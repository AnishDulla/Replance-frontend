"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface PreOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { plan: string; email: string; name: string }) => void;
}

export function PreOrderForm({ isOpen, onClose, onSubmit }: PreOrderFormProps) {
  const [plan, setPlan] = useState("starter")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ plan, email, name })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Pre-order LaunchPad</DialogTitle>
          <DialogDescription>
            Enter your details to pre-order LaunchPad. You&apos;ll be redirected to complete your payment.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Select Plan</Label>
            <RadioGroup value={plan} onValueChange={setPlan}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="starter" id="starter" />
                <Label htmlFor="starter">Starter ($29/mo)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pro" id="pro" />
                <Label htmlFor="pro">Pro ($79/mo)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="enterprise" id="enterprise" />
                <Label htmlFor="enterprise">Enterprise ($199/mo)</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full border-2 border-black">
            Proceed to Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 