import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db/connection";
import { verifyAuth } from "@/lib/middleware/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (user) {
      const connection = await pool.getConnection();

      try {
        await connection.query(
          `
          UPDATE user_sessions
          SET logout_time = NOW()
          WHERE user_id = ? AND logout_time IS NULL
          ORDER BY id DESC
          LIMIT 1
          `,
          [user.id]
        );
      } finally {
        connection.release();
      }
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete("token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
