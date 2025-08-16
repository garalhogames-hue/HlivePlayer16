"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function Header() {
  return (
    <header className="text-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 flex items-center justify-center">
            <Image
              src="/radio-logo-transparent.png"
              alt="Rádio Habblive Logo"
              width={48}
              height={48}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text">Rádio Habblive</h1>
        </div>
        <p className="text-muted-foreground text-sm md:text-base">Estamos com você 24/7 — sintonize!</p>
      </motion.div>
    </header>
  )
}
