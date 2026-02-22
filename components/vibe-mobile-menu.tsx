"use client"

import type React from "react"
import { Menu } from "lucide-react"
import { Link } from "@/i18n/routing"
import { LocaleToggle } from "@/components/locale-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface VibeMobileMenuProps {
  translations: {
    events: string
    blog: string
  }
}

export function VibeMobileMenu({ translations }: VibeMobileMenuProps) {
  return (
    <div className="md:hidden flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="p-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="vibe-font sm:max-w-sm p-0 border-l border-dashed border-gray-300">
          <SheetHeader className="p-6 border-b border-dashed border-gray-300 text-left">
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase">Menu</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col">
            <MobileNavLink href="#">{translations.events}</MobileNavLink>
            <MobileNavLink href="#">{translations.blog}</MobileNavLink>
            <div className="p-6 border-b border-dashed border-gray-300 flex items-center justify-between">
              <span className="text-lg font-bold">Language</span>
              <LocaleToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="p-6 text-lg font-bold border-b border-dashed border-gray-300 hover:bg-gray-50 transition-colors block"
    >
      {children}
    </Link>
  )
}
