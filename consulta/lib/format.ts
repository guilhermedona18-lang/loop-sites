export function formatBRL(value: number | string | null | undefined) {
  const n = Number(value ?? 0)
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatCpf(cpf: string | null | undefined) {
  if (!cpf) return '—'
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11) return cpf
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
