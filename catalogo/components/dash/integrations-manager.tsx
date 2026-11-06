"use client"

import { useState } from "react"
import { Loader2, Check, Plug, Send, AlertCircle, CheckCircle2, KeyRound, Link2, RefreshCw } from "lucide-react"
import { saveIntegration, testIntegration, syncArremates } from "@/lib/actions/integrations"
import type { IntegrationConfig, IntegrationEvent, LastDelivery } from "@/lib/integrations/webhook"

const EVENTS: { key: IntegrationEvent; label: string; hint: string }[] = [
  { key: "bid", label: "Lances / arremates", hint: "Enviado no formato de arremate (cliente, veículo, valor e etapas)." },
  { key: "simulation", label: "Simulações de financiamento", hint: "Cada proposta gerada no simulador." },
  { key: "vehicle", label: "Veículos", hint: "Cadastro e edição de veículos/lotes." },
  { key: "user", label: "Usuários / leads", hint: "Novos participantes cadastrados." },
]

export function IntegrationsManager({
  initialConfig,
  initialLast,
}: {
  initialConfig: IntegrationConfig
  initialLast: LastDelivery
}) {
  const [config, setConfig] = useState<IntegrationConfig>(initialConfig)
  const [last, setLast] = useState<LastDelivery>(initialLast)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ ok: boolean; message: string } | null>(null)

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await saveIntegration(config)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    const res = await testIntegration(config)
    setTestResult({ ok: res.ok, message: res.message })
    setLast({ event: "test", ok: res.ok, status: res.status, message: res.message, at: new Date().toISOString() })
    setTesting(false)
  }

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    const res = await syncArremates()
    const message = res.ok
      ? `${res.enviados} arremate(s) enviado(s) com sucesso.`
      : res.message
    setSyncResult({ ok: res.ok, message })
    setLast({ event: "sync", ok: res.ok, status: res.status, message, at: new Date().toISOString() })
    setSyncing(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Plug className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Integrações</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Envie automaticamente os dados deste painel para outro sistema em tempo real, via webhook.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Ativar */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Integração ativa</p>
            <p className="text-xs text-muted-foreground">Quando ligada, os eventos selecionados são enviados na hora.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={config.enabled}
            onClick={() => setConfig({ ...config, enabled: !config.enabled })}
            className={`relative h-6 w-11 rounded-full transition-colors ${config.enabled ? "bg-primary" : "bg-muted"}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-transform ${
                config.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Conexão */}
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Link2 className="h-4 w-4 text-muted-foreground" /> URL de destino (webhook)
            </label>
            <input
              type="url"
              placeholder="https://outro-painel.com/api/webhook"
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Endereço fornecido pelo outro painel. Os dados são enviados via HTTP POST em JSON.
            </p>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <KeyRound className="h-4 w-4 text-muted-foreground" /> Chave de API (x-api-key)
            </label>
            <input
              type="password"
              placeholder="INGEST_API_KEY do outro painel"
              value={config.secret}
              onChange={(e) => setConfig({ ...config, secret: e.target.value })}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Enviada em cada requisição no cabeçalho <code className="text-foreground">x-api-key</code> para o painel autenticar o envio.
            </p>
          </div>
        </div>

        {/* Eventos */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
          <p className="text-sm font-medium text-foreground">O que enviar</p>
          {EVENTS.map((ev) => (
            <label key={ev.key} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={config.events[ev.key]}
                onChange={(e) => setConfig({ ...config, events: { ...config.events, [ev.key]: e.target.checked } })}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm text-foreground">{ev.label}</span>
                <span className="block text-xs text-muted-foreground">{ev.hint}</span>
              </span>
            </label>
          ))}
        </div>

        {/* Sincronização em massa */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
          <div>
            <p className="text-sm font-medium text-foreground">Enviar arremates existentes</p>
            <p className="text-xs text-muted-foreground">
              Reenvia de uma só vez todos os arremates já registrados (com cliente, veículo e fotos) para o painel de destino. Útil na primeira integração ou para reprocessar.
            </p>
          </div>
          {syncResult && (
            <div
              className={`rounded-lg px-3 py-2 text-sm ${
                syncResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-destructive/10 text-destructive"
              }`}
            >
              {syncResult.message}
            </div>
          )}
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing || !config.url}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Sincronizar todos os arremates
          </button>
        </div>

        {/* Última entrega */}
        {last && (
          <div
            className={`flex items-start gap-2 rounded-xl border p-4 text-sm ${
              last.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {last.ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />}
            <div>
              <p className="font-medium">
                Último envio ({last.event}): {last.message}
              </p>
              <p className="text-xs opacity-80">{new Date(last.at).toLocaleString("pt-BR")}</p>
            </div>
          </div>
        )}

        {testResult && (
          <div
            className={`rounded-lg px-3 py-2 text-sm ${
              testResult.ok ? "bg-emerald-50 text-emerald-700" : "bg-destructive/10 text-destructive"
            }`}
          >
            {testResult.message}
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar integração
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !config.url}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-60"
          >
            {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Testar conexão
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
