export interface DuitkuPaymentRequest {
  paymentAmount: number;
  paymentMethod: string;
  merchantOrderId: string;
  productDetails: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  callbackUrl: string;
  returnUrl: string;
  expiryPeriod?: number;
}

export interface DuitkuPaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentUrl?: string;
  reference?: string;
  vaNumber?: string;
  amount?: number;
}

export interface PaymentCallback {
  merchantCode: string;
  amount: number;
  merchantOrderId: string;
  productDetail: string;
  additionalParam: string;
  paymentCode: string;
  resultCode: string;
  merchantUserId: string;
  reference: string;
  signature: string;
  publisherOrderId: string;
  spUserHash: string;
  settlementDate: string;
  issuerCode: string;
}

export interface Transaction {
  id: string;
  userId: string;
  recipientId?: string;
  type: 'donation' | 'payout' | 'fee';
  amount: number;
  currency: 'IDR';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  merchantOrderId: string;
  reference?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  recipientId: string;
  amount: number;
  currency: 'IDR';
  message?: string;
  isAnonymous: boolean;
  transactionId: string;
  createdAt: string;
}

export interface PayoutRequest {
  id: string;
  userId: string;
  amount: number;
  currency: 'IDR';
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  processedBy?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}