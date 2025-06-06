-- Create storage bucket for screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);

-- Storage policies
CREATE POLICY "Anyone can view screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'screenshots');

CREATE POLICY "Anyone can upload screenshots" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'screenshots');

CREATE POLICY "Anyone can update screenshots" ON storage.objects
  FOR UPDATE USING (bucket_id = 'screenshots');