-- Function to create or update a profile
CREATE OR REPLACE FUNCTION create_or_update_profile(
  p_id UUID,
  p_email TEXT,
  p_full_name TEXT DEFAULT '',
  p_avatar_url TEXT DEFAULT ''
) RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (p_id, p_email, p_full_name, p_avatar_url)
  ON CONFLICT (id) DO UPDATE
  SET 
    email = p_email,
    full_name = p_full_name,
    avatar_url = p_avatar_url,
    updated_at = NOW();
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RAISE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_or_update_profile TO authenticated;
