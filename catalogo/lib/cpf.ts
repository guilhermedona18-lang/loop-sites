/** Utilitários de CPF — validação (algoritmo oficial) e máscara. */

/** Mantém apenas os dígitos do CPF. */
export function onlyDigits(value: string): string {
  return (value || "").replace(/\D/g, "")
}

/**
 * Valida um CPF usando o algoritmo dos dígitos verificadores.
 * Aceita CPF com ou sem máscara. Rejeita sequências repetidas (ex.: 111.111.111-11).
 */
export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  // Rejeita todos os dígitos iguais (00000000000, 11111111111, ...)
  if (/^(\d)\1{10}$/.test(cpf)) return false

  const calcCheck = (base: string, factorStart: number) => {
    let sum = 0
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (factorStart - i)
    }
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }

  const d1 = calcCheck(cpf.slice(0, 9), 10)
  if (d1 !== Number(cpf[9])) return false

  const d2 = calcCheck(cpf.slice(0, 10), 11)
  if (d2 !== Number(cpf[10])) return false

  return true
}

/** Aplica a máscara 000.000.000-00 conforme o usuário digita. */
export function formatCPF(value: string): string {
  const cpf = onlyDigits(value).slice(0, 11)
  return cpf
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
}

/** Mascara parcialmente o CPF para exibição: 123.***.**9-00. */
export function maskCPF(value: string): string {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return formatCPF(value)
  return `${cpf.slice(0, 3)}.***.**${cpf.slice(8, 9)}-${cpf.slice(9)}`
}
