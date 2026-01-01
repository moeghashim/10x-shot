"use client"

import Link from "next/link"
import { Zap, BarChart3, Github } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <Zap className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                        <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-primary/50 group-hover:ring-primary transition-all" />
                    </div>
                    <span className="text-lg font-bold tracking-tight font-display">
                        10x<span className="text-primary">Builder</span>.ai
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    <Link href="/#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Projects
                    </Link>
                    <Link href="/progress" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Progress
                    </Link>
                    <Link href="/methodology" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Methodology
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="https://github.com/moeghashim/10x-shot" target="_blank" className="text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-5 w-5" />
                    </Link>
                    <Link href="/progress">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Track Progress
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    )
}
