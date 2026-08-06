import { NextResponse } from "next/server";
import { associatesPool } from "@/lib/db/associatesConnection";

export async function GET() {
  try {
    const [rows] = await associatesPool.query(
      `SELECT id, name FROM users WHERE name IS NOT NULL ORDER BY name ASC`
    );

    return NextResponse.json({ associates: rows });
  } catch (error) {
    console.error("Fetch associates error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
