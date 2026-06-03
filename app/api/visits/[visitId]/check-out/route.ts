import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { visitId: string } }
) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query(
        `UPDATE visits SET visit_status = 'CHECKED_OUT', check_out_time = NOW() WHERE id = ?`,
        [params.visitId]
      );

      // Log the action
      await connection.query(
        `INSERT INTO visit_logs (visit_id, action, performed_by) VALUES (?, 'CHECK_OUT', ?)`,
        [params.visitId, user.id]
      );

      return NextResponse.json({ message: 'Visitor checked out successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Check-out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
