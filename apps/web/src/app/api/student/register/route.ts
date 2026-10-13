import { NextResponse } from 'next/server';
import { queryNeon } from '@/lib/neonDb';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { username, pin, nickname, avatar } = body;

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập tên đăng nhập!' }, { status: 400 });
    }

    username = username.trim().toLowerCase();
    // Allow letters, numbers, underscores, dashes, length 2 to 30
    if (!/^[a-z0-9_-]{2,30}$/.test(username)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tên đăng nhập từ 2-30 ký tự, viết liền không dấu, chỉ gồm chữ, số hoặc dấu gạch dưới (VD: bebi, chip2016)!' 
      }, { status: 400 });
    }

    if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin.trim())) {
      return NextResponse.json({ success: false, error: 'Mật khẩu phải là 4 chữ số (VD: 1234)!' }, { status: 400 });
    }
    pin = pin.trim();

    if (!nickname || typeof nickname !== 'string' || !nickname.trim()) {
      nickname = username;
    } else {
      nickname = nickname.trim().slice(0, 50);
    }

    if (!avatar || typeof avatar !== 'string') {
      avatar = '🐯';
    }

    // Check if username already exists
    const existing = await queryNeon(
      'SELECT id FROM student_accounts WHERE LOWER(username) = LOWER($1) LIMIT 1;',
      [username]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Tên đăng nhập "${username}" đã có bạn đăng ký rồi. Bé hãy chọn tên khác nhé!` 
      }, { status: 409 });
    }

    const id = 'st_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    let studentData = body.initialData;
    if (!studentData || typeof studentData !== 'object') {
      studentData = {
        currentGrade: '4',
        currentSubject: 'math',
        g4MathProgress: { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
        g4TvProgress: { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
        g7MathProgress: { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
        g7LitProgress: { 1: { bestScore: 0, stars: 0, attempts: 0, unlocked: true } },
        history: [],
        wrongG4Math: [],
        wrongG4Tv: [],
        wrongG7Math: [],
        wrongG7Lit: [],
        badges: [],
        streakData: { currentStreak: 1, lastDate: new Date().toISOString().split('T')[0] },
        coins: 50,
        piggyBalance: 0,
        piggyHistory: [],
        piggyRequests: [],
        claimedStages: [],
        claimedFinal: false,
        reportedQuestions: [],
        verifiedErrorIds: []
      };
    }

    const inserted = await queryNeon(
      `INSERT INTO student_accounts (id, username, pin, nickname, avatar, data)
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       RETURNING id, username, pin, nickname, avatar, data, created_at, updated_at;`,
      [id, username, pin, nickname, avatar, JSON.stringify(studentData)]
    );

    if (!inserted || inserted.length === 0) {
      throw new Error('Could not insert student account');
    }

    const account = inserted[0];
    return NextResponse.json({
      success: true,
      message: 'Đăng ký tài khoản thành công!',
      account: {
        id: account.id,
        username: account.username,
        pin: account.pin,
        nickname: account.nickname,
        avatar: account.avatar,
        data: account.data || studentData
      }
    });

  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Lỗi hệ thống khi đăng ký tài khoản. Vui lòng thử lại!'
    }, { status: 500 });
  }
}
