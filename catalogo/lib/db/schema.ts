import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core"

export const vehicles = sqliteTable("vehicles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: text("category").notNull().default("carros"),
  version: text("version"),
  year: text("year").notNull().default(""),
  km: text("km").notNull().default(""),
  transmission: text("transmission").notNull().default(""),
  fuel: text("fuel").notNull().default(""),
  color: text("color").notNull().default(""),
  engine: text("engine").notNull().default(""),
  doors: text("doors").notNull().default(""),
  steering: text("steering").notNull().default(""),
  traction: text("traction").notNull().default(""),
  bodywork: text("bodywork").notNull().default(""),
  condition: text("condition").notNull().default(""),
  origin: text("origin").notNull().default(""),
  ipva: text("ipva").notNull().default(""),
  sinistro: text("sinistro").notNull().default(""),
  chassi: text("chassi").notNull().default(""),
  renavam: text("renavam").notNull().default(""),
  placa: text("placa").notNull().default(""),
  price: integer("price").notNull().default(0),
  bids: integer("bids").notNull().default(0),
  status: text("status").notNull().default("aberto"),
  note: text("note"),
  image: text("image").notNull().default(""),
  images: text("images", { mode: "json" }).$type<string[]>().notNull().default([]),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const bids = sqliteTable("bids", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vehicleId: text("vehicle_id").notNull(),
  vehicleName: text("vehicle_name").notNull().default(""),
  bidderName: text("bidder_name").notNull().default(""),
  bidderPhone: text("bidder_phone").notNull().default(""),
  amount: integer("amount").notNull().default(0),
  status: text("status").notNull().default("novo"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const auctionUsers = sqliteTable("auction_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().default(""),
  email: text("email").notNull().default(""),
  phone: text("phone").notNull().default(""),
  city: text("city").notNull().default(""),
  role: text("role").notNull().default("licitante"),
  status: text("status").notNull().default("ativo"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const auctions = sqliteTable("auctions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull().default(""),
  description: text("description").notNull().default(""),
  status: text("status").notNull().default("agendado"),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }),
  endsAt: integer("ends_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
})

export const arremates = sqliteTable("arremates", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cpf: text("cpf").notNull(),
  contractKey: text("contract_key"),
  accessHash: text("access_hash"),
  requestId: text("request_id").unique(),
  clientName: text("client_name").notNull().default(""),
  vehicleId: text("vehicle_id").notNull().default(""),
  vehicleName: text("vehicle_name").notNull().default(""),
  vehicleImage: text("vehicle_image").notNull().default(""),
  lote: text("lote").notNull().default(""),
  placa: text("placa").notNull().default(""),
  price: integer("price").notNull().default(0),
  entrada: integer("entrada").notNull().default(0),
  totalFinanciado: integer("total_financiado").notNull().default(0),
  parcelas: integer("parcelas").notNull().default(0),
  valorParcelaCents: integer("valor_parcela_cents").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
})

export type VehicleRow = typeof vehicles.$inferSelect
export type BidRow = typeof bids.$inferSelect
export type AuctionUserRow = typeof auctionUsers.$inferSelect
export type AuctionRow = typeof auctions.$inferSelect
export type ArremateRow = typeof arremates.$inferSelect

export const lookupLimits = sqliteTable("lookup_limits", { key: text("key").primaryKey(), attempts: integer("attempts").notNull(), resetAt: integer("reset_at").notNull() })
