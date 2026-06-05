import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { generateVisitorCode } from '@/lib/utils/codeGenerator';

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

      remarks

    } = await request.json();

    if (
      !fullName ||
      !mobileNumber
    ) {

      return NextResponse.json(

        {
          error:
            'Full name and mobile number are required'
        },

        {
          status: 400
        }

      );

    }

    if (
      !/^\d{10}$/.test(
        mobileNumber
      )
    ) {

      return NextResponse.json(

        {
          error:
            'Mobile number must be exactly 10 digits'
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

      const [result] =
        await connection.query(

          `INSERT INTO visitors (

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

          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,

          [

            visitorCode,

            fullName,

            `${countryCode} ${mobileNumber}`,

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

          message:
            'Visitor registered successfully',

          visitorCode,

          visitorId:
            (result as any).insertId

        },

        {
          status: 201
        }

      );

    } finally {

      connection.release();

    }

  } catch (error) {

    console.error(
      'Register visitor error:',
      error
    );

    return NextResponse.json(

      {
        error:
          'Internal server error'
      },

      {
        status: 500
      }

    );

  }

}