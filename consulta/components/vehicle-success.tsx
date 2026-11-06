'use client'

import { useState } from 'react'
import {
  ShieldCheck,
  User,
  Gavel,
  Calendar,
  CircleCheck,
  Lock,
  Camera,
  Car,
  ChevronRight,
  Star,
  Palette,
  Gauge,
  Fuel,
  Cog,
  Hash,
  Tag,
  Settings2,
  DoorOpen,
  FileText,
  ShieldAlert,
  Wallet,
  MessageCircle,
  IdCard,
} from 'lucide-react'
import { type Vehicle, formatCurrency, formatCpf } from '@/lib/vehicles'
import { PaymentScreen } from '@/components/payment-screen'

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
    value === null || value === undefined || value === '' ? null : String(value)
  if (!text) return null
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{text}</span>
    </div>
  )
}

const REVIEWS: {name:string;text:string}[] = []

function firstName(full: string) {
  const name = full.trim().split(/\s+/)[0]
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'cliente'
}

export function VehicleSuccess({
  customerName,
  document,
  rg,
  vehicle,
  onShowDetails,
}: {
  customerName: string
  document?: string
  rg?: string
  vehicle: Vehicle
  onShowDetails: () => void
}) {
  const [selected, setSelected] = useState(0)
  const gallery = vehicle.images?.length ? vehicle.images : [vehicle.imageUrl]

  return (
      /* Card único: status + detalhes + fotos */
      <article className="overflow-hidden rounded-2xl border border-border bg-card p-3.5 text-card-foreground shadow-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-primary">
          <Star className="size-2.5" aria-hidden="true" />
          PREMIUM
        </span>

        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-extrabold leading-tight text-foreground">
              Parabéns, {firstName(customerName)}!
            </h2>
            <p className="text-balance text-base font-extrabold leading-tight text-primary">
              Veículo arrematado com sucesso!
            </p>
          </div>
        </div>

        <p className="mt-2 text-xs leading-snug text-muted-foreground">
          Este veículo foi arrematado por você em nosso leilão. Todas as
          informações foram verificadas e conferidas pela nossa equipe para
          garantir segurança e transparência em todo o processo.
        </p>

        {/* Bloco de status */}
        <div className="mt-2.5 rounded-2xl bg-secondary/60 p-1.5">
          {/* Cliente */}
          <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <User className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Cliente</p>
              <p className="truncate text-sm font-bold text-foreground">
                {customerName}
              </p>
              {rg ? (
                <p className="text-[11px] text-muted-foreground">
                  RG: {rg}
                </p>
              ) : null}
              {document ? (
                <p className="text-[11px] text-muted-foreground">
                  CPF: {formatCpf(document)}
                </p>
              ) : null}
            </div>
          </div>

          {/* Status do veículo */}
          <div className="flex items-center gap-2.5 border-t border-border/60 px-2.5 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <Gavel className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Status do Veículo</p>
              <p className="text-sm font-bold text-foreground">Arrematado</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
              <CircleCheck className="size-3" aria-hidden="true" />
              Confirmado
            </span>
          </div>

          {/* Verificação */}
          <div className="flex items-center gap-2.5 border-t border-border/60 px-2.5 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Verificação</p>
              <p className="text-sm font-bold text-success">100% concluída</p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Veículo verificado e aprovado pela nossa equipe.
              </p>
            </div>
          </div>

          {/* Próximo passo */}
          <div className="flex items-start gap-2.5 border-t border-border/60 px-2.5 py-1.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <Calendar className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">Próximo passo</p>
              <p className="text-sm font-bold text-foreground">
                Pagamento pendente
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Falta apenas a regularização do pagamento para que possamos
                iniciar a liberação e entrega do veículo.
              </p>
            </div>
            <button
              type="button"
              onClick={onShowDetails}
              className="animate-pulse-red flex shrink-0 items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground transition-colors hover:animate-none hover:bg-primary/90"
            >
              Ver detalhes
              <ChevronRight className="size-3" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Vendedor responsável */}
        <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-border bg-secondary/50 px-2.5 py-2">
          <img
            src="/images/vendedor-thiago.png"
            alt="Foto do vendedor Thiago Portes Haus"
            className="size-8 shrink-0 rounded-full object-cover"
          />
          <div className="min-w-0">
            <p className="text-[10px] leading-none text-muted-foreground">
              Vendedor responsável
            </p>
            <p className="truncate text-xs font-bold text-foreground">
              Thiago Portes Haus
            </p>
            <p className="text-[10px] leading-none text-muted-foreground">
              CPF: {formatCpf('05911891948')}
            </p>
          </div>
        </div>

        {/* Box "Veículo praticamente seu" */}
        <div className="relative mt-2.5 overflow-hidden rounded-2xl bg-accent px-2.5 py-2">
          <div className="flex items-start gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Lock className="size-4" aria-hidden="true" />
            </span>
            <div className="relative z-10">
              <p className="text-sm font-bold text-primary">
                Veículo praticamente seu!
              </p>
              <p className="text-[11px] leading-snug text-muted-foreground">
                Após a confirmação do pagamento, faremos a liberação e entrega
                do veículo.
              </p>
            </div>
          </div>
          <Car
            className="pointer-events-none absolute -right-2 bottom-0 size-12 text-primary/10"
            aria-hidden="true"
          />
        </div>

        {/* Fotos do veículo */}
        <h3 className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
            <Camera className="size-4" aria-hidden="true" />
          </span>
          Fotos do Veículo
        </h3>

        <div className="mt-2.5 overflow-hidden rounded-xl border border-border">
          <img
            src={gallery[selected] || '/placeholder.svg'}
            alt={`Foto ${selected + 1} do veículo ${vehicle.fullTitle}`}
            className="h-40 w-full object-cover"
          />
        </div>

        {gallery.length > 1 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                type="button"
                onClick={() => setSelected(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === selected}
                className={`overflow-hidden rounded-lg border-2 transition-colors ${
                  i === selected ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img
                  src={src || '/placeholder.svg'}
                  alt={`Miniatura ${i + 1}`}
                  className="h-12 w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Dados do cliente */}
        <h3 className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
            <User className="size-4" aria-hidden="true" />
          </span>
          Dados do cliente
        </h3>
        <div className="mt-2 border-t border-border pt-2">
          <DataRow icon={User} label="Nome:" value={customerName} />
          <DataRow icon={IdCard} label="RG:" value={rg} />
          <DataRow
            icon={Hash}
            label="CPF:"
            value={document ? formatCpf(document) : undefined}
          />
        </div>

        {/* Informações do veículo (completas) */}
        <h3 className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
            <Car className="size-4" aria-hidden="true" />
          </span>
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
        <h3 className="mt-4 flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
            <FileText className="size-4" aria-hidden="true" />
          </span>
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
            <h3 className="mt-4 flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
                <Wallet className="size-4" aria-hidden="true" />
              </span>
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

        {/* Pagamento seguro */}
        <div className="mt-4">
          <PaymentScreen vehicleTitle={vehicle.fullTitle || vehicle.brandModel} />
        </div>

        {/* Avaliações de clientes */}
        <h3 className="mt-4 flex items-center gap-2 border-t border-border pt-3 text-sm font-bold text-foreground">
          <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-primary">
            <MessageCircle className="size-4" aria-hidden="true" />
          </span>
          O que dizem nossos clientes
        </h3>
        <div className="mt-2.5 space-y-2">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl bg-secondary/60 p-3">
              <div className="flex items-center gap-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{r.name}</p>
                  <div className="flex gap-0.5" aria-label="5 de 5 estrelas">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-2.5 fill-primary text-primary"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
                <CircleCheck className="size-3.5 shrink-0 text-success" aria-hidden="true" />
              </div>
              <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      </article>
  )
}
