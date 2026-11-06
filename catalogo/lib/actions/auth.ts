'use server';
import { headers } from 'next/headers';
import { checkPassword, createSession, destroySession } from '@/lib/auth-admin';
import { allowLoginAttempt } from '@/lib/admin-session';
import { redirect } from 'next/navigation';
export async function login(_prev:{error?:string}|undefined,formData:FormData){
 const h=await headers();
 if(!await allowLoginAttempt(h.get('cf-connecting-ip')||'unknown'))return {error:'Muitas tentativas. Aguarde 15 minutos.'};
 if(!checkPassword(String(formData.get('password')||'')))return {error:'Senha incorreta. Tente novamente.'};
 await createSession();redirect('/dash');
}
export async function logout(){await destroySession();redirect('/dash/login');}
