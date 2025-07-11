import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateResetToken } from '@/lib/auth';
import { ForgotPasswordRequest } from '@/types/user';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body: ForgotPasswordRequest = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 },
      );
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name')
      .eq('email', email)
      .single();

    if (error || !user) {
      // Don't reveal if email exists for security
      return NextResponse.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const resetToken = generateResetToken(email);

    // Store reset token in database
    await supabase.from('password_reset_tokens').insert({
      user_id: user.id,
      token: resetToken,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
    });

    // In production, send email with reset link
    // For now, we'll just return success
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return NextResponse.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
