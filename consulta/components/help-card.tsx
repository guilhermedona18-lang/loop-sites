import { MessageCircle } from 'lucide-react'

// Link direto do WhatsApp do vendedor.
const VENDEDOR_WHATSAPP_URL = 'https://wa.me/message/DGZ2W2OPP6HIE1'
const VENDEDOR_NOME = 'Thiago Portes'

export function HelpCard() {
  const whatsappUrl = VENDEDOR_WHATSAPP_URL

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-full items-center gap-4 rounded-2xl border border-primary/15 bg-accent px-4 py-4 text-left transition-colors hover:bg-accent/70"
    >
      <img
        src="/vendedor-thiago.png"
        alt={`Foto de ${VENDEDOR_NOME}, vendedor oficial da Loop Leilões`}
        className="size-16 shrink-0 rounded-full object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">
          Precisa de ajuda? Fale com o vendedor
        </p>
        <p className="text-xs text-muted-foreground">
          {VENDEDOR_NOME} — Vendedor Oficial
        </p>
      </div>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
        <MessageCircle className="size-5 text-white" aria-hidden="true" />
      </span>
    </a>
  )
}
