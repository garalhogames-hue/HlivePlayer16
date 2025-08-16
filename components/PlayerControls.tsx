"use client"

import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Home, Loader2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"

interface PlayerControlsProps {
  isPlaying: boolean
  isAudioLoading: boolean
  volume: number
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
}

export default function PlayerControls({
  isPlaying,
  isAudioLoading,
  volume,
  onPlayPause,
  onVolumeChange,
}: PlayerControlsProps) {
  const isMuted = volume === 0

  const toggleMute = () => {
    onVolumeChange(isMuted ? 0.7 : 0)
  }

  return (
    <motion.div
      className="glass-card rounded-2xl p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center justify-center gap-6">
        {/* Play/Pause Button */}
        <motion.button
          onClick={onPlayPause}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full gradient-primary flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            key={isAudioLoading ? "loading" : isPlaying ? "pause" : "play"}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isAudioLoading ? (
              <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-8 h-8 md:w-10 md:h-10 text-white fill-white" />
            ) : (
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white ml-1" />
            )}
          </motion.div>
        </motion.button>

        {/* Volume Control */}
        <div className="flex items-center gap-3 flex-1 max-w-xs">
          <motion.button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-foreground" />
            )}
          </motion.button>

          <div className="flex-1">
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              max={1}
              step={0.01}
              className="w-full h-3 [&_[data-slot=slider-track]]:bg-muted/40 [&_[data-slot=slider-track]]:border [&_[data-slot=slider-track]]:border-muted-foreground/20 [&_[data-slot=slider-track]]:h-3 [&_[data-slot=slider-range]]:h-3"
            />
          </div>

          <span className="text-sm text-muted-foreground min-w-[3ch]">{Math.round(volume * 100)}</span>
        </div>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://habblive.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full gradient-primary text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
          >
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="sm:hidden">Habblive</span>
            <span className="hidden sm:inline">Entrar no Habblive</span>
          </a>

          {/* Discord Button */}
          <a
            href="https://discord.gg/aCeNspzQzn"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-[#5865F2] text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>

          {/* Instagram Button */}
          <a
            href="http://instagram.com/radio.habblive"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-medium hover:shadow-lg transition-all duration-200 hover:scale-105 text-sm"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            Instagram
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}
