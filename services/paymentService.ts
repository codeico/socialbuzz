import { supabase } from '@/lib/supabase';
import { createPaymentRequest, checkPaymentStatus } from '@/lib/duitku';
import { Transaction, Donation, PayoutRequest } from '@/types/payment';
import { PaginatedResponse, PaginationParams } from '@/types/common';

export class PaymentService {
  static async createDonation(data: {
    donorId: string;
    recipientId: string;
    amount: number;
    paymentMethod: string;
    message?: string;
    isAnonymous?: boolean;
  }): Promise<{ transaction: Transaction; paymentUrl: string } | null> {
    try {
      const { donorId, recipientId, amount, paymentMethod, message, isAnonymous } = data;

      const merchantOrderId = `DN-${donorId}-${Date.now()}`;

      const { data: transaction, error } = await supabase
        .from('transactions')
        .insert({
          user_id: donorId,
          recipient_id: recipientId,
          type: 'donation',
          amount,
          currency: 'IDR',
          status: 'pending',
          payment_method: paymentMethod,
          merchant_order_id: merchantOrderId,
          description: 'Donation',
          metadata: { message, isAnonymous },
        })
        .select()
        .single();

      if (error) throw error;

      const donor = await supabase.from('users').select('email, full_name').eq('id', donorId).single();

      if (!donor.data) throw new Error('Donor not found');

      const paymentResponse = await createPaymentRequest({
        paymentAmount: amount,
        paymentMethod,
        merchantOrderId,
        productDetails: 'Donation',
        customerEmail: donor.data.email,
        customerName: donor.data.full_name,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/payment/callback`,
        returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      });

      if (paymentResponse.statusCode !== '00') {
        throw new Error('Payment creation failed');
      }

      return {
        transaction,
        paymentUrl: paymentResponse.paymentUrl!,
      };
    } catch (error) {
      console.error('Error creating donation:', error);
      return null;
    }
  }

  static async getTransactions(userId: string, params: PaginationParams = {}): Promise<PaginatedResponse<Transaction>> {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('transactions')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  static async getTransactionById(id: string): Promise<Transaction | null> {
    try {
      const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();

      if (error) return null;
      return data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      return null;
    }
  }

  static async updateTransactionStatus(id: string, status: Transaction['status']): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          status,
          updated_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      return false;
    }
  }

  static async getDonations(userId: string, params: PaginationParams = {}): Promise<PaginatedResponse<Donation>> {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabase
        .from('donations')
        .select('*', { count: 'exact' })
        .eq('recipient_id', userId)
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Error fetching donations:', error);
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  static async createPayoutRequest(data: {
    userId: string;
    amount: number;
    bankAccount: PayoutRequest['bankAccount'];
  }): Promise<PayoutRequest | null> {
    try {
      const { userId, amount, bankAccount } = data;

      const { data: user } = await supabase.from('users').select('balance').eq('id', userId).single();

      if (!user || user.balance < amount) {
        throw new Error('Insufficient balance');
      }

      const { data: payout, error } = await supabase
        .from('payout_requests')
        .insert({
          user_id: userId,
          amount,
          currency: 'IDR',
          bank_account: bankAccount,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      await supabase.rpc('decrement_user_balance', {
        user_id: userId,
        amount: amount,
      });

      return payout;
    } catch (error) {
      console.error('Error creating payout request:', error);
      return null;
    }
  }

  static async getPayoutRequests(
    userId?: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<PayoutRequest>> {
    try {
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = params;
      const offset = (page - 1) * limit;

      let query = supabase.from('payout_requests').select('*', { count: 'exact' });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error, count } = await query
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const total = count || 0;
      const totalPages = Math.ceil(total / limit);

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      return {
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  }

  static async updatePayoutStatus(id: string, status: PayoutRequest['status'], notes?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('payout_requests')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString(),
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', id);

      return !error;
    } catch (error) {
      console.error('Error updating payout status:', error);
      return false;
    }
  }

  static async checkTransactionStatus(merchantOrderId: string): Promise<any> {
    try {
      return await checkPaymentStatus(merchantOrderId);
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return null;
    }
  }
}
