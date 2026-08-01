-- Mensagens enviadas pelo formulario publico de contato (/contato).
--
-- Ate agora o formulario NAO gravava nada: submit() apenas trocava a tela para
-- "Mensagem enviada!". Toda mensagem enviada pelo site foi perdida — mesmo
-- defeito que public.quote_requests corrigiu para o formulario de orcamento.

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode ENVIAR: o formulario e publico e roda com a anon key.
CREATE POLICY "Anyone can submit a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Leitura SOMENTE para admin. A anon key esta publica no bundle do site; sem
-- esta restricao qualquer visitante baixaria a base de contatos inteira.
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);
