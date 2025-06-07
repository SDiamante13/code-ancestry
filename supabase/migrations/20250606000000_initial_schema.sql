-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create refactorings table
CREATE TABLE refactorings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  before_screenshot_url TEXT,
  during_screenshot_url TEXT,
  after_screenshot_url TEXT,
  title TEXT,
  description TEXT,
  language TEXT,
  author_id UUID REFERENCES auth.users(id),
  is_complete BOOLEAN DEFAULT FALSE
);

-- Create RLS policies
ALTER TABLE refactorings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read refactorings
CREATE POLICY "Anyone can view refactorings" ON refactorings
  FOR SELECT USING (true);

-- Allow authenticated users to create refactorings
CREATE POLICY "Authenticated users can create refactorings" ON refactorings
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own refactorings
CREATE POLICY "Users can update own refactorings" ON refactorings
  FOR UPDATE USING (auth.uid() = author_id OR author_id IS NULL);

-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Storage policies
CREATE POLICY "Anyone can view screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');

CREATE POLICY "Anyone can upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Anyone can update screenshots" ON storage.objects
  FOR UPDATE USING (bucket_id = 'screenshots');