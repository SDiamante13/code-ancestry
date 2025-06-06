-- Create reactions table
CREATE TABLE reactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  refactoring_id UUID NOT NULL REFERENCES refactorings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('fire', 'lightbulb', 'thinking')),
  UNIQUE(refactoring_id, user_id, reaction_type)
);

-- Create index for performance
CREATE INDEX idx_reactions_refactoring_id ON reactions(refactoring_id);

-- Enable RLS
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can add reactions" ON reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can remove their own reactions" ON reactions
  FOR DELETE USING (
    (auth.uid() = user_id) OR 
    (user_id IS NULL AND auth.ip() = current_setting('request.headers')::json->>'x-forwarded-for')
  );

-- Create view for reaction counts
CREATE VIEW reaction_counts AS
SELECT 
  refactoring_id,
  COUNT(CASE WHEN reaction_type = 'fire' THEN 1 END) as fire_count,
  COUNT(CASE WHEN reaction_type = 'lightbulb' THEN 1 END) as lightbulb_count,
  COUNT(CASE WHEN reaction_type = 'thinking' THEN 1 END) as thinking_count
FROM reactions
GROUP BY refactoring_id;