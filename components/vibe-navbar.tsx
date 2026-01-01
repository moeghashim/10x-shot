"use client"

import Link from "next/link"
import { Moon, Star } from "lucide-react"
import { GeistMono } from "geist/font/mono"

export function VibeNavbar() {
  return (
    <nav className={`${GeistMono.className} border-b border-dashed border-gray-300 bg-white`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center">
          <Link href="/" className="text-4xl font-black tracking-tighter uppercase mr-12 group">
            <span className="inline-flex items-center">
              <span className="bg-black text-white px-2 py-0.5 transform -skew-x-6">10X</span>
              <span className="text-black border-2 border-black px-2 py-0.5 ml-1 transform skew-x-6">BUILDER</span>
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-0">
          <NavLink href="#">Vibe Guide</NavLink>
          <NavLink href="#">Events</NavLink>
          <NavLink href="#">Blog</NavLink>
          <NavLink href="#">Docs</NavLink>
          
          <div className="flex items-center px-4 py-2 border-l border-dashed border-gray-300">
            <Star className="h-4 w-4 mr-2" />
            <span className="text-sm font-bold">10.6k</span>
          </div>
          
          <button className="p-4 border-l border-dashed border-gray-300 hover:bg-gray-50 transition-colors">
            <Moon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="px-6 py-5 text-sm font-bold border-l border-dashed border-gray-300 hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  )
}

