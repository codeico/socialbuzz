interface PaymentMethod {
  paymentMethod: string;
  paymentName: string;
  paymentImage: string;
  totalFee: string;
}

interface PaymentCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  methods: PaymentMethod[];
}

export const categorizePaymentMethods = (methods: PaymentMethod[]): PaymentCategory[] => {
  if (!methods || !Array.isArray(methods)) {
    return [];
  }
  const categories: PaymentCategory[] = [
    {
      id: 'virtual_account',
      name: 'Bank Transfer (Virtual Account)',
      icon: '🏦',
      description: 'Transfer via ATM, Mobile Banking, atau Internet Banking',
      methods: []
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏧',
      description: 'Transfer langsung antar bank',
      methods: []
    },
    {
      id: 'ewallet',
      name: 'E-Wallet',
      icon: '📱',
      description: 'Pembayaran via dompet digital',
      methods: []
    },
    {
      id: 'credit_card',
      name: 'Kartu Kredit',
      icon: '💳',
      description: 'Pembayaran dengan kartu kredit',
      methods: []
    },
    {
      id: 'convenience_store',
      name: 'Convenience Store',
      icon: '🏪',
      description: 'Bayar di minimarket',
      methods: []
    },
    {
      id: 'other',
      name: 'Lainnya',
      icon: '💰',
      description: 'Metode pembayaran lainnya',
      methods: []
    }
  ];

  // Categorize each payment method
  methods.forEach(method => {
    const methodCode = method.paymentMethod.toLowerCase();
    const methodName = method.paymentName.toLowerCase();

    if (methodCode.includes('va') || 
        methodName.includes('virtual') || 
        methodName.includes('va') ||
        methodName.includes('bca') ||
        methodName.includes('bni') ||
        methodName.includes('bri') ||
        methodName.includes('mandiri') ||
        methodName.includes('cimb') ||
        methodName.includes('permata') ||
        methodName.includes('maybank') ||
        methodName.includes('danamon') ||
        methodName.includes('bjb') ||
        methodName.includes('btn') ||
        methodName.includes('bss')) {
      categories[0].methods.push(method);
    } else if (methodCode.includes('bt') || 
               methodName.includes('bank transfer') ||
               methodName.includes('transfer bank')) {
      categories[1].methods.push(method);
    } else if (methodCode.includes('ov') || 
               methodCode.includes('da') || 
               methodCode.includes('sp') ||
               methodCode.includes('sl') ||
               methodCode.includes('ol') ||
               methodName.includes('ovo') ||
               methodName.includes('dana') ||
               methodName.includes('shopee') ||
               methodName.includes('linkaja') ||
               methodName.includes('gopay') ||
               methodName.includes('jenius') ||
               methodName.includes('wallet')) {
      categories[2].methods.push(method);
    } else if (methodCode.includes('vc') || 
               methodCode.includes('cc') ||
               methodName.includes('credit') ||
               methodName.includes('kredit') ||
               methodName.includes('visa') ||
               methodName.includes('mastercard')) {
      categories[3].methods.push(method);
    } else if (methodName.includes('indomaret') ||
               methodName.includes('alfamart') ||
               methodName.includes('convenience')) {
      categories[4].methods.push(method);
    } else {
      categories[5].methods.push(method);
    }
  });

  // Return only categories that have methods
  return categories.filter(category => category.methods.length > 0);
};

// getPaymentMethodIcon function removed - now using Duitku provided images directly