"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface LoveButtonProps {
  djName: string
}

export default function LoveButton({ djName }: LoveButtonProps) {
  const [loveCount, setLoveCount] = useState(0)
  const [canLove, setCanLove] = useState(true)
  const [showBurst, setShowBurst] = useState(false)

  // Load love count from localStorage
  useEffect(() => {
    const savedCount = localStorage.getItem(`love_${djName}`)
    if (savedCount) {
      setLoveCount(Number.parseInt(savedCount, 10))
    }

    // Check if user can love (30s cooldown)
    const lastLoveTime = localStorage.getItem(`lastLove_${djName}`)
    if (lastLoveTime) {
      const timeDiff = Date.now() - Number.parseInt(lastLoveTime, 10)
      if (timeDiff < 30000) {
        // 30 seconds
        setCanLove(false)
        setTimeout(() => setCanLove(true), 30000 - timeDiff)
      }
    }
  }, [djName])

  const handleLove = () => {
    if (!canLove) return

    const newCount = loveCount + 1
    setLoveCount(newCount)
    setCanLove(false)
    setShowBurst(true)

    // Save to localStorage
    localStorage.setItem(`love_${djName}`, newCount.toString())
    localStorage.setItem(`lastLove_${djName}`, Date.now().toString())

    // Reset burst animation
    setTimeout(() => setShowBurst(false), 600)

    // Reset cooldown
    setTimeout(() => setCanLove(true), 30000)
  }

  return (
    <motion.button
      onClick={handleLove}
      disabled={!canLove}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        canLove ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
      } ${showBurst ? "love-burst" : ""}`}
      whileHover={canLove ? { scale: 1.05 } : {}}
      whileTap={canLove ? { scale: 0.95 } : {}}
    >
      <Heart className={`w-5 h-5 ${canLove ? "fill-red-400" : "fill-gray-500"}`} />
      <span className="font-medium">{loveCount}</span>

      {showBurst && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          ❤️
        </motion.div>
      )}
    </motion.button>
  )
}
