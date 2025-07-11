export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          full_name: string;
          avatar: string | null;
          role: 'user' | 'admin' | 'super_admin';
          is_verified: boolean;
          balance: number;
          total_earnings: number;
          total_donations: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          full_name: string;
          avatar?: string | null;
          role?: 'user' | 'admin' | 'super_admin';
          is_verified?: boolean;
          balance?: number;
          total_earnings?: number;
          total_donations?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          full_name?: string;
          avatar?: string | null;
          role?: 'user' | 'admin' | 'super_admin';
          is_verified?: boolean;
          balance?: number;
          total_earnings?: number;
          total_donations?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          bio: string | null;
          website: string | null;
          location: string | null;
          social_links: Record<string, any> | null;
          bank_account: Record<string, any> | null;
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          social_links?: Record<string, any> | null;
          bank_account?: Record<string, any> | null;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          social_links?: Record<string, any> | null;
          bank_account?: Record<string, any> | null;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          recipient_id: string | null;
          type: 'donation' | 'payout' | 'fee';
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'cancelled';
          payment_method: string;
          merchant_order_id: string;
          reference: string | null;
          description: string;
          metadata: Record<string, any> | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipient_id?: string | null;
          type: 'donation' | 'payout' | 'fee';
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          payment_method: string;
          merchant_order_id: string;
          reference?: string | null;
          description: string;
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          recipient_id?: string | null;
          type?: 'donation' | 'payout' | 'fee';
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'cancelled';
          payment_method?: string;
          merchant_order_id?: string;
          reference?: string | null;
          description?: string;
          metadata?: Record<string, any> | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_id: string;
          recipient_id: string;
          amount: number;
          currency: string;
          message: string | null;
          is_anonymous: boolean;
          transaction_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          recipient_id: string;
          amount: number;
          currency?: string;
          message?: string | null;
          is_anonymous?: boolean;
          transaction_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          recipient_id?: string;
          amount?: number;
          currency?: string;
          message?: string | null;
          is_anonymous?: boolean;
          transaction_id?: string;
          created_at?: string;
        };
      };
      payout_requests: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          currency: string;
          bank_account: Record<string, any>;
          status: 'pending' | 'approved' | 'rejected' | 'completed';
          notes: string | null;
          processed_by: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          currency?: string;
          bank_account: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected' | 'completed';
          notes?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          currency?: string;
          bank_account?: Record<string, any>;
          status?: 'pending' | 'approved' | 'rejected' | 'completed';
          notes?: string | null;
          processed_by?: string | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      site_config: {
        Row: {
          id: string;
          key: string;
          value: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}