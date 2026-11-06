'use client'

import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Lock,
  Loader2,
  AlertCircle,
  Barcode,
  FileText,
  Info,
  BadgeCheck,
} from 'lucide-react'
import type { PaymentConfig } from '@/lib/payment'

export function PaymentScreen({ vehicleTitle }: { vehicleTitle?: string }) {
  const [config, setConfig] = useState<PaymentConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [copiedBoleto, setCopiedBoleto] = useState(false)

  useEffect(() => {
    let active = true
    fetch('/api/payment')
      .then((r) => r.json())
      .then((data) => {
        if (active) setConfig(data as PaymentConfig)
      })
      .catch(() => {
        if (active) setConfig(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  async function copyPix() {
    if (!config?.pixKey) return
    try {
      await navigator.clipboard.writeText(config.pixKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  async function copyBoleto() {
    if (!config?.boletoCode) return
    try {
      await navigator.clipboard.writeText(config.boletoCode)
      setCopiedBoleto(true)
      setTimeout(() => setCopiedBoleto(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
            Pagamento seguro
          </p>
          <h2 className="text-lg font-extrabold leading-tight text-foreground">
            Regularize o débito pendente
          </h2>
        </div>
      </div>

      {vehicleTitle ? (
        <p className="mt-2 text-xs leading-snug text-muted-foreground">
          Débito de documentação referente ao veículo{' '}
          <span className="font-semibold text-foreground">{vehicleTitle}</span>.
          Após a confirmação do pagamento, iniciamos a liberação e entrega.
        </p>
      ) : (
        <p className="mt-2 text-xs leading-snug text-muted-foreground">
          Escaneie o QR code ou use a chave PIX abaixo para concluir o pagamento
          com segurança.
        </p>
      )}

      {/* Para que serve o pagamento (baixa de gravame) */}
      <div className="mt-4 rounded-xl border border-border bg-secondary/50 p-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Info className="size-4 text-primary" aria-hidden="true" />
          Para que serve o pagamento?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Este é o pagamento do débito de documentação do seu veículo. Assim que
          o valor for pago e compensado, a instituição realiza a{' '}
          <span className="font-semibold text-foreground">baixa de gravame</span>{' '}
          — o processo que retira do sistema do Detran a restrição financeira do
          veículo, deixando o bem 100% liberado para você{' '}
          <span className="font-semibold text-foreground">transferir ou vender</span>.
        </p>
        <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-accent/60 px-3 py-2">
          <BadgeCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-[11px] leading-snug text-muted-foreground">
            Após regularizar, seu veículo fica sem restrições no Detran e pronto
            para transferência.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex flex-col items-center py-8 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" aria-hidden="true" />
          <p className="mt-2 text-sm">Carregando dados de pagamento...</p>
        </div>
      ) : !config || (!config.qrImage && !config.pixKey && !config.boletoCode) ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-xs leading-snug text-muted-foreground">
            Os dados de pagamento ainda não foram configurados. Entre em contato
            com o atendimento oficial da Loop Leilões para concluir sua compra.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {config.amountLabel ? (
            <div className="rounded-xl bg-accent p-3 text-center">
              <p className="text-[11px] text-muted-foreground">Valor a pagar</p>
              <p className="text-2xl font-extrabold text-primary">
                {config.amountLabel}
              </p>
            </div>
          ) : null}

          {/* QR code */}
          {config.qrImage ? (
            <div className="flex flex-col items-center">
              <h3 className="flex items-center gap-2 self-start text-sm font-bold text-foreground">
                <QrCode className="size-4 text-primary" aria-hidden="true" />
                Pague com QR code
              </h3>
              <img
                src={config.qrImage || '/placeholder.svg'}
                alt="QR code para pagamento"
                className="mt-3 size-56 rounded-xl border border-border bg-white object-contain p-2"
              />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Abra o app do seu banco e escaneie o código acima.
              </p>
            </div>
          ) : null}

          {/* Chave PIX */}
          {config.pixKey ? (
            <div className="rounded-xl border border-border p-3">
              <h3 className="text-sm font-bold text-foreground">Chave PIX</h3>
              {config.pixName ? (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Titular: {config.pixName}
                </p>
              ) : null}
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-sm text-foreground">
                  {config.pixKey}
                </code>
                <button
                  type="button"
                  onClick={copyPix}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" aria-hidden="true" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}

          {/* Boleto */}
          {config.boletoCode ? (
            <div className="rounded-xl border border-border p-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Barcode className="size-4 text-primary" aria-hidden="true" />
                Boleto bancário
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Copie a linha digitável e pague no app ou internet banking.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-secondary px-3 py-2 text-xs text-foreground">
                  {config.boletoCode}
                </code>
                <button
                  type="button"
                  onClick={copyBoleto}
                  className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {copiedBoleto ? (
                    <>
                      <Check className="size-3.5" aria-hidden="true" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" aria-hidden="true" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              {config.boletoUrl ? (
                <a
                  href={config.boletoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-secondary/70"
                >
                  <FileText className="size-3.5" aria-hidden="true" />
                  Abrir boleto em PDF
                </a>
              ) : null}
            </div>
          ) : null}

          {config.note ? (
            <p className="rounded-xl bg-secondary/60 p-3 text-xs leading-snug text-muted-foreground">
              {config.note}
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
        <Lock className="size-3" aria-hidden="true" />
        Ambiente seguro Loop Leilões
      </div>
    </article>
  )
}
