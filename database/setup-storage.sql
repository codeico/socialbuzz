-- Setup Storage Buckets for SocialBuzz
-- Run this in Supabase SQL Editor to create storage buckets

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('uploads', 'uploads', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain']),
  ('assets', 'assets', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'audio/mpeg'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for avatars bucket
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for uploads bucket
CREATE POLICY "Public can view uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'uploads' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for assets bucket
CREATE POLICY "Public can view assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Authenticated users can upload assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'assets' 
    AND auth.role() = 'authenticated'
  );

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Check if buckets were created successfully
SELECT id, name, public, file_size_limit, allowed_mime_types, created_at 
FROM storage.buckets 
WHERE id IN ('avatars', 'uploads', 'assets');