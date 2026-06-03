import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';
import { generateVisitorCode } from '@/lib/utils/codeGenerator';

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, mobileNumber, email, idProofType, idProofNumber, remarks } = await request.json();

    if (!fullName || !mobileNumber) {
      return NextResponse.json(
        { error: 'Full name and mobile number are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const visitorCode = generateVisitorCode();

      const [result] = await connection.query(
        `INSERT INTO visitors (visitor_code, full_name, mobile_number, email, id_proof_type, id_proof_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [visitorCode, fullName, mobileNumber, email || null, idProofType || null, idProofNumber || null]
      );

      return NextResponse.json(
        {
          message: 'Visitor registered successfully',
          visitorCode,
          visitorId: (result as any).insertId,
        },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Visitor with this mobile number already exists' },
          { status: 400 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register visitor error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
