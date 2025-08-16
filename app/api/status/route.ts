import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("
http://sonicpanel.oficialserver.com:8342/", {
      headers: {
        "User-Agent": "RadioHabblive-Player/1.0",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch radio status")
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
    console.error("Error fetching radio status:", error)

    // Return fallback data
    return NextResponse.json(
      {
        locutor: "Radio Habblive",
        programa: "Tocando as Melhores",
        unicos: 0,
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
