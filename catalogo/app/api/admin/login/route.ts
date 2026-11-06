import { ADMIN_COOKIE, SESSION_SECONDS, allowLoginAttempt, checkPassword, makeSessionToken } from '@/lib/admin-session';
export async function POST(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');
 if(origin && new URL(origin).host!==host)return new Response('Origem inválida',{status:403});
 if(Number(request.headers.get('content-length'))>4096)return new Response(null,{status:413});
 const headers={'Cache-Control':'no-store'};
 try{
  if(!await allowLoginAttempt(request.headers.get('cf-connecting-ip')||'unknown'))return new Response(null,{status:303,headers:{...headers,Location:'/dash/login?error=limited'}});
  const form=await request.formData();
  if(!checkPassword(String(form.get('password')||'')))return new Response(null,{status:303,headers:{...headers,Location:'/dash/login?error=invalid'}});
  return new Response(null,{status:303,headers:{...headers,Location:'/dash','Set-Cookie':`${ADMIN_COOKIE}=${makeSessionToken()}; Path=/; Max-Age=${SESSION_SECONDS}; HttpOnly; Secure; SameSite=Lax`}});
 }catch{return new Response(null,{status:303,headers:{...headers,Location:'/dash/login?error=unavailable'}});}
}
