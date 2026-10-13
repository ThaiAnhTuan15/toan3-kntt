import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, username, pin, data } = body;

    if (!accountId || !username || !pin) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin xác thực tài khoản!' }, { status: 400 });
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ success: false, error: 'Dữ liệu đồng bộ không hợp lệ!' }, { status: 400 });
    }

    // Verify account exists and PIN matches
    const rows = await queryNeon(
      `SELECT id, pin FROM student_accounts WHERE id = $1 AND LOWER(username) = LOWER($2) LIMIT 1;`,
      [accountId, username.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tài khoản không tồn tại!' }, { status: 404 });
    }

    if (rows[0].pin !== pin.trim()) {
      return NextResponse.json({ success: false, error: 'Mật khẩu xác thực không đúng!' }, { status: 401 });
    }

    // Update data
    await queryNeon(
      `UPDATE student_accounts
       SET data = $2::jsonb, updated_at = NOW()
       WHERE id = $1;`,
      [accountId, JSON.stringify(data)]
    );

    return NextResponse.json({
      success: true,
      message: 'Đồng bộ dữ liệu đám mây thành công!',
      syncedAt: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Sync API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi đồng bộ dữ liệu!'
    }, { status: 500 });
  }
}
