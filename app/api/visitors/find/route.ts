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

export async function POST(
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
      mobileNumber
    } = await request.json();

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
      String(
        mobileNumber
      ).replace(
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

      const [rows]: any =
        await connection.query(

          `
          SELECT *

          FROM visitors

          WHERE mobile_number
          LIKE ?

          ORDER BY id DESC

          LIMIT 1
          `,

          [
            `%${sanitizedMobile}`
          ]

        );

      if (
        rows.length === 0
      ) {

        return NextResponse.json(

          {
            visitor: null
          }

        );

      }

      return NextResponse.json(

        {
          visitor: rows[0]
        }

      );

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.log(
      "Find visitor error:",
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
