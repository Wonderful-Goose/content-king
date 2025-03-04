-- ContentPlanner Ideas and Content Schema
-- This file contains the tables, functions, and RLS policies for the ideas and content features

-- Create ideas table for storing content ideas
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft', -- draft, in_progress, ready, published, archived
  priority TEXT DEFAULT 'medium', -- low, medium, high
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for ideas updated_at
CREATE TRIGGER update_ideas_updated_at
  BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create idea_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS idea_tags (
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (idea_id, tag_id)
);

-- Create idea_references table for linking ideas to swipe files
CREATE TABLE IF NOT EXISTS idea_references (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  swipe_file_id UUID REFERENCES swipe_files(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(idea_id, swipe_file_id)
);

-- Create trigger for idea_references updated_at
CREATE TRIGGER update_idea_references_updated_at
  BEFORE UPDATE ON idea_references
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create idea_drafts table for storing drafts of idea content
CREATE TABLE IF NOT EXISTS idea_drafts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  version INTEGER NOT NULL,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for idea_drafts updated_at
CREATE TRIGGER update_idea_drafts_updated_at
  BEFORE UPDATE ON idea_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create content_items table for storing scheduled content
CREATE TABLE IF NOT EXISTS content_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT NOT NULL, -- blog, social, email, video, etc.
  status TEXT DEFAULT 'draft', -- draft, scheduled, published, archived
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  platform TEXT, -- specific platform if applicable
  url TEXT, -- URL where the content was published
  metrics JSONB DEFAULT '{}'::jsonb, -- For storing performance metrics
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for content_items updated_at
CREATE TRIGGER update_content_items_updated_at
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create content_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS content_tags (
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (content_id, tag_id)
);

-- Create content_attachments table for files attached to content
CREATE TABLE IF NOT EXISTS content_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for content_attachments updated_at
CREATE TRIGGER update_content_attachments_updated_at
  BEFORE UPDATE ON content_attachments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_attachments ENABLE ROW LEVEL SECURITY;

-- Ideas policies
CREATE POLICY "Users can view their own ideas"
  ON ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas"
  ON ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas"
  ON ideas FOR DELETE
  USING (auth.uid() = user_id);

-- Idea tags policies
CREATE POLICY "Users can view their own idea tags"
  ON idea_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_tags.idea_id
    AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own idea tags"
  ON idea_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_tags.idea_id
    AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own idea tags"
  ON idea_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_tags.idea_id
    AND ideas.user_id = auth.uid()
  ));

-- Idea references policies
CREATE POLICY "Users can view their own idea references"
  ON idea_references FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_references.idea_id
    AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own idea references"
  ON idea_references FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_references.idea_id
    AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own idea references"
  ON idea_references FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_references.idea_id
    AND ideas.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own idea references"
  ON idea_references FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM ideas
    WHERE ideas.id = idea_references.idea_id
    AND ideas.user_id = auth.uid()
  ));

-- Idea drafts policies
CREATE POLICY "Users can view their own idea drafts"
  ON idea_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own idea drafts"
  ON idea_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own idea drafts"
  ON idea_drafts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own idea drafts"
  ON idea_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Content items policies
CREATE POLICY "Users can view their own content items"
  ON content_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content items"
  ON content_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content items"
  ON content_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content items"
  ON content_items FOR DELETE
  USING (auth.uid() = user_id);

-- Content tags policies
CREATE POLICY "Users can view their own content tags"
  ON content_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM content_items
    WHERE content_items.id = content_tags.content_id
    AND content_items.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own content tags"
  ON content_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM content_items
    WHERE content_items.id = content_tags.content_id
    AND content_items.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own content tags"
  ON content_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM content_items
    WHERE content_items.id = content_tags.content_id
    AND content_items.user_id = auth.uid()
  ));

-- Content attachments policies
CREATE POLICY "Users can view their own content attachments"
  ON content_attachments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own content attachments"
  ON content_attachments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content attachments"
  ON content_attachments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content attachments"
  ON content_attachments FOR DELETE
  USING (auth.uid() = user_id); 