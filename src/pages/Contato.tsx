import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Eyebrow, Lead, Reveal, Section, SectionTitle } from "@/components/sonar/primitives";
import { supabase } from "@/integrations/supabase/client";

const CONTACTS = [
  { icon: Mail, label: "E-mail", value: "contato@sonaracusticos.com.br", href: "mailto:contato@sonaracusticos.com.br" },
  { icon: Phone, label: "Telefone", value: "(11) 96748-4000", href: "https://wa.me/5511967484000" },
  { icon: MapPin, label: "Endereço", value: "São Paulo, SP — Brasil", href: null },
];

const inputCls =
  "w-full rounded-lg border border-snr-mineral-100 bg-snr-white px-3 py-2.5 text-sm text-snr-graphite outline-none transition-colors focus:border-snr-ocean";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  /**
   * Antes esta funcao apenas fazia setSent(true) — a mensagem do visitante era
   * descartada sem nunca chegar a ninguem. Agora grava em
   * public.contact_messages, e so mostra a tela de sucesso se o insert passou.
   */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      console.error("Falha ao enviar mensagem de contato:", err);
      toast.error(
        "Não conseguimos registrar sua mensagem. Fale conosco pelo WhatsApp (11) 96748-4000 — seus dados foram preservados.",
        { duration: 8000 },
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="snr-home bg-snr-white">
        <Section tone="dark">
          <div className="max-w-2xl">
            <Eyebrow className="text-snr-ocean-light">Contato</Eyebrow>
            <SectionTitle className="mt-3 text-snr-white">Fale com um especialista</SectionTitle>
            <Lead className="mt-4 text-snr-mineral-300">
              Conte o que está acontecendo no seu ambiente. Respondemos com um diagnóstico
              inicial, sem compromisso.
            </Lead>
          </div>
        </Section>

        <Section>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Canais diretos */}
            <div className="space-y-4">
              {CONTACTS.map(({ icon: Icon, label, value, href }, i) => {
                const inner = (
                  <div className="flex items-start gap-4 rounded-2xl bg-snr-paper p-6 transition-shadow duration-ui ease-snr hover:shadow-[0_16px_36px_-22px_hsl(var(--snr-graphite)/0.35)]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-snr-ocean-wash">
                      <Icon className="h-4 w-4 text-snr-ocean" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-medium text-snr-graphite">{label}</h3>
                      <p className="mt-0.5 text-[13px] text-snr-mineral-700">{value}</p>
                    </div>
                  </div>
                );
                return (
                  <Reveal key={label} delay={i * 70}>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </Reveal>
                );
              })}
            </div>

            {/* Formulário */}
            <div className="rounded-2xl bg-snr-ocean-wash p-6 md:p-8">
              {sent ? (
                <motion.div
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-10 text-center"
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-snr-petrol">
                    <Check className="text-snr-white" size={26} strokeWidth={2} />
                  </div>
                  <p className="snr-card-title text-snr-graphite">Mensagem registrada</p>
                  <p className="mt-1.5 text-[13px] text-snr-mineral-700">Retornaremos em breve.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label htmlFor="contato-nome" className="mb-1.5 block text-xs text-snr-mineral-700">Nome</label>
                    <input
                      id="contato-nome"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contato-email" className="mb-1.5 block text-xs text-snr-mineral-700">E-mail</label>
                    <input
                      id="contato-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className={inputCls}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contato-mensagem" className="mb-1.5 block text-xs text-snr-mineral-700">Mensagem</label>
                    <textarea
                      id="contato-mensagem"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      rows={5}
                      className={`${inputCls} resize-none`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-snr-petrol px-6 text-sm font-medium text-snr-white transition-colors duration-micro ease-snr hover:bg-snr-petrol-light disabled:opacity-60"
                  >
                    {sending ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {sending ? "Enviando…" : "Enviar mensagem"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </Section>
      </div>
    </Layout>
  );
}
