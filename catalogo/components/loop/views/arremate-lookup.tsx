"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Trophy,
  Tag,
  FileText,
} from "lucide-react"
import { formatCPF, maskCPF } from "@/lib/cpf"
import { lookupArremate, type ArremateResult } from "@/lib/actions/arremates"
import { VehicleCard } from "../vehicle-card"
import { FichaTecnica } from "./ficha-tecnica"

function brl(value: number, withCents = false) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: withCents ? 2 : 0,
    minimumFractionDigits: withCents ? 2 : 0,
  })
}

export function ArremateLookup() {
  const [cpf, setCpf] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ArremateResult | null>(null)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await lookupArremate(cpf)
      if (res.ok) {
        setResult(res.arremate)
      } else {
        setError(res.error)
      }
    } catch {
      setError("Não foi possível consultar agora. Tente novamente em instantes.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Trophy className="size-5 text-primary" />
          <h2 className="font-heading text-base font-bold text-foreground">
            Consultar meu arremate
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe seu CPF para ver o veículo que você arrematou.
        </p>

        <form onSubmit={handleSearch} className="mt-3 flex items-center gap-2">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              value={cpf}
              onChange={(e) => {
                setCpf(formatCPF(e.target.value))
                setError(null)
              }}
              placeholder="000.000.000-00"
              inputMode="numeric"
              aria-label="CPF"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground transition active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Consultar"
            )}
          </button>
        </form>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          Consulta protegida — usamos seu CPF apenas para localizar o arremate.
        </p>
      </div>

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-700">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 font-heading text-sm font-extrabold text-emerald-700">
              <Trophy className="size-4" />
              Parabéns{result.clientName ? `, ${result.clientName.split(" ")[0]}` : ""}!
            </p>
            <p className="mt-1 text-sm text-emerald-700/90">
              Encontramos o veículo arrematado no CPF {maskCPF(result.cpf)}.
            </p>
          </div>

          {result.vehicle ? (
            <VehicleCard vehicle={result.vehicle} />
          ) : (
            <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-secondary">
                <Image
                  src={result.vehicleImage || "/placeholder.svg"}
                  alt={result.vehicleName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-base font-bold text-foreground">
                  {result.vehicleName}
                </h3>
                <p className="mt-1 text-xl font-extrabold text-foreground">
                  {brl(result.price)}
                </p>
              </div>
            </article>
          )}

          {/* Ficha técnica do veículo */}
          <FichaTecnica
            vehicle={result.vehicle}
            km={result.vehicle?.km}
            placa={result.placa}
          />

          {/* Detalhes da proposta */}
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 font-heading text-sm font-bold text-foreground">
              <FileText className="size-4 text-primary" />
              Dados do arremate
            </p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {result.lote && (
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <Tag className="size-3.5" /> Lote
                  </dt>
                  <dd className="font-semibold text-foreground">{result.lote}</dd>
                </div>
              )}
              {result.placa && (
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Placa</dt>
                  <dd className="font-semibold text-foreground">{result.placa}</dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Valor do veículo</dt>
                <dd className="font-semibold text-foreground">{brl(result.price)}</dd>
              </div>
              {result.parcelas > 0 && (
                <div className="flex items-center justify-between border-t border-border pt-2.5">
                  <dt className="font-bold text-foreground">
                    {result.parcelas}x de
                  </dt>
                  <dd className="font-heading text-lg font-extrabold text-primary">
                    {brl(result.valorParcela, true)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
