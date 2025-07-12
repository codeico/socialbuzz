import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role, email')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const emailSettings = await request.json();

    // Validate email settings
    if (!emailSettings.smtp_host || !emailSettings.smtp_username || !emailSettings.smtp_password) {
      return NextResponse.json(
        { error: 'Missing required email configuration' },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: emailSettings.smtp_host,
      port: emailSettings.smtp_port,
      secure: emailSettings.smtp_secure,
      auth: {
        user: emailSettings.smtp_username,
        pass: emailSettings.smtp_password,
      },
    });

    // Test email content
    const testEmail = {
      from: `${emailSettings.from_name} <${emailSettings.from_email}>`,
      to: user.email,
      subject: 'SocialBuzz Email Configuration Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Email Configuration Test</h2>
          <p>Hello,</p>
          <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>SMTP Host: ${emailSettings.smtp_host}</li>
            <li>SMTP Port: ${emailSettings.smtp_port}</li>
            <li>Secure Connection: ${emailSettings.smtp_secure ? 'Yes' : 'No'}</li>
            <li>From Email: ${emailSettings.from_email}</li>
          </ul>
          <p>If you received this email, your SMTP configuration is working properly!</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from the SocialBuzz admin panel by ${user.email}<br>
            Time: ${new Date().toISOString()}
          </p>
        </div>
      `,
    };

    // Send test email
    await transporter.sendMail(testEmail);

    // Log the test
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: decoded.userId,
        action: 'email_test',
        details: {
          smtp_host: emailSettings.smtp_host,
          test_sent_to: user.email,
          timestamp: new Date().toISOString(),
        },
      });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${user.email}`,
    });
  } catch (error) {
    console.error('Email test error:', error);
    
    let errorMessage = 'Failed to send test email';
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Authentication failed')) {
        errorMessage = 'SMTP authentication failed. Please check your username and password.';
      } else if (error.message.includes('Connection timeout')) {
        errorMessage = 'Connection timeout. Please check your SMTP host and port.';
      } else if (error.message.includes('ENOTFOUND')) {
        errorMessage = 'SMTP host not found. Please check your SMTP host address.';
      } else if (error.message.includes('ECONNREFUSED')) {
        errorMessage = 'Connection refused. Please check your SMTP host and port.';
      } else {
        errorMessage = `SMTP Error: ${error.message}`;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}