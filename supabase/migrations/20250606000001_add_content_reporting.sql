-- Add content reporting system with auto-hide functionality

-- Add is_hidden column to refactorings table
ALTER TABLE refactorings ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;

-- Create content_reports table
CREATE TABLE content_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    refactoring_id UUID NOT NULL REFERENCES refactorings(id) ON DELETE CASCADE,
    reporter_id TEXT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('inappropriate', 'not_code', 'spam', 'other')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(refactoring_id, reporter_id)
);

-- Enable RLS on content_reports
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can insert reports and read their own reports
CREATE POLICY "Users can insert content reports" ON content_reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read their own reports" ON content_reports
    FOR SELECT USING (reporter_id = auth.uid()::text OR reporter_id = current_setting('request.headers', true)::json->>'x-session-id');

-- Function to auto-hide refactorings when they reach 3+ reports
CREATE OR REPLACE FUNCTION auto_hide_reported_content()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this refactoring now has 3 or more reports
    IF (SELECT COUNT(*) FROM content_reports WHERE refactoring_id = NEW.refactoring_id) >= 3 THEN
        -- Auto-hide the refactoring
        UPDATE refactorings 
        SET is_hidden = TRUE 
        WHERE id = NEW.refactoring_id AND is_hidden = FALSE;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run auto-hide check after each report insertion
CREATE TRIGGER trigger_auto_hide_content
    AFTER INSERT ON content_reports
    FOR EACH ROW
    EXECUTE FUNCTION auto_hide_reported_content();

-- Index for performance
CREATE INDEX idx_content_reports_refactoring_id ON content_reports(refactoring_id);
CREATE INDEX idx_refactorings_is_hidden ON refactorings(is_hidden);