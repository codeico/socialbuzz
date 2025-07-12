import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { action, value } = body;

    let updateData: any = {
      updated_at: new Date().toISOString(),
    };

    switch (action) {
      case 'toggle_verification':
        // Get current verification status first
        const { data: currentUser } = await supabaseAdmin
          .from('users')
          .select('is_verified')
          .eq('id', id)
          .single();
        
        updateData.is_verified = !currentUser?.is_verified;
        break;

      case 'verify':
        updateData.is_verified = true;
        break;

      case 'unverify':
        updateData.is_verified = false;
        break;

      case 'change_role':
        if (!value || !['user', 'admin', 'super_admin'].includes(value)) {
          return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
          );
        }
        updateData.role = value;
        break;

      case 'update_balance':
        if (typeof value !== 'number') {
          return NextResponse.json(
            { error: 'Invalid balance amount' },
            { status: 400 }
          );
        }
        updateData.balance = value;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update user
    const { data: updatedUser, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Remove password_hash from response
    const { password_hash, ...sanitizedUser } = updatedUser;

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: sanitizedUser,
    });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is super admin (only super admin can delete users)
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', decoded.userId)
      .single();

    if (userError || user.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;

    // Prevent self-deletion
    if (id === decoded.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user (this will cascade delete related records due to foreign key constraints)
    const { error } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Admin user deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}