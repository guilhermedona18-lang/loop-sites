import {
  ShieldCheck,
  ClipboardCheck,
  Gavel,
  Headphones,
  Lock,
  BadgeCheck,
} from 'lucide-react'

const highlights = [
  { icon: ShieldCheck, label: 'Compra segura' },
  { icon: ClipboardCheck, label: 'Veículos verificados' },
  { icon: Gavel, label: 'Suporte no leilão' },
  { icon: Headphones, label: 'Atendimento humano' },
]

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Base DETRAN',
    description:
      'Conferência de dados com referência documental oficial para reforçar confiança no arremate.',
  },
  {
    icon: Lock,
    title: 'Proteção LGPD',
    description:
      'Tratamento responsável das informações do comprador com padrão de privacidade e controle.',
  },
  {
    icon: ClipboardCheck,
    title: 'Transparência total',
    description:
      'Etapas, taxas e orientações exibidas de forma clara para decisão segura em cada lote.',
  },
  {
    icon: Headphones,
    title: 'Garantia de suporte',
    description:
      'Canal oficial ativo para acompanhar você do lance até a finalização da compra.',
  },
]

export function WhyBuySection() {
  return (
    <section className="bg-[#0b1220] px-5 py-8">
      <h2 className="text-center text-xl font-extrabold text-white text-balance">
        Por que comprar conosco?
      </h2>

      {/* Cards de destaque */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {highlights.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-center shadow-sm"
          >
            <Icon className="size-6 text-[#e30613]" aria-hidden="true" />
            <span className="text-sm font-bold text-[#0d1526] text-balance">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Lista de benefícios */}
      <div className="mt-4 rounded-2xl border border-[#233049] bg-[#141d30] p-5">
        {benefits.map(({ icon: Icon, title, description }, index) => (
          <div
            key={title}
            className={
              index > 0 ? 'mt-4 border-t border-[#233049] pt-4' : undefined
            }
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2b2233]">
                <Icon className="size-5 text-[#e30613]" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-extrabold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#8b94a8]">
                  {description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
