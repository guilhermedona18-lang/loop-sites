"use client"

import { useState } from "react"
import { Loader2, ImageUp, CheckCircle2, AlertCircle } from "lucide-react"
import { migrateBase64Images } from "@/lib/actions/migrate-images"

export function ImageMigrationCard() {
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  async function handleRun() {
    setRunning(true)
    setResult(null)
    const res = await migrateBase64Images()
    setResult(res)
    setRunning(false)
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <ImageUp className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-foreground">Otimizar imagens (mover para o Blob)</h2>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            Move as fotos antigas que estão salvas dentro do banco para o armazenamento de arquivos (Vercel Blob),
            deixando o banco leve e evitando o bloqueio por cota. Rode uma vez assim que o banco estiver disponível.
          </p>

          <button
            type="button"
            onClick={handleRun}
            disabled={running}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageUp className="h-4 w-4" />}
            {running ? "Migrando imagens..." : "Migrar imagens agora"}
          </button>

          {result && (
            <div
              className={`mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                result.ok
                  ? "border-primary/30 bg-primary/5 text-foreground"
                  : "border-destructive/30 bg-destructive/5 text-foreground"
              }`}
            >
              {result.ok ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              ) : (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              )}
              <span>{result.message}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
