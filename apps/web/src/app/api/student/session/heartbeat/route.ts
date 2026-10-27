import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, sessionId } = body;

    if (!accountId || !sessionId) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin phiên!' }, { status: 400 });
    }

    const rows = await queryNeon(
      `SELECT active_session, data FROM student_accounts WHERE id = $1 LIMIT 1;`,
      [accountId]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tài khoản không tồn tại!' }, { status: 404 });
    }

    const currentSession = rows[0].active_session;
    const accountData = rows[0].data || {};

    // Nếu không có phiên hoặc sessionId khác -> phiên đã bị chuyển sang máy khác
    if (!currentSession || currentSession.sessionId !== sessionId) {
      return NextResponse.json({ 
        success: false, 
        active: false, 
        reason: 'transferred',
        message: 'Tài khoản đã được chuyển sang thiết bị khác!' 
      });
    }

    // Cập nhật nhịp tim lastHeartbeatAt
    const now = Date.now();
    const updatedSession = {
      ...currentSession,
      lastHeartbeatAt: now
    };

    await queryNeon(
      `UPDATE student_accounts SET active_session = $2::jsonb WHERE id = $1;`,
      [accountId, JSON.stringify(updatedSession)]
    );

    return NextResponse.json({ 
      success: true, 
      active: true, 
      timestamp: now,
      piggyBalance: typeof accountData.piggyBalance === 'number' ? accountData.piggyBalance : 0,
      coins: typeof accountData.coins === 'number' ? accountData.coins : 50,
      resetVersion: accountData.resetVersion || 0,
      accountData: accountData
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
