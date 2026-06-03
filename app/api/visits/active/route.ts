import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      const [visits] = await connection.query(
        `SELECT v.*, vs.full_name, vs.mobile_number, vp.name as purpose_name
         FROM visits v
         LEFT JOIN visitors vs ON v.visitor_id = vs.id
         LEFT JOIN visit_purposes vp ON v.purpose_id = vp.id
         WHERE DATE(v.created_at) = CURDATE() AND v.visit_status IN ('REGISTERED', 'CHECKED_IN')
         ORDER BY v.created_at DESC`
      );

      return NextResponse.json(visits);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get active visits error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
