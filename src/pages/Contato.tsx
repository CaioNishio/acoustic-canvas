import { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";

export default function ContatoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <SectionHeading tag="Contato" title="Fale Conosco" description="Estamos prontos para ajudar no seu projeto acústico." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info */}
            <div className="space-y-6">
              <div className="glass-card p-6 flex items-start gap-4">
                <Mail className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display font-semibold">E-mail</h3>
                  <p className="text-sm text-muted-foreground">contato@sonaracusticos.com.br</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-start gap-4">
                <Phone className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display font-semibold">Telefone</h3>
                  <p className="text-sm text-muted-foreground">(11) 96748-4000</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-start gap-4">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display font-semibold">Endereço</h3>
                  <p className="text-sm text-muted-foreground">São Paulo, SP — Brasil</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass-card p-6 md:p-8">
              {sent ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
                  <div className="w-12 h-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Check className="text-primary" size={24} />
                  </div>
                  <p className="font-display font-semibold">Mensagem enviada!</p>
                  <p className="text-sm text-muted-foreground mt-1">Retornaremos em breve.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Nome</label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">E-mail</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary" required />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Mensagem</label>
                    <textarea value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary resize-none" required />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                    <Send size={16} /> Enviar Mensagem
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
