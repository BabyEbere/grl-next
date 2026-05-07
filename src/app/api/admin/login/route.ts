import { NextResponse } from 'next/server';
import { PHP_API_URL } from '@/lib/config';
import { createSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const resp = await fetch(`${PHP_API_URL}?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await resp.json();

    if (data.success) {
       await createSession({
         username: data.user.username,
         role: data.user.role,
         permissions: data.user.permissions
       });
       return NextResponse.json({ message: 'Login successful', user: data.user });
    }

    return NextResponse.json({ message: data.message || 'Invalid credentials' }, { status: 401 });
  } catch (e) {
    console.error('Login API Error:', e);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
