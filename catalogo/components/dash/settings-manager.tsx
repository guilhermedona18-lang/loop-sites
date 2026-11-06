"use client"

import { useState } from "react"
import { Loader2, Check } from "lucide-react"
import { saveSettings } from "@/lib/actions/settings"

const FIELDS: { key: string; label: string; type: "text" | "number" | "textarea"; hint?: string; suffix?: string }[] = [
  { key: "buyer_fee", label: "Taxa do comprador", type: "number", suffix: "%", hint: "Percentual cobrado sobre o lance vencedor." },
  { key: "seller_fee", label: "Taxa do vendedor", type: "number", suffix: "%", hint: "Percentual descontado do vendedor." },
  { key: "min_increment", label: "Incremento mínimo de lance", type: "number", suffix: "R$", hint: "Valor mínimo entre lances." },
  { key: "rules", label: "Regras do leilão", type: "textarea", hint: "Texto exibido aos participantes." },
  { key: "notice", label: "Aviso / comunicado", type: "textarea", hint: "Mensagem destacada no painel e na vitrine." },
]

export function SettingsManager({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {}
    for (const f of FIELDS) v[f.key] = initialSettings[f.key] ?? ""
    return v
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await saveSettings(values)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Taxas, regras e avisos do leilão.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-border bg-card p-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="mb-1 block text-sm font-medium text-foreground">{f.label}</label>
            {f.type === "textarea" ? (
              <textarea
                value={values[f.key]}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
              />
            ) : (
              <div className="flex items-center gap-2">
                {f.suffix && <span className="text-sm text-muted-foreground">{f.suffix}</span>}
                <input
                  type={f.type}
                  value={values[f.key]}
                  onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                />
              </div>
            )}
            {f.hint && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar configurações
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
              <Check className="h-4 w-4" /> Salvo
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
