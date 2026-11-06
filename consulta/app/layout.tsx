import type { Metadata, Viewport } from 'next'
import './globals.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://kaua-contratos-consulta.kauahenriquemariaalv.chatgpt.site'),
  title: 'Loop Leilões — Consulta de veículo arrematado',
  description:
    'Consulte os detalhes do veículo que você arrematou na Loop Leilões informando seu CPF ou e-mail.',
  
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://kaua-contratos-consulta.kauahenriquemariaalv.chatgpt.site',
    siteName: 'Loop Leilões',
    title: 'Loop Leilões — Consulte seu veículo',
    description:
      'Informações completas para você fazer o melhor negócio. Consulte dados, histórico e mais. É rápido, fácil e gratuito!',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 1200,
        type: 'image/jpeg',
        alt: 'Loop Leilões — Consulte seu veículo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loop Leilões — Consulte seu veículo',
    description:
      'Informações completas para você fazer o melhor negócio. Consulte dados, histórico e mais. É rápido, fácil e gratuito!',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={` bg-background`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
