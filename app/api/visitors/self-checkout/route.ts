import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db/connection";

export async function POST(request: NextRequest) {
  try {
    const { fullName, mobileNumber } = await request.json();

    if (!fullName || !String(fullName).trim() || !mobileNumber) {
      return NextResponse.json(
        { error: "Full name and mobile number are required" },
        { status: 400 }
      );
    }

    const sanitizedMobile = String(mobileNumber).replace(/\D/g, "");

    const connection = await pool.getConnection();

    try {
      const [rows] = await connection.query(
        `
        SELECT * FROM visitors
        WHERE full_name = ? AND mobile_number LIKE ? AND status = 'Checked In'
        ORDER BY id DESC
        LIMIT 1
        `,
        [String(fullName).trim(), `%${sanitizedMobile}`]
      );

      const visitor = (rows as any[])[0];

      if (!visitor) {
        return NextResponse.json(
          { error: "No active visit found for this name and number" },
          { status: 404 }
        );
      }

      await connection.query(
        `
        UPDATE visitors
        SET status = 'Checked Out', check_out_time = NOW()
        WHERE id = ?
        `,
        [visitor.id]
      );

      return NextResponse.json({
        success: true,
        message: "Checked out successfully",
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Self checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
