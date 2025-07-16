import { NextRequest, NextResponse } from 'next/server';
import { getPaymentMethods } from '@/lib/duitku';
import { handleCors } from '@/lib/middleware';

export async function OPTIONS(req: NextRequest) {
  return handleCors(req) || new NextResponse(null, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount < 5000) {
      return NextResponse.json({
        success: false,
        error: 'Amount is required and must be at least 5000'
      }, { status: 400 });
    }

    let response;
    
    try {
      response = await getPaymentMethods(amount);
    } catch (error) {
      console.error('Duitku payment methods failed:', error);
      
      // In development mode, use mock payment methods
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock payment methods for development');
        response = {
          responseCode: '00',
          responseMessage: 'SUCCESS (MOCK)',
          paymentFee: [
            {
              paymentMethod: 'VC',
              paymentName: 'Virtual Account',
              paymentImage: '/payment-methods/virtual-account.png',
              totalFee: 0,
              mock: true
            },
            {
              paymentMethod: 'BC',
              paymentName: 'Bank Transfer',
              paymentImage: '/payment-methods/bank-transfer.png',
              totalFee: 0,
              mock: true
            },
            {
              paymentMethod: 'CC',
              paymentName: 'Credit Card',
              paymentImage: '/payment-methods/credit-card.png',
              totalFee: Math.round(amount * 0.029),
              mock: true
            },
            {
              paymentMethod: 'OL',
              paymentName: 'Online Banking',
              paymentImage: '/payment-methods/online-banking.png',
              totalFee: 0,
              mock: true
            },
            {
              paymentMethod: 'OV',
              paymentName: 'OVO',
              paymentImage: '/payment-methods/ovo.png',
              totalFee: 0,
              mock: true
            }
          ]
        };
      } else {
        // In production, return error
        return NextResponse.json({
          success: false,
          error: 'Payment gateway unavailable'
        }, { status: 500 });
      }
    }

    if (response.responseCode !== '00') {
      return NextResponse.json({
        success: false,
        error: response.responseMessage || 'Failed to get payment methods'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        paymentMethods: response.paymentFee || [],
        responseCode: response.responseCode,
        responseMessage: response.responseMessage
      }
    });
  } catch (error) {
    console.error('Payment methods API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    }, { status: 500 });
  }
}