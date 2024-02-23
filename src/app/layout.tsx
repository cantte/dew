import "~/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { type Metadata } from "next";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { type ReactNode } from "react";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/toaster";

import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
  fallback: ["sans-serif"],
});

export const metadata: Metadata = {
  title: "dew",
  description: "Sofware de gestión de ventas y facturación.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: [
    "facturación",
    "ventas",
    "software",
    "productos",
    "clientes",
    "inventario",
    "compras",
  ],
  authors: [
    {
      name: "cantte",
      url: "https://www.cantte.com/",
    },
  ],
  creator: "cantte",
  openGraph: {
    type: "website",
    locale: "es_ES",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.variable} bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
          </TRPCReactProvider>
        </ThemeProvider>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
