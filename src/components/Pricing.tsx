"use client"

import { Check, Bird } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import type React from "react"
import { useState } from "react"

// Pricing data
const pricingData = {
  monthly: [
    {
      title: "Freelancer",
      price: "5",
      originalPrice: "20",
      features: [
        "1 Freelancer Profile",
        "50 Proposals / Month",
        "Email support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
    {
      title: "Freelancer Pro",
      price: "12.50",
      originalPrice: "50",
      features: [
        "3 Freelancer Profiles",
        "250 Proposals / Month",
        "Chat & email support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
    {
      title: "Freelancer Agency",
      price: "25",
      originalPrice: "100",
      features: [
        "10 Freelancer Profiles",
        "1500 Proposals / Month",
        "One-on-one Support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
  ],
  yearly: [
    {
      title: "Freelancer",
      price: "50",
      originalPrice: "200",
      features: [
        "1 Freelancer Profile",
        "50 Proposals / Month",
        "Email support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
    {
      title: "Freelancer Pro",
      price: "125",
      originalPrice: "500",
      features: [
        "3 Freelancer Profiles",
        "250 Proposals / Month",
        "Chat & email support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
    {
      title: "Freelancer Agency",
      price: "250",
      originalPrice: "1000",
      features: [
        "10 Freelancer Profiles",
        "1500 Proposals / Month",
        "One-on-one Support",
        "Online Community Access",
        "60-day money-back guarantee",
      ],
    },
  ],
}

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")
  const currentPricing = pricingData[billingPeriod]

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Early Bird Banner */}
      <div className="text-center mb-8">
        <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-4 py-2 rounded-full mb-3">
          🎉 Early Bird Special
        </span>
        <p className="text-gray-600">
          Get in early and lock in our best prices.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex flex-col items-end gap-2 mb-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm", billingPeriod === "monthly" ? "text-black font-medium" : "text-gray-500")}>
            Billed monthly
          </span>
          <Switch
            checked={billingPeriod === "yearly"}
            onCheckedChange={(checked) => setBillingPeriod(checked ? "yearly" : "monthly")}
          />
          <span className={cn("text-sm", billingPeriod === "yearly" ? "text-black font-medium" : "text-gray-500")}>
            Billed yearly
          </span>
        </div>
        <span className="text-sm text-blue-600">Get two months free with yearly billing</span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {currentPricing.map((plan, index) => (
          <Card key={plan.title} className={cn("p-6 relative overflow-visible bg-white", index === 1 && "border-2 border-blue-600")}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-20">
                Most popular
              </div>
            )}
            {/* Early Bird Badge */}
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold flex items-center">
              <Bird className="w-4 h-4 mr-1" /> Early Bird
            </div>
            
            <CardContent className="pt-4">
              <h3 className="text-2xl font-bold mb-6">{plan.title}</h3>
              <div className="flex items-baseline mb-8">
                {billingPeriod === "yearly" ? (
                  <>
                    <span className="text-6xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 ml-2 line-through">${plan.originalPrice}</span>
                    <span className="text-gray-400 ml-2">/ yr</span>
                  </>
                ) : (
                  <>
                    <span className="text-6xl font-bold">${plan.price}</span>
                    <span className="text-gray-400 ml-2 line-through">${plan.originalPrice}</span>
                    <span className="text-gray-400 ml-2">/ mo</span>
                  </>
                )}
              </div>
              <p className="text-blue-500 font-semibold mb-4">
                Save ${Number.parseInt(plan.originalPrice) - Number.parseInt(plan.price)} {' '}
                per {billingPeriod === "yearly" ? "year" : "month"}!
              </p>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm tracking-wider uppercase">Features</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <PricingItem key={featureIndex}>{feature}</PricingItem>
                  ))}
                </ul>
              </div>
              <button className="w-full mt-8 py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700">
                Get started
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PricingItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  )
}