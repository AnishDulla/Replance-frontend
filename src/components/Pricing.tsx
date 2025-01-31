"use client"

import { Check } from "lucide-react"
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
      price: "30",
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
      price: "42",
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
      price: "100",
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
      price: "300",
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
      price: "420",
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
      price: "1000",
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
    <div className="container mx-auto px-4 py-12">
      {/* New Billing Toggle */}
      <div className="flex justify-end items-center gap-8 mb-16 max-w-7xl mx-auto">
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
        <span className="text-sm text-blue-600">Save up to 30% with yearly billing</span>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {currentPricing.map((plan, index) => (
          <Card className={cn("p-6 relative", index === 1 && "border-2 border-blue-600")} key={plan.title}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Most popular
              </div>
            )}
            <CardContent className="pt-4">
              <h3 className="text-2xl font-bold mb-6">{plan.title}</h3>
              <div className="flex items-baseline mb-8">
                <span className="text-6xl font-bold">${plan.price}</span>
                <span className="text-gray-400 ml-2">/ {billingPeriod === "monthly" ? "mo" : "yr"}</span>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm tracking-wider uppercase">Features</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <PricingItem key={featureIndex}>{feature}</PricingItem>
                  ))}
                </ul>
              </div>
              <button className={cn(
                "w-full mt-8 py-2 px-4 rounded-lg font-medium",
                index === 1 
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              )}>
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