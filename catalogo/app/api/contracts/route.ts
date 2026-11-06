import {env} from '@/lib/runtime';
import {requireAdmin} from '@/lib/auth-admin';
import {hash,isValidCPF,onlyDigits,privateHeaders} from '@/lib/contracts';
import {db} from '@/lib/db';import {arremates} from '@/lib/db/schema';import {eq} from 'drizzle-orm';
export async function POST(request:Request){
 try{await requireAdmin();}catch{return Response.json({error:'Não autorizado'},{status:401});}
 try{
 if(Number(request.headers.get('content-length'))>6*1024*1024)return Response.json({error:'Arquivo muito grande.'},{status:413});
 const form=await request.formData();const file=form.get('pdf');const data=JSON.parse(String(form.get('data')||'{}'));
 const cpf=onlyDigits(String(data.cpf||''));const code=String(form.get('code')||'');const requestId=String(form.get('requestId')||'');
 if(!isValidCPF(cpf)||!data.clientName?.trim()||!/^[a-f0-9]{32}$/.test(code)||! /^[a-f0-9-]{36}$/.test(requestId))return Response.json({error:'Nome, CPF ou identificação inválidos.'},{status:422});
 for(const k of ['price','entrada','totalFinanciado','parcelas','valorParcela'])if(!Number.isFinite(data[k])||data[k]<0||data[k]>1e9)return Response.json({error:'Valores inválidos.'},{status:422});
 if(!(file instanceof File)||file.size>5*1024*1024||await file.slice(0,5).text()!=='%PDF-')return Response.json({error:'Envie PDF válido de até 5 MB.'},{status:422});
 const old=await db.select().from(arremates).where(eq(arremates.requestId,requestId)).limit(1);
 if(old[0]){if(old[0].accessHash!==await hash(code))return Response.json({error:'Identificação já utilizada.'},{status:409});return Response.json({ok:true,code,id:old[0].id},{headers:privateHeaders});}
 const key=`contratos/${crypto.randomUUID()}.pdf`;
 await env.BUCKET!.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:'application/pdf'}});
 try{
 const rows=await db.insert(arremates).values({cpf,clientName:String(data.clientName).slice(0,200),vehicleId:String(data.vehicleId||''),vehicleName:String(data.vehicleName||''),vehicleImage:String(data.vehicleImage||''),lote:String(data.lote||''),placa:String(data.placa||''),price:Math.round(data.price),entrada:Math.round(data.entrada),totalFinanciado:Math.round(data.totalFinanciado),parcelas:Math.round(data.parcelas),valorParcelaCents:Math.round(data.valorParcela*100),contractKey:key,accessHash:await hash(code),requestId}).returning({id:arremates.id});
 return Response.json({ok:true,code,id:rows[0].id},{headers:privateHeaders});
 }catch(e){await env.BUCKET!.delete(key);throw e;}
 }catch{return Response.json({error:'Não foi possível salvar o contrato. Tente novamente.'},{status:500});}
}
