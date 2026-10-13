import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { username, pin } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập tên đăng nhập!' }, { status: 400 });
    }
    username = username.trim().toLowerCase();

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập mật khẩu 4 số!' }, { status: 400 });
    }
    pin = pin.trim();

    const rows = await queryNeon(
      `SELECT id, username, pin, nickname, avatar, data, updated_at
       FROM student_accounts
       WHERE LOWER(username) = LOWER($1)
       LIMIT 1;`,
      [username]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Không tìm thấy tài khoản "${username}". Bé hãy kiểm tra lại tên đăng nhập hoặc đăng ký tài khoản mới nhé!` 
      }, { status: 404 });
    }

    const account = rows[0];
    if (account.pin !== pin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mật khẩu 4 số chưa đúng. Bé hãy nhập lại nhé!' 
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      account: {
        id: account.id,
        username: account.username,
        pin: account.pin,
        nickname: account.nickname,
        avatar: account.avatar,
        data: account.data || {}
      }
    });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi đăng nhập. Vui lòng thử lại!'
    }, { status: 500 });
  }
}
