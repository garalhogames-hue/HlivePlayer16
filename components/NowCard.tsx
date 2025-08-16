"use client"

import { motion } from "framer-motion"
import Avatar from "./Avatar"
import LoveButton from "./LoveButton"
import Listeners from "./Listeners"
import type { RadioStatus } from "@/lib/types"

interface NowCardProps {
  radioStatus: RadioStatus | null
  avatarUrl: string | null
}

export default function NowCard({ radioStatus, avatarUrl }: NowCardProps) {
  const isLive = radioStatus?.locutor && radioStatus.locutor !== "Radio Habblive" && radioStatus.locutor.trim() !== ""

  const displayDJ = isLive ? radioStatus.locutor : "Rádio Habblive"
  const displayProgram = isLive ? radioStatus.programa : "Tocando as Melhores"

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 md:p-8"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="text-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar avatarUrl={avatarUrl} isLive={!!isLive} djName={displayDJ} />

          <div className="space-y-2">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-foreground"
              key={displayDJ}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayDJ}
            </motion.h2>

            <motion.p
              className="text-muted-foreground"
              key={displayProgram}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {displayProgram}
            </motion.p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <Listeners count={radioStatus?.unicos || 0} />

          {isLive && <LoveButton djName={radioStatus.locutor} />}
        </div>
      </div>
    </motion.div>
  )
}
