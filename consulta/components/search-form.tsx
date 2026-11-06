'use client'

import { useState } from 'react'
import { Search, IdCard, Lock, Loader2 } from 'lucide-react'
import { formatCpf } from '@/lib/vehicles'

type SearchFormProps = {
  onSearch: (query: string, code: string) => void
  loading: boolean
  error: string | null
}

export function SearchForm({ onSearch, loading, error }: SearchFormProps) {
  const [value, setValue] = useState('')
  const [code,setCode]=useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (loading) return
    onSearch(value,code)
  }

  return (
    <section className="px-5">
      <div className="rounded-2xl bg-card p-5 text-card-foreground shadow-sm">
        <h2 className="text-lg font-bold">Consultar seu contrato</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Informe seu CPF e o código de acesso recebido com o contrato.
        </p>

        <form onSubmit={handleSubmit} className="mt-4" noValidate>
          <label htmlFor="query" className="sr-only">
            CPF
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
            <IdCard className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="query"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="Digite seu CPF"
              value={value}
              onChange={(e) => setValue(formatCpf(e.target.value))}
              maxLength={14}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          <label htmlFor="access-code" className="mt-3 block text-sm font-semibold">Código de acesso</label><input id="access-code" autoComplete="off" value={code} onChange={e=>setCode(e.target.value)} placeholder="Código recebido com o contrato" maxLength={40} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-3 text-sm" />
          {error && (
            <p role="alert" className="mt-2 text-sm font-medium text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="size-5" aria-hidden="true" />
                Consultar CPF
              </>
            )}
          </button>
        </form>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden="true" />
          Seus dados estão protegidos conosco.
        </p>
      </div>
    </section>
  )
}
