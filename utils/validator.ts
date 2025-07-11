import { z } from 'zod';

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Za-z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores');

export const fullNameSchema = z
  .string()
  .min(2, 'Full name must be at least 2 characters')
  .max(50, 'Full name must be at most 50 characters');

export const amountSchema = z
  .number()
  .min(1000, 'Minimum amount is Rp 1,000')
  .max(10000000, 'Maximum amount is Rp 10,000,000');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  fullName: fullNameSchema,
});

export const donationSchema = z.object({
  recipientId: z.string().min(1, 'Recipient is required'),
  amount: amountSchema,
  paymentMethod: z.string().min(1, 'Payment method is required'),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

export const payoutRequestSchema = z.object({
  amount: amountSchema,
  bankAccount: z.object({
    bankName: z.string().min(1, 'Bank name is required'),
    accountNumber: z.string().min(1, 'Account number is required'),
    accountHolderName: z.string().min(1, 'Account holder name is required'),
  }),
});

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
  bio: z.string().max(500, 'Bio must be at most 500 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be at most 100 characters').optional(),
  socialLinks: z.object({
    twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
    youtube: z.string().url('Invalid YouTube URL').optional().or(z.literal('')),
    tiktok: z.string().url('Invalid TikTok URL').optional().or(z.literal('')),
  }).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DonationFormData = z.infer<typeof donationSchema>;
export type PayoutRequestFormData = z.infer<typeof payoutRequestSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;