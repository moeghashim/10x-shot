"use client"

import { Mail } from "lucide-react"
import { GeistMono } from "geist/font/mono"

export function VibeNewsletterSection() {
  return (
    <section className={`${GeistMono.className} px-6 py-24 bg-white border-b border-dashed border-gray-300`}>
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 border-2 border-dashed border-gray-300 px-4 py-1 text-xs font-black uppercase tracking-widest bg-white">
            <Mail className="h-4 w-4 text-gray-400" />
            Stay Updated
          </div>
        </div>

        <h2 className="mb-6 text-4xl md:text-5xl font-black uppercase tracking-tighter">
          Get the Latest Updates
        </h2>

        <p className="mb-12 text-lg md:text-xl font-medium leading-relaxed text-gray-600 max-w-2xl mx-auto">
          Follow along as I document the real impact of AI on productivity. Get insights, lessons learned, and
          behind-the-scenes updates from each project.
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative p-2 border-2 border-dashed border-gray-300 bg-white max-w-full">
            <iframe 
              src="https://buildinpublic.substack.com/embed" 
              width="480" 
              height="320" 
              className="max-w-full"
              style={{ background: "white", overflow: "hidden" }} 
              title="Subscribe to Building in Public Newsletter"
            />
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          No spam, unsubscribe at any time. Updates sent weekly.
        </p>
      </div>
    </section>
  )
}
