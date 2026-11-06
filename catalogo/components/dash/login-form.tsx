"use client"

import { useFormStatus } from "react-dom"
import { Lock, Gavel } from "lucide-react"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition active:scale-[0.99] disabled:opacity-60"
    >
      {pending ? "Entrando..." : "Entrar no painel"}
    </button>
  )
}

export function LoginForm({error}:{error?:string}) {

  return (
    <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Gavel className="size-7" />
        </span>
        <h1 className="mt-4 font-heading text-2xl font-extrabold text-foreground">
          Painel Loop Leilões
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Área restrita. Informe a senha de acesso.
        </p>
      </div>

      <form action="/api/admin/login" method="post" className="mt-6 space-y-3">
        <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <Lock className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            aria-label="Senha do painel"
            required
            autoFocus
            placeholder="Senha do painel"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </label>

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
            {error}
          </p>
        )}

        <SubmitButton />
      </form>
    </div>
  )
}
