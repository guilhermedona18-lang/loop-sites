import {
  ShieldCheck,
  ClipboardCheck,
  Lock,
  User,
  Car,
  Calendar,
  CircleCheck,
  FileText,
  Gauge,
  Fuel,
  Palette,
  Cog,
  Settings2,
  DoorOpen,
  Hash,
  ShieldAlert,
  Tag,
  Wallet,
} from 'lucide-react'
import { type Vehicle, formatCpf, formatCurrency } from '@/lib/vehicles'

function DataRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value?: string | number | null
}) {
  const text =
    value === null || value === undefined || value === ''
      ? null
      : String(value)
  if (!text) return null
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{text}</span>
    </div>
  )
}

export function VehicleDetails({
  customerName,
  document,
  vehicle,
}: {
  customerName: string
  document?: string
  vehicle: Vehicle
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-primary">
        Confiança e transparência
      </p>
      <h2 className="mt-1 text-pretty text-2xl font-extrabold leading-tight text-foreground">
        Arremate com segurança total
      </h2>
      <p className="mt-2 text-[13px] leading-snug text-muted-foreground">
        Todas as informações deste lote passam por conferência da equipe Loop e
        acompanhamento do vendedor oficial.
      </p>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-foreground">Dados conferidos</p>
            <p className="text-xs leading-snug text-muted-foreground">
              Descrição, fotos e condição do veículo validados antes da
              publicação.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3">
          <ClipboardCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-foreground">Processo transparente</p>
            <p className="text-xs leading-snug text-muted-foreground">
              Taxas, prazos e etapas exibidos com clareza para sua decisão.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 p-3">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <p className="text-sm font-bold text-foreground">Pagamento protegido</p>
            <p className="text-xs leading-snug text-muted-foreground">
              Orientação oficial para evitar fraudes e garantir transação segura.
            </p>
          </div>
        </div>
      </div>

      {/* Lote ativo - bolinha verde piscando */}
      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-success/10 p-3">
        <span className="relative mt-1 flex size-2.5 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-success" />
        </span>
        <div>
          <p className="text-sm font-bold text-success">
            Lote ativo e aberto para lance agora
          </p>
          <p className="text-xs leading-snug text-muted-foreground">
            Aproveite o momento para arrematar com suporte oficial da Loop.
          </p>
        </div>
      </div>

      {/* Dados do cliente */}
      <h3 className="mt-5 flex items-center gap-2 text-base font-extrabold text-foreground">
        <User className="size-4 text-primary" aria-hidden="true" />
        Dados do cliente
      </h3>
      <div className="mt-2 border-t border-border pt-2">
        <DataRow icon={User} label="Nome:" value={customerName} />
        {document ? (
          <DataRow icon={FileText} label="CPF:" value={formatCpf(document)} />
        ) : null}
      </div>

      {/* Dados do veículo */}
      <h3 className="mt-4 flex items-center gap-2 text-base font-extrabold text-foreground">
        <Car className="size-4 text-primary" aria-hidden="true" />
        Dados do veículo
      </h3>
      <div className="mt-2 border-t border-border pt-2">
        <DataRow icon={Car} label="Modelo:" value={vehicle.brandModel} />
        <DataRow icon={Tag} label="Versão:" value={vehicle.version} />
        <DataRow icon={Tag} label="Marca:" value={vehicle.brand} />
        <DataRow icon={Calendar} label="Ano:" value={vehicle.year} />
        <DataRow icon={Palette} label="Cor:" value={vehicle.color} />
        <DataRow icon={Gauge} label="Quilometragem:" value={vehicle.mileage} />
        <DataRow icon={Fuel} label="Combustível:" value={vehicle.fuel} />
        <DataRow icon={Cog} label="Motor:" value={vehicle.engine} />
        <DataRow icon={Settings2} label="Câmbio:" value={vehicle.transmission} />
        <DataRow icon={Settings2} label="Direção:" value={vehicle.steering} />
        <DataRow icon={Car} label="Tração:" value={vehicle.traction} />
        <DataRow icon={Car} label="Carroceria:" value={vehicle.bodywork} />
        <DataRow icon={DoorOpen} label="Portas:" value={vehicle.doors} />
        <DataRow icon={CircleCheck} label="Situação:" value={vehicle.status} />
      </div>

      {/* Documentação */}
      <h3 className="mt-4 flex items-center gap-2 text-base font-extrabold text-foreground">
        <FileText className="size-4 text-primary" aria-hidden="true" />
        Documentação
      </h3>
      <div className="mt-2 border-t border-border pt-2">
        <DataRow icon={CircleCheck} label="Condição:" value={vehicle.condition} />
        <DataRow icon={Tag} label="Origem:" value={vehicle.origin} />
        <DataRow icon={FileText} label="IPVA:" value={vehicle.ipva} />
        <DataRow icon={ShieldAlert} label="Sinistro:" value={vehicle.sinistro} />
        <DataRow icon={Hash} label="Placa:" value={vehicle.plate} />
        <DataRow icon={Hash} label="Chassi:" value={vehicle.chassi} />
        <DataRow icon={Hash} label="Renavam:" value={vehicle.renavam} />
        <DataRow icon={Hash} label="Lote:" value={vehicle.lot} />
      </div>

      {/* Financiamento */}
      {vehicle.parcelas && vehicle.valorParcela ? (
        <>
          <h3 className="mt-4 flex items-center gap-2 text-base font-extrabold text-foreground">
            <Wallet className="size-4 text-primary" aria-hidden="true" />
            Financiamento
          </h3>
          <div className="mt-2 border-t border-border pt-2">
            <DataRow
              icon={Wallet}
              label="Total financiado:"
              value={
                vehicle.totalFinanciado
                  ? formatCurrency(vehicle.totalFinanciado)
                  : undefined
              }
            />
            <DataRow
              icon={Wallet}
              label="Parcelas:"
              value={`${vehicle.parcelas}x de ${formatCurrency(vehicle.valorParcela)}`}
            />
          </div>
        </>
      ) : null}
    </article>
  )
}
