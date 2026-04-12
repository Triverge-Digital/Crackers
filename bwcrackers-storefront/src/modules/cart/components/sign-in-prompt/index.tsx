import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-orange-50 flex items-center justify-between p-6 rounded-xl border border-orange-200">
      <div>
        <Heading level="h2" className="text-lg font-bold text-gray-900">
          Already have an account?
        </Heading>
        <Text className="text-gray-600 mt-1 text-sm">
          Sign in for a faster checkout experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white h-10 text-sm font-semibold rounded-full px-6"
            data-testid="sign-in-button"
          >
            Sign In
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
