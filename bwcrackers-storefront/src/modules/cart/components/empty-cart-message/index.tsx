import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="py-24 px-6 flex flex-col justify-center items-center text-center min-h-96"
      data-testid="empty-cart-message"
    >
      <div className="h-32 w-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
        <svg
          className="w-16 h-16 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      </div>
      <Heading
        level="h1"
        className="text-3xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-4"
      >
        Your Cart is Empty
      </Heading>
      <Text className="text-gray-600 text-lg mb-8 max-w-md">
        Looks like you haven&apos;t added any items to your cart yet. Start
        shopping to light up your celebrations!
      </Text>
      <div>
        <InteractiveLink href="/store">
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-colors inline-block">
            Continue Shopping
          </span>
        </InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
