export type Vehicle = {
  id: string
  imageUrl: string
  images: string[]
  brandModel: string
  version: string
  fullTitle: string
  lot: string
  auction: string
  year: string
  color: string
  fuel: string
  mileage: string
  status: string
  auctionDate: string
  wonValue: number
  adminFee: number
  // Ficha técnica (opcionais — preenchidos quando vêm do banco fonte)
  brand?: string
  category?: string
  engine?: string
  transmission?: string
  doors?: string
  steering?: string
  traction?: string
  bodywork?: string
  condition?: string
  origin?: string
  ipva?: string
  sinistro?: string
  chassi?: string
  renavam?: string
  plate?: string
  // Financiamento (opcionais)
  entrada?: number
  totalFinanciado?: number
  parcelas?: number
  valorParcela?: number
}

export type TrackingInfo = {
  active: boolean
  locked: boolean
  driverProblem: boolean
  driverStatusMessage: string
  originAddress: string
  destinationAddress: string
}

export const TRACKING_DEFAULTS: TrackingInfo = {
  active: false,
  locked: false,
  driverProblem: false,
  driverStatusMessage: '',
  originAddress: '',
  destinationAddress: '',
}

export type CustomerExtra = {
  rg: string
  deliveryPhoto: string
  deliveryAddress: string
  notes: string
}

export const CUSTOMER_EXTRA_DEFAULTS: CustomerExtra = {
  rg: '',
  deliveryPhoto: '',
  deliveryAddress: '',
  notes: '',
}

export type LookupResult = {
  customerName: string
  document: string
  vehicles: Vehicle[]
  tracking?: TrackingInfo | null
  extra?: CustomerExtra | null
}

/**
 * Busca os dados do cliente pelo CPF ou e-mail.
 *
 * Envia a consulta para a rota interna `/api/lookup`, que por sua vez repassa
 * para a URL de destino (webhook) configurada em LOOKUP_WEBHOOK_URL. Se o
 * webhook não estiver configurado, a rota devolve os dados de exemplo.
 */
export async function lookupCustomerData(
  query: string,
  code: string,
): Promise<LookupResult | null> {
  const normalized = query.trim()
  if (!isValidCpf(normalized)) {
    return null
  }

  const res = await fetch('/api/lookup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: normalized, code }),
  })

  if (!res.ok) {
    if(res.status===404)return null;
    const failure=await res.json().catch(()=>null) as {error?:string}|null;
    throw new Error(failure?.error||'Consulta temporariamente indisponível.');
  }

  return (await res.json()) as LookupResult
}

/** Remove tudo que não for dígito. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

/** Valida CPF: exige exatamente 11 dígitos. */
export function isValidCpf(value: string): boolean {
  return onlyDigits(value).length === 11
}

/** Aplica a máscara 000.000.000-00 conforme o usuário digita. */
export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
