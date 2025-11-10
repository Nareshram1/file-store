import { SignJWT } from 'jose';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

// This function securely compares the attempted password with the real one.
// Using a simple '===' can lead to "timing attacks".
async function verifyPassword(attempt) {
  const realPassword = process.env.SITE_PASSWORD;
  
  // This is a more secure way to compare strings
  if (realPassword && realPassword.length === attempt.length) {
    let equivalent = true;
    for (let i = 0; i < realPassword.length; i++) {
      if (realPassword[i] !== attempt[i]) {
        equivalent = false;
      }
    }
    return equivalent;
  }
  return false;
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    // 1. Verify the password
    const isVerified = await verifyPassword(password);

    if (!isVerified) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // 2. Create a secure session token (JWT)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ loggedIn: true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h') // Token is valid for 8 hours
      .sign(secret);

    // 3. Set the token in a secure, HttpOnly cookie
    const cookie = serialize('session', token, {
      httpOnly: true,     // Prevents client-side JS from reading it
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
      maxAge: 60 * 60 * 8,  // 8 hours
      path: '/',          // Available for the whole site
      sameSite: 'strict', // Helps prevent CSRF
    });

    return NextResponse.json({ success: true }, {
      headers: { 'Set-Cookie': cookie },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}