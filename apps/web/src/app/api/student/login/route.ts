import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { username, pin, sessionId, deviceInfo, forceTransfer, parentPin } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập tên đăng nhập!' }, { status: 400 });
    }
    username = username.trim().toLowerCase();

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập mật khẩu 4 số!' }, { status: 400 });
    }
    pin = pin.trim();

    const rows = await queryNeon(
      `SELECT id, username, pin, nickname, avatar, data, active_session, updated_at
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

    // SESSION LOCK CHECK
    const currentSession = account.active_session;
    const now = Date.now();
    const mySessionId = sessionId || `sess_${now}_${Math.random().toString(36).slice(2, 8)}`;
    const myDevice = deviceInfo || 'Trình duyệt Web';

    if (currentSession && currentSession.sessionId && currentSession.sessionId !== mySessionId) {
      const lastHeartbeat = typeof currentSession.lastHeartbeatAt === 'number' 
        ? currentSession.lastHeartbeatAt 
        : new Date(currentSession.lastHeartbeatAt || 0).getTime();
      const diffSec = Math.round((now - lastHeartbeat) / 1000);

      // Nếu máy kia có tín hiệu hoạt động trong vòng 90 giây:
      if (diffSec < 90) {
                if (forceTransfer) {
          // Bé có thể chủ động chuyển máy bằng mã PIN của bé HOẶC mã PIN của Ba Mẹ
          const cleanTransferPin = (parentPin || '').trim();
          const expectedParentPin = String(account.data?.parentPin || '2026').trim();
          const expectedStudentPin = String(account.pin || '').trim();

          let isPinValid = false;
          if (cleanTransferPin) {
            isPinValid = cleanTransferPin === expectedStudentPin || cleanTransferPin === expectedParentPin;
          } else {
            isPinValid = cleanPin === expectedStudentPin;
          }

          if (!isPinValid) {
            return NextResponse.json({
              success: false,
              isSessionLocked: true,
              error: 'Mã PIN không chính xác! Bé có thể dùng mã PIN của bé hoặc mã Ba Mẹ để chuyển máy.'
            }, { status: 403 });
          }
          // Cho phép chuyển máy thành công!
        } else {
          // Khóa và cảnh báo không cho đăng nhập đồng thời
          return NextResponse.json({
            success: false,
            isSessionLocked: true,
            activeDevice: currentSession.device || 'Một máy tính khác',
            lastActiveSecondsAgo: Math.max(1, diffSec),
            error: `Tài khoản bé "${account.nickname || account.username}" đang mở học trên ${currentSession.device || 'một thiết bị khác'} (vừa hoạt động ${diffSec}s trước). Để bảo vệ bài thi, hệ thống không cho phép 2 máy cùng học một tài khoản!`
          }, { status: 409 });
        }
      }
    }

    // Cập nhật phiên đăng nhập mới
    const newSession = {
      sessionId: mySessionId,
      device: myDevice,
      loginAt: new Date().toISOString(),
      lastHeartbeatAt: now
    };

    await queryNeon(
      `UPDATE student_accounts
       SET active_session = $2::jsonb, updated_at = NOW()
       WHERE id = $1;`,
      [account.id, JSON.stringify(newSession)]
    );

    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công!',
      sessionId: mySessionId,
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
