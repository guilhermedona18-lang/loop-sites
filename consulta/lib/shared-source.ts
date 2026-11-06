import 'server-only';import {env} from '@/lib/runtime';
export async function proxy(request:Request,path:string){
 const vars=env as unknown as Record<string,string>;
 if(!vars.SOURCE_SITE_URL)return Response.json({error:'Serviço temporariamente indisponível.'},{status:503});
 const body=await request.json().catch(()=>null) as {query?:unknown;code?:unknown}|null;
 if(!body||typeof body.query!=='string'||typeof body.code!=='string')return Response.json({error:'Informe CPF e código de acesso.'},{status:422});
 const res=await fetch(new URL(path,vars.SOURCE_SITE_URL),{method:'POST',headers:{'Content-Type':'application/json','x-client-ip':request.headers.get('cf-connecting-ip')||'unknown'},body:JSON.stringify({query:body.query,code:body.code}),signal:AbortSignal.timeout(90000)});
 const headers=new Headers({'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});headers.set('Content-Type',res.headers.get('Content-Type')||'application/json');if(res.headers.get('Content-Disposition'))headers.set('Content-Disposition',res.headers.get('Content-Disposition')!);
 return new Response(res.body,{status:res.status,headers});
}
