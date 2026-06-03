import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = (users as any[])[0];

      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const passwordMatch = await bcryptjs.compare(password, user.password);
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      if (!user.status) {
        return NextResponse.json({ error: 'User account is disabled' }, { status: 403 });
      }

      const token = jwt.sign(
        {
          id: user.id,
          uuid: user.uuid,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );

      // Update last login
      await connection.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
