import 'server-only';
async function rpc(input:unknown):Promise<any>{
 const endpoint=process.env.RENDER_STORAGE_ENDPOINT,key=process.env.RENDER_STORAGE_KEY;
 if(!endpoint||!key)throw new Error('Armazenamento não configurado.');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${key}`},body:JSON.stringify(input),cache:'no-store',signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error('Armazenamento temporariamente indisponível.');
 return ((await response.json()) as {result:unknown}).result;
}
class RemoteStatement{
 constructor(readonly sql:string,readonly params:unknown[]=[]){ }
 bind(...params:unknown[]){return new RemoteStatement(this.sql,params);}
 async all<T=Record<string,unknown>>(){return await rpc({op:'sql',method:'all',sql:this.sql,params:this.params}) as D1Result<T>;}
 async run(){return rpc({op:'sql',method:'run',sql:this.sql,params:this.params});}
 async raw(){return rpc({op:'sql',method:'raw',sql:this.sql,params:this.params});}
 async first<T=Record<string,unknown>>(column?:string){const result=await this.all<T>();const row=result.results?.[0]??null;return column&&row?(row as any)[column]:row;}
}
const DB={prepare(sql:string){return new RemoteStatement(sql);},batch(queries:RemoteStatement[]){return rpc({op:'batch',queries:queries.map(q=>({sql:q.sql,params:q.params}))});}};
const BUCKET={
 async put(key:string,data:ArrayBuffer|Uint8Array,options?:{httpMetadata?:{contentType?:string}}){await rpc({op:'object_put',key,data:Buffer.from(data instanceof ArrayBuffer?new Uint8Array(data):data).toString('base64'),contentType:options?.httpMetadata?.contentType});return {key};},
 async get(key:string){const result=await rpc({op:'object_get',key});if(!result)return null;const bytes=new Uint8Array(Buffer.from(result.data,'base64'));return {body:bytes,httpMetadata:{contentType:result.contentType},arrayBuffer:async()=>bytes.buffer};},
 async delete(key:string){await rpc({op:'object_delete',key});}
};
export const env=new Proxy({DB,BUCKET},{get(target,key){return key in target?target[key as keyof typeof target]:process.env[String(key)];}}) as unknown as Cloudflare.Env & Record<string,string>;
