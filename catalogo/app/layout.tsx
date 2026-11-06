import type { Metadata, Viewport } from 'next'
import './globals.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://kaua-contratos-painel.kauahenriquemariaalv.chatgpt.site'),
  title: 'Loop Leilões — Compre seu carro com segurança',
  description:
    'Leilões de veículos com base DETRAN, suporte humano e pagamento seguro. Encontre carros, motos e pesados com a Loop.',
  
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://kaua-contratos-painel.kauahenriquemariaalv.chatgpt.site',
    siteName: 'Loop Leilões',
    title: 'Loop Leilões — Veículos abaixo do valor da FIPE',
    description:
      'Leilões de veículos com base DETRAN, suporte humano e pagamento seguro. Encontre carros, motos e pesados com a Loop.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 1200,
        alt: 'Loop Leilões — Promoção: veículos abaixo do valor da FIPE',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loop Leilões — Veículos abaixo do valor da FIPE',
    description:
      'Leilões de veículos com base DETRAN, suporte humano e pagamento seguro. Encontre carros, motos e pesados com a Loop.',
    images: ['/og-image.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#e5093e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`light  bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
