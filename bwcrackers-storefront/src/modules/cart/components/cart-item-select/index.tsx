"use client"

import { Minus, Plus } from "lucide-react"

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  max?: number
  disabled?: boolean
}

const CartItemSelect = ({
  value,
  onChange,
  max = 10,
  disabled = false,
}: QuantityStepperProps) => {
  return (
    <div className="flex items-center gap-0 border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-brand-gold-400/30 transition-colors">
      <button
        type="button"
        onClick={() => value > 1 && onChange(value - 1)}
        disabled={disabled || value <= 1}
        className="h-10 w-9 flex items-center justify-center text-white/50 hover:text-brand-gold-400 hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const num = parseInt(e.target.value)
          if (!isNaN(num) && num >= 1 && num <= max) {
            onChange(num)
          }
        }}
        disabled={disabled}
        className="h-10 w-10 bg-transparent text-white font-bold text-center text-sm border-x border-white/10 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        data-testid="product-select-button"
      />
      <button
        type="button"
        onClick={() => value < max && onChange(value + 1)}
        disabled={disabled || value >= max}
        className="h-10 w-9 flex items-center justify-center text-white/50 hover:text-brand-gold-400 hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

CartItemSelect.displayName = "CartItemSelect"

export default CartItemSelect
