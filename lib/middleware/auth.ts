import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: number;
  uuid: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SECURITY';
}

export const verifyAuth = (request: NextRequest): AuthPayload | null => {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as AuthPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

export const requireAuth = (handler: Function) => {
  return async (request: NextRequest) => {
    const user = verifyAuth(request);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Store user in request for use in handler
    (request as any).user = user;
    return handler(request);
  };
};

export const requireRole = (...roles: string[]) => {
  return (handler: Function) => {
    return async (request: NextRequest) => {
      const user = verifyAuth(request);

      if (!user || !roles.includes(user.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      (request as any).user = user;
      return handler(request);
    };
  };
};
