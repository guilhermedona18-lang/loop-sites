import type { Metadata } from "next"
import { BlockedActions } from "./blocked-actions"
import { ShieldAlert, Clock, Headset } from "lucide-react"

export const metadata: Metadata = {
  title: "Acesso temporariamente bloqueado | Loop Leilões",
  description:
    "Detectamos um volume incomum de acessos a partir da sua conexão. O acesso será liberado automaticamente em alguns minutos.",
  robots: { index: false, follow: false },
}

export default function AcessoBloqueadoPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-accent">
          <ShieldAlert className="size-8 text-primary" aria-hidden="true" />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
          Loop Leilões
        </p>
        <h1 className="text-balance text-2xl font-bold text-card-foreground sm:text-3xl">
          Acesso temporariamente bloqueado
        </h1>
        <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
          Detectamos um volume incomum de requisições vindas da sua conexão. Para
          proteger a plataforma e manter o leilão estável para todos, o acesso foi
          pausado por alguns minutos.
        </p>

        <div className="mt-6 space-y-3 text-left">
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-secondary-foreground">
              <span className="font-semibold">Liberação automática:</span> você não
              precisa fazer nada. O acesso volta ao normal em até 20 minutos.
            </p>
          </div>
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-4">
            <Headset className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-secondary-foreground">
              <span className="font-semibold">É um engano?</span> Se você é um usuário
              real participando de um leilão, aguarde alguns instantes e tente
              novamente, ou fale com o nosso suporte.
            </p>
          </div>
        </div>

        <BlockedActions />

        <p className="mt-6 text-xs text-muted-foreground">
          Se o problema persistir, entre em contato pelo telefone (11) 3950-5000.
        </p>
      </section>
    </main>
  )
}
