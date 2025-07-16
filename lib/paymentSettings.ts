import { createClient } from '@supabase/supabase-js';

interface PaymentSettings {
  duitku_merchant_code: string;
  duitku_api_key: string;
  duitku_sandbox_mode: boolean;
  transaction_id_prefix: string;
}

let cachedSettings: PaymentSettings | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getPaymentSettings(): Promise<PaymentSettings> {
  // Check cache first
  if (cachedSettings && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedSettings;
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: settings, error } = await supabase
      .from('system_settings')
      .select('category, key, value')
      .eq('category', 'payment')
      .in('key', ['duitku_merchant_code', 'duitku_api_key', 'duitku_sandbox_mode', 'transaction_id_prefix']);

    if (error) {
      console.error('Error fetching payment settings:', error);
      // Fallback to environment variables
      return getFallbackSettings();
    }

    // Convert array to object
    const settingsObj: Record<string, any> = {};
    settings?.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    // Parse and validate settings
    const paymentSettings: PaymentSettings = {
      duitku_merchant_code: settingsObj.duitku_merchant_code || process.env.DUITKU_MERCHANT_CODE || '',
      duitku_api_key: settingsObj.duitku_api_key || process.env.DUITKU_API_KEY || '',
      duitku_sandbox_mode: settingsObj.duitku_sandbox_mode !== undefined 
        ? (settingsObj.duitku_sandbox_mode === 'true' || settingsObj.duitku_sandbox_mode === true)
        : (process.env.DUITKU_BASE_URL?.includes('sandbox') ?? true),
      transaction_id_prefix: settingsObj.transaction_id_prefix || 'SB',
    };

    // Cache the result
    cachedSettings = paymentSettings;
    cacheTimestamp = Date.now();

    return paymentSettings;
  } catch (error) {
    console.error('Error in getPaymentSettings:', error);
    return getFallbackSettings();
  }
}

function getFallbackSettings(): PaymentSettings {
  return {
    duitku_merchant_code: process.env.DUITKU_MERCHANT_CODE || '',
    duitku_api_key: process.env.DUITKU_API_KEY || '',
    duitku_sandbox_mode: process.env.DUITKU_BASE_URL?.includes('sandbox') ?? true,
    transaction_id_prefix: 'SB',
  };
}

export function getDuitkuBaseUrl(sandboxMode: boolean): string {
  return sandboxMode 
    ? 'https://sandbox.duitku.com/webapi/api'
    : 'https://passport.duitku.com/webapi/api';
}

// Clear cache when settings are updated
export function clearPaymentSettingsCache(): void {
  cachedSettings = null;
  cacheTimestamp = 0;
  console.log('Payment settings cache cleared');
}