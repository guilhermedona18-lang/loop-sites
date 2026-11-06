import "server-only"
import { db } from "@/lib/db"
import { settings, vehicles, arremates, type BidRow, type ArremateRow } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export type IntegrationEvent = "bid" | "simulation" | "vehicle" | "user"

/** Formato exato esperado pelo painel externo (ingest API). */
export type ArremataPayload = {
  externalId: string
  cpf: string
  nomeCliente: string
  email?: string
  modelo: string
  versao?: string
  ano: string
  cor?: string
  combustivel?: string
  km?: string
  vehicleId?: string
  leilaoNome?: string
  placa: string
  chassi: string
  imagem: string
  imagens?: string[]
  statusLabel: string
  leilao: string
  modalidade: string
  dataArrematacao: string
  valorArrematacao: number
  taxasDespesas: number
  situacao: string
  etapas: { titulo: string; data: string; concluido: boolean }[]
  entrada?: number
  parcelas?: number
  valorParcela?: number
  totalFinanciado?: number
}

function formatDateBR(d: Date | string | null | undefined): string {
  const date = d ? new Date(d) : new Date()
  return date.toLocaleDateString("pt-BR")
}

const STATUS_LABELS: Record<string, string> = {
  novo: "Em andamento",
  contato: "Em andamento",
  aprovado: "Pagamento aprovado",
  pago: "Pagamento aprovado",
  finalizado: "Concluído",
  cancelado: "Cancelado",
}

/** Transforma um lance + dados do veículo no payload de arremate do painel externo. */
export async function buildArremataPayload(bid: BidRow): Promise<ArremataPayload> {
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, bid.vehicleId))
  const data = formatDateBR(bid.createdAt)
  const situacao = STATUS_LABELS[bid.status] ?? "Em andamento"
  const concluidoPagamento = ["aprovado", "pago", "finalizado"].includes(bid.status)

  const rawImages = Array.isArray(vehicle?.images) ? (vehicle.images as string[]) : []
  const allImages = (vehicle?.image ? [vehicle.image, ...rawImages] : rawImages).filter(
    (v, i, arr) => v && arr.indexOf(v) === i,
  )

  return {
    externalId: `lance-${bid.id}`,
    cpf: "",
    nomeCliente: bid.bidderName,
    email: "",
    modelo: vehicle?.name ?? bid.vehicleName,
    versao: vehicle?.version ?? "",
    ano: vehicle?.year ?? "",
    cor: vehicle?.color ?? "",
    combustivel: vehicle?.fuel ?? "",
    km: vehicle?.km ?? "",
    vehicleId: bid.vehicleId,
    leilaoNome: "Loop Leilões",
    placa: vehicle?.placa ?? "",
    chassi: vehicle?.chassi ?? "",
    imagem: vehicle?.image ?? "",
    imagens: allImages,
    statusLabel: situacao,
    leilao: bid.vehicleId,
    modalidade: "Online",
    dataArrematacao: data,
    valorArrematacao: bid.amount,
    taxasDespesas: 0,
    situacao,
    etapas: [
      { titulo: "Arrematado", data, concluido: true },
      { titulo: "Pagamento aprovado", data, concluido: concluidoPagamento },
    ],
  }
}

export type SimulationData = {
  clientName: string
  document?: string
  vehicleId?: string
  vehicleName: string
  vehiclePrice: number
  downPayment: number
  fees?: number
  documentation?: number
  installments: number
  installmentValue: number
  totalFinanced: number
  lote?: string
  placa?: string
}

