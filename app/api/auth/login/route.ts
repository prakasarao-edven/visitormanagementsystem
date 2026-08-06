import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  pool
} from "@/lib/db/connection";

import bcryptjs from "bcryptjs";

const jwt =
  require("jsonwebtoken");

export async function POST(
  request: NextRequest
) {

  try {

    const {
      email,
      password
    } = await request.json();

    if (
      !email ||
      !password
    ) {

      return NextResponse.json(

        {
          error:
            "Email and password are required"
        },

        {
          status: 400
        }

      );

    }

    const connection =
      await pool.getConnection();

    try {

      const [users] =
        await connection.query(

          "SELECT * FROM users WHERE email = ?",

          [email]

        );

      const user =
        (users as any[])[0];

      if (!user) {

        return NextResponse.json(

          {
            error:
              "Invalid credentials"
          },

          {
            status: 401
          }

        );

      }

      const passwordMatch =
        await bcryptjs.compare(

          password,

          user.password

        );

      if (!passwordMatch) {

        return NextResponse.json(

          {
            error:
              "Invalid credentials"
          },

          {
            status: 401
          }

        );

      }

      if (!user.status) {

        return NextResponse.json(

          {
            error:
              "User account is disabled"
          },

          {
            status: 403
          }

        );

      }

      const token =
        jwt.sign(

          {

            id: user.id,

            uuid: user.uuid,

            email: user.email,

            role: user.role

          },

          process.env.JWT_SECRET,

          {

            expiresIn:
              process.env.JWT_EXPIRY ||
              "24h"

          }

        );

      await connection.query(

        "UPDATE users SET last_login = NOW() WHERE id = ?",

        [user.id]

      );

      await connection.query(

        `
        INSERT INTO user_sessions (user_id, login_time, ip_address, device_info)
        VALUES (?, NOW(), ?, ?)
        `,

        [
          user.id,
          request.headers.get("x-forwarded-for") || null,
          request.headers.get("user-agent") || null
        ]

      );

      const response =
        NextResponse.json({

          success: true,

          user: {

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role

          }

        });

      response.cookies.set(

        "token",

        token,

        {

          httpOnly: true,

          secure: false,

          sameSite: "lax",

          path: "/",

          maxAge:
            60 * 60 * 24

        }

      );

      return response;

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.error(
      "Login error:",
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