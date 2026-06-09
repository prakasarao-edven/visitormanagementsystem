import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  pool
} from "@/lib/db/connection";

import {
  requireAdmin
} from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest
) {

  try {

    const isAdmin =
      await requireAdmin(
        request
      );

    if (!isAdmin) {

      return NextResponse.json(
        {
          error:
            "Unauthorized"
        },
        {
          status: 401
        }
      );

    }

    const connection =
      await pool.getConnection();

    try {

      const [rows] =
        await connection.query(

          `
          SELECT *
          FROM visitors
          ORDER BY created_at DESC
          `

        );

      return NextResponse.json({

        visitors: rows

      });

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.error(
      "Fetch visitors error:",
      error
    );

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