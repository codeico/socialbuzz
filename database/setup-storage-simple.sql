-- Simple Storage Setup for SocialBuzz
-- Run this in Supabase SQL Editor ONLY for buckets creation

-- Create storage buckets (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('uploads', 'uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']),
  ('assets', 'assets', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'audio/mpeg'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Check if buckets were created successfully
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id IN ('avatars', 'uploads', 'assets');