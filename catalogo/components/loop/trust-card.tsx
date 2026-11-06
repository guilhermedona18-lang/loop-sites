import { ShieldCheck, ClipboardCheck, Lock } from "lucide-react"

const items = [
  {
    icon: ShieldCheck,
    title: "Dados conferidos",
    desc: "Descrição, fotos e condição do veículo validados antes da publicação.",
  },
  {
    icon: ClipboardCheck,
    title: "Processo transparente",
    desc: "Taxas, prazos e etapas exibidos com clareza para sua decisão.",
  },
  {
    icon: Lock,
    title: "Pagamento protegido",
    desc: "Orientação oficial para evitar fraudes e garantir transação segura.",
  },
]

export function TrustCard({ active = true }: { active?: boolean }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <p className="font-heading text-xs font-extrabold uppercase tracking-wide text-primary">
        Confiança e transparência
      </p>
      <h3 className="mt-1 font-heading text-2xl font-extrabold leading-tight text-foreground text-balance">
        Arremate com segurança total
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Todas as informações deste lote passam por conferência da equipe Loop e
        acompanhamento do vendedor oficial.
      </p>

      <div className="mt-4 space-y-3">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex gap-3 rounded-2xl bg-secondary p-4">
              <Icon className="size-5 shrink-0 text-primary" />
              <div className="min-w-0">
                <h4 className="font-heading text-base font-bold text-foreground">
                  {item.title}
                </h4>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {active && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-[oklch(0.95_0.06_150)] p-4">
          <span className="relative mt-1 flex size-3 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[oklch(0.6_0.17_150)] opacity-75" />
            <span className="relative inline-flex size-3 rounded-full bg-[oklch(0.55_0.17_150)]" />
          </span>
          <div className="min-w-0">
            <h4 className="font-heading text-base font-bold text-[oklch(0.35_0.09_150)]">
              Lote ativo e aberto para lance agora
            </h4>
            <p className="mt-0.5 text-sm leading-relaxed text-[oklch(0.45_0.07_150)]">
              Aproveite o momento para arrematar com suporte oficial da Loop.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
