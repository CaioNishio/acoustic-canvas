-- The public quote form must not receive SELECT or broad INSERT privileges on
-- a table that stores customer PII. Expose one validated operation instead.
CREATE OR REPLACE FUNCTION public.submit_quote_request(
  p_name text,
  p_email text,
  p_phone text,
  p_company text,
  p_project_type text,
  p_area text,
  p_city text,
  p_description text,
  p_attachments jsonb DEFAULT '[]'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF length(trim(coalesce(p_name, ''))) < 2
     OR length(trim(coalesce(p_email, ''))) > 180
     OR trim(coalesce(p_email, '')) !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]{2,}$'
     OR length(regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g')) < 10
     OR length(trim(coalesce(p_project_type, ''))) < 1
     OR length(trim(coalesce(p_city, ''))) < 2
     OR jsonb_typeof(coalesce(p_attachments, '[]'::jsonb)) <> 'array'
     OR jsonb_array_length(coalesce(p_attachments, '[]'::jsonb)) > 10
  THEN
    RAISE EXCEPTION 'invalid quote request' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.quote_requests
    (name, email, phone, company, project_type, area, city, description, attachments)
  VALUES
    (left(trim(p_name), 120), lower(left(trim(p_email), 180)),
     left(regexp_replace(p_phone, '[^0-9]', '', 'g'), 32),
     nullif(left(trim(coalesce(p_company, '')), 120), ''),
     left(trim(p_project_type), 80),
     nullif(left(trim(coalesce(p_area, '')), 40), ''),
     left(trim(p_city), 120),
     nullif(left(trim(coalesce(p_description, '')), 4000), ''),
     coalesce(p_attachments, '[]'::jsonb))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_quote_request(text,text,text,text,text,text,text,text,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_quote_request(text,text,text,text,text,text,text,text,jsonb) TO anon, authenticated;
