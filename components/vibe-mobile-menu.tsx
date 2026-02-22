"use client"

import type React from "react"
import { Menu } from "lucide-react"
import { Link } from "@/i18n/routing"
import { LocaleToggle } from "@/components/locale-toggle"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
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
        <SheetContent side="right" className="vibe-font sm:max-w-sm border-l border-dashed border-gray-300">
          <div className="flex flex-col space-y-4 mt-8">
            <MobileNavLink href="#">{translations.events}</MobileNavLink>
            <MobileNavLink href="#">{translations.blog}</MobileNavLink>
            <div className="py-4 border-t border-dashed border-gray-300 flex items-center justify-between">
              <span className="text-sm font-bold">Language</span>
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
      className="text-lg font-bold py-2 hover:text-gray-600 transition-colors"
    >
      {children}
    </Link>
  )
}
