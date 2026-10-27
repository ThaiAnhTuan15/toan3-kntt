import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { accountId, username, pin } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Thiếu tên đăng nhập!' }, { status: 400 });
    }
    username = username.trim().toLowerCase();

    // Query Neon DB for the latest account record
    let rows: any[] = [];
    if (accountId) {
      rows = await queryNeon(
        `SELECT id, username, pin, nickname, avatar, data, active_session, updated_at
         FROM student_accounts
         WHERE id = $1 AND LOWER(username) = LOWER($2)
         LIMIT 1;`,
        [accountId, username]
      );
    } else {
      rows = await queryNeon(
        `SELECT id, username, pin, nickname, avatar, data, active_session, updated_at
         FROM student_accounts
         WHERE LOWER(username) = LOWER($1)
         LIMIT 1;`,
        [username]
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Không tìm thấy tài khoản "${username}".` 
      }, { status: 404 });
    }

    const account = rows[0];

    // Optional PIN verification if provided
    if (pin && String(pin).trim() !== String(account.pin).trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mật khẩu xác thực không đúng!' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Làm mới dữ liệu tài khoản thành công!',
      account: {
        id: account.id,
        username: account.username,
        pin: account.pin,
        nickname: account.nickname,
        avatar: account.avatar,
        data: account.data || {},
        updatedAt: account.updated_at
      }
    });

  } catch (error: any) {
    console.error('Refresh API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi làm mới dữ liệu!'
    }, { status: 500 });
  }
}
