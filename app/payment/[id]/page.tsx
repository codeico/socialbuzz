'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatter';
import { 
  ArrowLeft, 
  User, 
  CreditCard, 
  Clock, 
  Heart,
  Copy,
  QrCode,
  ExternalLink,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { categorizePaymentMethods } from '@/utils/paymentMethods';
import QRCode from 'qrcode';

interface DonationDetails {
  id: string;
  recipient_id: string;
  amount: number;
  message: string;
  donor_name: string;
  donor_email: string;
  is_anonymous: boolean;
  payment_status: string;
  expires_at: string;
  created_at: string;
  recipient: {
    username: string;
    full_name: string;
    avatar?: string;
  };
}

interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

interface PaymentDetails {
  transactionId: string;
  reference: string;
  paymentUrl?: string;
  vaNumber?: string;
  qrCode?: string;
  expiryTime: string;
  instructions: string[];
}

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const donationId = params.id as string;
  
  const [donation, setDonation] = useState<DonationDetails | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [generatedQRCode, setGeneratedQRCode] = useState<string | null>(null);

  const loadDonationDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/donations/${donationId}`);
      const result = await response.json();

      if (result.success) {
        setDonation(result.data);
        
        // Calculate time left based on expiry
        const expiryTime = new Date(result.data.expires_at).getTime();
        const now = new Date().getTime();
        const secondsLeft = Math.max(0, Math.floor((expiryTime - now) / 1000));
        setTimeLeft(secondsLeft);
      } else {
        setError(result.error || 'Donation not found');
      }
    } catch (error) {
      console.error('Error loading donation:', error);
      setError('Failed to load donation details');
    } finally {
      setLoading(false);
    }
  }, [donationId]);

  const loadPaymentMethods = async () => {
    try {
      // Get payment methods from Duitku
      const response = await fetch('/api/v1/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 25000 }), // We'll update this with actual amount
      });

      const result = await response.json();

      if (result.success) {
        setPaymentMethods(result.data.paymentMethods || []);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  useEffect(() => {
    loadDonationDetails();
    loadPaymentMethods();
  }, [donationId, loadDonationDetails]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleMethodSelect = async (method: PaymentMethod) => {
    if (!donation) return;

    setSelectedMethod(method);
    setProcessingPayment(true);
    setError(null);

    try {
      // Update payment methods for actual amount
      const methodsResponse = await fetch('/api/v1/payments/methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: donation.amount }),
      });

      const methodsResult = await methodsResponse.json();
      
      if (!methodsResult.success) {
        setError('Failed to get payment methods');
        setProcessingPayment(false);
        return;
      }

      // Find the selected method with actual fees
      const actualMethod = methodsResult.data.paymentMethods.find(
        (m: PaymentMethod) => m.paymentMethod === method.paymentMethod
      );

      if (!actualMethod) {
        setError('Selected payment method not available');
        setProcessingPayment(false);
        return;
      }

      // Create payment with Duitku
      const paymentResponse = await fetch('/api/v1/payments/create-new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donationId: donation.id,
          recipientId: donation.recipient_id,
          amount: donation.amount,
          message: donation.message,
          donorName: donation.donor_name,
          donorEmail: donation.donor_email,
          isAnonymous: donation.is_anonymous,
          paymentMethod: actualMethod.paymentMethod,
          type: 'donation',
        }),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResult.success) {
        // Generate payment details based on method type
        const details = await generatePaymentDetails(actualMethod, paymentResult.data);
        setPaymentDetails(details);
        setShowPaymentModal(true);
      } else {
        console.error('Payment creation failed:', paymentResult);
        setError(paymentResult.error || 'Failed to create payment');
        
        // Log additional details for debugging
        if (paymentResult.details) {
          console.error('Payment error details:', paymentResult.details);
        }
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Failed to create payment');
    } finally {
      setProcessingPayment(false);
    }
  };

  const generateQRCodeImage = async (qrString: string): Promise<string> => {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return '';
    }
  };

  const generatePaymentDetails = async (method: PaymentMethod, paymentData: any): Promise<PaymentDetails> => {
    const methodType = method.paymentMethod.toLowerCase();
    let instructions: string[] = [];

    console.log('Generating payment details for:', methodType, paymentData);

    if (methodType.includes('va') || method.paymentName.toLowerCase().includes('virtual')) {
      instructions = [
        "Buka aplikasi mobile banking atau ATM",
        "Pilih menu Transfer/Bayar",
        "Pilih Virtual Account atau Bank Transfer",
        `Masukkan nomor Virtual Account: ${paymentData.vaNumber || 'Loading...'}`,
        `Masukkan nominal: ${formatCurrency(donation!.amount + parseInt(method.totalFee))}`,
        "Konfirmasi dan selesaikan pembayaran",
        "Kembali ke halaman ini untuk konfirmasi"
      ];
    } else if (methodType.includes('qr') || method.paymentName.toLowerCase().includes('qr')) {
      instructions = [
        "Buka aplikasi e-wallet atau mobile banking",
        "Pilih fitur Scan QR Code",
        "Scan QR Code yang ditampilkan",
        "Konfirmasi nominal pembayaran",
        "Masukkan PIN untuk konfirmasi",
        "Kembali ke halaman ini untuk konfirmasi"
      ];
    } else {
      instructions = [
        "Klik tombol 'Bayar Sekarang' di bawah",
        "Anda akan diarahkan ke halaman pembayaran",
        "Selesaikan pembayaran sesuai instruksi",
        "Kembali ke halaman ini setelah pembayaran selesai"
      ];
    }

    // Handle different possible QR code formats from Duitku
    let qrCodeUrl = paymentData.qrCode || paymentData.qrString || paymentData.qrUrl || null;
    
    // If we have a qrString, generate QR code image
    if (paymentData.qrString) {
      console.log('Found qrString, generating QR code from:', paymentData.qrString.substring(0, 50) + '...');
      const generatedQR = await generateQRCodeImage(paymentData.qrString);
      console.log('Generated QR code:', generatedQR ? 'Success' : 'Failed');
      if (generatedQR) {
        qrCodeUrl = generatedQR;
        setGeneratedQRCode(generatedQR);
      }
    }
    
    // If QR code is base64 encoded, prepend data URL prefix
    if (qrCodeUrl && !qrCodeUrl.startsWith('http') && !qrCodeUrl.startsWith('data:')) {
      qrCodeUrl = `data:image/png;base64,${qrCodeUrl}`;
    }

    return {
      transactionId: paymentData.transactionId,
      reference: paymentData.reference,
      paymentUrl: paymentData.paymentUrl,
      vaNumber: paymentData.vaNumber,
      qrCode: qrCodeUrl,
      expiryTime: new Date(Date.now() + 3600000).toISOString(),
      instructions
    };
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Donation Not Found</h2>
            <p className="text-gray-600 mb-4">The donation you&apos;re looking for doesn&apos;t exist.</p>
            <Button onClick={handleGoBack} variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categorizedMethods = categorizePaymentMethods(paymentMethods || []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button onClick={handleGoBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
        </div>

        {/* Donation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Supporting {donation.recipient.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Donation Amount</span>
                <span className="font-bold text-lg">{formatCurrency(donation.amount)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">From</span>
                <span className="font-medium">
                  {donation.is_anonymous ? 'Anonymous' : donation.donor_name}
                </span>
              </div>
              
              {donation.message && (
                <div>
                  <span className="text-gray-600 block mb-1">Message</span>
                  <p className="text-gray-900 italic">&quot;{donation.message}&quot;</p>
                </div>
              )}

              {/* Timer */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">Time remaining</span>
                  </div>
                  <div className={`font-mono text-lg font-bold ${timeLeft <= 300 ? 'text-red-600' : 'text-orange-600'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
              Choose Payment Method
            </CardTitle>
            <CardDescription>
              Select your preferred payment method to complete the donation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categorizedMethods.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No payment methods available</p>
                </div>
              ) : (
                categorizedMethods.map((category) => (
                  <div key={category.id}>
                    <h3 className="font-medium text-gray-900 mb-3">{category.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {category.methods.map((method) => (
                      <Button
                        key={method.paymentMethod}
                        variant="outline"
                        onClick={() => handleMethodSelect(method)}
                        disabled={processingPayment}
                        className="h-16 flex flex-col items-center justify-center p-2 hover:bg-gray-50"
                      >
                        <Image
                          src={method.paymentImage}
                          alt={method.paymentName}
                          width={32}
                          height={32}
                          className="mb-1"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMTYgMTJWMjAiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPC9zdmc+';
                          }}
                        />
                        <span className="text-xs text-center">{method.paymentName}</span>
                        <span className="text-xs text-gray-500">
                          +{formatCurrency(parseInt(method.totalFee))}
                        </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Modal */}
        {showPaymentModal && paymentDetails && selectedMethod && (
          <Modal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            title={`Payment via ${selectedMethod.paymentName}`}
          >
            <div className="space-y-4">
              {/* Payment Amount */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Donation Amount</span>
                  <span className="font-medium">{formatCurrency(donation.amount)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Payment Fee</span>
                  <span className="font-medium">{formatCurrency(parseInt(selectedMethod.totalFee))}</span>
                </div>
                <div className="flex justify-between items-center font-bold border-t pt-2">
                  <span>Total Payment</span>
                  <span>{formatCurrency(donation.amount + parseInt(selectedMethod.totalFee))}</span>
                </div>
              </div>

              {/* Payment Details */}
              {paymentDetails.vaNumber && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Virtual Account Number</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(paymentDetails.vaNumber!)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="font-mono text-lg font-bold mt-2">{paymentDetails.vaNumber}</p>
                </div>
              )}

              {paymentDetails.qrCode && (
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="mb-4">
                    <p className="font-medium mb-2">QR Code Payment</p>
                    <p className="text-sm text-gray-600 mb-4">Scan with your e-wallet app</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <Image
                      src={paymentDetails.qrCode}
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.parentElement?.querySelector('.qr-fallback') as HTMLElement;
                        if (fallback) {
                          fallback.style.display = 'block';
                        }
                      }}
                    />
                    <div className="qr-fallback hidden">
                      <QrCode className="h-32 w-32 mx-auto text-green-600" />
                      <p className="text-sm text-gray-600 mt-2">QR Code will appear here</p>
                    </div>
                  </div>
                </div>
              )}

              {paymentDetails.paymentUrl && !paymentDetails.qrCode && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Button
                    onClick={() => window.open(paymentDetails.paymentUrl, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Bayar Sekarang
                  </Button>
                </div>
              )}

              {/* Instructions */}
              <div>
                <h4 className="font-medium mb-2">Payment Instructions:</h4>
                <ol className="text-sm space-y-1">
                  {paymentDetails.instructions.map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="mr-2 text-gray-400">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  onClick={() => setShowPaymentModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Methods
                </Button>
                <Button
                  onClick={async () => {
                    setProcessingPayment(true);
                    try {
                      const statusResponse = await fetch('/api/v1/payments/check-status', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          donationId: donation.id,
                          transactionId: paymentDetails.transactionId
                        }),
                      });

                      const statusResult = await statusResponse.json();

                      if (statusResult.success && statusResult.data.status === 'paid') {
                        // Payment successful, redirect to success page with donation ID only
                        const successUrl = new URL('/payment/success', window.location.origin);
                        successUrl.searchParams.set('donationId', donation.id);
                        window.location.href = successUrl.toString();
                      } else {
                        alert('Payment not yet confirmed. Please wait a moment or try again.');
                      }
                    } catch (error) {
                      console.error('Error checking payment status:', error);
                      alert('Error checking payment status. Please try again.');
                    } finally {
                      setProcessingPayment(false);
                    }
                  }}
                  disabled={processingPayment}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  I&apos;ve Paid
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}