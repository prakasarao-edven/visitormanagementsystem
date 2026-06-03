import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db/connection';
import { verifyAuth } from '@/lib/middleware/auth';
import { generateVisitNumber, generateQRToken } from '@/lib/utils/codeGenerator';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { visitorId, purposeId, personToMeet, remarks } = await request.json();

    if (!visitorId || !purposeId) {
      return NextResponse.json(
        { error: 'Visitor ID and purpose are required' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    try {
      const visitNumber = generateVisitNumber();
      const qrToken = generateQRToken();

      const [result] = await connection.query(
        `INSERT INTO visits (visit_number, visitor_id, purpose_id, person_to_meet, remarks, qr_token, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [visitNumber, visitorId, purposeId, personToMeet || null, remarks || null, qrToken, user.id]
      );

      const visitId = (result as any).insertId;

      // Generate QR Code
      const qrImageUrl = await QRCode.toDataURL(qrToken);

      // Store QR code info
      await connection.query(
        `INSERT INTO qr_codes (visit_id, qr_token, qr_image_url, expires_at)
         VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR))`,
        [visitId, qrToken, qrImageUrl, process.env.QR_EXPIRY_HOURS || 24]
      );

      return NextResponse.json(
        {
          message: 'Visit created successfully',
          visitNumber,
          visitId,
          qrCode: qrImageUrl,
        },
        { status: 201 }
      );
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create visit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
