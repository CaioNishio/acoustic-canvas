-- Propostas comerciais (orcamentos/pedidos de venda) emitidas pela equipe,
-- seguindo o mesmo layout do documento em PDF ja usado pela Sonar Acusticos
-- (numero sequencial, dados do cliente, itens, impostos, totais).
--
-- Diferente de public.quote_requests (formulario publico de lead, sem itens
-- nem valores): esta tabela guarda o documento comercial formal que um
-- administrador emite a partir do painel /admin/orcamentos, com itens e
-- valores ja calculados, pronta para impressao/PDF e envio por e-mail.

CREATE SEQUENCE public.commercial_quote_number_seq START 32;

CREATE TABLE public.commercial_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_number INTEGER NOT NULL DEFAULT nextval('public.commercial_quote_number_seq'),

  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE NOT NULL,

  -- Dados do cliente — mesmos campos do template em PDF.
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

  -- [{ description, sku, dimensions, unit, quantity, unitPrice, total }]
  items JSONB NOT NULL DEFAULT '[]'::jsonb,

  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,

  notes TEXT,
  status TEXT NOT NULL DEFAULT 'rascunho', -- rascunho | enviado | aprovado | recusado
  email_sent_at TIMESTAMP WITH TIME ZONE,

  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commercial_quotes ENABLE ROW LEVEL SECURITY;

-- Ferramenta interna: todo o CRUD fica restrito a administradores. Nao ha
-- policy para anon — diferente de quote_requests, aqui nao existe envio
-- publico.
CREATE POLICY "Admins can view commercial quotes"
  ON public.commercial_quotes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert commercial quotes"
  ON public.commercial_quotes FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update commercial quotes"
  ON public.commercial_quotes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX commercial_quotes_created_at_idx
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

CREATE TRIGGER commercial_quotes_set_updated_at
  BEFORE UPDATE ON public.commercial_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.set_commercial_quote_updated_at();
