import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(request: NextRequest) {
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
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || !['admin', 'super_admin'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { userIds, action } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'User IDs array is required' }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
    case 'verify':
      updateData.is_verified = true;
      break;

    case 'unverify':
      updateData.is_verified = false;
      break;

    case 'delete':
      // Only super admin can bulk delete
      if (user.role !== 'super_admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Prevent self-deletion
      if (userIds.includes(decoded.userId)) {
        return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
      }

      const { error: deleteError } = await supabaseAdmin.from('users').delete().in('id', userIds);

      if (deleteError) {
        throw deleteError;
      }

      return NextResponse.json({
        success: true,
        message: `${userIds.length} users deleted successfully`,
      });

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    // Update users
    const { data: updatedUsers, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .in('id', userIds)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `${updatedUsers?.length || 0} users updated successfully`,
      data: updatedUsers,
    });
  } catch (error) {
    console.error('Admin bulk user update error:', error);
    return NextResponse.json({ error: 'Failed to update users' }, { status: 500 });
  }
}
