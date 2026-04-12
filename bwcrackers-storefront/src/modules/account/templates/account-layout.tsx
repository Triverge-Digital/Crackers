import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 small:py-12" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 small:grid-cols-[280px_1fr] gap-8 py-8">
          {/* Sidebar Navigation */}
          <div className="card-gradient p-6 rounded-xl text-white h-fit border border-[rgba(255,255,255,0.1)]">
            {customer && <AccountNav customer={customer} />}
          </div>

          {/* Main Content */}
          <div className="card-gradient p-8 rounded-xl text-white border border-[rgba(255,255,255,0.1)] min-h-screen">
            {children}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-[rgba(255,255,255,0.1)] py-12 gap-8 mt-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Got questions?</h3>
            <span className="text-sm text-white/80">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
