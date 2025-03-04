-- ContentPlanner Swipe Files Schema
-- This file contains the tables, functions, and RLS policies for the swipe files feature

-- Create swipe_files table for storing saved content from around the web
CREATE TABLE IF NOT EXISTS swipe_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT,
  description TEXT,
  content TEXT, -- For storing the actual content if needed
  source TEXT, -- Source of the swipe file (website, social media, etc.)
  thumbnail_url TEXT, -- URL to a thumbnail image
  metadata JSONB DEFAULT '{}'::jsonb, -- For storing additional metadata
  is_favorite BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for swipe_files updated_at
CREATE TRIGGER update_swipe_files_updated_at
  BEFORE UPDATE ON swipe_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create swipe_file_tags junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS swipe_file_tags (
  swipe_file_id UUID REFERENCES swipe_files(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (swipe_file_id, tag_id)
);

-- Create swipe_file_notes table for notes attached to swipe files
CREATE TABLE IF NOT EXISTS swipe_file_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  swipe_file_id UUID REFERENCES swipe_files(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create trigger for swipe_file_notes updated_at
CREATE TRIGGER update_swipe_file_notes_updated_at
  BEFORE UPDATE ON swipe_file_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create swipe_file_collections table for organizing swipe files into collections
CREATE TABLE IF NOT EXISTS swipe_file_collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, name)
);

-- Create trigger for swipe_file_collections updated_at
CREATE TRIGGER update_swipe_file_collections_updated_at
  BEFORE UPDATE ON swipe_file_collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create swipe_file_collection_items junction table
CREATE TABLE IF NOT EXISTS swipe_file_collection_items (
  collection_id UUID REFERENCES swipe_file_collections(id) ON DELETE CASCADE,
  swipe_file_id UUID REFERENCES swipe_files(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0, -- For ordering items within a collection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (collection_id, swipe_file_id)
);

-- Set up Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE swipe_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_file_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_file_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_file_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipe_file_collection_items ENABLE ROW LEVEL SECURITY;

-- Swipe files policies
CREATE POLICY "Users can view their own swipe files"
  ON swipe_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipe files"
  ON swipe_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipe files"
  ON swipe_files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swipe files"
  ON swipe_files FOR DELETE
  USING (auth.uid() = user_id);

-- Swipe file tags policies
CREATE POLICY "Users can view their own swipe file tags"
  ON swipe_file_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM swipe_files
    WHERE swipe_files.id = swipe_file_tags.swipe_file_id
    AND swipe_files.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own swipe file tags"
  ON swipe_file_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM swipe_files
    WHERE swipe_files.id = swipe_file_tags.swipe_file_id
    AND swipe_files.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own swipe file tags"
  ON swipe_file_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM swipe_files
    WHERE swipe_files.id = swipe_file_tags.swipe_file_id
    AND swipe_files.user_id = auth.uid()
  ));

-- Swipe file notes policies
CREATE POLICY "Users can view their own swipe file notes"
  ON swipe_file_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipe file notes"
  ON swipe_file_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipe file notes"
  ON swipe_file_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swipe file notes"
  ON swipe_file_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Swipe file collections policies
CREATE POLICY "Users can view their own swipe file collections"
  ON swipe_file_collections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipe file collections"
  ON swipe_file_collections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipe file collections"
  ON swipe_file_collections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swipe file collections"
  ON swipe_file_collections FOR DELETE
  USING (auth.uid() = user_id);

-- Swipe file collection items policies
CREATE POLICY "Users can view their own swipe file collection items"
  ON swipe_file_collection_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM swipe_file_collections
    WHERE swipe_file_collections.id = swipe_file_collection_items.collection_id
    AND swipe_file_collections.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own swipe file collection items"
  ON swipe_file_collection_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM swipe_file_collections
    WHERE swipe_file_collections.id = swipe_file_collection_items.collection_id
    AND swipe_file_collections.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own swipe file collection items"
  ON swipe_file_collection_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM swipe_file_collections
    WHERE swipe_file_collections.id = swipe_file_collection_items.collection_id
    AND swipe_file_collections.user_id = auth.uid()
  )); 