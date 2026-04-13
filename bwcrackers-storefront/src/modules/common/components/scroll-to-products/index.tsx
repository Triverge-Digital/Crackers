"use client"

export function ScrollToProductsButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={() => {
        const el = document.getElementById("featured-products")
        el?.scrollIntoView({ behavior: "smooth" })
      }}
      className={className}
    >
      {children}
    </button>
  )
}

export function ScrollToProductsDiv({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      onClick={() => {
        const el = document.getElementById("featured-products")
        el?.scrollIntoView({ behavior: "smooth" })
      }}
      className={className}
    >
      {children}
    </div>
  )
}
