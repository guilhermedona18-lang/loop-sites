"use server"
import { env } from "@/lib/runtime";
import { requireAdmin } from "@/lib/auth-admin";
export async function uploadImage(formData:FormData){
 await requireAdmin();const f=formData.get("file");
 if(!(f instanceof File)||!['image/png','image/jpeg','image/webp','image/gif','image/avif'].includes(f.type)||f.size>8*1024*1024)return {error:"Envie imagem PNG, JPEG, WebP, GIF ou AVIF de até 8 MB."};
 const key=`veiculos/${crypto.randomUUID()}`;await env.BUCKET!.put(key,await f.arrayBuffer(),{httpMetadata:{contentType:f.type}});return {url:`/api/blob/${key}`};
}
