import crypto from 'crypto';
import axios from 'axios';
import { DuitkuPaymentRequest, DuitkuPaymentResponse, PaymentCallback } from '@/types/payment';

const DUITKU_MERCHANT_CODE = process.env.DUITKU_MERCHANT_CODE!;
const DUITKU_API_KEY = process.env.DUITKU_API_KEY!;
const DUITKU_BASE_URL = process.env.DUITKU_BASE_URL || 'https://sandbox.duitku.com/webapi/api';

export const generateSignature = (
  merchantCode: string,
  merchantOrderId: string,
  paymentAmount: number,
  apiKey: string,
): string => {
  const message = merchantCode + merchantOrderId + paymentAmount + apiKey;
  return crypto.createHash('md5').update(message).digest('hex');
};

export const verifyCallbackSignature = (
  merchantCode: string,
  amount: number,
  merchantOrderId: string,
  apiKey: string,
  receivedSignature: string,
): boolean => {
  const message = merchantCode + amount + merchantOrderId + apiKey;
  const calculatedSignature = crypto.createHash('md5').update(message).digest('hex');
  return calculatedSignature === receivedSignature;
};

export const createPaymentRequest = async (paymentData: DuitkuPaymentRequest): Promise<DuitkuPaymentResponse> => {
  try {
    const signature = generateSignature(
      DUITKU_MERCHANT_CODE,
      paymentData.merchantOrderId,
      paymentData.paymentAmount,
      DUITKU_API_KEY,
    );

    const requestData = {
      merchantCode: DUITKU_MERCHANT_CODE,
      paymentAmount: paymentData.paymentAmount,
      paymentMethod: paymentData.paymentMethod,
      merchantOrderId: paymentData.merchantOrderId,
      productDetails: paymentData.productDetails,
      customerEmail: paymentData.customerEmail,
      customerName: paymentData.customerName,
      customerPhone: paymentData.customerPhone,
      callbackUrl: paymentData.callbackUrl,
      returnUrl: paymentData.returnUrl,
      signature: signature,
      expiryPeriod: paymentData.expiryPeriod || 1440, // 24 hours default
    };

    const response = await axios.post(`${DUITKU_BASE_URL}/merchant/createinvoice`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Duitku payment request error:', error);
    throw new Error('Failed to create payment request');
  }
};

export const checkPaymentStatus = async (merchantOrderId: string): Promise<any> => {
  try {
    const signature = generateSignature(DUITKU_MERCHANT_CODE, merchantOrderId, 0, DUITKU_API_KEY);

    const requestData = {
      merchantCode: DUITKU_MERCHANT_CODE,
      merchantOrderId: merchantOrderId,
      signature: signature,
    };

    const response = await axios.post(`${DUITKU_BASE_URL}/merchant/transactionStatus`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Duitku payment status check error:', error);
    throw new Error('Failed to check payment status');
  }
};

export const getPaymentMethods = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${DUITKU_BASE_URL}/merchant/paymentmethod`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.paymentFee || [];
  } catch (error) {
    console.error('Duitku payment methods error:', error);
    throw new Error('Failed to get payment methods');
  }
};

export const validateCallback = (callback: PaymentCallback): boolean => {
  const isSignatureValid = verifyCallbackSignature(
    callback.merchantCode,
    callback.amount,
    callback.merchantOrderId,
    DUITKU_API_KEY,
    callback.signature,
  );

  const isAmountValid = callback.amount > 0;
  const isMerchantCodeValid = callback.merchantCode === DUITKU_MERCHANT_CODE;
  const isResultCodeValid = ['00', '01'].includes(callback.resultCode);

  return isSignatureValid && isAmountValid && isMerchantCodeValid && isResultCodeValid;
};

export const isPaymentSuccessful = (callback: PaymentCallback): boolean => {
  return callback.resultCode === '00';
};

export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};

export const generateMerchantOrderId = (userId: string, timestamp?: number): string => {
  const ts = timestamp || Date.now();
  return `SB-${userId}-${ts}`;
};
