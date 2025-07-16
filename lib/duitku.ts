import crypto from 'crypto';
import axios from 'axios';
import { DuitkuPaymentRequest, DuitkuPaymentResponse, PaymentCallback } from '@/types/payment';
import { getPaymentSettings, getDuitkuBaseUrl } from './paymentSettings';

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
  
  console.log('Signature verification:', {
    merchantCode,
    amount,
    merchantOrderId,
    apiKey: apiKey ? `${apiKey.substring(0, 4)}...` : 'NOT_SET',
    message,
    calculatedSignature,
    receivedSignature,
    isValid: calculatedSignature === receivedSignature
  });
  
  return calculatedSignature === receivedSignature;
};

export const createPaymentRequest = async (paymentData: DuitkuPaymentRequest): Promise<DuitkuPaymentResponse> => {
  try {
    const settings = await getPaymentSettings();
    const baseUrl = getDuitkuBaseUrl(settings.duitku_sandbox_mode);
    
    const signature = generateSignature(
      settings.duitku_merchant_code,
      paymentData.merchantOrderId,
      paymentData.paymentAmount,
      settings.duitku_api_key,
    );

    // Customer details for Duitku v2 API
    const customerDetail = {
      firstName: paymentData.customerName?.split(' ')[0] || 'Anonymous',
      lastName: paymentData.customerName?.split(' ').slice(1).join(' ') || 'Donor',
      email: paymentData.customerEmail,
      phoneNumber: paymentData.customerPhone || '',
      billingAddress: {
        firstName: paymentData.customerName?.split(' ')[0] || 'Anonymous',
        lastName: paymentData.customerName?.split(' ').slice(1).join(' ') || 'Donor',
        address: 'Jakarta',
        city: 'Jakarta',
        postalCode: '12345',
        phone: paymentData.customerPhone || '',
        countryCode: 'ID'
      },
      shippingAddress: {
        firstName: paymentData.customerName?.split(' ')[0] || 'Anonymous',
        lastName: paymentData.customerName?.split(' ').slice(1).join(' ') || 'Donor',
        address: 'Jakarta',
        city: 'Jakarta',
        postalCode: '12345',
        phone: paymentData.customerPhone || '',
        countryCode: 'ID'
      }
    };

    // Item details
    const itemDetails = [
      {
        name: paymentData.productDetails,
        price: paymentData.paymentAmount,
        quantity: 1
      }
    ];

    const requestData = {
      merchantCode: settings.duitku_merchant_code,
      paymentAmount: paymentData.paymentAmount,
      paymentMethod: paymentData.paymentMethod,
      merchantOrderId: paymentData.merchantOrderId,
      productDetails: paymentData.productDetails,
      additionalParam: '',
      merchantUserInfo: '',
      customerVaName: paymentData.customerName || 'Anonymous Donor',
      email: paymentData.customerEmail,
      phoneNumber: paymentData.customerPhone || '',
      itemDetails: itemDetails,
      customerDetail: customerDetail,
      callbackUrl: paymentData.callbackUrl,
      returnUrl: paymentData.returnUrl,
      signature: signature,
      expiryPeriod: paymentData.expiryPeriod || 60, // 1 hour default
    };

    console.log('Duitku request data:', JSON.stringify(requestData, null, 2));

    const response = await axios.post(`${baseUrl}/merchant/v2/inquiry`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Duitku response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Duitku payment request error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw new Error('Failed to create payment request');
  }
};

export const checkPaymentStatus = async (merchantOrderId: string): Promise<any> => {
  try {
    const settings = await getPaymentSettings();
    const baseUrl = getDuitkuBaseUrl(settings.duitku_sandbox_mode);
    
    const signature = generateSignature(settings.duitku_merchant_code, merchantOrderId, 0, settings.duitku_api_key);

    const requestData = {
      merchantCode: settings.duitku_merchant_code,
      merchantOrderId: merchantOrderId,
      signature: signature,
    };

    const response = await axios.post(`${baseUrl}/merchant/transactionStatus`, requestData, {
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


export const validateCallback = async (callback: PaymentCallback): Promise<boolean> => {
  const settings = await getPaymentSettings();
  
  const isSignatureValid = verifyCallbackSignature(
    callback.merchantCode,
    callback.amount,
    callback.merchantOrderId,
    settings.duitku_api_key,
    callback.signature,
  );

  const isAmountValid = callback.amount > 0;
  const isMerchantCodeValid = callback.merchantCode === settings.duitku_merchant_code;
  const isResultCodeValid = ['00', '01'].includes(callback.resultCode);

  return isSignatureValid && isAmountValid && isMerchantCodeValid && isResultCodeValid;
};

export const isPaymentSuccessful = (callback: PaymentCallback): boolean => {
  return callback.resultCode === '00';
};

export const formatAmount = (amount: number): number => {
  return Math.round(amount * 100) / 100;
};

export const generateMerchantOrderId = async (userId: string, timestamp?: number): Promise<string> => {
  const settings = await getPaymentSettings();
  const ts = timestamp || Date.now();
  
  // Shorten userId to first 8 characters to fit within 50 char limit
  // Format: PREFIX-SHORTID-TIMESTAMP (e.g., SB-12345678-1752580155672)
  const shortUserId = userId.replace(/-/g, '').substring(0, 8);
  const merchantOrderId = `${settings.transaction_id_prefix}-${shortUserId}-${ts}`;
  
  // Ensure it doesn't exceed 50 characters
  if (merchantOrderId.length > 50) {
    // If still too long, use shorter timestamp (last 10 digits)
    const shortTs = ts.toString().slice(-10);
    const fallbackId = `${settings.transaction_id_prefix}-${shortUserId}-${shortTs}`;
    return fallbackId.substring(0, 50);
  }
  
  return merchantOrderId;
};

export const generateSHA256Signature = (
  merchantCode: string,
  amount: number,
  datetime: string,
  apiKey: string,
): string => {
  const message = merchantCode + amount + datetime + apiKey;
  return crypto.createHash('sha256').update(message).digest('hex');
};

export const getPaymentMethods = async (amount: number): Promise<any> => {
  try {
    const settings = await getPaymentSettings();
    const baseUrl = getDuitkuBaseUrl(settings.duitku_sandbox_mode);
    
    console.log('Environment check:', {
      merchantCode: settings.duitku_merchant_code,
      apiKeyLength: settings.duitku_api_key?.length,
      baseUrl: baseUrl,
      sandboxMode: settings.duitku_sandbox_mode,
      fullUrl: `${baseUrl}/merchant/paymentmethod/getpaymentmethod`
    });

    // Use format: YYYY-MM-DD HH:mm:ss to match PHP date('Y-m-d H:i:s')
    const now = new Date();
    const datetime = now.getFullYear() + '-' + 
      String(now.getMonth() + 1).padStart(2, '0') + '-' + 
      String(now.getDate()).padStart(2, '0') + ' ' + 
      String(now.getHours()).padStart(2, '0') + ':' + 
      String(now.getMinutes()).padStart(2, '0') + ':' + 
      String(now.getSeconds()).padStart(2, '0');
    const signature = generateSHA256Signature(
      settings.duitku_merchant_code,
      amount,
      datetime,
      settings.duitku_api_key,
    );

    const requestData = {
      merchantcode: settings.duitku_merchant_code,
      amount: amount,
      datetime: datetime,
      signature: signature,
    };

    console.log('Payment methods request:', requestData);
    console.log('Full URL:', `${baseUrl}/merchant/paymentmethod/getpaymentmethod`);

    const response = await axios.post(
      `${baseUrl}/merchant/paymentmethod/getpaymentmethod`,
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    console.log('Payment methods response status:', response.status);
    console.log('Payment methods response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get payment methods error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      console.error('Request config:', error.config);
    }
    throw new Error(`Failed to get payment methods: ${error instanceof Error ? error.message : String(error)}`);
  }
};
