import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import WarmupBackend from "@lib/warmup"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body className="min-h-screen bg-white text-gray-900">
        <WarmupBackend />
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
