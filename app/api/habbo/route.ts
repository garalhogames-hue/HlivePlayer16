import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const nick = searchParams.get("nick")

  if (!nick) {
    return NextResponse.json({ error: "Nick parameter is required" }, { status: 400 })
  }

  try {
    const response = await fetch(`https://habblive.in/api/user/${encodeURIComponent(nick)}`, {
      headers: {
        "User-Agent": "RadioHabblive-Player/1.0",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch habbo user data")
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  } catch (error) {
    console.error("Error fetching habbo user:", error)

    // Return fallback data
    return NextResponse.json(
      {
        avatar: null,
        nickname: nick,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      },
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
