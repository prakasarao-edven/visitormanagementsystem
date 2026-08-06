import {
  NextRequest,
  NextResponse
} from "next/server";

import fs from "fs";
import path from "path";

import {
  pool
} from "@/lib/db/connection";

import {
  generateVisitorCode
} from "@/lib/utils/codeGenerator";

function savePhoto(
  visitorCode: string,
  photo: string
) {

  const matches =
    photo.match(
      /^data:image\/(\w+);base64,(.+)$/
    );

  if (!matches) return null;

  const extension =
    matches[1] === "jpeg" ? "jpg" : matches[1];

  const uploadsDir =
    path.join(
      process.cwd(),
      "public",
      "uploads",
      "visitors"
    );

  fs.mkdirSync(
    uploadsDir,
    { recursive: true }
  );

  const fileName =
    `${visitorCode}.${extension}`;

  fs.writeFileSync(
    path.join(uploadsDir, fileName),
    Buffer.from(matches[2], "base64")
  );

  return `/uploads/visitors/${fileName}`;

}

export async function POST(
  request: NextRequest
) {

  try {

    const {

      fullName,

      countryCode,

      mobileNumber,

      email,

      idProofType,

      idProofNumber,

      purposeOfVisit,

      personToMeet,

      remarks,

      photo

    } = await request.json();

    if (
      !fullName ||
      !mobileNumber ||
      !purposeOfVisit ||
      !photo
    ) {

      return NextResponse.json(

        {
          error:
            "Full name, mobile number, purpose of visit and photo are required"
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

    const finalMobile =
      `${sanitizedCountryCode}${sanitizedMobile}`;

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

      const photoUrl =
        photo ? savePhoto(visitorCode, photo) : null;

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

            photo_url,

            status,

            check_in_time

          )

          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `,

          [

            visitorCode,

            sanitizedName,

            finalMobile,

            email || null,

            purposeOfVisit || null,

            personToMeet || null,

            idProofType || null,

            idProofNumber || null,

            remarks || null,

            photoUrl,

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