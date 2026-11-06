"use server"
import { requireAdmin } from "@/lib/auth-admin";
export async function migrateBase64Images(){await requireAdmin();return {ok:true,message:"As imagens já são armazenadas neste serviço."};}
