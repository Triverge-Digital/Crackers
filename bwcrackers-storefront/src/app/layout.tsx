import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Outfit, Playfair_Display } from "next/font/google"
import "styles/globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${outfit.variable} ${playfairDisplay.variable}`}>
      <body className="min-h-screen bg-white text-gray-900">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
