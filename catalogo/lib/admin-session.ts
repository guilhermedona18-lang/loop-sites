import 'server-only';
import { env } from '@/lib/runtime';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const ADMIN_COOKIE = '__Host-loop_admin';
export const SESSION_SECONDS = 12 * 60 * 60;

function configuration() {
  const vars = env as unknown as Record<string, string>;
  if (!vars.ADMIN_PASSWORD || !vars.ADMIN_SESSION_SECRET) throw new Error('Acesso administrativo não configurado.');
  return { password: vars.ADMIN_PASSWORD, secret: vars.ADMIN_SESSION_SECRET };
}

export function checkPassword(password: string) {
  const expected = configuration().password;
  return timingSafeEqual(createHash('sha256').update(password).digest(), createHash('sha256').update(expected).digest());
}

function signature(payload: string) {
  const { secret, password } = configuration();
  return createHmac('sha256', secret).update(password).update(':').update(payload).digest('hex');
}

export function makeSessionToken() {
  const payload = `${Math.floor(Date.now() / 1000) + SESSION_SECONDS}.${randomBytes(24).toString('hex')}`;
  return `${payload}.${signature(payload)}`;
}

export function validSessionToken(token: string | undefined) {
  if (!token || !/^\d+\.[a-f0-9]{48}\.[a-f0-9]{64}$/.test(token)) return false;
  const [expiry, nonce, signed] = token.split('.');
  const expires = Number(expiry), now = Math.floor(Date.now() / 1000);
  if (expires <= now || expires > now + SESSION_SECONDS + 60) return false;
  try { return timingSafeEqual(Buffer.from(signed, 'hex'), Buffer.from(signature(`${expiry}.${nonce}`), 'hex')); }
  catch { return false; }
}

export async function allowLoginAttempt(ip: string) {
  const key = 'admin-login:' + createHash('sha256').update(ip).digest('hex');
  const now = Date.now();
  const row = await env.DB!.prepare(`INSERT INTO lookup_limits (key,attempts,reset_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset_at < ? THEN 1 ELSE attempts+1 END, reset_at=CASE WHEN reset_at < ? THEN ? ELSE reset_at END RETURNING attempts`).bind(key, now + 900000, now, now, now + 900000).first<{attempts:number}>();
  return Boolean(row && row.attempts <= 10);
}
