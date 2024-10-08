import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import '~/styles/globals.css'

import { GeistSans } from 'geist/font/sans'

import type { ReactNode } from 'react'
import { ThemeProvider } from '~/components/theme-provider'
import { Toaster } from '~/components/ui/toaster'

import { TRPCReactProvider } from '~/trpc/react'
import { CSPostHogProvider } from './(analytics)/providers'

export const metadata: Metadata = {
  title: 'dew',
  description: 'Sofware de gestión de ventas y facturación.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
  keywords: [
    'facturación',
    'ventas',
    'software',
    'productos',
    'clientes',
    'inventario',
    'compras',
  ],
  authors: [
    {
      name: 'cantte',
      url: 'https://www.cantte.com/',
    },
  ],
  creator: 'cantte',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
  },
}

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <CSPostHogProvider>
      <html lang="es">
        <body className={`font-sans ${GeistSans.variable} bg-background`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
          <Toaster />
        </body>
      </html>
    </CSPostHogProvider>
  )
}
