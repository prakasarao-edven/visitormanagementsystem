import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/lib/db/connection";

export async function POST(
  request: NextRequest
) {

  try {

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

    const connection =
      await pool.getConnection();

    try {

      const [rows]: any =
        await connection.query(

          `SELECT *

           FROM visitors

           WHERE mobile_number
           LIKE ?

           ORDER BY id DESC

           LIMIT 1`,

          [`%${mobileNumber}`]

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