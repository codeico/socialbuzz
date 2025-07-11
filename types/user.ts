export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  isVerified: boolean;
  balance: number;
  totalEarnings: number;
  totalDonations: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  website?: string;
  location?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  bankAccount?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    privacyMode: boolean;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin' | 'super_admin';
  avatar?: string;
  isVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}