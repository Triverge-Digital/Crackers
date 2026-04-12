"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-base py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex flex-col gap-y-6">
          {product.material && (
            <div className="border-b border-gray-200 pb-4">
              <span className="font-bold text-orange-600 text-sm uppercase tracking-wider">
                Material
              </span>
              <p className="text-gray-600 mt-2">{product.material}</p>
            </div>
          )}
          {product.origin_country && (
            <div className="border-b border-gray-200 pb-4">
              <span className="font-bold text-orange-600 text-sm uppercase tracking-wider">
                Country of Origin
              </span>
              <p className="text-gray-600 mt-2">{product.origin_country}</p>
            </div>
          )}
          {product.type && (
            <div className="border-b border-gray-200 pb-4">
              <span className="font-bold text-orange-600 text-sm uppercase tracking-wider">
                Type
              </span>
              <p className="text-gray-600 mt-2">{product.type.value}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-6">
          {product.weight && (
            <div className="border-b border-gray-200 pb-4">
              <span className="font-bold text-orange-600 text-sm uppercase tracking-wider">
                Weight
              </span>
              <p className="text-gray-600 mt-2">{product.weight} g</p>
            </div>
          )}
          {product.length && product.width && product.height && (
            <div className="border-b border-gray-200 pb-4">
              <span className="font-bold text-orange-600 text-sm uppercase tracking-wider">
                Dimensions
              </span>
              <p className="text-gray-600 mt-2">
                {product.length}L x {product.width}W x {product.height}H
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-base py-8 space-y-8">
      <div className="flex items-start gap-x-4 pb-6 border-b border-gray-200">
        <div className="flex-shrink-0">
          <FastDelivery />
        </div>
        <div>
          <span className="font-bold text-orange-600 block mb-2">
            Fast Delivery
          </span>
          <p className="text-gray-600 leading-relaxed">
            Your package will arrive in 3-5 business days at your pick up
            location or in the comfort of your home.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-4 pb-6 border-b border-gray-200">
        <div className="flex-shrink-0">
          <Refresh />
        </div>
        <div>
          <span className="font-bold text-orange-600 block mb-2">
            Simple Exchanges
          </span>
          <p className="text-gray-600 leading-relaxed">
            Is the fit not quite right? No worries - we&apos;ll exchange your
            product for a new one.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-4">
        <div className="flex-shrink-0">
          <Back />
        </div>
        <div>
          <span className="font-bold text-orange-600 block mb-2">
            Easy Returns
          </span>
          <p className="text-gray-600 leading-relaxed">
            Just return your product and we&apos;ll refund your money. No
            questions asked - we&apos;ll do our best to make sure your return is
            hassle-free.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
