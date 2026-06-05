import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/lib/db/connection";

export async function PUT(
  request: NextRequest
) {

  try {

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

      await connection.query(

        `UPDATE visitors

         SET
           check_out_time = ?,
           status = 'Checked Out'

         WHERE id = ?`,

        [
          checkOutTime,
          visitorId
        ]

      );

      return NextResponse.json(

        {
          message:
            "Checkout time updated successfully"
        }

      );

    } finally {

      connection.release();

    }

  } catch (error) {

    console.log(error);

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