import {
  NextRequest,
  NextResponse
} from "next/server";

import { pool }
from "@/lib/db/connection";

export async function PUT(
  request: NextRequest
) {

  try {

    const {
      visitorId
    } = await request.json();

    const connection =
      await pool.getConnection();

    try {

      await connection.query(

        `
        UPDATE visitors

        SET
          status = 'Checked Out',
          check_out_time = NOW()

        WHERE id = ?
        `,

        [visitorId]

      );

      return NextResponse.json({

        message:
          "Visitor checked out successfully"

      });

    } finally {

      connection.release();

    }

  } catch (error) {

    console.error(error);

    return NextResponse.json(

      {
        error:
          "Internal server error"
      },

      {
        status: 500
      }

    );

  }

}