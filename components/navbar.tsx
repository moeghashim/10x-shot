"use client"

import Link from "next/link"
import Image from "next/image"
import { BarChart3, Github } from "lucide-react"
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
                    <Image
                        src="/10claws.svg"
                        alt="10xBuilder.ai logo"
                        width={36}
                        height={36}
                        className="h-9 w-9"
                        priority
                    />
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
