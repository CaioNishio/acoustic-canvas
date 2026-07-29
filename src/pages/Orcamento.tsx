import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Upload, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/shared/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

const steps = ["Seus Dados", "Sobre o Projeto", "Arquivos", "Confirmação"];

const PROJECT_TYPES = [
  { value: "estudio", label: "Estúdio" },
  { value: "igreja", label: "Igreja" },
  { value: "auditorio", label: "Auditório" },
  { value: "corporativo", label: "Corporativo" },
  { value: "residencial", label: "Residencial" },
  { value: "outro", label: "Outro" },
];

const MAX_FILE_MB = 10;
const MAX_FILES = 10;

type FormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  area: string;
  city: string;
  description: string;
  files: File[];
};

const EMPTY_FORM: FormState = {
  name: "", email: "", phone: "", company: "",
  projectType: "", area: "", city: "", description: "",
  files: [],
};

// (11) 98765-4321 — corta em 11 digitos (celular com nono digito).
function maskPhone(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const inputClass =
  "w-full bg-secondary border rounded-md px-3 py-2 text-foreground outline-none focus:ring-1 focus:ring-primary";

/**
 * Traduz a falha real em algo acionavel. Mensagem generica esconde a causa e
 * faz o cliente tentar de novo contra um erro que nunca vai passar sozinho.
 *
 * Os codigos vem do PostgREST (tabela/coluna) e do Storage do Supabase.
 */
function mensagemDeErro(err: unknown): string {
  const e = err as { code?: string; message?: string; statusCode?: string | number };
  const code = String(e?.code ?? e?.statusCode ?? "");
  const msg = (e?.message ?? "").toLowerCase();

  // Tabela public.quote_requests ausente no banco: a migracao nao foi aplicada.
  if (code === "PGRST205" || code === "42P01" || msg.includes("does not exist")) {
    return "O envio está temporariamente indisponível por uma configuração pendente do servidor. Seus dados foram preservados — fale conosco pelo WhatsApp que damos andamento agora.";
  }
  // Bucket quote-attachments ausente.
  if (msg.includes("bucket not found")) {
    return "Não foi possível enviar os anexos por uma configuração pendente do servidor. Remova os arquivos e envie sem anexos, ou fale conosco pelo WhatsApp.";
  }
  // RLS barrou o insert anonimo.
  if (code === "42501" || msg.includes("row-level security") || msg.includes("policy")) {
    return "O envio foi recusado pelo servidor por uma permissão pendente. Seus dados foram preservados — fale conosco pelo WhatsApp.";
  }
  if (msg.includes("payload too large") || code === "413") {
    return `Um dos arquivos excede o limite de ${MAX_FILE_MB} MB. Remova ou substitua o arquivo e tente novamente. Os demais dados foram preservados.`;
  }
  if (msg.includes("mime") || msg.includes("content-type")) {
    return "Um dos arquivos está em um formato não aceito. Envie imagens ou PDF. Os demais dados foram preservados.";
  }
  if (msg.includes("failed to fetch") || msg.includes("networkerror") || msg.includes("load failed")) {
    return "Não conseguimos falar com o servidor. Verifique sua conexão e tente novamente — seus dados foram preservados.";
  }
  return "Não conseguimos concluir o envio. Seus dados foram preservados — tente novamente em instantes ou fale conosco pelo WhatsApp.";
}

const WHATSAPP_NUMBER = "5511967484000"; // mesmo numero usado em QuoteCartDrawer.tsx

/** Protocolo curto e legivel a partir do UUID retornado pelo insert. */
function protocoloFromId(id: string): string {
  return `SNR-${id.slice(0, 8).toUpperCase()}`;
}

/**
 * Resumo estruturado para o cliente encaminhar por WhatsApp apos o envio.
 *
 * So os campos que o formulario de fato coleta — sem inventar quantidade,
 * prazo ou condicao comercial que nao existem aqui. Campos vazios sao
 * omitidos, para nao gerar linhas em branco nem link maior que o necessario.
 */
function buildWhatsAppMessage(protocolo: string, form: FormState, projectTypeLabel?: string): string {
  const linhas = [
    "Olá! Gostaria de solicitar uma avaliação acústica.",
    "",
    "PROTOCOLO",
    protocolo,
    "",
    "CLIENTE",
    `Nome: ${form.name}`,
    form.company && `Empresa: ${form.company}`,
    `Telefone: ${form.phone}`,
    `E-mail: ${form.email}`,
    `Cidade/UF: ${form.city}`,
    "",
    "AMBIENTE",
    `Tipo: ${projectTypeLabel || "—"}`,
    form.area && `Área aproximada: ${form.area} m²`,
    form.description && `Descrição: ${form.description}`,
    "",
    "Enviei essas informações pelo formulário de orçamento da Sonar Acústicos.",
  ];
  // `campo && texto` vira "" quando o campo opcional esta vazio — mesmo
  // valor de uma linha em branco intencional, entao o join ja fica correto;
  // o replace so evita blocos de 3+ linhas em branco quando dois campos
  // opcionais seguidos estao vazios.
  return linhas.join("\n").replace(/\n{3,}/g, "\n\n");
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  placeholder?: string;
};

// Definido no escopo do modulo, e NAO dentro de OrcamentoPage: um componente
// declarado durante o render vira um tipo novo a cada keystroke, e o React
// desmonta e remonta o <input>, fazendo o campo perder o foco enquanto o
// usuario digita.
function Field({ label, value, onChange, type = "text", required, error, inputMode, placeholder }: FieldProps) {
  return (
    <div>
      <label className="text-sm text-muted-foreground mb-1 block">
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`${inputClass} ${error ? "border-destructive" : "border-border"}`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function OrcamentoPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [protocolo, setProtocolo] = useState<string | null>(null);

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: "" } : e));
  };

  // Valida so o passo pedido e devolve os erros encontrados.
  const validateStep = (target: number) => {
    const found: Record<string, string> = {};

    if (target === 0) {
      if (form.name.trim().length < 2) found.name = "Informe seu nome completo.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) found.email = "E-mail inválido.";
      const digits = form.phone.replace(/\D/g, "");
      if (digits.length < 10) found.phone = "Telefone incompleto — inclua o DDD.";
    }

    if (target === 1) {
      if (!form.projectType) found.projectType = "Selecione o tipo de projeto.";
      if (form.city.trim().length < 2) found.city = "Informe cidade e estado.";
      if (form.area && !/^\d+([.,]\d+)?$/.test(form.area.trim())) found.area = "Use apenas números (ex: 45 ou 45,5).";
    }

    return found;
  };

  const next = () => {
    const found = validateStep(step);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const addFiles = (incoming: File[]) => {
    const accepted: File[] = [];
    for (const file of incoming) {
      if (file.size > MAX_FILE_MB * 1024 * 1024) {
        toast.error(`${file.name} passa de ${MAX_FILE_MB} MB e foi ignorado.`);
        continue;
      }
      accepted.push(file);
    }
    const total = [...form.files, ...accepted].slice(0, MAX_FILES);
    if (form.files.length + accepted.length > MAX_FILES) {
      toast.error(`Máximo de ${MAX_FILES} arquivos.`);
    }
    update("files", total);
  };

  const removeFile = (index: number) =>
    update("files", form.files.filter((_, i) => i !== index));

  const submit = async () => {
    // Revalida os dois passos com campos obrigatorios: o usuario pode ter
    // voltado e apagado algo depois de passar pela validacao.
    const found = { ...validateStep(0), ...validateStep(1) };
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setStep(found.name || found.email || found.phone ? 0 : 1);
      toast.error("Revise os campos destacados antes de enviar.");
      return;
    }

    setSubmitting(true);
    try {
      const attachments: { path: string; name: string; size: number }[] = [];

      for (const file of form.files) {
        const path = `${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
        const { error: uploadError } = await supabase.storage
          .from("quote-attachments")
          .upload(path, file);

        if (uploadError) throw uploadError;
        attachments.push({ path, name: file.name, size: file.size });
      }

      const { data: inserted, error: insertError } = await supabase
        .from("quote_requests")
        .insert({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.replace(/\D/g, ""),
          company: form.company.trim() || null,
          project_type: form.projectType,
          area: form.area.trim() || null,
          city: form.city.trim(),
          description: form.description.trim() || null,
          attachments,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      setProtocolo(protocoloFromId(inserted.id));
      setSubmitted(true);
    } catch (err) {
      console.error("Falha ao enviar orçamento:", err);
      toast.error(mensagemDeErro(err), { duration: 8000 });
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypeLabel = PROJECT_TYPES.find((t) => t.value === form.projectType)?.label;

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
            {protocolo && (
              <>
                <p className="text-sm text-muted-foreground mt-4">
                  Protocolo <span className="font-mono font-semibold text-foreground">{protocolo}</span>
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(protocolo, form, projectTypeLabel))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  Enviar resumo por WhatsApp
                </a>
                <p className="text-xs text-muted-foreground mt-3">
                  Opcional — adianta o atendimento, mas seu orçamento já foi registrado com o protocolo acima.
                </p>
              </>
            )}
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
                    <Field label="Nome completo" required value={form.name} error={errors.name} onChange={(v) => update("name", v)} />
                    <Field label="E-mail" type="email" inputMode="email" required value={form.email} error={errors.email} onChange={(v) => update("email", v)} />
                    <Field label="Telefone" type="tel" inputMode="tel" placeholder="(11) 98765-4321" required value={form.phone} error={errors.phone} onChange={(v) => update("phone", maskPhone(v))} />
                    <Field label="Empresa" value={form.company} onChange={(v) => update("company", v)} />
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Sobre o Projeto</h3>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Tipo de projeto *</label>
                      <select
                        value={form.projectType}
                        onChange={(e) => update("projectType", e.target.value)}
                        aria-invalid={!!errors.projectType}
                        className={`${inputClass} ${errors.projectType ? "border-destructive" : "border-border"}`}
                      >
                        <option value="">Selecione</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      {errors.projectType && <p className="text-xs text-destructive mt-1">{errors.projectType}</p>}
                    </div>
                    <Field label="Área aproximada (m²)" inputMode="numeric" value={form.area} error={errors.area} onChange={(v) => update("area", v)} />
                    <Field label="Cidade / Estado" required value={form.city} error={errors.city} onChange={(v) => update("city", v)} />
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Descrição do projeto</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={4}
                        className={`${inputClass} border-border resize-none`}
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Arquivos (opcional)</h3>
                    <p className="text-sm text-muted-foreground">
                      Anexe plantas, fotos ou outros arquivos relevantes. Até {MAX_FILES} arquivos, {MAX_FILE_MB} MB cada.
                    </p>
                    <label className="glass-card-hover flex flex-col items-center justify-center py-12 cursor-pointer">
                      <Upload className="text-muted-foreground mb-2" size={32} />
                      <span className="text-sm text-muted-foreground">Clique para enviar arquivos</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          addFiles(Array.from(e.target.files || []));
                          e.target.value = "";
                        }}
                      />
                    </label>
                    {form.files.length > 0 && (
                      <ul className="space-y-1">
                        {form.files.map((f, i) => (
                          <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              aria-label={`Remover ${f.name}`}
                              className="shrink-0 hover:text-foreground transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {step === 3 && (
                  <div className="space-y-4">
                    <h3 className="font-display text-lg font-semibold mb-4">Confirme os dados</h3>
                    <div className="glass-card divide-y divide-border text-sm">
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Nome</span><span className="text-right">{form.name || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">E-mail</span><span className="text-right break-all">{form.email || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Telefone</span><span className="text-right">{form.phone || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Empresa</span><span className="text-right">{form.company || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Tipo</span><span className="text-right">{projectTypeLabel || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Área</span><span className="text-right">{form.area ? `${form.area} m²` : "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Cidade</span><span className="text-right">{form.city || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Descrição</span><span className="text-right">{form.description || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-muted-foreground">Arquivos</span><span className="text-right">{form.files.length} arquivo(s)</span></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={prev} disabled={submitting} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-50">
                  <ArrowLeft size={14} /> Voltar
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={next} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-1 text-sm">
                  Próximo <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-1 text-sm disabled:opacity-60">
                  {submitting ? <><Loader2 className="animate-spin" size={14} /> Enviando...</> : <>Enviar Orçamento <Check size={14} /></>}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
