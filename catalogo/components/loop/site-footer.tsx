"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ClipboardCheck,
  Gavel,
  Headphones,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react"

type IconProps = { className?: string }

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7C3.42 8.48 3.4 8.85 3.4 12s.02 3.52.08 4.76c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32C15.52 4.01 15.15 4 12 4Zm0 3.06A4.94 4.94 0 1 1 7.06 12 4.94 4.94 0 0 1 12 7.06Zm0 8.14A3.2 3.2 0 1 0 8.8 12a3.2 3.2 0 0 0 3.2 3.2Zm6.3-8.34a1.15 1.15 0 1 1-1.15-1.15 1.15 1.15 0 0 1 1.15 1.15Z" />
    </svg>
  )
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6Z" />
    </svg>
  )
}

function LinkedinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function WhatsappIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.24-.69.24-1.28.17-1.41-.07-.12-.27-.2-.57-.35ZM12.05 21.8h-.01a9.7 9.7 0 0 1-4.95-1.36l-.35-.21-3.68.96.98-3.59-.23-.37a9.68 9.68 0 0 1-1.48-5.15c0-5.35 4.36-9.7 9.72-9.7 2.6 0 5.03 1.01 6.86 2.85a9.65 9.65 0 0 1 2.85 6.86c0 5.35-4.36 9.71-9.71 9.71Zm8.26-17.96A11.42 11.42 0 0 0 12.05.5C5.8.5.72 5.58.72 11.82c0 2.05.54 4.05 1.56 5.82L.62 23.5l6-1.57a11.35 11.35 0 0 0 5.42 1.38h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.03-1.18-5.87-3.32-8.01Z" />
    </svg>
  )
}

const whyCards = [
  { title: "Compra segura", icon: ShieldCheck },
  { title: "Veículos verificados", icon: ClipboardCheck },
  { title: "Suporte no leilão", icon: Gavel },
  { title: "Atendimento humano", icon: Headphones },
]

const details = [
  {
    icon: ShieldCheck,
    title: "Base DETRAN",
    desc: "Conferência de dados com referência documental oficial para reforçar confiança no arremate.",
  },
  {
    icon: Lock,
    title: "Proteção LGPD",
    desc: "Tratamento responsável das informações do comprador com padrão de privacidade e controle.",
  },
  {
    icon: ClipboardCheck,
    title: "Transparência total",
    desc: "Etapas, taxas e orientações exibidas de forma clara para decisão segura em cada lote.",
  },
  {
    icon: Headphones,
    title: "Garantia de suporte",
    desc: "Canal oficial ativo para acompanhar você do lance até a finalização da compra.",
  },
]

const contacts = [
  { icon: MessageCircle, title: "WhatsApp", value: "Revendedores oficiais" },
  { icon: Mail, title: "E-mail", value: "sac@loopleiloes.com" },
  { icon: MapPin, title: "Localização", value: "Mogi das Cruzes - SP" },
]

const socials = [
  { icon: InstagramIcon, label: "Instagram", className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]" },
  { icon: FacebookIcon, label: "Facebook", className: "bg-[#1877f2]" },
  { icon: YoutubeIcon, label: "YouTube", className: "bg-[#ff0000]" },
  { icon: LinkedinIcon, label: "LinkedIn", className: "bg-[#0a66c2]" },
  {
    icon: WhatsappIcon,
    label: "WhatsApp",
    className: "bg-[#25d366]",
    href: "https://wa.me/message/DGZ2W2OPP6HIE1",
  },
]

