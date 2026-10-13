import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, sessionId } = body;

    if (accountId) {
      await queryNeon(
        `UPDATE student_accounts
         SET active_session = NULL
         WHERE id = $1 AND (active_session->>'sessionId' = $2 OR active_session IS NULL);`,
        [accountId, sessionId || '']
      );
    }

    return NextResponse.json({ success: true, message: 'Đã giải phóng phiên đăng nhập!' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
