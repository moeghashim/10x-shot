"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Send } from "lucide-react"

export function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Here you would typically integrate with your newsletter service
      setIsSubmitted(true)
      setEmail("")
      setTimeout(() => setIsSubmitted(false), 3000)
    }
  }

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600">
            <Mail className="h-4 w-4" />
            Stay Updated
          </div>
        </div>

        <h2 className="mb-4 text-3xl font-bold text-black">Get the Latest Updates</h2>

        <p className="mb-8 text-lg text-gray-600 max-w-2xl mx-auto">
          Follow along as I document the real impact of AI on productivity. Get insights, lessons learned, and
          behind-the-scenes updates from each project.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white border-gray-300 focus:border-black"
            required
          />
          <Button type="submit" className="bg-black hover:bg-gray-800 text-white px-6" disabled={isSubmitted}>
            {isSubmitted ? (
              "Subscribed!"
            ) : (
              <>
                Subscribe
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {isSubmitted && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            Thanks for subscribing! You'll receive updates on the 10x experiment.
          </p>
        )}

        <p className="mt-4 text-xs text-gray-500">No spam, unsubscribe at any time. Updates sent weekly.</p>
      </div>
    </section>
  )
}
