import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  pool
} from "@/lib/db/connection";

import {
  requireSecurity
} from "@/lib/middleware/auth";

export async function PUT(
  request: NextRequest
) {

  try {

    const isSecurity =
      await requireSecurity(
        request
      );

    if (!isSecurity) {

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

    const {
      visitorId
    } = await request.json();

    if (!visitorId) {

      return NextResponse.json(

        {
          error:
            "Visitor ID is required"
        },

        {
          status: 400
        }

      );

    }

    const connection =
      await pool.getConnection();

    try {

      const [existingVisitor] =
        await connection.query(

          `
          SELECT *

          FROM visitors

          WHERE id = ?
          `,

          [visitorId]

        );

      const visitor =
        (existingVisitor as any[])[0];

      if (!visitor) {

        return NextResponse.json(

          {
            error:
              "Visitor not found"
          },

          {
            status: 404
          }

        );

      }

      if (

        visitor.status ===
        "Checked In"

      ) {

        return NextResponse.json(

          {
            error:
              "Visitor already checked in"
          },

          {
            status: 400
          }

        );

      }

      await connection.query(

        `
        UPDATE visitors

        SET
          status = 'Checked In',
          check_in_time = NOW()

        WHERE id = ?
        `,

        [visitorId]

      );

      return NextResponse.json({

        success: true,

        message:
          "Visitor checked in successfully"

      });

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.error(
      "Check in error:",
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