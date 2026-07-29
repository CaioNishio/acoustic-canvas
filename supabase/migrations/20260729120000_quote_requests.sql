-- Solicitacoes de orcamento enviadas pelo formulario publico (/orcamento).
--
-- Ate agora o formulario nao gravava nada: o botao "Enviar Orcamento" apenas
-- trocava a tela para "Orcamento Enviado!". Toda solicitacao feita pelo site
-- foi perdida.

CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  project_type TEXT NOT NULL,
  area TEXT,
  city TEXT NOT NULL,
  description TEXT,
  -- [{ path, name, size }] — path aponta para o bucket privado abaixo.
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode ENVIAR um orcamento: o formulario e publico e roda
-- com a anon key.
CREATE POLICY "Anyone can submit a quote request"
  ON public.quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Leitura SOMENTE para admin. Ao contrario de product_images, aqui NAO cabe
-- USING (true): a tabela guarda nome, e-mail e telefone de clientes, e a anon
-- key esta publica no bundle do site — qualquer visitante poderia baixar a
-- base inteira de contatos.
CREATE POLICY "Admins can view quote requests"
  ON public.quote_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quote requests"
  ON public.quote_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX quote_requests_created_at_idx
  ON public.quote_requests (created_at DESC);

-- Bucket PRIVADO para os anexos (plantas, fotos do ambiente). Diferente de
-- 'product-photos', que e publico: plantas de clientes nao devem ficar
-- acessiveis por URL adivinhavel.
INSERT INTO storage.buckets (id, name, public)
VALUES ('quote-attachments', 'quote-attachments', false);

CREATE POLICY "Anyone can upload quote attachments"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'quote-attachments');

CREATE POLICY "Admins can read quote attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'quote-attachments'
    AND public.has_role(auth.uid(), 'admin')
  );
