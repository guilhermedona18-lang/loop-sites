import 'server-only';
import { cookies, headers } from 'next/headers';
import { ADMIN_COOKIE, SESSION_SECONDS, checkPassword, makeSessionToken, validSessionToken } from './admin-session';
export { checkPassword };

export async function isAuthenticated() {
  return validSessionToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin() {
  if (!await isAuthenticated()) throw new Error('Não autorizado');
  const requestHeaders = await headers();
  const origin = requestHeaders.get('origin');
  if (origin && new URL(origin).host !== requestHeaders.get('host')) throw new Error('Origem inválida');
}

export async function createSession() {
  (await cookies()).set(ADMIN_COOKIE, makeSessionToken(), {httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:SESSION_SECONDS});
}

export async function destroySession() {
  (await cookies()).set(ADMIN_COOKIE, '', {httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:0});
}
