import { cn } from "@/lib/utils"

const styles: Record<string, string> = {
  // lances
  novo: "bg-primary/10 text-primary",
  aprovado: "bg-emerald-100 text-emerald-700",
  arrematado: "bg-emerald-100 text-emerald-700",
  recusado: "bg-destructive/10 text-destructive",
  // veículos
  aberto: "bg-emerald-100 text-emerald-700",
  encerrando: "bg-amber-100 text-amber-700",
  // leilões
  agendado: "bg-amber-100 text-amber-700",
  ativo: "bg-emerald-100 text-emerald-700",
  encerrado: "bg-muted text-muted-foreground",
  // usuários
  inativo: "bg-muted text-muted-foreground",
}

const labels: Record<string, string> = {
  novo: "Novo",
  aprovado: "Aprovado",
  arrematado: "Arrematado",
  recusado: "Recusado",
  aberto: "Aberto",
  encerrando: "Encerrando",
  agendado: "Agendado",
  ativo: "Ativo",
  encerrado: "Encerrado",
  inativo: "Inativo",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold capitalize",
        styles[status] ?? "bg-muted text-muted-foreground",
      )}
    >
      {labels[status] ?? status}
    </span>
  )
}
