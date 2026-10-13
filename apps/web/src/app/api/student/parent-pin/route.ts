import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { accountId, username, newParentPin } = await request.json();

    if (!accountId || !username || !newParentPin) {
      return NextResponse.json({ success: false, error: 'Thiếu thông tin cập nhật!' }, { status: 400 });
    }

    const cleanNewPin = String(newParentPin).trim();
    if (!/^\d{4}$/.test(cleanNewPin)) {
      return NextResponse.json({ success: false, error: 'Mã PIN Ba Mẹ phải có đúng 4 chữ số!' }, { status: 400 });
    }

    // Lấy tài khoản hiện tại
    const rows = await queryNeon(
      `SELECT id, username, pin, data FROM student_accounts WHERE id = $1 AND LOWER(username) = LOWER($2) LIMIT 1;`,
      [accountId, username.trim()]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tài khoản học sinh!' }, { status: 404 });
    }

    const account = rows[0];

    // Không được trùng với mật khẩu của bé
    if (cleanNewPin === account.pin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mã PIN Ba Mẹ không được trùng với mật khẩu của bé!' 
      }, { status: 400 });
    }

    const curData = account.data || {};
    curData.parentPin = cleanNewPin;

    await queryNeon(
      `UPDATE student_accounts SET data = $2::jsonb, updated_at = NOW() WHERE id = $1;`,
      [account.id, JSON.stringify(curData)]
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật mã PIN Ba Mẹ thành công!',
      parentPin: cleanNewPin
    });

  } catch (error: any) {
    console.error('Parent PIN API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi cập nhật mã PIN Ba Mẹ!'
    }, { status: 500 });
  }
}
