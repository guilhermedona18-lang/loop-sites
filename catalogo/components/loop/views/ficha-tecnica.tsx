import {
  Palette,
  Cog,
  DoorOpen,
  Disc3,
  Waypoints,
  Car,
  Diamond,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react"
import type { Vehicle } from "@/lib/loop-data"

const NA = "Não informado"

/** Mascara o miolo de um documento, mantendo início e fim visíveis. */
function maskDoc(value?: string, keepStart = 3, keepEnd = 2) {
  const v = (value ?? "").trim()
  if (!v) return ""
  if (v.length <= keepStart + keepEnd) return v
  const start = v.slice(0, keepStart)
  const end = v.slice(-keepEnd)
  return `${start}${"*".repeat(Math.max(3, v.length - keepStart - keepEnd))}${end}`
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <Icon className="size-5 text-primary" />
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
        {value || NA}
      </p>
    </div>
  )
}

export function FichaTecnica({
  vehicle,
  km,
  placa,
}: {
  vehicle: Vehicle | null
  km?: string
  placa?: string
}) {
  const tiles: { icon: LucideIcon; label: string; value: string }[] = [
    { icon: Palette, label: "Cor", value: vehicle?.color || NA },
    { icon: Cog, label: "Motor", value: vehicle?.engine || NA },
    { icon: DoorOpen, label: "Portas", value: vehicle?.doors || NA },
    { icon: Disc3, label: "Direção", value: vehicle?.steering || NA },
    { icon: Waypoints, label: "Tração", value: vehicle?.traction || NA },
    { icon: Car, label: "Carroceria", value: vehicle?.bodywork || NA },
    { icon: Diamond, label: "Condição", value: vehicle?.condition || NA },
    { icon: FileText, label: "Origem", value: vehicle?.origin || NA },
    { icon: ShieldCheck, label: "IPVA", value: vehicle?.ipva || NA },
    { icon: CheckCircle2, label: "Sinistro", value: vehicle?.sinistro || NA },
    { icon: FileText, label: "Chassi", value: maskDoc(vehicle?.chassi) || NA },
    { icon: FileText, label: "Renavam", value: maskDoc(vehicle?.renavam) || NA },
  ]

  return (
    <div className="space-y-4">
      {/* Km e Placa */}
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Km
          </p>
          <p className="mt-0.5 font-heading text-base font-bold text-foreground">
            {km || vehicle?.km || NA}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Placa
          </p>
          <p className="mt-0.5 font-heading text-base font-bold text-foreground">
            {placa || maskDoc(vehicle?.placa, 3, 1) || NA}
          </p>
        </div>
      </div>

      {/* Ficha técnica */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
              Ficha técnica
            </p>
            <h3 className="mt-0.5 font-heading text-lg font-extrabold text-foreground">
              Informações do veículo
            </h3>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-accent">
            <ClipboardCheck className="size-5 text-primary" />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {tiles.map((t) => (
            <InfoTile key={t.label} icon={t.icon} label={t.label} value={t.value} />
          ))}
        </div>
      </div>
    </div>
  )
}
