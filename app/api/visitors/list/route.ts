import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  pool
} from "@/lib/db/connection";

import {
  verifyAuth
} from "@/lib/middleware/auth";

export async function GET(
  request: NextRequest
) {

  try {

    const user =
      await verifyAuth(
        request
      );

    if (!user) {

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

      console.log(
  "DATABASE ROWS:",
  rows
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