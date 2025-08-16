"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface AvatarProps {
  avatarUrl: string | null
  isLive: boolean
  djName: string
}

export default function Avatar({ avatarUrl, isLive, djName }: AvatarProps) {
  const normalizedDjName = djName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
  const isRadioHabblive =
    normalizedDjName.includes("radio habblive") ||
    djName.toLowerCase().includes("rádio habblive") ||
    djName.toLowerCase().includes("radio habblive")

  return (
    <div className="relative">
      <motion.div
        className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden ${isLive ? "glow-ring" : ""}`}
        animate={
          isLive
            ? {
                boxShadow: [
                  "0 0 0 2px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)",
                  "0 0 0 2px rgba(219, 39, 119, 0.3), 0 0 20px rgba(219, 39, 119, 0.2)",
                  "0 0 0 2px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.2)",
                ],
              }
            : {}
        }
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        {isRadioHabblive ? (
          <Image src="/radio-logo-with-bg.png" alt="Logo da Rádio Habblive" fill className="object-cover" />
        ) : avatarUrl ? (
          <Image src={avatarUrl || "/placeholder.svg"} alt={`Avatar de ${djName}`} fill className="object-cover" />
        ) : (
          <div className="w-full h-full gradient-primary flex items-center justify-center">
            <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
              {djName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </motion.div>

      {isLive && (
        <motion.div
          className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full" />
        </motion.div>
      )}
    </div>
  )
}
