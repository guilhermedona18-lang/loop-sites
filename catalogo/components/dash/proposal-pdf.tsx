"use client"

import type { ReactNode } from "react"
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
} from "@react-pdf/renderer"

export type ProposalData = {
  simDate: string
  validadeDias: number
  clientName: string
  clientDoc: string
  vehicleName: string
  lote: string
  placa: string
  valorVeiculo: number
  entrada: number
  juros: number
  documentacao: number
  totalFinanciado: number
  parcelas: number
  valorParcela: number
  phone: string
  site: string
  logoSrc?: string
  qrSrc?: string
}

const RED = "#E11D2A"
const PINK = "#FCE4E8"
const INK = "#0F172A"
const MUTED = "#64748B"
const LINE = "#E5E7EB"
const GREEN = "#16A34A"
const GREEN_BG = "#ECFDF5"
const GREEN_BORDER = "#BBF7D0"
const SOFT = "#FDECEE"
const WHITE = "#FFFFFF"

const brl = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(v || 0)

const sp = (color: string, w = 1.8) => ({
  stroke: color,
  strokeWidth: w,
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
})

/* ---------- Ícones (lucide) ---------- */
function IconCalendar({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={4} width={18} height={18} rx={2} {...sp(color)} />
      <Path d="M3 10h18" {...sp(color)} />
      <Path d="M8 2v4" {...sp(color)} />
      <Path d="M16 2v4" {...sp(color)} />
    </Svg>
  )
}
function IconBadgeCheck({ size = 18, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
        {...sp(color)}
      />
      <Path d="m9 12 2 2 4-4" {...sp(color)} />
    </Svg>
  )
}
function IconUser({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" {...sp(color)} />
      <Circle cx={12} cy={7} r={4} {...sp(color)} />
    </Svg>
  )
}
function IconCar({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
        {...sp(color)}
      />
      <Circle cx={7} cy={17} r={2} {...sp(color)} />
      <Path d="M9 17h6" {...sp(color)} />
      <Circle cx={17} cy={17} r={2} {...sp(color)} />
    </Svg>
  )
}
function IconArrowDown({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} {...sp(color)} />
      <Path d="M8 12l4 4 4-4" {...sp(color)} />
      <Path d="M12 8v8" {...sp(color)} />
    </Svg>
  )
}
function IconPercent({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={19} y1={5} x2={5} y2={19} {...sp(color)} />
      <Circle cx={6.5} cy={6.5} r={2.5} {...sp(color)} />
      <Circle cx={17.5} cy={17.5} r={2.5} {...sp(color)} />
    </Svg>
  )
}
function IconFile({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" {...sp(color)} />
      <Path d="M14 2v6h6" {...sp(color)} />
      <Path d="M16 13H8" {...sp(color)} />
      <Path d="M16 17H8" {...sp(color)} />
      <Path d="M10 9H8" {...sp(color)} />
    </Svg>
  )
}
function IconDollar({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Line x1={12} y1={2} x2={12} y2={22} {...sp(color)} />
      <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" {...sp(color)} />
    </Svg>
  )
}
function IconShield({ size = 18, color = GREEN }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z"
        {...sp(color)}
      />
      <Path d="m9 12 2 2 4-4" {...sp(color)} />
    </Svg>
  )
}
function IconLock({ size = 30, color = GREEN }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Rect x={3} y={11} width={18} height={11} rx={2} {...sp(color)} />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" {...sp(color)} />
    </Svg>
  )
}
function IconGlobe({ size = 13, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={12} cy={12} r={10} {...sp(color)} />
      <Path d="M2 12h20" {...sp(color)} />
      <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" {...sp(color)} />
    </Svg>
  )
}
function IconPhone({ size = 13, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
        {...sp(color)}
      />
    </Svg>
  )
}
function IconHeadset({ size = 16, color = RED }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-6a9 9 0 0 1 18 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" {...sp(color)} />
    </Svg>
  )
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 22,
    paddingBottom: 18,
    paddingHorizontal: 30,
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica",
    backgroundColor: WHITE,
  },
  /* header */
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 64, height: 20, objectFit: "contain" },
  pill: { backgroundColor: RED, borderRadius: 10, paddingVertical: 3, paddingHorizontal: 8 },
  pillText: { color: WHITE, fontSize: 8, fontFamily: "Helvetica-Bold" },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK },
  dateValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK, marginTop: 1 },
  divider: { height: 1.6, backgroundColor: RED, marginTop: 10 },
  /* hero */
  heroRow: { flexDirection: "row", alignItems: "center", marginTop: 16 },
  heroLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  sealCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { fontSize: 22, fontFamily: "Helvetica-Bold", color: INK },
  heroSub: { fontSize: 9.5, color: MUTED, marginTop: 3, lineHeight: 1.4 },
  validBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  validLabel: { fontSize: 9, color: MUTED },
  validDays: { fontSize: 12, fontFamily: "Helvetica-Bold", color: RED, marginTop: 1 },
  /* cards */
  twoCol: { flexDirection: "row", gap: 12, marginTop: 18 },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: MUTED, letterSpacing: 0.5 },
  cardValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK, marginTop: 2 },
  cardSub: { fontSize: 8.5, color: MUTED, marginTop: 2 },
  /* section title */
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 7, marginTop: 18, marginBottom: 8 },
  sectionTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", color: INK },
  /* summary */
  summary: { borderWidth: 1, borderColor: LINE, borderRadius: 10, overflow: "hidden" },
  summaryRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: LINE },
  summaryLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
  },
  summaryRight: {
    width: 200,
    borderLeftWidth: 1,
    borderLeftColor: LINE,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingVertical: 9,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: PINK,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: { fontSize: 10, color: INK },
  summaryValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: INK },
  /* parcelas */
  parcelBox: {
    backgroundColor: SOFT,
    borderWidth: 1,
    borderColor: "#F6D4DA",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  parcelCount: { fontSize: 17, fontFamily: "Helvetica-Bold", color: INK },
  parcelValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: RED, marginTop: 3 },
  /* trust */
  trust: {
    marginTop: 18,
    backgroundColor: GREEN_BG,
    borderWidth: 1,
    borderColor: GREEN_BORDER,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  trustTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: GREEN, marginBottom: 3 },
  trustText: { fontSize: 8.5, color: MUTED, lineHeight: 1.4 },
  /* center note */
  centerNote: { fontSize: 8, color: MUTED, textAlign: "center", marginTop: 14 },
  centerLine: {
    width: 150,
    borderTopWidth: 1,
    borderTopColor: "#94A3B8",
    alignSelf: "center",
    marginTop: 6,
    marginBottom: 5,
  },
  centerName: { fontSize: 9.5, fontFamily: "Helvetica-Bold", color: INK, textAlign: "center" },
  /* footer */
  footerDivider: { height: 1.6, backgroundColor: RED, marginTop: 14 },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  footerLeft: { width: 120, gap: 8 },
  footerContact: { flexDirection: "row", alignItems: "center", gap: 6 },
  footerContactText: { fontSize: 8.5, color: INK },
  footerBadges: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 16 },
  footerBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerBadgeTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK },
  footerBadgeSub: { fontSize: 6.5, color: MUTED, marginTop: 1 },
  qrWrap: { alignItems: "center", width: 72 },
  qr: { width: 54, height: 54 },
  qrCaption: { fontSize: 6, color: MUTED, textAlign: "center", marginTop: 2 },
})

