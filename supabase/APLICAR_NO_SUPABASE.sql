-- =============================================================================
-- SONAR ACÚSTICOS — script único de sincronização do banco
-- =============================================================================
--
-- POR QUE ESTE ARQUIVO EXISTE
-- As migrações em supabase/migrations/ nunca foram aplicadas no projeto
-- Supabase. O sintoma: o formulário de /orcamento falha com
-- "O envio está temporariamente indisponível por uma configuração pendente do
-- servidor" — que é a tradução amigável do erro PGRST205 do PostgREST
-- ("tabela não encontrada"). O mesmo vale para /contato e para o gerador de
-- orçamentos em /admin/orcamentos.
--
-- COMO USAR
-- 1. Abra o painel do Supabase do projeto zcnasovvuglsxoobfcbt
-- 2. Vá em SQL Editor > New query
-- 3. Cole este arquivo INTEIRO e clique em Run
--
-- É SEGURO RODAR MAIS DE UMA VEZ
-- Tudo aqui é idempotente: nada é apagado, nada é sobrescrito e o que já
-- existir é simplesmente ignorado. Rodar duas vezes tem o mesmo efeito de
-- rodar uma. Nenhum dado existente é tocado.
--
-- Alternativa por linha de comando, se preferir:
--   supabase link --project-ref zcnasovvuglsxoobfcbt
--   supabase db push
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Papéis de usuário (base para todas as políticas de admin)
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER: a função precisa ler user_roles ignorando a RLS da própria
-- tabela, senão a política que a usa entraria em recursão infinita.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));


-- -----------------------------------------------------------------------------
-- 2. Imagens de produto (painel /envio-fotos)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view product images" ON public.product_images;
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can upload product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can upload product images" ON public.product_images;
CREATE POLICY "Admins can upload product images"
  ON public.product_images FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can delete product images" ON public.product_images;
DROP POLICY IF EXISTS "Admins can delete product images" ON public.product_images;
CREATE POLICY "Admins can delete product images"
  ON public.product_images FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));


-- -----------------------------------------------------------------------------
-- 3. Solicitações de orçamento (/orcamento) — a tabela que está faltando hoje
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  project_type TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL,
  description TEXT,
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Envio é público: o formulário roda com a anon key, sem login.
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON public.quote_requests;
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Leitura SÓ para admin: a tabela guarda nome, e-mail e telefone de clientes,
-- e a anon key é pública no bundle do site. Sem isso, qualquer visitante
-- baixaria a base de contatos inteira.
DROP POLICY IF EXISTS "Admins can view quote requests" ON public.quote_requests;
CREATE POLICY "Admins can view quote requests"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update quote requests" ON public.quote_requests;
CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS quote_requests_created_at_idx
  ON public.quote_requests (created_at DESC);


-- -----------------------------------------------------------------------------
-- 4. Mensagens de contato (/contato)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);


-- -----------------------------------------------------------------------------
-- 5. Propostas comerciais (/admin/orcamentos)
-- -----------------------------------------------------------------------------

-- Começa em 32 para continuar a numeração da série já usada no documento
-- físico (o último emitido foi o 0031).
CREATE SEQUENCE IF NOT EXISTS public.commercial_quote_number_seq START 32;

CREATE TABLE IF NOT EXISTS public.commercial_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_number INTEGER NOT NULL DEFAULT nextval('public.commercial_quote_number_seq'),

  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL,

  client_name TEXT NOT NULL,
  client_document TEXT,
  client_address TEXT,
  client_neighborhood TEXT,
  client_city TEXT,
  client_state TEXT,
  client_zip TEXT,
  client_phone TEXT,
  client_email TEXT,
  client_state_registration TEXT,

  items JSONB NOT NULL DEFAULT '[]'::jsonb,

  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,

  notes TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho',
  email_sent_at TIMESTAMP WITH TIME ZONE,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commercial_quotes ENABLE ROW LEVEL SECURITY;

-- Ferramenta interna: todo o CRUD é restrito a admin. Não há policy para anon.
DROP POLICY IF EXISTS "Admins can view commercial quotes" ON public.commercial_quotes;
CREATE POLICY "Admins can view commercial quotes"
  ON public.commercial_quotes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert commercial quotes" ON public.commercial_quotes;
CREATE POLICY "Admins can insert commercial quotes"
  ON public.commercial_quotes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update commercial quotes" ON public.commercial_quotes;
CREATE POLICY "Admins can update commercial quotes"
  ON public.commercial_quotes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS commercial_quotes_created_at_idx
  ON public.commercial_quotes (created_at DESC);

CREATE OR REPLACE FUNCTION public.set_commercial_quote_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS commercial_quotes_set_updated_at ON public.commercial_quotes;
CREATE TRIGGER commercial_quotes_set_updated_at
  BEFORE UPDATE ON public.commercial_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_commercial_quote_updated_at();


-- -----------------------------------------------------------------------------
-- 6. Buckets de arquivos
-- -----------------------------------------------------------------------------

-- Público: fotos de produto aparecem no site.
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-photos', 'product-photos', true)
ON CONFLICT (id) DO NOTHING;

-- PRIVADO: plantas e fotos de ambiente enviadas por clientes não podem ficar
-- acessíveis por URL adivinhável.
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product photos" ON storage.objects;
CREATE POLICY "Public read product photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-photos');

DROP POLICY IF EXISTS "Anyone can upload product photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product photos" ON storage.objects;
CREATE POLICY "Admins can upload product photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-photos' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Anyone can delete product photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product photos" ON storage.objects;
CREATE POLICY "Admins can delete product photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-photos' AND public.has_role(auth.uid(), 'admin'));

-- Anexos do orçamento: qualquer visitante envia, só admin lê.
DROP POLICY IF EXISTS "Anyone can upload quote attachments" ON storage.objects;
CREATE POLICY "Anyone can upload quote attachments"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'quote-attachments');

DROP POLICY IF EXISTS "Admins can read quote attachments" ON storage.objects;
CREATE POLICY "Admins can read quote attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'quote-attachments' AND public.has_role(auth.uid(), 'admin'));


-- -----------------------------------------------------------------------------
-- 7. Recarrega o cache de schema do PostgREST
-- -----------------------------------------------------------------------------
--
-- Sem isto a API pode continuar respondendo PGRST205 por alguns minutos, mesmo
-- com as tabelas já criadas — o PostgREST guarda o schema em cache.

NOTIFY pgrst, 'reload schema';


-- =============================================================================
-- CONFERÊNCIA — deve listar as 5 tabelas
-- =============================================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'user_roles', 'product_images', 'quote_requests',
    'contact_messages', 'commercial_quotes'
  )
ORDER BY table_name;
