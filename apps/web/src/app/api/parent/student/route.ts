import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { username, parentPin } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập tên đăng nhập của bé!' }, { status: 400 });
    }
    username = username.trim().toLowerCase();

    if (!parentPin || typeof parentPin !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập mã PIN phụ huynh (Mặc định: 2026 hoặc mã 4 số của bé)!' }, { status: 400 });
    }
    parentPin = parentPin.trim();

    // Query student account from Neon DB
    const rows = await queryNeon(
      `SELECT id, username, pin, nickname, avatar, data, created_at, updated_at
       FROM student_accounts
       WHERE LOWER(username) = LOWER($1)
       LIMIT 1;`,
      [username]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Không tìm thấy tài khoản học sinh "${username}". Ba Mẹ hãy kiểm tra lại tên đăng nhập của bé nhé!` 
      }, { status: 404 });
    }

    const account = rows[0];

    // Parent PIN verification: Accept default '2026' OR the student's own PIN
    if (parentPin !== '2026' && parentPin !== account.pin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mã PIN phụ huynh không đúng! (Ba Mẹ có thể dùng mã mặc định 2026 hoặc mã 4 số của bé)' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Xác thực tài khoản phụ huynh thành công!',
      student: {
        id: account.id,
        username: account.username,
        pin: account.pin,
        nickname: account.nickname,
        avatar: account.avatar,
        data: account.data || {},
        createdAt: account.created_at,
        updatedAt: account.updated_at
      }
    });

  } catch (error: any) {
    console.error('Parent Student API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi tải dữ liệu học sinh!'
    }, { status: 500 });
  }
}
