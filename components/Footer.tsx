"use client"

import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-8 px-4 text-center space-y-4">
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <p className="text-sm font-bold text-foreground uppercase tracking-wide">PROGRESSO DO FUTURO SITE</p>

        <div className="flex items-center justify-center gap-3">
          <div className="w-full max-w-md bg-muted rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "5%" }}
              transition={{
                duration: 2,
                ease: "easeOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                repeatDelay: 1,
              }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground min-w-[2rem]">5%</span>
        </div>
      </motion.div>

      <motion.p
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        Desenvolvido por Michael, caso haja problemas chame no discord: explodido
      </motion.p>
    </footer>
  )
}