function SummaryRow({
  icon,
  label,
  value,
  last,
  bold,
}: {
  icon: ReactNode
  label: string
  value: string
  last?: boolean
  bold?: boolean
}) {
  return (
    <View style={[styles.summaryRow, last ? { borderBottomWidth: 0 } : {}]}>
      <View style={styles.summaryLeft}>
        <View style={styles.iconCircle}>{icon}</View>
        <Text style={[styles.summaryLabel, bold ? { fontFamily: "Helvetica-Bold" } : {}]}>
          {label}
        </Text>
      </View>
      <View style={styles.summaryRight}>
        <Text style={[styles.summaryValue, bold ? { color: RED, fontSize: 13 } : {}]}>
          {value}
        </Text>
      </View>
    </View>
  )
}

export function ProposalDocument({ data }: { data: ProposalData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            {data.logoSrc ? <Image src={data.logoSrc} style={styles.logo} /> : null}
            <View style={styles.pill}>
              <Text style={styles.pillText}>Leilões</Text>
            </View>
          </View>
          <View style={styles.dateRow}>
            <IconCalendar />
            <View>
              <Text style={styles.dateLabel}>Data da simulação</Text>
              <Text style={styles.dateValue}>{data.simDate}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Hero */}
        <View style={styles.heroRow}>
          <View style={styles.heroLeft}>
            <View style={styles.sealCircle}>
              <IconBadgeCheck size={24} color={RED} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Proposta Pré-Aprovada</Text>
              <Text style={styles.heroSub}>
                Aprovação sujeita à análise financeira.{"\n"}Veículo com procedência e
                entrega garantida.
              </Text>
            </View>
          </View>
          <View style={styles.validBox}>
            <IconBadgeCheck size={24} color={RED} />
            <View>
              <Text style={styles.validLabel}>Proposta</Text>
              <Text style={styles.validLabel}>válida por</Text>
              <Text style={styles.validDays}>{data.validadeDias} dias</Text>
            </View>
          </View>
        </View>

        {/* Cliente + Veículo */}
        <View style={styles.twoCol}>
          <View style={styles.card}>
            <IconUser />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>DADOS DO CLIENTE</Text>
              <Text style={styles.cardValue}>{data.clientName || "—"}</Text>
              <Text style={styles.cardSub}>CPF/CNPJ: {data.clientDoc || "—"}</Text>
            </View>
          </View>
          <View style={styles.card}>
            <IconCar />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>VEÍCULO</Text>
              <Text style={styles.cardValue}>{data.vehicleName}</Text>
              <Text style={styles.cardSub}>
                Lote: {data.lote || "—"} | Placa: {data.placa || "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Resumo */}
        <View style={styles.sectionHead}>
          <IconFile size={18} />
          <Text style={styles.sectionTitle}>Resumo da Simulação</Text>
        </View>
        <View style={styles.summary}>
          <SummaryRow icon={<IconCar size={14} />} label="Valor do Veículo" value={brl(data.valorVeiculo)} />
          <SummaryRow icon={<IconArrowDown size={14} />} label="Entrada" value={brl(data.entrada)} />
          <SummaryRow icon={<IconPercent size={14} />} label="Juros/Tarifas" value={brl(data.juros)} />
          <SummaryRow icon={<IconFile size={14} />} label="Documentação Obrigatória" value={brl(data.documentacao)} />
          <SummaryRow icon={<IconDollar size={14} />} label="Valor total financiado" value={brl(data.totalFinanciado)} last bold />
        </View>

        {/* Parcelas */}
        <View style={styles.sectionHead}>
          <IconCalendar size={18} />
          <Text style={styles.sectionTitle}>Simulação de Parcelas</Text>
        </View>
        <View style={styles.parcelBox}>
          <Text style={styles.parcelCount}>
            {data.parcelas > 0 ? `${data.parcelas}x` : "À vista"}
          </Text>
          <Text style={styles.parcelValue}>
            {brl(data.parcelas > 0 ? data.valorParcela : data.totalFinanciado)}
          </Text>
        </View>

        {/* Segurança */}
        <View style={styles.trust}>
          <IconShield size={20} />
          <View style={{ flex: 1 }}>
            <Text style={styles.trustTitle}>Segurança e Confiança</Text>
            <Text style={styles.trustText}>
              Todas as simulações são realizadas em ambiente seguro.{"\n"}Seus dados estão
              protegidos e não compartilhamos suas informações.
            </Text>
          </View>
          <IconLock size={30} />
        </View>

        {/* Nota central */}
        <Text style={styles.centerNote}>
          Aprovação sujeita à análise financeira. Veículo com procedência e entrega
          garantida.
        </Text>
        <View style={styles.centerLine} />
        <Text style={styles.centerName}>Loop Leilões</Text>

        {/* Footer */}
        <View style={styles.footerDivider} />
        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <View style={styles.footerContact}>
              <IconGlobe />
              <Text style={styles.footerContactText}>{data.site}</Text>
            </View>
            <View style={styles.footerContact}>
              <IconPhone />
              <Text style={styles.footerContactText}>{data.phone}</Text>
            </View>
          </View>
          <View style={styles.footerBadges}>
            <View style={styles.footerBadge}>
              <IconShield size={16} color={RED} />
              <View>
                <Text style={styles.footerBadgeTitle}>Compra Segura</Text>
                <Text style={styles.footerBadgeSub}>Ambiente 100% seguro</Text>
              </View>
            </View>
            <View style={styles.footerBadge}>
              <IconBadgeCheck size={16} color={RED} />
              <View>
                <Text style={styles.footerBadgeTitle}>Veículos Verificados</Text>
                <Text style={styles.footerBadgeSub}>Procedência garantida</Text>
              </View>
            </View>
            <View style={styles.footerBadge}>
              <IconHeadset size={16} color={RED} />
              <View>
                <Text style={styles.footerBadgeTitle}>Suporte Especializado</Text>
                <Text style={styles.footerBadgeSub}>Atendimento dedicado</Text>
              </View>
            </View>
          </View>
          {data.qrSrc ? (
            <View style={styles.qrWrap}>
              <Image src={data.qrSrc} style={styles.qr} />
              <Text style={styles.qrCaption}>Escaneie e acesse{"\n"}nossas ofertas</Text>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}
