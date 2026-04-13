import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Sparkles } from "lucide-react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="space-y-6">
      <div className="flex flex-col gap-y-6">
        {product.collection && (
          <div className="flex items-center gap-3">
             <div className="h-px w-8 bg-brand-gold-400"></div>
             <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-xs font-black text-brand-gold-400 hover:text-white transition uppercase tracking-[0.3em]"
            >
              {product.collection.title}
            </LocalizedClientLink>
          </div>
        )}
        
        <div className="space-y-4">
          <Heading
            level="h1"
            className="text-5xl font-black leading-tight text-white tracking-tighter font-serif"
            data-testid="product-title"
          >
            {product.title}
          </Heading>
          
          <div className="flex items-center gap-2 text-brand-gold-400">
            <Sparkles className="h-4 w-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium Quality Assured</span>
          </div>
        </div>

        {product.description && (
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm">
            <Text
              className="text-sm text-white/50 whitespace-pre-line leading-relaxed font-light"
              data-testid="product-description"
            >
              {product.description}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
