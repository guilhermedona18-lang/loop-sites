"use client"

import { useMemo, useState, useRef } from "react"
import { FileDown, Loader2, Calculator } from "lucide-react"
import QRCode from "qrcode"
import { type ProposalData } from "./proposal-pdf"
import { formatBRL } from "@/lib/format"
import { notifySimulation } from "@/lib/actions/integrations"

import { isValidCPF, formatCPF } from "@/lib/cpf"

const SITE = "loopleiloes.com.br"
const PHONE = "(11) 3950-5000"
const VALIDADE_DIAS = 2
const PARCELAS_OPCOES = [12, 24, 36, 48, 60, 72]

type VehicleOption = {
  id: string
  name: string
  price: number
  image?: string
}

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(v || 0)

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function FinancingSimulator({ vehicles }: { vehicles: VehicleOption[] }) {
  const [clientName, setClientName] = useState("")
  const [clientDoc, setClientDoc] = useState("")
  const [vehicleId, setVehicleId] = useState(vehicles[0]?.id ?? "")
  const [lote, setLote] = useState("")
  const [placa, setPlaca] = useState("")
  const [entrada, setEntrada] = useState(0)
  const [juros, setJuros] = useState(0)
  const [documentacao, setDocumentacao] = useState(2350)
  const [parcelas, setParcelas] = useState(24)
  const [generating, setGenerating] = useState(false)
  const requestRef = useRef<{id:string;code:string;fingerprint:string}|null>(null)
  const [contractAccess, setContractAccess] = useState<string|null>(null)
  const [sendStatus, setSendStatus] = useState<{ ok: boolean; message: string } | null>(null)

  const vehicle = useMemo(
    () => vehicles.find((v) => v.id === vehicleId),
    [vehicles, vehicleId],
  )

  const valorVeiculo = vehicle?.price ?? 0
  const totalFinanciado = Math.max(0, valorVeiculo - entrada + juros + documentacao)
  const valorParcela = parcelas > 0 ? totalFinanciado / parcelas : 0

  function onSelectVehicle(id: string) {
    setVehicleId(id)
    if (!lote) {
      const rand = Math.floor(10000 + Math.random() * 89999)
      setLote(`LT-${new Date().getFullYear()}-${rand}`)
    }
  }

  async function handleGenerate() {
    if (!vehicle) return
    setGenerating(true)
    try {
      const [{pdf},{ProposalDocument}]=await Promise.all([import("@react-pdf/renderer"),import("./proposal-pdf")]);
      const qrSrc = await QRCode.toDataURL(`https://${SITE}`, {
        margin: 1,
        width: 220,
      })
      const simDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date())

      const data: ProposalData = {
        simDate,
        validadeDias: VALIDADE_DIAS,
        clientName,
        clientDoc,
        vehicleName: vehicle.name,
        lote,
        placa,
        valorVeiculo,
        entrada,
        juros,
        documentacao,
        totalFinanciado,
        parcelas,
        valorParcela,
        phone: PHONE,
        site: SITE,
        logoSrc: `${window.location.origin}/loop-logo.png`,
        qrSrc,
      }

      const blob = await pdf(<ProposalDocument data={data} />).toBlob()
      // Garante persistência do arremate antes de oferecer a proposta.
      // O PDF é enviado ao armazenamento antes de ser oferecido para download.
      if (!isValidCPF(clientDoc)) {
        setSendStatus({ ok: false, message: "CPF inválido: a proposta não foi registrada." })
        return
      }
      try {
        const fingerprint=JSON.stringify([clientDoc,clientName,vehicle.id,lote,placa,valorVeiculo,entrada,totalFinanciado,parcelas,valorParcela]);
        if(!requestRef.current||requestRef.current.fingerprint!==fingerprint) requestRef.current={id:crypto.randomUUID(),code:crypto.randomUUID().replaceAll('-',''),fingerprint};
        const form=new FormData();
        form.set('pdf',blob,'contrato.pdf');form.set('data',JSON.stringify({
          cpf: clientDoc,
          clientName,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          vehicleImage: vehicle.image ?? "",
          lote,
          placa,
          price: valorVeiculo,
          entrada,
          totalFinanciado,
          parcelas,
          valorParcela,
        }));
        form.set('requestId',requestRef.current.id);form.set('code',requestRef.current.code);
        const response=await fetch('/api/contracts',{method:'POST',body:form});
        const saved=await response.json() as {ok?:boolean;code:string;error?:string};
        if(response.ok && saved.ok){setContractAccess(saved.code);requestRef.current=null;}

        if (!saved.ok) {
          setSendStatus({ ok: false, message: saved.error || "Falha ao salvar o contrato." })
          return
        }
      } catch {
        setSendStatus({ ok: false, message: "Não foi possível salvar o arremate. Verifique a conexão com o banco." })
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const nameSlug = slugify(clientName || "cliente")
      a.download = `proposta-loop-${nameSlug}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)

      setSendStatus({ok:true,message:'Contrato salvo. Envie o código de acesso abaixo ao cliente.'});
    } finally {
      setGenerating(false)
    }
  }

  const inputCls =
    "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
  const labelCls = "text-xs font-semibold text-muted-foreground"

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Formulário */}
      <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-heading text-base font-bold text-foreground">
          Dados da simulação
        </h2>

        {/* Cliente */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nome do cliente</label>
            <input
              className={inputCls}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: João da Silva"
            />
          </div>
          <div>
            <label className={labelCls}>CPF do cliente</label>
            <input
              className={inputCls}
              value={clientDoc}
              onChange={(e) => setClientDoc(formatCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
            />
            {clientDoc.trim() !== "" && !isValidCPF(clientDoc) ? (
              <p className="mt-1 text-xs font-medium text-amber-600">
                CPF incompleto ou inválido — a consulta por CPF só será liberada com um CPF válido.
              </p>
            ) : clientDoc.trim() !== "" ? (
              <p className="mt-1 text-xs font-medium text-emerald-600">
                CPF válido — o veículo ficará disponível na consulta por CPF após gerar o PDF.
              </p>
            ) : null}
          </div>
        </div>

        {/* Veículo */}
        <div className="mt-4">
          <label className={labelCls}>Veículo</label>
          <select
            className={inputCls}
            value={vehicleId}
            onChange={(e) => onSelectVehicle(e.target.value)}
          >
            {vehicles.length === 0 && <option value="">Nenhum veículo cadastrado</option>}
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} — {formatBRL(v.price)}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Lote</label>
            <input
              className={inputCls}
              value={lote}
              onChange={(e) => setLote(e.target.value)}
              placeholder="LT-2026-00000"
            />
          </div>
          <div>
            <label className={labelCls}>Placa</label>
            <input
              className={inputCls}
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              placeholder="XXX-****"
            />
          </div>
        </div>

        {/* Valores */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>Entrada (R$)</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={entrada || ""}
              onChange={(e) => setEntrada(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelCls}>Juros / Tarifas (R$)</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={juros || ""}
              onChange={(e) => setJuros(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div>
            <label className={labelCls}>Documentação (R$)</label>
            <input
              type="number"
              min={0}
              className={inputCls}
              value={documentacao || ""}
              onChange={(e) => setDocumentacao(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Número de parcelas</label>
          <select
            className={inputCls}
            value={parcelas}
            onChange={(e) => setParcelas(Number(e.target.value))}
          >
            <option value={0}>À vista</option>
            {PARCELAS_OPCOES.map((p) => (
              <option key={p} value={p}>
                {p}x
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumo + ação */}
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Calculator className="size-5 text-primary" />
            <h2 className="font-heading text-base font-bold text-foreground">
              Resumo
            </h2>
          </div>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Valor do veículo</dt>
              <dd className="font-semibold text-foreground">{brl(valorVeiculo)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Entrada</dt>
              <dd className="font-semibold text-foreground">- {brl(entrada)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Juros / Tarifas</dt>
              <dd className="font-semibold text-foreground">{brl(juros)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Documentação</dt>
              <dd className="font-semibold text-foreground">{brl(documentacao)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5">
              <dt className="font-bold text-foreground">Total financiado</dt>
              <dd className="font-bold text-foreground">{brl(totalFinanciado)}</dd>
            </div>
          </dl>

          <div className="mt-4 rounded-xl bg-primary p-4 text-primary-foreground">
            <p className="text-xs uppercase tracking-wide opacity-80">
              {parcelas > 0 ? `${parcelas}x de` : "Pagamento à vista"}
            </p>
            <p className="font-heading text-2xl font-extrabold">
              {brl(parcelas > 0 ? valorParcela : totalFinanciado)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={!vehicle || generating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3.5 font-heading text-sm font-extrabold text-background transition active:scale-95 disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <FileDown className="size-5" />
          )}
          {generating ? "Gerando PDF..." : "Gerar e baixar PDF"}
        </button>
        <p className="text-center text-xs text-muted-foreground">
          O PDF é gerado no seu navegador e baixado na hora. Nada fica salvo no sistema.
        </p>

        {contractAccess && <div className="mt-4 rounded-xl border border-green-300 bg-green-50 p-4 text-slate-900"><p className="font-bold">Contrato salvo</p><p className="mt-2 text-sm">Código de acesso do cliente:</p><code className="block break-all select-all text-base">{contractAccess}</code><p className="mt-2 text-sm">Consulta: {process.env.NEXT_PUBLIC_CONSULTA_URL || "https://kaua-contratos-consulta.kauahenriquemariaalv.chatgpt.site"}</p></div>}
        {sendStatus && (
          <div
            className={`rounded-xl border px-3 py-2.5 text-center text-xs font-medium ${
              sendStatus.ok
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {sendStatus.message}
          </div>
        )}
      </div>
    </div>
  )
}
