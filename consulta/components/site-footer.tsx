import {
  MessageCircle,
  Mail,
  MapPin,
  ShieldCheck,
  ClipboardCheck,
  Headphones,
  ArrowRight,
} from 'lucide-react'

const contacts = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Revendedores oficiais',
  },
  {
    icon: Mail,
    title: 'E-mail',
    description: 'sac@loopleiloes.com',
  },
  {
    icon: MapPin,
    title: 'Localização',
    description: 'Mogi das Cruzes - SP',
  },
]

const socials = [
  { src: '/social/instagram-mono.svg', label: 'Instagram', bg: '#E4405F' },
  { src: '/social/facebook-mono.svg', label: 'Facebook', bg: '#1877F2' },
  { src: '/social/youtube-mono.svg', label: 'YouTube', bg: '#FF0000' },
  { src: '/social/linkedin-mono.svg', label: 'LinkedIn', bg: '#0A66C2' },
  { src: '/social/whatsapp-mono.svg', label: 'WhatsApp', bg: '#25D366' },
]

const footerFeatures = [
  { icon: ShieldCheck, label: 'Compra segura' },
  { icon: ClipboardCheck, label: 'Veículos verificados' },
  { icon: Headphones, label: 'Suporte especializado' },
  { icon: ArrowRight, label: 'Catálogo atualizado' },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#0b1220] px-5 pb-10 pt-2">
      {/* Marca + descrição */}
      <div className="flex items-center gap-2">
        <img
          src="/images/loop-logo.png"
          alt="Loop"
          className="h-5 w-auto"
          style={{
            filter:
              'brightness(0) saturate(100%) invert(13%) sepia(96%) saturate(7404%) hue-rotate(3deg) brightness(97%) contrast(118%)',
          }}
        />
        <span className="rounded-full bg-[#e30613] px-3 py-1 text-xs font-bold text-white">
          Leilões
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[#8b94a8]">
        Catálogo oficial administrado por representantes exclusivos de vendas.
        Atendimento personalizado durante todo o processo de compra.
      </p>

      {/* Contatos */}
      <div className="mt-4 space-y-3">
        {contacts.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-2xl border border-[#233049] bg-[#141d30] px-4 py-3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#28324a]">
              <Icon className="size-5 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="text-xs text-[#8b94a8]">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Redes sociais */}
      <h3 className="mt-6 text-center text-lg font-extrabold text-white">
        Siga-nos nas redes sociais
      </h3>
      <ul className="mt-4 flex items-center justify-center gap-3">
        {socials.map(({ src, label, bg }) => (
          <li key={label}>
            <a
              href="#"
              aria-label={label}
              className="flex size-12 items-center justify-center rounded-full transition-transform hover:scale-105"
              style={{ backgroundColor: bg }}
            >
              <img
                src={src || '/placeholder.svg'}
                alt={label}
                className="size-6 brightness-0 invert"
              />
            </a>
          </li>
        ))}
      </ul>

      {/* Barra de destaques */}
      <div className="mt-6 grid grid-cols-2 gap-y-3 gap-x-4 rounded-2xl border border-[#233049] bg-[#141d30] px-4 py-4">
        {footerFeatures.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-[#e30613]" aria-hidden="true" />
            <span className="text-xs font-bold text-white">{label}</span>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#8b94a8]">
          {'\u00A9'} 2026 Loop Leilões. Todos os direitos reservados.
        </p>
        <p className="text-xs text-[#8b94a8]">
          Representantes exclusivos de vendas.
        </p>
      </div>
    </footer>
  )
}
