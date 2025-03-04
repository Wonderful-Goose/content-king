-- Add content_type column to ideas table
ALTER TABLE ideas
ADD COLUMN content_type TEXT;

-- Add constraint to ensure content_type is one of the predefined types
ALTER TABLE ideas
ADD CONSTRAINT valid_content_type 
CHECK (content_type IN ('tweet', 'linkedin', 'newsletter', 'blog', 'video', 'podcast', 'instagram', 'thread'));

-- Update existing ideas to have a default content type
UPDATE ideas
SET content_type = 'blog'
WHERE content_type IS NULL; 