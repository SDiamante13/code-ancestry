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