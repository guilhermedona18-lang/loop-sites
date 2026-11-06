export function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value || 0)
}

export function formatDate(value: string | Date | null | undefined) {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

export function formatDateTime(value: string | Date | null | undefined) {
  if (!value) return "—"
  const d = typeof value === "string" ? new Date(value) : value
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}
