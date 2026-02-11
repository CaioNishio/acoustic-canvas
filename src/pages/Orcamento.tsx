import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";

const steps = ["Seus Dados", "Sobre o Projeto", "Arquivos", "Confirmação"];

export default function OrcamentoPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    projectType: "", area: "", city: "", description: "",
    files: [] as File[],
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string | File[]) => setForm((f) => ({ ...f, [field]: value }));
  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const submit = () => {
    // Future: send to database
    setSubmitted(true);
  };

  const Input = ({ label, field, type = "text", required = false }: { label: string; field: string; type?: string; required?: boolean }) => (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">{label}{required && " *"}</label>
      <input
        type={type}
        value={(form as any)[field]}
        onChange={(e) => update(field, e.target.value)}
        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container mx-auto max-w-lg text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 bg-primary/10 rounded-full mx-auto flex items-center justify-center mb-6">
              <Check className="text-primary" size={32} />
            </motion.div>
            <h2 className="font-display text-3xl font-bold">Orçamento Enviado!</h2>
            <p className="text-muted-foreground mt-3">Recebemos sua solicitação e entraremos em contato em até 24 horas.</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <SectionHeading tag="Orçamento" title="Solicitar Orçamento" description="Preencha o formulário abaixo para receber uma proposta personalizada." />

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  i <= step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="glass-card p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Seus Dados</h3>
                    <Input label="Nome completo" field="name" required />
                    <Input label="E-mail" field="email" type="email" required />
                    <Input label="Telefone" field="phone" type="tel" required />
                    <Input label="Empresa" field="company" />
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Sobre o Projeto</h3>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Tipo de projeto *</label>
                      <select value={form.projectType} onChange={(e) => update("projectType", e.target.value)} className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary">
                        <option value="">Selecione</option>
                        <option value="estudio">Estúdio</option>
                        <option value="igreja">Igreja</option>
                        <option value="auditorio">Auditório</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="residencial">Residencial</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>
                    <Input label="Área aproximada (m²)" field="area" />
                    <Input label="Cidade / Estado" field="city" required />
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Descrição do projeto</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={4}
                        className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Arquivos (opcional)</h3>
                    <p className="text-sm text-muted-foreground">Anexe plantas, fotos ou outros arquivos relevantes.</p>
                    <label className="glass-card-hover flex flex-col items-center justify-center py-12 cursor-pointer">
                      <Upload className="text-muted-foreground mb-2" size={32} />
                      <span className="text-sm text-muted-foreground">Clique para enviar arquivos</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => update("files", Array.from(e.target.files || []))}
                      />
                    </label>
                    {form.files.length > 0 && (
                      <ul className="space-y-1">
                        {form.files.map((f, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{f.name}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Confirme os dados</h3>
                    <div className="glass-card divide-y divide-border text-sm">
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Nome</span><span>{form.name || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">E-mail</span><span>{form.email || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Telefone</span><span>{form.phone || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Empresa</span><span>{form.company || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Tipo</span><span>{form.projectType || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Cidade</span><span>{form.city || "—"}</span></div>
                      <div className="flex justify-between px-4 py-3"><span className="text-muted-foreground">Arquivos</span><span>{form.files.length} arquivo(s)</span></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={prev} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={14} /> Voltar
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={next} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-1 text-sm">
                  Próximo <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={submit} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-1 text-sm">
                  Enviar Orçamento <Check size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
