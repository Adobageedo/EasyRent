-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view all properties
CREATE POLICY "Properties are viewable by everyone" ON properties
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own properties
CREATE POLICY "Users can create their own properties" ON properties
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own properties
CREATE POLICY "Users can update their own properties" ON properties
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own properties
CREATE POLICY "Users can delete their own properties" ON properties
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Storage policies for property-photos bucket
-- Note: Run these only after creating the bucket in the dashboard
INSERT INTO storage.policies (name, definition, bucket_id)
VALUES 
  (
    'Avatar images are publicly accessible.',
    '(bucket_id = ''property-photos''::text)',
    'property-photos'::text
  ),
  (
    'Anyone can upload an avatar.',
    '(bucket_id = ''property-photos''::text) AND (auth.role() = ''authenticated''::text)',
    'property-photos'::text
  ),
  (
    'Anyone can update their own avatar.',
    '((bucket_id = ''property-photos''::text) AND (auth.uid()::text = (storage.foldername(name))[1]))',
    'property-photos'::text
  ),
  (
    'Anyone can delete their own avatar.',
    '((bucket_id = ''property-photos''::text) AND (auth.uid()::text = (storage.foldername(name))[1]))',
    'property-photos'::text
  );
