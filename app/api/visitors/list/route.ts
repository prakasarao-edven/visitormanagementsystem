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

      const [settingsRows] =
        await connection.query(

          `
          SELECT setting_value
          FROM system_settings
          WHERE setting_key = 'AUTO_CHECKOUT_HOURS'
          LIMIT 1
          `

        );

      const autoCheckoutHours =
        parseInt(
          (settingsRows as any[])[0]?.setting_value,
          10
        ) || 12;

      await connection.query(

        `
        UPDATE visitors
        SET
          status = 'Checked Out',
          check_out_time = LEAST(
            DATE_ADD(check_in_time, INTERVAL ? HOUR),
            DATE_ADD(DATE(check_in_time), INTERVAL 1 DAY)
          )
        WHERE
          status = 'Checked In'
          AND (
            check_in_time < DATE_SUB(NOW(), INTERVAL ? HOUR)
            OR DATE(check_in_time) < CURDATE()
          )
        `,

        [
          autoCheckoutHours,
          autoCheckoutHours
        ]

      );

      const isSecurity =
        user.role === "SECURITY";

      const [rows] =
        await connection.query(

          isSecurity

          ? `
            SELECT
              id, visitor_code, full_name, photo_url,
              purpose_of_visit, person_to_meet,
              status, check_in_time, check_out_time
            FROM visitors
            WHERE DATE(check_in_time) = CURDATE()
            ORDER BY created_at DESC
            `

          : `
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