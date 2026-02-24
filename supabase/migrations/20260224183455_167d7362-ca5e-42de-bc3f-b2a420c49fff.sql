
-- Table for product images
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

-- Public insert (open upload for now)
CREATE POLICY "Anyone can upload product images"
  ON public.product_images FOR INSERT
  WITH CHECK (true);

-- Public delete
CREATE POLICY "Anyone can delete product images"
  ON public.product_images FOR DELETE
  USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('product-photos', 'product-photos', true);

-- Storage policies
CREATE POLICY "Public read product photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

CREATE POLICY "Anyone can upload product photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-photos');

CREATE POLICY "Anyone can delete product photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-photos');
