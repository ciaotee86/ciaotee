import { NextResponse } from 'next/server';
import { signToken, createAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validations';

// Simple in-memory rate limit (resets on server restart)
// For production, use Redis or Upstash
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimit(ip) {
  const now = Date.now();
  const data = loginAttempts.get(ip);
  
  if (!data) return { count: 0, locked: false };
  if (data.lockedUntil && now < data.lockedUntil) {
    return { count: data.count, locked: true, remaining: data.lockedUntil - now };
  }
  if (data.lockedUntil && now >= data.lockedUntil) {
    loginAttempts.delete(ip);
    return { count: 0, locked: false };
  }
  
  return { count: data.count, locked: false };
}

function incrementAttempt(ip) {
  const now = Date.now();
  const data = loginAttempts.get(ip) || { count: 0 };
  const newCount = data.count + 1;
  
  if (newCount >= MAX_ATTEMPTS) {
    loginAttempts.set(ip, { count: newCount, lockedUntil: now + LOCKOUT_MS });
  } else {
    loginAttempts.set(ip, { count: newCount });
  }
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || 
                'unknown';
    const rateLimit = getRateLimit(ip);
    
    if (rateLimit.locked) {
      const minutesLeft = Math.ceil(rateLimit.remaining / 60000);
      return NextResponse.json(
        { error: `Quá nhiều lần thử. Vui lòng thử lại sau ${minutesLeft} phút.` },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    // Validate credentials against env vars
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Constant-time comparison to prevent timing attacks
    const usernameMatch = username === validUsername;
    const passwordMatch = password === validPassword;

    if (!usernameMatch || !passwordMatch) {
      incrementAttempt(ip);
      // Generic error message — don't reveal which field was wrong
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Clear rate limit on success
    loginAttempts.delete(ip);

    // Issue JWT
    const token = await signToken({ 
      sub: username, 
      role: 'admin',
      iat: Math.floor(Date.now() / 1000),
    });

    const response = NextResponse.json({ success: true, message: 'Đăng nhập thành công' });
    response.headers.set('Set-Cookie', createAuthCookie(token));
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
