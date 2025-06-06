-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create refactorings table
CREATE TABLE refactorings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  before_screenshot_url TEXT,
  after_screenshot_url TEXT,
  title TEXT,
  description TEXT,
  language TEXT,
  author_id UUID REFERENCES auth.users(id),
  is_complete BOOLEAN DEFAULT FALSE
);