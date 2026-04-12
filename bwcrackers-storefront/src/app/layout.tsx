import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="min-h-screen bg-gradient-to-br from-brand-purple-900 via-brand-pink-500 to-brand-orange-500 text-white">
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
