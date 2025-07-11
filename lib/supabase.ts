import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  UPLOADS: 'uploads',
  PUBLIC: 'public',
} as const;

export const uploadFile = async (
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
) => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return data;
};

export const getPublicUrl = (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
) => {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(path);

  return data.publicUrl;
};

export const deleteFile = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
) => {
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

export const createSignedUrl = async (
  bucket: keyof typeof STORAGE_BUCKETS,
  path: string,
  expiresIn: number = 3600,
) => {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Create signed URL failed: ${error.message}`);
  }

  return data;
};
