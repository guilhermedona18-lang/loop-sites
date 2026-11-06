'use client'

import { useState } from 'react'
import { SearchX, LogOut, ChevronLeft, ShieldCheck } from 'lucide-react'
import { AppHero } from '@/components/app-hero'
import { SearchForm } from '@/components/search-form'
import { VehicleSuccess } from '@/components/vehicle-success'
import { VehicleDetails } from '@/components/vehicle-details'
import { PaymentCta } from '@/components/payment-cta'
import { PaymentScreen } from '@/components/payment-screen'
import { HelpCard } from '@/components/help-card'
import { LiveTrackingSection } from '@/components/live-tracking-section'
import { DeliveryLocation } from '@/components/delivery-location'
import { WhyBuySection } from '@/components/why-buy-section'
import { SiteFooter } from '@/components/site-footer'
import {
  lookupCustomerData,
  isValidCpf,
  type LookupResult,
  type Vehicle,
} from '@/lib/vehicles'

type Status = 'idle' | 'loading' | 'success' | 'empty'

export default function Page() {
  const [access, setAccess] = useState<{query:string;code:string}|null>(null)
  const [downloading,setDownloading]=useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [detailsVehicle, setDetailsVehicle] = useState<Vehicle | null>(null)
  const [payingVehicle, setPayingVehicle] = useState<Vehicle | null>(null)

  async function handleSearch(query: string, code: string) {
    setError(null)

    if (!isValidCpf(query)) {
      setError('Informe um CPF válido (11 dígitos).')
      return
    }

    if(!/^[a-f0-9]{32}$/i.test(code.replaceAll('-','').trim())){setError('Informe o código de acesso recebido com seu contrato.');return;}
    setStatus('loading')
    setResult(null)

    try {
      const [data] = await Promise.all([
        lookupCustomerData(query,code),
        // Garante que a tela de carregamento seguro fique visível por um instante
        new Promise((resolve) => setTimeout(resolve, 1400)),
      ])
      if (!data || data.vehicles.length === 0) {
        setResult(null)
        setStatus('empty')
        return
      }
      setAccess({query,code})
      setResult(data)
      setStatus('success')
    } catch (cause) {
      setStatus('idle')
      setError(cause instanceof Error ? cause.message : 'Não foi possível buscar seus dados. Tente novamente.')
    }
  }

  async function downloadContract(){if(!access)return;setDownloading(true);try{const res=await fetch('/api/contract',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(access)});if(!res.ok)throw new Error();const url=URL.createObjectURL(await res.blob());const a=document.createElement('a');a.href=url;a.download='contrato.pdf';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch{setError('Não foi possível baixar o contrato. Tente novamente.');}finally{setDownloading(false);}}
  function handleExit() {
    setAccess(null)
    setResult(null)
    setStatus('idle')
    setError(null)
    setDetailsVehicle(null)
    setPayingVehicle(null)
  }

  // Tela de carregamento (buscando os dados com segurança)
  if (status === 'loading') {
    return <LoadingScreen />
  }

  // Tela de pagamento seguro
  if (status === 'success' && result && payingVehicle) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <button
            type="button"
            onClick={() => setPayingVehicle(null)}
            className="flex items-center gap-1 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            Voltar
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </header>

        <main className="flex-1 px-4 py-4">
          <PaymentScreen vehicleTitle={payingVehicle.fullTitle || payingVehicle.brandModel} />
        </main>
      </div>
    )
  }

  // Tela de detalhes (Confiança e transparência)
  if (status === 'success' && result && detailsVehicle) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <button
            type="button"
            onClick={() => setDetailsVehicle(null)}
            className="flex items-center gap-1 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            Voltar
          </button>
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </header>

        <main className="flex-1 pb-4">
          <div className="space-y-4 px-4 py-4">
            <PaymentCta onClick={() => setPayingVehicle(detailsVehicle)} />
            <VehicleDetails
              customerName={result.customerName}
              document={result.document}
              vehicle={detailsVehicle}
            />
          </div>

          <WhyBuySection />

          <SiteFooter />
        </main>
      </div>
    )
  }

  // Tela de resultado (após consultar o CPF)
  if (status === 'success' && result) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <img
              src="/images/loop-logo.png"
              alt="Loop"
              className="h-7 w-auto"
            />
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              Leilões
            </span>
          </div>
          <button
            type="button"
            onClick={handleExit}
            className="flex items-center gap-1.5 text-sm font-bold text-primary transition-opacity hover:opacity-80"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </header>

        <main className="flex-1 pb-4">
          <div className="space-y-4 px-4 py-4">
            <section className="rounded-2xl border border-border bg-card p-5"><h1 className="text-lg font-bold">Seu contrato</h1><p className="mt-1 text-sm text-muted-foreground">Olá, {result.customerName}. Baixe o PDF salvo no momento da emissão.</p><button onClick={downloadContract} disabled={downloading} className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground disabled:opacity-60">{downloading?'Baixando...':'Baixar contrato PDF'}</button>{error&&<p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}</section>
            {result.tracking?.active && result.vehicles[0] && (
              <LiveTrackingSection
                tracking={result.tracking}
                vehicle={result.vehicles[0]}
              />
            )}

            {result.extra && <DeliveryLocation extra={result.extra} />}

            {result.vehicles.map((vehicle) => (
              <div key={vehicle.id} className="space-y-3">

                <VehicleSuccess
                  customerName={result.customerName}
                  document={result.document}
                  rg={result.extra?.rg}
                  vehicle={vehicle}
                  onShowDetails={() => setDetailsVehicle(vehicle)}
                />
              </div>
            ))}

            <HelpCard />
          </div>

          <WhyBuySection />

          <SiteFooter />
        </main>
      </div>
    )
  }

  // Tela inicial: hero + busca
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      <AppHero />

      <main className="flex-1">
        <div className="-mt-4">
          <SearchForm
            onSearch={handleSearch}
            loading={false}
            error={error}
          />
        </div>

        {status === 'empty' && (
          <section className="mt-6 px-5">
            <EmptyState />
          </section>
        )}

        <div className="mt-6 px-5 pb-8">
          <HelpCard />
        </div>
      </main>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center bg-background px-8 text-center">
      <div className="relative flex items-center justify-center">
        <span className="absolute size-32 animate-ping rounded-full bg-primary/10" />
        <span className="absolute size-24 animate-pulse rounded-full bg-primary/5" />
        <img
          src="/images/loop-logo.png"
          alt="Loop Leilões"
          className="relative z-10 h-20 w-auto animate-pulse"
        />
      </div>

      <div
        className="mt-10 size-8 animate-spin rounded-full border-[3px] border-muted border-t-primary"
        role="status"
        aria-label="Carregando"
      />

      <h1 className="mt-8 text-lg font-bold text-balance text-foreground">
        Carregando seus dados com segurança
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground">
        Estamos consultando as informações do seu veículo. Isso leva apenas
        alguns segundos.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
        <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
        <span className="text-xs font-bold text-foreground">
          Conexão protegida
        </span>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-accent">
        <SearchX className="size-7 text-primary" aria-hidden="true" />
      </div>
      <p className="mt-4 text-sm font-bold text-foreground">
        Nenhum veículo encontrado
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Não localizamos veículos para esse CPF. Verifique o número informado no
        momento do leilão e tente novamente.
      </p>
    </div>
  )
}
