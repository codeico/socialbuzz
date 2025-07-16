import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting database fix...');

    // 1. Set minimum_donation as public
    const { error: updateError1 } = await supabaseAdmin
      .from('system_settings')
      .update({ is_public: true })
      .eq('key', 'minimum_donation')
      .eq('category', 'payment');

    if (updateError1) {
      console.error('Error updating minimum_donation:', updateError1);
    } else {
      console.log('✅ Set minimum_donation as public');
    }

    // 2. Set other payment settings as public
    const { error: updateError2 } = await supabaseAdmin
      .from('system_settings')
      .update({ is_public: true })
      .in('key', ['maximum_donation', 'predefined_amounts', 'platform_fee_percentage', 'duitku_sandbox_mode'])
      .eq('category', 'payment');

    if (updateError2) {
      console.error('Error updating payment settings:', updateError2);
    } else {
      console.log('✅ Set payment settings as public');
    }

    // 3. Delete duplicate min_donation_amount
    const { error: deleteError } = await supabaseAdmin
      .from('system_settings')
      .delete()
      .eq('key', 'min_donation_amount')
      .eq('category', 'payment');

    if (deleteError) {
      console.error('Error deleting min_donation_amount:', deleteError);
    } else {
      console.log('✅ Deleted min_donation_amount duplicate');
    }

    // 4. Verify results
    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('system_settings')
      .select('key, value, is_public')
      .eq('category', 'payment')
      .like('key', '%donation%')
      .order('key');

    if (verifyError) {
      console.error('Error verifying results:', verifyError);
    }

    console.log('Database fix completed. Current donation settings:', verifyData);

    return NextResponse.json({
      success: true,
      message: 'Database fixed successfully',
      results: {
        updated_minimum_donation: !updateError1,
        updated_payment_settings: !updateError2,
        deleted_duplicate: !deleteError,
        current_settings: verifyData
      }
    });

  } catch (error) {
    console.error('Database fix error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fix database'
    }, { status: 500 });
  }
}