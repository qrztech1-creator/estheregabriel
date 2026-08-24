DROP POLICY IF EXISTS "auth upload proposal media" ON storage.objects;
DROP POLICY IF EXISTS "auth read proposal media" ON storage.objects;
DROP POLICY IF EXISTS "auth update proposal media" ON storage.objects;
DROP POLICY IF EXISTS "auth delete proposal media" ON storage.objects;

CREATE POLICY "auth upload proposal media" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'proposal-media');

CREATE POLICY "auth read proposal media" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'proposal-media');

CREATE POLICY "auth update proposal media" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'proposal-media') WITH CHECK (bucket_id = 'proposal-media');

CREATE POLICY "auth delete proposal media" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'proposal-media');