import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "Rádio Habblive",
  description: "Player oficial da Rádio Habblive - Estamos com você 24/7",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/radio-logo-transparent.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/radio-logo-transparent.png" type="image/png" />
        <link rel="apple-touch-icon" href="/radio-logo-transparent.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}