import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get all payment-related settings for debugging
    const { data: settings, error } = await supabaseAdmin
      .from('system_settings')
      .select('key, value, type, is_public')
      .eq('category', 'payment')
      .order('key');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch settings', details: error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: settings,
      count: settings?.length || 0
    });
  } catch (error) {
    console.error('Debug settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch debug settings' }, { status: 500 });
  }
}