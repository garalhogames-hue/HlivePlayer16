import type { RadioStatus, HabboUser } from "./types"

export async function fetchRadioStatus(): Promise<RadioStatus> {
  const response = await fetch("/api/status")
  if (!response.ok) {
    throw new Error("Failed to fetch radio status")
  }
  return response.json()
}

export async function fetchHabboAvatar(nick: string): Promise<HabboUser> {
  try {
    const avatarUrl = `https://habblive.in/imager.php?user=${encodeURIComponent(nick)}&action=wav&size=l&head_direction=3&direction=3&gesture=sml`
    return { avatar: avatarUrl }
  } catch (error) {
    console.error("[v0] Failed to generate avatar URL:", error)
    return { avatar: null }
  }
}
