import {env} from '@/lib/runtime';import {validateLookup,privateHeaders} from '@/lib/contracts';
export async function POST(request:Request){try{
 const result=await validateLookup(request);if(result.error)return result.error;const {row:a,cpf}=result;
 const v=a.vehicle_id?await env.DB!.prepare('SELECT * FROM vehicles WHERE id = ?').bind(a.vehicle_id).first<any>():null;
 const src=(x:string)=>x?.startsWith('/')?'/api/image?path='+encodeURIComponent(x):x||'';
 let gallery:string[]=[];try{gallery=JSON.parse(v?.images||'[]').map(src);}catch{}
 return Response.json({customerName:a.client_name,document:cpf,contractAvailable:true,vehicles:[{id:String(a.id),imageUrl:src(a.vehicle_image||v?.image),images:gallery,brandModel:a.vehicle_name,fullTitle:a.vehicle_name,version:v?.version||'',lot:a.lote,auction:a.placa,year:v?.year||'',color:v?.color||'',fuel:v?.fuel||'',mileage:v?.km||'',status:'Contrato registrado',auctionDate:new Date(a.created_at).toLocaleDateString('pt-BR'),wonValue:a.price,adminFee:0,totalFinanciado:a.total_financiado,parcelas:a.parcelas,valorParcela:a.valor_parcela_cents/100}],tracking:null,extra:null},{headers:privateHeaders});
 }catch{return Response.json({error:'Consulta indisponível.'},{status:503});}}
