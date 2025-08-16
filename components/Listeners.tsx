"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"

interface ListenersProps {
  count: number
}

export default function Listeners({ count }: ListenersProps) {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Users className="w-5 h-5" />
      <span className="font-medium">{count}</span>
      <span className="text-sm text-muted-foreground">ouvintes</span>
    </motion.div>
  )
}
