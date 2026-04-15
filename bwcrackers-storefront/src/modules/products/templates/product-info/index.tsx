import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Sparkles, CheckCircle2 } from "lucide-react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="space-y-10">
      <div className="flex flex-col gap-y-10">
        {product.collection && (
          <div className="flex items-center gap-4">
             <div className="h-0.5 w-10 bg-brand-maroon/20"></div>
             <LocalizedClientLink
              href={`/collections/${product.collection.handle}`}
              className="text-[10px] font-black text-brand-maroon hover:text-brand-carbon transition uppercase tracking-[0.4em]"
            >
              {product.collection.title}
            </LocalizedClientLink>
          </div>
        )}
        
        <div className="space-y-6">
          <Heading
            level="h1"
            className="text-6xl font-black leading-[0.9] text-brand-carbon tracking-tightest uppercase"
            data-testid="product-title"
          >
            {product.title}
          </Heading>
          
          <div className="flex items-center gap-3 text-brand-maroon">
            <Sparkles className="h-4 w-4 fill-current animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Premium Quality Assured</span>
          </div>
        </div>

        {product.description && (
          <div className="bento-card p-10 bg-brand-cloud border border-surface-border">
            <Text
              className="text-base text-text-secondary whitespace-pre-line leading-relaxed font-bold"
              data-testid="product-description"
            >
              {product.description}
            </Text>
            
            <div className="mt-8 pt-8 border-t border-surface-border grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-brand-maroon" />
                    <span className="text-[10px] font-black text-brand-carbon uppercase tracking-widest leading-none">Safe Grade</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-brand-maroon" />
                    <span className="text-[10px] font-black text-brand-carbon uppercase tracking-widest leading-none">Fresh Stock</span>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductInfo
