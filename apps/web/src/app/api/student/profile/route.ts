import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountId, username, pin, nickname, avatar, newPin } = body;

    if (!accountId || !username || !pin) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin xác thực tài khoản!' }, { status: 400 });
    }

    const rows = await queryNeon(
      `SELECT id, pin, nickname, avatar FROM student_accounts WHERE id = $1 AND LOWER(username) = LOWER($2) LIMIT 1;`,
      [accountId, username.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Tài khoản không tồn tại!' }, { status: 404 });
    }

    if (rows[0].pin !== pin.trim()) {
      return NextResponse.json({ success: false, error: 'Mật khẩu xác thực không đúng!' }, { status: 401 });
    }

    let updatedPin = rows[0].pin;
    if (newPin && typeof newPin === 'string') {
      if (!/^\d{4}$/.test(newPin.trim())) {
        return NextResponse.json({ success: false, error: 'Mật khẩu mới phải là 4 chữ số!' }, { status: 400 });
      }
      updatedPin = newPin.trim();
    }

    const updatedNickname = (nickname && typeof nickname === 'string' && nickname.trim()) 
      ? nickname.trim().slice(0, 50) 
      : rows[0].nickname;

    const updatedAvatar = (avatar && typeof avatar === 'string') 
      ? avatar 
      : rows[0].avatar;

    const updatedRows = await queryNeon(
      `UPDATE student_accounts
       SET nickname = $2, avatar = $3, pin = $4, updated_at = NOW()
       WHERE id = $1
       RETURNING id, username, pin, nickname, avatar;`,
      [accountId, updatedNickname, updatedAvatar, updatedPin]
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin thành công!',
      account: updatedRows[0]
    });

  } catch (error: any) {
    console.error('Profile Update API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi cập nhật hồ sơ!'
    }, { status: 500 });
  }
}
