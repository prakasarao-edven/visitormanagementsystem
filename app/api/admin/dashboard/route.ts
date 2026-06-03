import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user || !['SUPER_ADMIN', 'ADMIN'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const connection = await pool.getConnection();
    try {
      const [[todayStats]] = await connection.query(
        `SELECT COUNT(*) as total_visitors,
                SUM(CASE WHEN visit_status = 'CHECKED_IN' THEN 1 ELSE 0 END) as active_visitors
         FROM visits WHERE DATE(created_at) = CURDATE()`
      );

      const [[totalUsers]] = await connection.query('SELECT COUNT(*) as count FROM users');
      const [[totalVisitors]] = await connection.query('SELECT COUNT(*) as count FROM visitors');

      return NextResponse.json({
        todayVisitors: todayStats.total_visitors || 0,
        activeVisitors: todayStats.active_visitors || 0,
        totalUsers: totalUsers.count || 0,
        totalVisitors: totalVisitors.count || 0,
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
