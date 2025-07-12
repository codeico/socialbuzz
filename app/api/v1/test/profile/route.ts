import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'bangcode';

    console.log(`Testing profile API for username: ${username}`);

    // Test the profile API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const profileResponse = await fetch(`${baseUrl}/api/v1/users/username/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const profileData = await profileResponse.json();

    return NextResponse.json({
      success: true,
      message: `Profile API test for ${username}`,
      data: {
        status: profileResponse.status,
        statusText: profileResponse.statusText,
        response: profileData,
      },
    });
  } catch (error) {
    console.error('Profile API test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Profile API test failed',
      details: error.message,
    }, { status: 500 });
  }
}