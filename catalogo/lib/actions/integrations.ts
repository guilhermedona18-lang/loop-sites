"use server"

import { revalidatePath } from "next/cache"
import { requireAdmin } from "@/lib/auth-admin"
import {
  readIntegrationConfig,
  writeIntegrationConfig,
  readLastDelivery,
  sendWebhook,
  dispatchIntegrationEvent,
  toConsulteloopEnvelope,
  syncAllArremates,
  type IntegrationConfig,
  type LastDelivery,
} from "@/lib/integrations/webhook"

export async function getIntegration(): Promise<{
  config: IntegrationConfig
  last: LastDelivery
}> {
  await requireAdmin()
  const [config, last] = await Promise.all([readIntegrationConfig(), readLastDelivery()])
  return { config, last }
}

export async function saveIntegration(config: IntegrationConfig) {
  await requireAdmin()
  await writeIntegrationConfig({
    enabled: Boolean(config.enabled),
    url: config.url.trim(),
    secret: config.secret.trim(),
    events: {
      bid: Boolean(config.events.bid),
      simulation: Boolean(config.events.simulation),
      vehicle: Boolean(config.events.vehicle),
      user: Boolean(config.events.user),
    },
  })
  revalidatePath("/dash/integracoes")
  return { ok: true }
}

/** Disparado pelo simulador de financiamento quando uma proposta é gerada. */
export async function notifySimulation(data: {
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
}) {
  await requireAdmin()
  const res = await dispatchIntegrationEvent("simulation", data)
  return res
}

/** Reenvia TODOS os arremates já registrados de uma vez para o painel externo. */
export async function syncArremates() {
  await requireAdmin()
  const res = await syncAllArremates()
  revalidatePath("/dash/integracoes")
  return res
}

/** Envia um payload de teste para validar a URL/segredo antes de ativar de verdade. */
export async function testIntegration(config: IntegrationConfig) {
  await requireAdmin()
  if (!config.url.trim()) {
    return { ok: false, status: 0, message: "Informe a URL de destino primeiro." }
  }
  const hoje = new Date().toLocaleDateString("pt-BR")
  const payload = toConsulteloopEnvelope({
    externalId: `teste-${Date.now()}`,
    cpf: "00000000000",
    nomeCliente: "Teste de Conexão",
    email: "",
    modelo: "VEÍCULO DE EXEMPLO",
    versao: "",
    ano: "2024/2025",
    cor: "",
    combustivel: "",
    km: "",
    vehicleId: "exemplo-001",
    leilaoNome: "Loop Leilões",
    placa: "TES-0000",
    chassi: "",
    imagem: "",
    imagens: [],
    statusLabel: "Em andamento",
    leilao: "exemplo-001",
    modalidade: "Online",
    dataArrematacao: hoje,
    valorArrematacao: 45000,
    taxasDespesas: 0,
    situacao: "Em andamento",
    etapas: [{ titulo: "Arrematado", data: hoje, concluido: true }],
  })
  return sendWebhook(
    { ...config, url: config.url.trim(), secret: config.secret.trim() },
    "test",
    payload,
  )
}
