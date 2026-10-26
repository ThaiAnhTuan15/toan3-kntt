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
      return NextResponse.json({ success: false, error: 'Vui lòng nhập mã PIN phụ huynh!' }, { status: 400 });
    }
    parentPin = parentPin.trim();

    // Query student account from Neon DB
    let rows = await queryNeon(
      `SELECT id, username, pin, nickname, avatar, data, created_at, updated_at
       FROM student_accounts
       WHERE LOWER(username) = LOWER($1)
       LIMIT 1;`,
      [username]
    );

    if (!rows || rows.length === 0) {
      try {
        const hocRows = await queryNeon(
          `SELECT id, username, pin, nickname, avatar, data, active_session, created_at, updated_at
           FROM hoc12nam_student_accounts
           WHERE LOWER(username) = LOWER($1)
           LIMIT 1;`,
          [username]
        );
        if (hocRows && hocRows.length > 0) {
          const hocAcc = hocRows[0];
          await queryNeon(
            `INSERT INTO student_accounts (id, username, pin, nickname, avatar, data, active_session, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, NOW(), NOW())
             ON CONFLICT (id) DO UPDATE 
             SET pin = $3, nickname = $4, avatar = $5, data = $6::jsonb, active_session = $7::jsonb, updated_at = NOW();`,
            [
              hocAcc.id,
              hocAcc.username,
              hocAcc.pin,
              hocAcc.nickname,
              hocAcc.avatar,
              JSON.stringify(hocAcc.data || {}),
              hocAcc.active_session ? JSON.stringify(hocAcc.active_session) : null
            ]
          );
          rows = hocRows;
        }
      } catch (e) {
        console.warn('Fallback parent query hoc12nam_student_accounts error:', e);
      }
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Không tìm thấy tài khoản học sinh "${username}". Ba Mẹ hãy kiểm tra lại tên đăng nhập của bé nhé!` 
      }, { status: 404 });
    }

    const account = rows[0];
    const accountData = account.data || {};
    const expectedParentPin = accountData.parentPin || '2026';

    // Không được dùng mật khẩu của bé để vào cổng cha mẹ
    if (parentPin === account.pin && account.pin !== expectedParentPin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Đây là mật khẩu của bé! Vui lòng nhập mật khẩu riêng của Cha Mẹ.' 
      }, { status: 401 });
    }

    // Xác thực mã PIN phụ huynh
    if (parentPin !== expectedParentPin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Mật khẩu cha mẹ không chính xác!' 
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
