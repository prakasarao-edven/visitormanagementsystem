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

export async function GET(
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

    const searchParams =
      request.nextUrl.searchParams;

    const mobileNumber =
      searchParams.get(
        "mobileNumber"
      );

    if (!mobileNumber) {

      return NextResponse.json(

        {
          error:
            "Mobile number is required"
        },

        {
          status: 400
        }

      );

    }

    const sanitizedMobile =
      mobileNumber.replace(
        /\D/g,
        ""
      );

    if (
      sanitizedMobile.length < 10
    ) {

      return NextResponse.json(

        {
          error:
            "Invalid mobile number"
        },

        {
          status: 400
        }

      );

    }

    const connection =
      await pool.getConnection();

    try {

      const [visitors] =
        await connection.query(

          `
          SELECT *

          FROM visitors

          WHERE mobile_number = ?
          `,

          [sanitizedMobile]

        );

      const visitor =
        (visitors as any[])[0];

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

      return NextResponse.json({

        visitor

      });

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.error(
      "Search visitor error:",
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