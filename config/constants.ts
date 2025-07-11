export const APP_NAME = 'SocialBuzz';
export const APP_DESCRIPTION = 'Support Your Favorite Creators';
export const APP_VERSION = '1.0.0';

export const API_VERSION = 'v1';
export const API_BASE_URL = `/api/${API_VERSION}`;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
};

export const DONATION_LIMITS = {
  MIN_AMOUNT: 1000, // Rp 1,000
  MAX_AMOUNT: 10000000, // Rp 10,000,000
};

export const PAYOUT_LIMITS = {
  MIN_AMOUNT: 50000, // Rp 50,000
  MAX_AMOUNT: 50000000, // Rp 50,000,000
};

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const TRANSACTION_TYPES = {
  DONATION: 'donation',
  PAYOUT: 'payout',
  FEE: 'fee',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export const PAYOUT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
} as const;

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  VIRTUAL_ACCOUNT: 'virtual_account',
  E_WALLET: 'e_wallet',
  CREDIT_CARD: 'credit_card',
} as const;

export const NOTIFICATION_TYPES = {
  DONATION_RECEIVED: 'donation_received',
  PAYOUT_APPROVED: 'payout_approved',
  PAYOUT_REJECTED: 'payout_rejected',
  PAYOUT_COMPLETED: 'payout_completed',
  PROFILE_UPDATED: 'profile_updated',
} as const;

export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  INSTAGRAM: 'instagram',
  YOUTUBE: 'youtube',
  TIKTOK: 'tiktok',
  FACEBOOK: 'facebook',
  DISCORD: 'discord',
} as const;

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  FULL_NAME_MIN_LENGTH: 2,
  FULL_NAME_MAX_LENGTH: 50,
  BIO_MAX_LENGTH: 500,
  LOCATION_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 1000,
};

export const RATE_LIMITS = {
  DONATION_PER_HOUR: 10,
  PAYOUT_REQUEST_PER_DAY: 3,
  PROFILE_UPDATE_PER_HOUR: 5,
  FILE_UPLOAD_PER_HOUR: 20,
};

export const CACHE_KEYS = {
  USER_PROFILE: 'user_profile',
  TRANSACTIONS: 'transactions',
  DONATIONS: 'donations',
  PAYOUT_REQUESTS: 'payout_requests',
  SITE_CONFIG: 'site_config',
};

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  PAYMENT_FAILED: 'Payment failed',
  UPLOAD_FAILED: 'File upload failed',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  DONATION_CREATED: 'Donation created successfully',
  PAYOUT_REQUESTED: 'Payout request submitted successfully',
  FILE_UPLOADED: 'File uploaded successfully',
};

export const BANKS = [
  { code: 'BCA', name: 'Bank Central Asia (BCA)' },
  { code: 'BNI', name: 'Bank Negara Indonesia (BNI)' },
  { code: 'BRI', name: 'Bank Rakyat Indonesia (BRI)' },
  { code: 'MANDIRI', name: 'Bank Mandiri' },
  { code: 'CIMB', name: 'CIMB Niaga' },
  { code: 'PERMATA', name: 'Bank Permata' },
  { code: 'DANAMON', name: 'Bank Danamon' },
  { code: 'MAYBANK', name: 'Maybank Indonesia' },
  { code: 'OCBC', name: 'OCBC NISP' },
  { code: 'PANIN', name: 'Bank Panin' },
];