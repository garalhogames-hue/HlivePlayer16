"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import NowCard from "@/components/NowCard"
import PlayerControls from "@/components/PlayerControls"
import Footer from "@/components/Footer"
import { fetchRadioStatus, fetchHabboAvatar } from "@/lib/api"
import type { RadioStatus } from "@/lib/types"

export default function RadioPlayer() {
  const [radioStatus, setRadioStatus] = useState<RadioStatus | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isLoading, setIsLoading] = useState(true)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRestartTimeRef = useRef<number>(Date.now())

  // Fetch radio status
  const updateRadioStatus = async () => {
    try {
      const status = await fetchRadioStatus()
      setRadioStatus(status)

      // Fetch avatar if there's a DJ
      if (status.locutor && status.locutor !== "Radio Habblive" && status.locutor.trim() !== "") {
        try {
          const avatar = await fetchHabboAvatar(status.locutor)
          setAvatarUrl(avatar.avatar || null)
        } catch (error) {
          setAvatarUrl(null)
        }
      } else {
        setAvatarUrl(null)
      }
    } catch (error) {
      console.error("Failed to fetch radio status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to restart the audio stream
  const restartAudioStream = async () => {
    if (!audioRef.current) return

    try {
      console.log("Restarting audio stream...")
      const wasPlaying = isPlaying
      
      // Stop current playback
      audioRef.current.pause()
      
      // Reset the audio element
      audioRef.current.load()
      
      // If it was playing, start playing again
      if (wasPlaying) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error("Error restarting playback:", error)
          setIsPlaying(false)
        }
      }
      
      lastRestartTimeRef.current = Date.now()
    } catch (error) {
      console.error("Error in restartAudioStream:", error)
    }
  }

  // Handle reconnection with debounce
  const handleReconnect = () => {
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    // Debounce reconnection attempts to avoid too many rapid reconnects
    reconnectTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        console.log("Connection issue detected, attempting to reconnect...")
        restartAudioStream()
      }
    }, 1000)
  }

  // Initialize audio and status
  useEffect(() => {
    updateRadioStatus()
    const interval = setInterval(updateRadioStatus, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Setup audio event listeners for connection issues
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Event handlers for connection issues
    const handleStalled = () => {
      console.log("Audio stalled, attempting to reconnect...")
      handleReconnect()
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      handleReconnect()
    }

    const handleEnded = () => {
      console.log("Audio ended unexpectedly, attempting to reconnect...")
      handleReconnect()
    }

    const handleWaiting = () => {
      console.log("Audio waiting for data...")
      // Only reconnect if we've been waiting for more than 5 seconds
      const waitTimeout = setTimeout(() => {
        if (isPlaying) {
          console.log("Audio stuck waiting, attempting to reconnect...")
          handleReconnect()
        }
      }, 5000)

      // Clear timeout if playing resumes
      const handlePlaying = () => {
        clearTimeout(waitTimeout)
      }
      
      audio.addEventListener("playing", handlePlaying, { once: true })
    }

    // Add event listeners
    audio.addEventListener("stalled", handleStalled)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("waiting", handleWaiting)

    // Cleanup
    return () => {
      audio.removeEventListener("stalled", handleStalled)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("waiting", handleWaiting)
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [isPlaying])

  // Periodic restart to prevent delay accumulation (every 10 minutes)
  useEffect(() => {
    const RESTART_INTERVAL = 10 * 60 * 1000 // 10 minutes in milliseconds

    const intervalId = setInterval(() => {
      if (isPlaying) {
        console.log("Performing periodic stream restart to prevent delay...")
        restartAudioStream()
      }
    }, RESTART_INTERVAL)

    return () => clearInterval(intervalId)
  }, [isPlaying])

  // Handle audio volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handlePlayPause = async () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        // Always load fresh stream when starting playback
        audioRef.current.load()
        await audioRef.current.play()
        setIsPlaying(true)
        lastRestartTimeRef.current = Date.now()
      }
    } catch (error) {
      console.error("Audio playback error:", error)
      setIsPlaying(false)
    }
  }

const STREAM_URL = "https://sonicpanel.oficialserver.com:8342/;stream.mp3"

// Prefer 'loadedmetadata' on Chrome for streams (canplay may not always fire reliably for live)
const waitForLoadedMeta = (audio: HTMLAudioElement, timeoutMs = 3000) =>
  new Promise<void>((resolve) => {
    let done = false
    const ok = () => {
      if (done) return
      done = true
      audio.removeEventListener("loadedmetadata", ok)
      clearTimeout(t)
      resolve()
    }
    const t = setTimeout(() => {
      if (done) return
      done = true
      audio.removeEventListener("loadedmetadata", ok)
      resolve()
    }, timeoutMs)
    audio.addEventListener("loadedmetadata", ok, { once: true })
  })

let playLock = false
const handlePlayPause = async () => {
  if (!audioRef.current || playLock) return
  const audio = audioRef.current

  try {
    playLock = true

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      return
    }

    // Reset stream cleanly (no cache-busting for Chrome)
    audio.pause()
    // Rebuild <source> list to hint MIME to Chrome
    while (audio.firstChild) audio.removeChild(audio.firstChild)
    const s = document.createElement("source")
    s.src = STREAM_URL
    s.type = "audio/aac" // aac/aacp stream hint
    audio.appendChild(s)

    audio.load()
    ;(audio as any).playsInline = true

    // Wait briefly for metadata then try to play
    await waitForLoadedMeta(audio)

    let p = audio.play()
    if (p && typeof p.then === "function") {
      await p
    }

    setIsPlaying(true)
    lastRestartTimeRef.current = Date.now()
  } catch (err: any) {
    console.error("Audio playback error (Chrome):", err?.name || err, err?.message || "")
    // Fallback: try without <source> (set src directly)
    try {
      audio.pause()
      while (audio.firstChild) audio.removeChild(audio.firstChild)
      audio.removeAttribute("src")
      audio.src = STREAM_URL
      audio.load()
      ;(audio as any).playsInline = true
      const p2 = audio.play()
      if (p2 && typeof p2.then === "function") await p2
      setIsPlaying(true)
      return
    } catch (err2) {
      console.error("Audio playback fallback failed:", err2)
      setIsPlaying(false)
    }
  } finally {
    playLock = false
  }
}


const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <audio 
        ref={audioRef} 
        preload="none"
        crossOrigin="anonymous"
        playsInline
      >
        <source src="https://sonicpanel.oficialserver.com:8342/;stream.mp3" type="audio/aac" />

      <motion.div
        className="hidden lg:block fixed inset-0 pointer-events-none z-20"
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <img src="/hliveequipe.png" alt="" className="w-full h-full object-cover object-center" />
      </motion.div>

      <div className="relative z-10">
        </audio>

      <Header />

        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={radioStatus?.locutor || "loading"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <NowCard radioStatus={radioStatus} avatarUrl={avatarUrl} />
              </motion.div>
            </AnimatePresence>

            <PlayerControls
              isPlaying={isPlaying}
              volume={volume}
              onPlayPause={handlePlayPause}
              onVolumeChange={handleVolumeChange}
            />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}