const bottomBadges = [
  { icon: ShieldCheck, title: "Compra segura" },
  { icon: ClipboardCheck, title: "Veículos verificados" },
  { icon: Headphones, title: "Suporte especializado" },
  { icon: ArrowRight, title: "Catálogo atualizado" },
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  return (
    <section className="px-4 pt-6">
      <div className="space-y-5 rounded-3xl bg-ink p-5 text-ink-foreground">
        {/* Por que comprar conosco */}
        <h2 className="text-center font-heading text-xl font-extrabold text-balance">
          Por que comprar conosco?
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {whyCards.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex flex-col items-center gap-2 rounded-2xl bg-card px-3 py-4 text-center"
              >
                <Icon className="size-6 text-primary" />
                <span className="text-xs font-bold text-foreground">{c.title}</span>
              </div>
            )
          })}
        </div>

        {/* Detalhes */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2">
          {details.map((d, i) => {
            const Icon = d.icon
            return (
              <div key={d.title}>
                <div className="flex gap-3 p-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="size-5 text-primary" />
                  </span>
                  <div>
                    <h3 className="font-heading text-lg font-bold leading-tight">
                      {d.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-foreground/70">
                      {d.desc}
                    </p>
                  </div>
                </div>
                {i < details.length - 1 && <div className="mx-3 h-px bg-white/10" />}
              </div>
            )
          })}
        </div>

        {/* Newsletter */}
        <div className="rounded-2xl bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary">
              <Lock className="size-5 text-primary-foreground" />
            </span>
            <div>
              <p className="font-heading text-base font-bold">
                Receba oportunidades exclusivas
              </p>
              <p className="text-xs text-ink-foreground/60">
                Ofertas selecionadas no seu e-mail.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-3 text-sm font-medium text-ink-foreground">
              <CheckCircle2 className="size-5 text-primary" />
              Pronto! Você receberá nossas ofertas.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes("@")) setSent(true)
              }}
              className="mt-3 flex overflow-hidden rounded-xl bg-card"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="shrink-0 bg-primary px-5 text-sm font-bold text-primary-foreground transition active:scale-95"
              >
                Receber
              </button>
            </form>
          )}
          <p className="mt-2 text-[11px] text-ink-foreground/50">
            Seus dados estão seguros conosco.
          </p>
        </div>

        {/* Logo + descrição */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2">
            <Image
              src="/loop-logo-mark.png"
              alt="Loop"
              width={240}
              height={160}
              className="h-10 w-auto brightness-0 invert"
            />
            <span className="rounded-md bg-primary px-2 py-0.5 font-heading text-xs font-extrabold uppercase tracking-wide text-primary-foreground">
              Leilões
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ink-foreground/70">
            Catálogo oficial administrado por representantes exclusivos de vendas.
            Atendimento personalizado durante todo o processo de compra.
          </p>
        </div>

        {/* Contatos */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {contacts.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.title}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="size-5 text-ink-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-sm font-bold">{c.title}</p>
                  <p className="truncate text-xs text-ink-foreground/60">{c.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Redes sociais */}
        <div className="pt-2">
          <h3 className="text-center font-heading text-lg font-bold">
            Siga-nos nas redes sociais
          </h3>
          <div className="mt-4 flex items-center justify-center gap-3">
            {socials.map((s) => {
              const Icon = s.icon
              return (
                <a
                  key={s.label}
                  href={s.href ?? "#"}
                  target={s.href ? "_blank" : undefined}
                  rel={s.href ? "noopener noreferrer" : undefined}
                  aria-label={s.label}
                  className={`flex size-12 items-center justify-center rounded-full text-white transition active:scale-95 ${s.className}`}
                >
                  <Icon className="size-6" />
                </a>
              )
            })}
          </div>
        </div>

        {/* Selos */}
        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 sm:grid-cols-4">
          {bottomBadges.map((b) => {
            const Icon = b.icon
            return (
              <div key={b.title} className="flex items-center gap-2">
                <Icon className="size-5 shrink-0 text-ink-foreground/80" />
                <span className="text-xs font-bold leading-tight">{b.title}</span>
              </div>
            )
          })}
        </div>

        {/* Copyright */}
        <div className="pt-2 text-center text-[11px] leading-relaxed text-ink-foreground/50">
          © 2026 Loop Leilões. Todos os direitos reservados.
          <br />
          Representantes exclusivos de vendas.
        </div>
      </div>
    </section>
  )
}
