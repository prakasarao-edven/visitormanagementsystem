import { NextRequest, NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { pool } from "@/lib/db/connection";

import { getUserFromToken } from "@/lib/auth/getUserFromToken";

export async function POST(request: NextRequest) {

  try {

    const authHeader =
      request.headers.get("authorization");

    if (!authHeader) {

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );

    }

    const token = authHeader.split(" ")[1];

    const decodedUser: any =
      getUserFromToken(token);

    if (!decodedUser) {

      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );

    }

    if (decodedUser.role !== "SUPER_ADMIN") {

      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );

    }

    const body = await request.json();

    const {
      name,
      email,
      phone,
      password,
      role
    } = body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const uuid =
      "USR_" + Date.now();

    const connection =
      await pool.getConnection();

    await connection.query(

      `
      INSERT INTO users
      (
        uuid,
        name,
        email,
        phone,
        password,
        role
      )
      VALUES
      (?, ?, ?, ?, ?, ?)
      `,

      [
        uuid,
        name,
        email,
        phone,
        hashedPassword,
        role
      ]
    );

    connection.release();

    return NextResponse.json({
      message: "User created successfully"
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );

  }
}
