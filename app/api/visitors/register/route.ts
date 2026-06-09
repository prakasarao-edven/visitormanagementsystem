import {
  NextRequest,
  NextResponse
} from "next/server";

import {
  pool
} from "@/lib/db/connection";

import {
  generateVisitorCode
} from "@/lib/utils/codeGenerator";

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

      fullName,

      countryCode,

      mobileNumber,

      email,

      idProofType,

      idProofNumber,

      purposeOfVisit,

      personToMeet,

      remarks

    } = await request.json();

    if (
      !fullName ||
      !mobileNumber
    ) {

      return NextResponse.json(

        {
          error:
            "Full name and mobile number are required"
        },

        {
          status: 400
        }

      );

    }

    const sanitizedName =
      String(fullName)
        .trim();

    const sanitizedMobile =
      String(mobileNumber)
        .replace(/\D/g, "");

    const sanitizedCountryCode =
      String(countryCode || "+91")
        .trim();

    if (
      sanitizedName.length < 2 ||
      sanitizedName.length > 100
    ) {

      return NextResponse.json(

        {
          error:
            "Full name must be between 2 and 100 characters"
        },

        {
          status: 400
        }

      );

    }

    if (
      !/^\d{10}$/.test(
        sanitizedMobile
      )
    ) {

      return NextResponse.json(

        {
          error:
            "Mobile number must be exactly 10 digits"
        },

        {
          status: 400
        }

      );

    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {

      return NextResponse.json(

        {
          error:
            "Invalid email address"
        },

        {
          status: 400
        }

      );

    }

    const connection =
      await pool.getConnection();

    try {

      const visitorCode =
        generateVisitorCode();

      const [existingVisitors] =
        await connection.query(

          `
          SELECT id

          FROM visitors

          WHERE mobile_number = ?
          AND status = 'Checked In'

          LIMIT 1
          `,

          [
            `${sanitizedCountryCode}${sanitizedMobile}`
          ]

        );

      if (
        (existingVisitors as any[])
          .length > 0
      ) {

        return NextResponse.json(

          {
            error:
              "Visitor is already checked in"
          },

          {
            status: 400
          }

        );

      }

      const [result] =
        await connection.query(

          `
          INSERT INTO visitors (

            visitor_code,

            full_name,

            mobile_number,

            email,

            purpose_of_visit,

            person_to_meet,

            id_proof_type,

            id_proof_number,

            remarks,

            status,

            check_in_time

          )

          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `,

          [

            visitorCode,

            sanitizedName,

            `${sanitizedCountryCode}${sanitizedMobile}`,

            email || null,

            purposeOfVisit || null,

            personToMeet || null,

            idProofType || null,

            idProofNumber || null,

            remarks || null,

            "Checked In"

          ]

        );

      return NextResponse.json(

        {

          success: true,

          message:
            "Visitor registered successfully",

          visitorCode,

          visitorId:
            (result as any)
              .insertId

        },

        {
          status: 201
        }

      );

    }

    finally {

      connection.release();

    }

  }

  catch (error) {

    console.error(
      "Register visitor error:",
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