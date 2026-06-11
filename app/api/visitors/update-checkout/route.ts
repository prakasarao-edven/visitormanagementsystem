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

      visitorId,

      checkOutTime

    } = await request.json();

    if (
      !visitorId ||
      !checkOutTime
    ) {

      return NextResponse.json(

        {
          error:
            "Visitor ID and checkout time are required"
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

      await connection.query(

        `
        UPDATE visitors

        SET
          check_out_time = ?,
          status = 'Checked Out'

        WHERE id = ?
        `,

        [
          checkOutTime,
          visitorId
        ]

      );

      return NextResponse.json(

        {

          success: true,

          message:
            "Checkout time updated successfully"

        }

      );

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.log(
      "Update checkout error:",
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

