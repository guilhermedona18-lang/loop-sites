import {proxy} from '@/lib/shared-source';
export async function POST(request:Request){try{return await proxy(request,'/api/shared/contract');}catch{return Response.json({error:'Serviço temporariamente indisponível.'},{status:503});}}
