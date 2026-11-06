import "server-only";
import { env } from "@/lib/runtime";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, { get(_, key) { const instance=drizzle(env.DB!, {schema}); const value=Reflect.get(instance,key);return typeof value === "function" ? value.bind(instance) : value; }});
