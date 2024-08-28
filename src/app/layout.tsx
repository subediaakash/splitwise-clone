import "./globals.css"
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import SessionWrapper from "@/components/SessionWrapper"
import Navbar from "@/components/Navbar"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-[#37393b] font-sans antialiased",
          fontSans.variable
        )}
      >
        <Navbar />
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
