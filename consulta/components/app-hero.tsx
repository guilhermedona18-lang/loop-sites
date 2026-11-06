import { ShieldCheck, User, Menu } from 'lucide-react'

export function AppHero() {
  return (
    <header className="relative overflow-hidden bg-primary text-primary-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center rounded-lg bg-primary-foreground px-2 py-1">
            <img
              src="/images/loop-logo.png"
              alt="Loop"
              className="h-6 w-auto"
            />
          </span>
          <span className="rounded-full bg-primary-foreground px-3 py-1 text-xs font-bold text-primary">
            Leilões
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Minha conta"
            className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
          >
            <User className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Abrir menu"
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-primary-foreground/15"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Greeting + illustration */}
      <div className="relative flex items-center justify-between gap-3 px-5 pt-4">
        <div className="relative z-10 max-w-[60%]">
          <h1 className="text-pretty text-2xl font-extrabold leading-tight">
            Olá, cliente!
          </h1>
          <p className="mt-1.5 text-xs font-semibold leading-snug text-primary-foreground/90">
            Consulte aqui os detalhes do veículo arrematado por você.
          </p>
        </div>
        <img
          src="/images/hero-cliente.png"
          alt="Ilustração de um cliente segurando as chaves do veículo arrematado"
          className="pointer-events-none relative -right-2 z-0 w-32 select-none object-contain"
        />
      </div>

      {/* Security card */}
      <div className="relative z-10 px-5 pb-6 pt-3">
        <div className="flex items-center gap-3 rounded-2xl bg-card p-3 text-card-foreground shadow-sm">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-bold">
              Segurança <span className="text-primary">em primeiro lugar</span>
            </p>
            <p className="text-xs leading-snug text-muted-foreground">
              Seus dados estão protegidos e criptografados.
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
