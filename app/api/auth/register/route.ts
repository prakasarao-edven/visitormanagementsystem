import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';
import bcryptjs from 'bcryptjs';
import { generateUUID } from '@/lib/utils/codeGenerator';

export async function POST(request: NextRequest) {
  try {
    // Verify that only SUPER_ADMIN can register users
    const user = verifyAuth(request);
    if (!user || user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, phone, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const uuid = generateUUID();

      await connection.query(
        'INSERT INTO users (uuid, name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)',
        [uuid, name, email, phone || null, hashedPassword, role]
      );

      return NextResponse.json(
        { message: 'User registered successfully' },
        { status: 201 }
      );
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
