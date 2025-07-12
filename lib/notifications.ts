import { supabaseAdmin } from './supabase';

export interface NotificationData {
  user_id: string;
  type: 'donation' | 'follow' | 'system' | 'payout' | 'verification';
  title: string;
  message: string;
  data?: Record<string, any>;
  action_url?: string;
}

export async function createNotification(notificationData: NotificationData) {
  try {
    const { data: notification, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        ...notificationData,
        is_read: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export async function createDonationNotification(
  creatorId: string,
  donorName: string,
  amount: number,
  message?: string,
  isAnonymous: boolean = false,
) {
  const displayName = isAnonymous ? 'Anonymous' : donorName;
  const notificationTitle = 'New donation received!';
  const notificationMessage = message
    ? `${displayName} donated Rp ${amount.toLocaleString()} with message: "${message}"`
    : `${displayName} donated Rp ${amount.toLocaleString()}`;

  return createNotification({
    user_id: creatorId,
    type: 'donation',
    title: notificationTitle,
    message: notificationMessage,
    data: {
      amount,
      donor_name: donorName,
      is_anonymous: isAnonymous,
      message,
    },
    action_url: '/dashboard/donations',
  });
}

export async function createPayoutNotification(
  userId: string,
  amount: number,
  status: 'pending' | 'completed' | 'failed',
) {
  const statusText = {
    pending: 'is being processed',
    completed: 'has been completed successfully',
    failed: 'has failed. Please contact support.',
  };

  return createNotification({
    user_id: userId,
    type: 'payout',
    title: `Payout ${status}`,
    message: `Your payout of Rp ${amount.toLocaleString()} ${statusText[status]}`,
    data: { amount, status },
    action_url: '/dashboard/payouts',
  });
}

export async function createSystemNotification(userId: string, title: string, message: string, actionUrl?: string) {
  return createNotification({
    user_id: userId,
    type: 'system',
    title,
    message,
    action_url: actionUrl,
  });
}

export async function createVerificationNotification(userId: string, status: 'approved' | 'rejected') {
  const title = status === 'approved' ? 'Account Verified!' : 'Verification Request Rejected';

  const message =
    status === 'approved'
      ? 'Congratulations! Your account has been verified. You now have a verified badge.'
      : 'Your verification request has been rejected. Please check your profile and try again.';

  return createNotification({
    user_id: userId,
    type: 'verification',
    title,
    message,
    data: { status },
    action_url: '/dashboard/settings',
  });
}
