import { NextResponse } from "next/server"

// Base Shoutcast host and port (no trailing slash)
const BASE = "http://sonicpanel.oficialserver.com:8342"

// small helper for timeout
async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), ms)
  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      // Identify ourselves; some hosts block default fetch UA
      headers: {
        "User-Agent": "RadioHabblive-Player/1.0",
        ...(init.headers || {}),
      },
      // avoid Next caching
      cache: "no-store",
    })
    return res
  } finally {
    clearTimeout(id)
  }
}

function okJson(data: any) {
  return new NextResponse(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

function errorJson(message: string, status = 500) {
  return new NextResponse(JSON.stringify({ success: false, error: message }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
}

// Try Shoutcast v2 JSON endpoints first, then fallbacks
export async function GET() {
  try {
    // 1) /statistics?json=1 (server-wide) — preferred
    const urls = [
      `${BASE}/statistics?json=1`,
      `${BASE}/stats?sid=1&json=1`,
      `${BASE}/stats?json=1`,
      // Shoutcast v1/v2 legacy: /7.html (CSV-ish)
      `${BASE}/7.html`,
      // Icecast-compatible JSON (some SonicPanel hosts expose this)
      `${BASE}/status-json.xsl`,
    ]

    let locutor: string | null = null
    let programa: string | null = null
    let unicos: number | null = null
    let status: "online" | "offline" = "offline"

    let lastError: any = null

    for (const u of urls) {
      try {
        const res = await fetchWithTimeout(u)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        if (u.endsWith("statistics?json=1")) {
          const j = await res.json()
          // Use first active stream if available
          const stream = Array.isArray(j.streams) && j.streams.length ? j.streams[0] : j
          locutor = (stream.dj || j.dj || null) ?? null
          programa = (stream.songtitle || stream.servertitle || j.songtitle || null) ?? null
          // Prefer stream-level unique listeners; fallback to server-wide
          unicos = Number(
            stream.uniquelisteners ??
              j.uniquelisteners ??
              stream.currentlisteners ??
              j.currentlisteners ??
              0,
          )
          status =
            Number(stream.streamstatus ?? j.streamstatus ?? (unicos ?? 0) > 0 ? 1 : 0) === 1
              ? "online"
              : "offline"
          break
        }

        if (u.includes("/stats")) {
          const j = await res.json()
          locutor = (j.dj || j.songtitle || null) ?? null
          programa = (j.songtitle || j.servertitle || null) ?? null
          unicos = Number(j.uniquelisteners ?? j.currentlisteners ?? 0)
          status = Number(j.streamstatus ?? (unicos ?? 0) > 0 ? 1 : 0) === 1 ? "online" : "offline"
          break
        }

        if (u.endsWith("/7.html")) {
          const txt = await res.text()
          // Typical format: currentlisteners,peaklisteners,maxlisteners,?,bitrate,?,"Stream Title"
          // e.g. "2,10,100,0,128,0,Song - Artist"
          const parts = txt.replace(/<[^>]+>/g, "").trim().split(",")
          if (parts.length >= 7) {
            const current = Number(parts[0])
            const title = parts.slice(6).join(",").replace(/^"+|"+$/g, "")
            locutor = null
            programa = title || null
            unicos = Number.isFinite(current) ? current : 0
            status = current > 0 ? "online" : "offline"
            break
          }
        }

        if (u.endsWith("status-json.xsl")) {
          const j = await res.json()
          const s =
            j &&
            j.icestats &&
            Array.isArray(j.icestats.source)
              ? j.icestats.source[0]
              : j?.icestats?.source || j?.source
          const listeners = Number(s?.listeners ?? 0)
          locutor = null
          programa = s?.title || s?.server_name || null
          unicos = listeners
          status = listeners > 0 ? "online" : "offline"
          break
        }
      } catch (e: any) {
        lastError = e
        continue
      }
    }

    if (unicos === null && programa === null && locutor === null) {
      throw new Error(`Nenhum endpoint do Shoutcast respondeu. Último erro: ${String(lastError)}`)
    }

    return okJson({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        locutor: locutor || "—",
        programa: programa || "—",
        unicos: Number(unicos ?? 0),
        status,
      },
    })
  } catch (err: any) {
    return errorJson(err?.message || "Erro ao obter status da rádio")
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
