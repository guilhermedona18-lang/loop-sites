import "server-only";
import {env} from "@/lib/runtime";
import {isValidCPF,onlyDigits} from "@/lib/cpf";
export {isValidCPF,onlyDigits};
export async function hash(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(n=>n.toString(16).padStart(2,'0')).join('');}
export async function validateLookup(request:Request){
 const body=await request.json().catch(()=>null) as {query?:unknown;code?:unknown}|null;const cpf=onlyDigits(String(body?.query||''));const code=String(body?.code||'').replace(/[^a-f0-9]/gi,'').toLowerCase();
 if(!isValidCPF(cpf)||!/^[a-f0-9]{32}$/.test(code))return {error:new Response(JSON.stringify({error:'CPF ou código inválido.'}),{status:404})};
 const ip=request.headers.get('x-client-ip')||request.headers.get('cf-connecting-ip')||'unknown';const key=await hash(ip+':'+cpf);const now=Date.now();
 const limit=await env.DB!.prepare(`INSERT INTO lookup_limits (key,attempts,reset_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset_at < ? THEN 1 ELSE attempts+1 END, reset_at=CASE WHEN reset_at < ? THEN ? ELSE reset_at END RETURNING attempts`).bind(key,now+900000,now,now,now+900000).first<{attempts:number}>();
 if(!limit||limit.attempts>20)return {error:Response.json({error:'Muitas tentativas. Aguarde 15 minutos.'},{status:429})};
 const row=await env.DB!.prepare('SELECT * FROM arremates WHERE cpf = ? AND access_hash = ? AND contract_key IS NOT NULL ORDER BY created_at DESC LIMIT 1').bind(cpf,await hash(code)).first<any>();
 if(!row)return {error:Response.json({error:'CPF ou código inválido.'},{status:404})};
 return {row,cpf};
}
export const privateHeaders={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
