"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Bell,
  ChevronRight,
  Gavel,
  Heart,
  LogOut,
  ShieldCheck,
  FileText,
} from "lucide-react"
import { useLoop } from "../store"

export function AccountView() {
  const { user, login, logout, setTab, favorites } = useLoop()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState<"login" | "signup">("login")

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="px-5 pt-6">
      <div className="flex justify-center">
        <Image
          src="/loop-logo.png"
          alt="Loop Leilões"
          width={150}
          height={44}
          className="h-11 w-auto"
          priority
        />
      </div>

      <div className="mt-8 text-center">
        <span className="inline-block rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          Área segura
        </span>
        <h1 className="mt-3 font-heading text-3xl font-extrabold text-foreground">
          Minha conta
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Acesse suas simulações e acompanhe oportunidades com apoio oficial.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (email.includes("@")) login(email)
        }}
        className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm"
      >
        <label className="block text-sm font-semibold text-foreground">
          E-mail
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="voce@email.com"
          className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground"
        />

        <label className="mt-4 block text-sm font-semibold text-foreground">
          Senha
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground outline-none transition focus:border-primary placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition active:scale-[0.99]"
        >
          {mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setMode((m) => (m === "login" ? "signup" : "login"))}
        className="mt-4 w-full rounded-xl border border-primary/40 bg-card py-4 text-sm font-bold text-primary transition active:scale-[0.99]"
      >
        {mode === "login" ? "Criar meu cadastro" : "Já tenho conta"}
      </button>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Ambiente protegido e dados tratados com segurança.
      </p>
    </div>
  )
}

function Dashboard() {
  const { user, logout, setTab, favorites } = useLoop()

  const rows = [
    { icon: Heart, label: "Favoritos", value: `${favorites.length} lotes`, tab: "favoritos" as const },
    { icon: Gavel, label: "Meus lances", value: "0 ativos" },
    { icon: FileText, label: "Documentos", value: "Em dia" },
    { icon: Bell, label: "Notificações", value: "Ativadas" },
    { icon: ShieldCheck, label: "Segurança da conta", value: "Verificada" },
  ]

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-4 rounded-3xl bg-ink p-5 text-ink-foreground">
        <span className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {user?.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-ink-foreground/70">Bem-vindo de volta</p>
          <p className="truncate font-heading text-lg font-bold">{user}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-card">
        {rows.map((r, i) => {
          const Icon = r.icon
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => r.tab && setTab(r.tab)}
              className={`flex w-full items-center gap-4 px-4 py-4 text-left transition active:bg-secondary ${
                i !== rows.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-foreground">
                  {r.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {r.value}
                </span>
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={logout}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-card py-4 text-sm font-bold text-primary transition active:scale-[0.99]"
      >
        <LogOut className="size-4" />
        Sair da conta
      </button>
    </div>
  )
}