/** Descobre a URL pública base do app para montar URLs absolutas de imagem. */
async function getBaseUrl(): Promise<string> {
  const { headers } = await import("next/headers")
  try {
    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    const proto = h.get("x-forwarded-proto") ?? "https"
    if (host) return `${proto}://${host}`
  } catch {
    // fora de um contexto de requisição
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return vercel ? `https://${vercel}` : ""
}

/** Converte um caminho de imagem (relativo ou absoluto) em URL absoluta. */
function toAbsoluteUrl(src: string, baseUrl: string): string {
  if (!src) return ""
  if (src.startsWith("http://") || src.startsWith("https://")) return src
  if (!baseUrl) return src
  return `${baseUrl}${src.startsWith("/") ? "" : "/"}${src}`
}

/** Transforma uma simulação de financiamento no payload de arremate do painel externo. */
export async function buildSimulationPayload(sim: SimulationData): Promise<ArremataPayload & Record<string, unknown>> {
  const [vehicle] = sim.vehicleId
    ? await db.select().from(vehicles).where(eq(vehicles.id, sim.vehicleId))
    : [undefined]
  const data = formatDateBR(new Date())

  const baseUrl = await getBaseUrl()
  const rawImages = Array.isArray(vehicle?.images) ? (vehicle.images as string[]) : []
  const allImages = (vehicle?.image ? [vehicle.image, ...rawImages] : rawImages)
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .map((src) => toAbsoluteUrl(src, baseUrl))

  return {
    externalId: `simulacao-${Date.now()}`,
    cpf: sim.document ?? "",
    nomeCliente: sim.clientName,
    email: "",
    modelo: vehicle?.name ?? sim.vehicleName,
    versao: vehicle?.version ?? "",
    ano: vehicle?.year ?? "",
    cor: vehicle?.color ?? "",
    combustivel: vehicle?.fuel ?? "",
    km: vehicle?.km ?? "",
    vehicleId: sim.vehicleId ?? vehicle?.id ?? "",
    leilaoNome: "Loop Leilões",
    placa: sim.placa ?? vehicle?.placa ?? "",
    chassi: vehicle?.chassi ?? "",
    imagem: allImages[0] ?? "",
    imagens: allImages,
    statusLabel: "Simulação de financiamento",
    leilao: sim.lote || sim.vehicleId || "",
    modalidade: "Online",
    dataArrematacao: data,
    valorArrematacao: sim.vehiclePrice,
    taxasDespesas: (sim.fees ?? 0) + (sim.documentation ?? 0),
    situacao: "Simulação de financiamento",
    etapas: [{ titulo: "Simulação gerada", data, concluido: true }],
    // Dados do financiamento preenchidos na simulação (campos extras).
    entrada: sim.downPayment,
    parcelas: sim.installments,
    valorParcela: sim.installmentValue,
    totalFinanciado: sim.totalFinanced,
  }
}

/** Formato de evento aceito pelo painel consulteloop (ingest API testada). */
export type ConsulteloopEnvelope = {
  events: {
    type: "arremate"
    data: {
      customer: { name: string; cpf: string; email: string }
      vehicle: {
        id: string
        brandModel: string
        version: string
        year: string
        color: string
        fuel: string
        mileage: string
        status: string
        lot: string
        auction: string
        imageUrl: string
        images: string[]
      }
      auctionDate: string
      wonValue: number
      adminFee: number
      stage: string
      financing?: {
        downPayment: number
        installments: number
        installmentValue: number
        totalFinanced: number
      }
    }
  }[]
}

/** Converte o payload interno de arremate/simulação para o envelope do consulteloop. */
export function toConsulteloopEnvelope(p: ArremataPayload): ConsulteloopEnvelope {
  const images = p.imagens?.length ? p.imagens : [p.imagem].filter(Boolean)
  const hasFinancing =
    p.entrada != null || p.parcelas != null || p.valorParcela != null || p.totalFinanciado != null

  return {
    events: [
      {
        type: "arremate",
        data: {
          customer: { name: p.nomeCliente, cpf: p.cpf, email: p.email ?? "" },
          vehicle: {
            id: p.vehicleId || p.externalId,
            brandModel: p.modelo,
            version: p.versao ?? "",
            year: p.ano,
            color: p.cor ?? "",
            fuel: p.combustivel ?? "",
            mileage: p.km ?? "",
            status: p.situacao,
            lot: p.leilao,
            auction: p.leilaoNome ?? "Loop Leilões",
            imageUrl: p.imagem,
            images,
          },
          auctionDate: p.dataArrematacao,
          wonValue: p.valorArrematacao,
          adminFee: p.taxasDespesas,
          stage: p.situacao,
          ...(hasFinancing
            ? {
                financing: {
                  downPayment: p.entrada ?? 0,
                  installments: p.parcelas ?? 0,
                  installmentValue: p.valorParcela ?? 0,
                  totalFinanced: p.totalFinanciado ?? 0,
                },
              }
            : {}),
        },
      },
    ],
  }
}

export type IntegrationConfig = {
  enabled: boolean
  url: string
  secret: string
  events: Record<IntegrationEvent, boolean>
}

const CONFIG_KEY = "integration_webhook"

const DEFAULT_CONFIG: IntegrationConfig = {
  enabled: false,
  url: "",
  secret: "",
  events: { bid: true, simulation: true, vehicle: true, user: true },
}

/** Lê a config direto do banco (uso interno do servidor, sem exigir sessão admin). */
export async function readIntegrationConfig(): Promise<IntegrationConfig> {
  const [row] = await db.select().from(settings).where(eq(settings.key, CONFIG_KEY))
  if (!row?.value) return DEFAULT_CONFIG
  try {
    const parsed = JSON.parse(row.value) as Partial<IntegrationConfig>
    return {
      enabled: Boolean(parsed.enabled),
      url: parsed.url ?? "",
      secret: parsed.secret ?? "",
      events: { ...DEFAULT_CONFIG.events, ...(parsed.events ?? {}) },
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

export async function writeIntegrationConfig(config: IntegrationConfig) {
  const value = JSON.stringify(config)
  await db
    .insert(settings)
    .values({ key: CONFIG_KEY, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
}

async function recordLastDelivery(info: { event: string; ok: boolean; status: number; message: string }) {
  const value = JSON.stringify({ ...info, at: new Date().toISOString() })
  await db
    .insert(settings)
    .values({ key: "integration_webhook_last", value })
    .onConflictDoUpdate({ target: settings.key, set: { value } })
}

export type LastDelivery = {
  event: string
  ok: boolean
  status: number
  message: string
  at: string
} | null

export async function readLastDelivery(): Promise<LastDelivery> {
  const [row] = await db.select().from(settings).where(eq(settings.key, "integration_webhook_last"))
  if (!row?.value) return null
  try {
    return JSON.parse(row.value) as LastDelivery
  } catch {
    return null
  }
}

/** Faz o POST para a URL configurada com o cabeçalho x-api-key. Retorna o resultado da entrega. */
export async function sendWebhook(
  config: IntegrationConfig,
  event: IntegrationEvent | "test",
  payload: unknown,
): Promise<{ ok: boolean; status: number; message: string }> {
  const body = JSON.stringify(payload)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Loop-Leiloes-Webhook/1.0",
  }
  if (config.secret) {
    headers["x-api-key"] = config.secret
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    // Segue redirects manualmente para PRESERVAR o método POST.
    // (O fetch padrão converte POST em GET num redirect 301/302/303, o que causa erro 405.)
    let url = config.url
    let res = await fetch(url, { method: "POST", headers, body, redirect: "manual", signal: controller.signal })
    let hops = 0
    while ([301, 302, 303, 307, 308].includes(res.status) && hops < 5) {
      const location = res.headers.get("location")
      if (!location) break
      url = new URL(location, url).toString()
      res = await fetch(url, { method: "POST", headers, body, redirect: "manual", signal: controller.signal })
      hops++
    }

    let message: string
    if (res.ok) {
      message = "Entregue com sucesso"
    } else if (res.status === 405) {
      message = "Destino respondeu 405: a URL não aceita POST. Confira se o endereço aponta direto para o endpoint de recebimento (não para uma página)."
    } else if (res.status === 401 || res.status === 403) {
      message = `Destino respondeu ${res.status}: chave de API (x-api-key) inválida ou ausente.`
    } else if (res.status === 404) {
      message = "Destino respondeu 404: endpoint não encontrado. Verifique a URL de destino."
    } else {
      message = `Destino respondeu ${res.status}`
    }

    const result = { ok: res.ok, status: res.status, message }
    await recordLastDelivery({ event, ...result })
    return result
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError" ? "Tempo limite excedido (8s)" : "Falha ao conectar ao destino"
    const result = { ok: false, status: 0, message }
    await recordLastDelivery({ event, ...result })
    return result
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Dispara um evento para o painel externo, sem bloquear a ação principal.
 * Nunca lança erro — se a integração estiver desativada ou falhar, apenas ignora.
 */
export type DispatchResult = { sent: boolean; status: number; message: string }

export async function dispatchIntegrationEvent(event: IntegrationEvent, data: unknown): Promise<DispatchResult> {
  try {
    const config = await readIntegrationConfig()
    if (!config.enabled) return { sent: false, status: 0, message: "Integração desativada no painel." }
    if (!config.url) return { sent: false, status: 0, message: "Nenhuma URL de destino configurada." }
    if (!config.events[event]) return { sent: false, status: 0, message: `Evento "${event}" não está marcado para envio.` }
    // Converte para o envelope de arremate esperado pelo painel consulteloop.
    let payload: unknown
    if (event === "bid") {
      payload = toConsulteloopEnvelope(await buildArremataPayload(data as BidRow))
    } else if (event === "simulation") {
      payload = toConsulteloopEnvelope(await buildSimulationPayload(data as SimulationData))
    } else {
      payload = { event, source: "loop-leiloes", data }
    }
    const res = await sendWebhook(config, event, payload)
    return { sent: res.ok, status: res.status, message: res.message }
  } catch (err) {
    // Integração nunca deve quebrar o fluxo do painel.
    return { sent: false, status: 0, message: err instanceof Error ? err.message : "Erro ao enviar." }
  }
}

/** Converte uma linha da tabela `arremates` (+ veículo) no payload de arremate. */
async function arremateRowToPayload(row: ArremateRow): Promise<ArremataPayload> {
  const [vehicle] = row.vehicleId
    ? await db.select().from(vehicles).where(eq(vehicles.id, row.vehicleId))
    : [undefined]

  const baseUrl = await getBaseUrl()
  const rawImages = Array.isArray(vehicle?.images) ? (vehicle.images as string[]) : []
  const allImages = (vehicle?.image ? [vehicle.image, ...rawImages] : rawImages)
    .filter((v, i, arr) => v && arr.indexOf(v) === i)
    .map((src) => toAbsoluteUrl(src, baseUrl))
  const capaFallback = row.vehicleImage ? toAbsoluteUrl(row.vehicleImage, baseUrl) : ""
  const imagens = allImages.length ? allImages : [capaFallback].filter(Boolean)

  return {
    externalId: `arremate-${row.id}`,
    cpf: row.cpf,
    nomeCliente: row.clientName,
    email: "",
    modelo: vehicle?.name ?? row.vehicleName,
    versao: vehicle?.version ?? "",
    ano: vehicle?.year ?? "",
    cor: vehicle?.color ?? "",
    combustivel: vehicle?.fuel ?? "",
    km: vehicle?.km ?? "",
    vehicleId: row.vehicleId,
    leilaoNome: "Loop Leilões",
    placa: row.placa || vehicle?.placa || "",
    chassi: vehicle?.chassi ?? "",
    imagem: imagens[0] ?? "",
    imagens,
    statusLabel: "Arrematado",
    leilao: row.lote,
    modalidade: "Online",
    dataArrematacao: formatDateBR(row.createdAt),
    valorArrematacao: row.price,
    taxasDespesas: 0,
    situacao: "Arrematado",
    etapas: [{ titulo: "Arrematado", data: formatDateBR(row.createdAt), concluido: true }],
    entrada: row.entrada,
    parcelas: row.parcelas,
    valorParcela: row.valorParcelaCents / 100,
    totalFinanciado: row.totalFinanciado,
  }
}

/**
 * Sincroniza TODOS os arremates registrados de uma vez para o painel consulteloop.
 * Puxa cada arremate, junta os dados/fotos do veículo e envia num único POST.
 */
export async function syncAllArremates(): Promise<{
  ok: boolean
  enviados: number
  status: number
  message: string
}> {
  const config = await readIntegrationConfig()
  if (!config.url) {
    return { ok: false, enviados: 0, status: 0, message: "Nenhuma URL de destino configurada." }
  }

  const rows = await db.select().from(arremates).orderBy(arremates.createdAt)
  if (rows.length === 0) {
    return { ok: false, enviados: 0, status: 0, message: "Nenhum arremate registrado para enviar." }
  }

  const payloads = await Promise.all(rows.map((r) => arremateRowToPayload(r)))
  const events = payloads.flatMap((p) => toConsulteloopEnvelope(p).events)

  const res = await sendWebhook(config, "bid", { events })
  return { ok: res.ok, enviados: events.length, status: res.status, message: res.message }
}
