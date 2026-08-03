import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Upload, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
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
  "w-full rounded-lg border bg-snr-white px-3 py-2.5 text-sm text-snr-graphite outline-none transition-colors focus:border-snr-ocean";

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

/** Protocolo curto e legivel a partir do UUID da solicitacao. */
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
function buildWhatsAppMessage(protocolo: string | null, form: FormState, projectTypeLabel?: string): string {
  const linhas = [
    "Olá! Gostaria de solicitar uma avaliação acústica.",
    "",
    // Sem protocolo o envio não chegou ao servidor: avisar isso aqui evita que
    // o atendimento procure um registro que não existe.
    ...(protocolo
      ? ["PROTOCOLO", protocolo]
      : ["(O envio pelo site falhou — estes dados vieram direto do formulário.)"]),
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
      <label className="mb-1.5 block text-xs text-snr-mineral-700">
        {label}{required && " *"}
      </label>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        className={`${inputClass} ${error ? "border-destructive" : "border-snr-mineral-100"}`}
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

      // O id e gerado AQUI, nao lido de volta do banco. Motivo: `.select()`
      // depois de `.insert()` vira `INSERT ... RETURNING id`, e o RETURNING
      // exige policy de SELECT. A tabela so permite SELECT para admin — de
      // proposito, porque ela guarda nome, e-mail e telefone de clientes e a
      // anon key e publica no bundle. Resultado: o visitante anonimo passava
      // no INSERT e era barrado no retorno, o envio inteiro falhava e o lead
      // era perdido. Gerando o id no cliente nao ha releitura, nao e preciso
      // abrir SELECT para anon, e o protocolo sai igual.
      const requestId = crypto.randomUUID();

      const { error: insertError } = await supabase
        .from("quote_requests")
        .insert({
          id: requestId,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: form.phone.replace(/\D/g, ""),
          company: form.company.trim() || null,
          project_type: form.projectType,
          area: form.area.trim() || null,
          city: form.city.trim(),
          description: form.description.trim() || null,
          attachments,
        });

      if (insertError) throw insertError;
      setProtocolo(protocoloFromId(requestId));
      setSubmitted(true);
    } catch (err) {
      console.error("Falha ao enviar orçamento:", err);
      // Falar em "fale conosco pelo WhatsApp" sem dar o caminho deixa o cliente
      // procurar o número sozinho — na prática, o lead se perde. A ação abre o
      // WhatsApp já com todos os dados preenchidos que ele acabou de digitar.
      const tipo = PROJECT_TYPES.find((t) => t.value === form.projectType)?.label;
      toast.error(mensagemDeErro(err), {
        duration: 15000,
        action: {
          label: "Enviar por WhatsApp",
          onClick: () =>
            window.open(
              `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                buildWhatsAppMessage(null, form, tipo),
              )}`,
              "_blank",
              "noopener,noreferrer",
            ),
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const projectTypeLabel = PROJECT_TYPES.find((t) => t.value === form.projectType)?.label;

  if (submitted) {
    return (
      <Layout>
        <section className="snr-home snr-section bg-snr-white">
          <div className="snr-container max-w-lg text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-snr-petrol">
              <Check className="text-snr-white" size={30} strokeWidth={2} />
            </motion.div>
            <h2 className="snr-title text-snr-graphite">Orçamento enviado</h2>
            <p className="snr-body mt-3 text-snr-mineral-700">Recebemos sua solicitação e entraremos em contato em até 24 horas.</p>
            {protocolo && (
              <>
                <p className="mt-4 text-sm text-snr-mineral-700">
                  Protocolo <span className="font-mono font-semibold text-snr-graphite">{protocolo}</span>
                </p>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(protocolo, form, projectTypeLabel))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  Enviar resumo por WhatsApp
                </a>
                <p className="mt-3 text-xs text-snr-mineral-500">
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
      <div className="snr-home bg-snr-white">
        {/* Abertura em grafite: tira o formulário do branco puro e dá contexto */}
        <section className="snr-section bg-snr-graphite text-snr-white snr-on-dark snr-tone-dark">
          <div className="snr-container max-w-2xl">
            <p className="snr-caption snr-rule-editorial text-snr-ocean-light">Orçamento</p>
            <h1 className="snr-title mt-3 text-snr-white">Solicitar orçamento</h1>
            <p className="snr-body mt-4 text-snr-mineral-300">
              Preencha o formulário e nossa equipe técnica dimensiona a solução para o seu
              ambiente.
            </p>
          </div>
        </section>

        <section className="snr-section">
          <div className="snr-container max-w-2xl">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors duration-ui ease-snr ${
                  i <= step ? "bg-snr-petrol text-snr-white" : "bg-snr-paper text-snr-mineral-500"
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`w-8 h-px transition-colors duration-ui ease-snr ${i < step ? "bg-snr-petrol" : "bg-snr-mineral-100"}`} />}
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-snr-paper p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="snr-card-title mb-5 text-snr-graphite">Seus Dados</h3>
                    <Field label="Nome completo" required value={form.name} error={errors.name} onChange={(v) => update("name", v)} />
                    <Field label="E-mail" type="email" inputMode="email" required value={form.email} error={errors.email} onChange={(v) => update("email", v)} />
                    <Field label="Telefone" type="tel" inputMode="tel" placeholder="(11) 98765-4321" required value={form.phone} error={errors.phone} onChange={(v) => update("phone", maskPhone(v))} />
                    <Field label="Empresa" value={form.company} onChange={(v) => update("company", v)} />
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-4">
                    <h3 className="snr-card-title mb-5 text-snr-graphite">Sobre o Projeto</h3>
                    <div>
                      <label className="mb-1.5 block text-xs text-snr-mineral-700">Tipo de projeto *</label>
                      <select
                        value={form.projectType}
                        onChange={(e) => update("projectType", e.target.value)}
                        aria-invalid={!!errors.projectType}
                        className={`${inputClass} ${errors.projectType ? "border-destructive" : "border-snr-mineral-100"}`}
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
                      <label className="mb-1.5 block text-xs text-snr-mineral-700">Descrição do projeto</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        rows={4}
                        className={`${inputClass} border-snr-mineral-100 resize-none`}
                      />
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div className="space-y-4">
                    <h3 className="snr-card-title mb-5 text-snr-graphite">Arquivos (opcional)</h3>
                    <p className="text-sm text-snr-mineral-700">
                      Anexe plantas, fotos ou outros arquivos relevantes. Até {MAX_FILES} arquivos, {MAX_FILE_MB} MB cada.
                    </p>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-snr-mineral-100 bg-snr-white py-12 transition-colors duration-ui ease-snr hover:border-snr-ocean">
                      <Upload className="mb-2 text-snr-mineral-500" size={32} />
                      <span className="text-sm text-snr-mineral-700">Clique para enviar arquivos</span>
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
                          <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2 text-sm text-snr-mineral-700">
                            <span className="truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              aria-label={`Remover ${f.name}`}
                              className="shrink-0 transition-colors hover:text-snr-graphite"
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
                    <h3 className="snr-card-title mb-5 text-snr-graphite">Confirme os dados</h3>
                    <div className="divide-y divide-snr-mineral-100 rounded-xl bg-snr-white text-sm">
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Nome</span><span className="text-right">{form.name || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">E-mail</span><span className="text-right break-all">{form.email || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Telefone</span><span className="text-right">{form.phone || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Empresa</span><span className="text-right">{form.company || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Tipo</span><span className="text-right">{projectTypeLabel || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Área</span><span className="text-right">{form.area ? `${form.area} m²` : "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Cidade</span><span className="text-right">{form.city || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Descrição</span><span className="text-right">{form.description || "—"}</span></div>
                      <div className="flex justify-between gap-4 px-4 py-3"><span className="text-snr-mineral-500">Arquivos</span><span className="text-right">{form.files.length} arquivo(s)</span></div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Nav buttons */}
            <div className="flex justify-between mt-8">
              {step > 0 ? (
                <button onClick={prev} disabled={submitting} className="inline-flex min-h-11 items-center gap-1.5 text-sm text-snr-mineral-700 transition-colors duration-micro ease-snr hover:text-snr-graphite disabled:opacity-50">
                  <ArrowLeft size={14} /> Voltar
                </button>
              ) : <div />}
              {step < 3 ? (
                <button onClick={next} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-snr-petrol px-6 text-sm font-medium text-snr-white transition-colors duration-micro ease-snr hover:bg-snr-petrol-light">
                  Próximo <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={submit} disabled={submitting} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-snr-orange px-6 text-sm font-medium text-snr-white transition-all duration-micro ease-snr hover:brightness-95 disabled:opacity-60">
                  {submitting ? <><Loader2 className="animate-spin" size={14} /> Enviando…</> : <>Enviar orçamento <Check size={14} /></>}
                </button>
              )}
            </div>
          </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
