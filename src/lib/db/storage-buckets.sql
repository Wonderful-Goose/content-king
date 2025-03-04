-- ContentPlanner Storage Buckets Configuration
-- This file contains the configuration for Supabase storage buckets

-- Create storage buckets for different types of files
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'User avatars', false, false, 5242880, -- 5MB limit
   ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']::text[]),
  
  ('content_images', 'Content images', false, false, 10485760, -- 10MB limit
   ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']::text[]),
  
  ('content_attachments', 'Content attachments', false, false, 52428800, -- 50MB limit
   ARRAY['application/pdf', 'application/msword', 
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
         'application/vnd.ms-excel',
         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
         'application/vnd.ms-powerpoint',
         'application/vnd.openxmlformats-officedocument.presentationml.presentation',
         'text/plain', 'text/csv']::text[]),
  
  ('swipe_file_thumbnails', 'Swipe file thumbnails', false, false, 5242880, -- 5MB limit
   ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp']::text[])
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  public = EXCLUDED.public,
  avif_autodetection = EXCLUDED.avif_autodetection,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Set up RLS policies for storage buckets

-- Avatars bucket policies
CREATE POLICY "Users can view their own avatars"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Content images bucket policies
CREATE POLICY "Users can view their own content images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'content_images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own content images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'content_images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own content images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'content_images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own content images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'content_images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Content attachments bucket policies
CREATE POLICY "Users can view their own content attachments"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'content_attachments' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own content attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'content_attachments' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own content attachments"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'content_attachments' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own content attachments"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'content_attachments' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Swipe file thumbnails bucket policies
CREATE POLICY "Users can view their own swipe file thumbnails"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'swipe_file_thumbnails' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own swipe file thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'swipe_file_thumbnails' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own swipe file thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'swipe_file_thumbnails' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own swipe file thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'swipe_file_thumbnails' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  ); 