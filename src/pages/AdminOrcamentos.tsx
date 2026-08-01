import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, LogOut, Plus, Printer, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { productPrices } from "@/data/productPrices";
import logo from "@/assets/logo-sonar.png";

interface QuoteItem {
  id: string;
  slug: string;
  description: string;
  sku: string;
  dimensions: string;
  unit: string;
  quantity: number;
  unitPrice: number;
}

interface ClientData {
  name: string;
  document: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  stateRegistration: string;
}

const EMPTY_CLIENT: ClientData = {
  name: "", document: "", address: "", neighborhood: "",
  city: "", state: "", zip: "", phone: "", email: "", stateRegistration: "",
};

const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const todayIso = () => new Date().toISOString().slice(0, 10);
const inDaysIso = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};
const dateBr = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const inputCls =
  "w-full rounded-lg border border-snr-mineral-100 bg-snr-white px-3 py-2 text-sm text-snr-graphite outline-none transition-colors focus:border-snr-ocean";

let itemSeq = 0;
const newItem = (): QuoteItem => ({
  id: `item-${Date.now()}-${itemSeq++}`,
  slug: "", description: "", sku: "", dimensions: "", unit: "un.", quantity: 1, unitPrice: 0,
});

export default function AdminOrcamentosPage() {
  const { isAdmin, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [client, setClient] = useState<ClientData>(EMPTY_CLIENT);
  const [issueDate, setIssueDate] = useState(todayIso());
  const [validUntil, setValidUntil] = useState(inDaysIso(10));
  const [items, setItems] = useState<QuoteItem[]>([newItem()]);
  const [discount, setDiscount] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const [notes, setNotes] = useState(
    "Prazo de entrega: a combinar conforme escopo do projeto.\nCondições de pagamento: a combinar.\nInstalação realizada por equipe especializada da SONAR ACÚSTICOS.",
  );
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [docNumber, setDocNumber] = useState<number | null>(null);

  const productOptions = useMemo(
    () => products.map((p) => ({ slug: p.slug, name: p.name, category: p.category })),
    [],
  );

  const updateClient = <K extends keyof ClientData>(field: K, value: string) =>
    setClient((c) => ({ ...c, [field]: value }));

  const updateItem = (id: string, patch: Partial<QuoteItem>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const pickProduct = (id: string, slug: string) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) {
      updateItem(id, { slug, description: "", sku: "", unitPrice: 0 });
      return;
    }
    const pricing = productPrices[slug];
    updateItem(id, {
      slug,
      description: product.name,
      sku: slug.toUpperCase().replace(/-/g, ""),
      dimensions: product.thickness ? `Espessura ${product.thickness}` : "",
      unitPrice: pricing?.basePrice ?? 0,
      unit: pricing?.unit === "m²" ? "m²" : "un.",
    });
  };

  const addItem = () => setItems((list) => [...list, newItem()]);
  const removeItem = (id: string) => setItems((list) => (list.length > 1 ? list.filter((it) => it.id !== id) : list));

  const lineTotal = (item: QuoteItem) => item.quantity * item.unitPrice;
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0);
  const total = Math.max(subtotal - discount + taxTotal, 0);

  const buildPayload = () => ({
    docNumber: docNumber ?? 0,
    issueDate,
    validUntil,
    client,
    items: items
      .filter((it) => it.description.trim())
      .map((it) => ({
        description: it.description,
        sku: it.sku || undefined,
        dimensions: it.dimensions || undefined,
        unit: it.unit,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        total: lineTotal(it),
      })),
    subtotal,
    discount,
    taxTotal,
    total,
    notes: notes.trim() || undefined,
  });

  const validate = () => {
    if (!client.name.trim()) return "Informe o nome ou razão social do cliente.";
    if (!client.email.trim()) return "Informe o e-mail do cliente.";
    if (!items.some((it) => it.description.trim())) return "Adicione pelo menos um item.";
    return null;
  };

  const save = async () => {
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return null;
    }
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("commercial_quotes")
        .insert({
          issue_date: issueDate,
          valid_until: validUntil,
          client_name: client.name.trim(),
          client_document: client.document.trim() || null,
          client_address: client.address.trim() || null,
          client_neighborhood: client.neighborhood.trim() || null,
          client_city: client.city.trim() || null,
          client_state: client.state.trim() || null,
          client_zip: client.zip.trim() || null,
          client_phone: client.phone.trim() || null,
          client_email: client.email.trim().toLowerCase(),
          client_state_registration: client.stateRegistration.trim() || null,
          items: buildPayload().items,
          subtotal,
          discount,
          tax_total: taxTotal,
          total,
          notes: notes.trim() || null,
        })
        .select("doc_number")
        .single();

      if (error) throw error;
      setDocNumber(data.doc_number);
      toast.success(`Orçamento N° ${String(data.doc_number).padStart(4, "0")} salvo.`);
      return data.doc_number as number;
    } catch (err) {
      console.error("Falha ao salvar orçamento:", err);
      toast.error("Não foi possível salvar. Verifique se a migração da tabela foi aplicada no Supabase.");
      return null;
    } finally {
      setSaving(false);
    }
  };

  const sendEmail = async () => {
    const problem = validate();
    if (problem) {
      toast.error(problem);
      return;
    }
    setSending(true);
    try {
      const number = docNumber ?? (await save());
      if (!number) return;

      const { error } = await supabase.functions.invoke("send-quote-email", {
        body: { ...buildPayload(), docNumber: number },
      });
      if (error) throw error;
      toast.success("E-mail enviado para o cliente, com cópia para a Sonar.");
    } catch (err) {
      console.error("Falha ao enviar e-mail do orçamento:", err);
      toast.error(
        "O envio automático ainda não está configurado no servidor (faltam os secrets GMAIL_USER/GMAIL_APP_PASSWORD). O documento já foi salvo — use \"Imprimir / Salvar PDF\" e envie manualmente por enquanto.",
        { duration: 10000 },
      );
    } finally {
      setSending(false);
    }
  };

  const print = async () => {
    if (!docNumber) {
      const number = await save();
      if (!number) return;
    }
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-snr-ocean" size={32} />
        </div>
      </Layout>
    );
  }
  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return (
    <Layout>
      <div className="snr-home bg-snr-white">
        <section className="snr-section print:hidden">
          <div className="snr-container">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="snr-caption snr-rule-editorial text-snr-mineral-700">Ferramenta interna</p>
                <h1 className="snr-title mt-3 text-snr-graphite">Gerador de orçamentos</h1>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => { await supabase.auth.signOut(); navigate("/admin-login"); }}
              >
                <LogOut size={14} className="mr-1.5" /> Sair
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Dados do cliente */}
              <div className="rounded-2xl bg-snr-paper p-6">
                <h2 className="snr-card-title mb-4 text-snr-graphite">Dados do cliente</h2>
                <div className="grid grid-cols-2 gap-3">
                  <input className={`${inputCls} col-span-2`} placeholder="Razão social / Nome *" value={client.name} onChange={(e) => updateClient("name", e.target.value)} />
                  <input className={inputCls} placeholder="CNPJ / CPF" value={client.document} onChange={(e) => updateClient("document", e.target.value)} />
                  <input className={inputCls} placeholder="Inscrição estadual" value={client.stateRegistration} onChange={(e) => updateClient("stateRegistration", e.target.value)} />
                  <input className={`${inputCls} col-span-2`} placeholder="Endereço" value={client.address} onChange={(e) => updateClient("address", e.target.value)} />
                  <input className={inputCls} placeholder="Bairro" value={client.neighborhood} onChange={(e) => updateClient("neighborhood", e.target.value)} />
                  <input className={inputCls} placeholder="CEP" value={client.zip} onChange={(e) => updateClient("zip", e.target.value)} />
                  <input className={inputCls} placeholder="Cidade" value={client.city} onChange={(e) => updateClient("city", e.target.value)} />
                  <input className={inputCls} placeholder="UF" maxLength={2} value={client.state} onChange={(e) => updateClient("state", e.target.value.toUpperCase())} />
                  <input className={inputCls} placeholder="Telefone" value={client.phone} onChange={(e) => updateClient("phone", e.target.value)} />
                  <input className={inputCls} type="email" placeholder="E-mail *" value={client.email} onChange={(e) => updateClient("email", e.target.value)} />
                </div>
              </div>

              {/* Documento */}
              <div className="rounded-2xl bg-snr-ocean-wash p-6">
                <h2 className="snr-card-title mb-4 text-snr-graphite">Documento</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs text-snr-mineral-700">Data de emissão</label>
                    <input className={inputCls} type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-snr-mineral-700">Validade da proposta</label>
                    <input className={inputCls} type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-snr-mineral-700">Desconto (R$)</label>
                    <input className={inputCls} type="number" min={0} step="0.01" value={discount} onChange={(e) => setDiscount(Number(e.target.value) || 0)} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-snr-mineral-700">Impostos (R$)</label>
                    <input className={inputCls} type="number" min={0} step="0.01" value={taxTotal} onChange={(e) => setTaxTotal(Number(e.target.value) || 0)} />
                  </div>
                </div>
                {docNumber && (
                  <p className="mt-4 text-sm text-snr-petrol">
                    Documento N° <strong>{String(docNumber).padStart(4, "0")}</strong> salvo.
                  </p>
                )}
              </div>
            </div>

            {/* Itens */}
            <div className="mt-8 rounded-2xl border border-snr-mineral-100 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="snr-card-title text-snr-graphite">Itens</h2>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus size={14} className="mr-1.5" /> Adicionar item
                </Button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 items-center gap-2 rounded-xl bg-snr-paper p-3">
                    <select
                      className={`${inputCls} col-span-12 sm:col-span-4`}
                      value={item.slug}
                      onChange={(e) => pickProduct(item.id, e.target.value)}
                    >
                      <option value="">Selecionar produto do catálogo…</option>
                      {productOptions.map((p) => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                      ))}
                    </select>
                    <input
                      className={`${inputCls} col-span-12 sm:col-span-3`}
                      placeholder="Descrição"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    />
                    <input
                      className={`${inputCls} col-span-4 sm:col-span-1`}
                      type="number" min={0.01} step="0.01"
                      placeholder="Qtd."
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
                    />
                    <input
                      className={`${inputCls} col-span-4 sm:col-span-2`}
                      type="number" min={0} step="0.01"
                      placeholder="Valor unit."
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })}
                    />
                    <span className="col-span-3 sm:col-span-1 text-right text-sm font-medium text-snr-graphite">
                      {brl(lineTotal(item))}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remover item"
                      className="col-span-1 flex justify-end text-snr-mineral-500 transition-colors hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-1 mt-6 block text-xs text-snr-mineral-700">Observações / informações adicionais</label>
                <textarea
                  className={`${inputCls} min-h-24 resize-y`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="mt-6 flex flex-col items-end gap-1 text-sm">
                <div className="flex w-56 justify-between text-snr-mineral-700"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
                <div className="flex w-56 justify-between text-snr-mineral-700"><span>Descontos</span><span>-{brl(discount)}</span></div>
                <div className="flex w-56 justify-between text-snr-mineral-700"><span>Impostos</span><span>{brl(taxTotal)}</span></div>
                <div className="mt-2 flex w-56 justify-between border-t border-snr-mineral-100 pt-2 text-lg font-semibold text-snr-graphite">
                  <span>Total</span><span className="text-[hsl(var(--snr-orange))]">{brl(total)}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-end gap-3">
                <Button variant="outline" onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="mr-1.5 animate-spin" size={14} /> : null}
                  Salvar
                </Button>
                <Button variant="outline" onClick={print}>
                  <Printer size={14} className="mr-1.5" /> Imprimir / Salvar PDF
                </Button>
                <Button onClick={sendEmail} disabled={sending}>
                  {sending ? <Loader2 className="mr-1.5 animate-spin" size={14} /> : <Send size={14} className="mr-1.5" />}
                  Enviar por e-mail
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Documento — visivel apenas na impressao/PDF, no layout do template oficial */}
        <div id="quote-print-area" className="hidden print:block">
          <div className="flex items-start justify-between border-b-2 border-[hsl(var(--snr-orange))] pb-4">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Sonar Acústicos" className="h-16 w-auto" />
              <div className="text-[11px] leading-snug text-slate-600">
                <p className="font-semibold text-slate-800">SONAR ACÚSTICOS</p>
                <p>Avenida Lindóia, 388 - Centro, Bragança Paulista - SP - CEP 12900-000</p>
                <p>Telefone: (11) 96748-4000 · contato@sonaracusticos.com.br</p>
              </div>
            </div>
            <h1 className="text-2xl font-semibold tracking-wide text-slate-800">ORÇAMENTO</h1>
          </div>

          <div className="mt-4 flex justify-between text-[12px] text-slate-700">
            <span><strong>N° DO DOCUMENTO:</strong> {String(docNumber ?? 0).padStart(4, "0")}</span>
            <span><strong>EMISSÃO:</strong> {dateBr(issueDate)}</span>
            <span><strong>VALIDADE:</strong> {dateBr(validUntil)}</span>
          </div>

          <div className="mt-4 rounded-md bg-slate-100 p-4 text-[12px] text-slate-700">
            <p className="mb-2 font-semibold text-slate-800">DADOS DO CLIENTE</p>
            <p><strong>Razão Social / Nome:</strong> {client.name}</p>
            {client.document && <p><strong>CNPJ / CPF:</strong> {client.document}</p>}
            {client.address && <p><strong>Endereço:</strong> {client.address}</p>}
            {client.city && <p><strong>Cidade / UF:</strong> {client.city}{client.state ? ` - ${client.state}` : ""}</p>}
            {client.phone && <p><strong>Telefone:</strong> {client.phone}</p>}
            <p><strong>E-mail:</strong> {client.email}</p>
          </div>

          <table className="mt-4 w-full border-collapse text-[12px]">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="px-2 py-2 text-left">#</th>
                <th className="px-2 py-2 text-left">Descrição</th>
                <th className="px-2 py-2 text-left">Un.</th>
                <th className="px-2 py-2 text-right">Qtd.</th>
                <th className="px-2 py-2 text-right">Valor unit.</th>
                <th className="px-2 py-2 text-right">Valor total</th>
              </tr>
            </thead>
            <tbody>
              {items.filter((it) => it.description.trim()).map((item, i) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="px-2 py-2">{i + 1}</td>
                  <td className="px-2 py-2">
                    <strong>{item.description}</strong>
                    {item.dimensions && <span className="block text-slate-500">{item.dimensions}</span>}
                  </td>
                  <td className="px-2 py-2">{item.unit}</td>
                  <td className="px-2 py-2 text-right">{item.quantity}</td>
                  <td className="px-2 py-2 text-right">{brl(item.unitPrice)}</td>
                  <td className="px-2 py-2 text-right font-semibold">{brl(lineTotal(item))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 text-[12px] text-slate-700">
              <div className="flex justify-between py-0.5"><span>Subtotal</span><span>{brl(subtotal)}</span></div>
              <div className="flex justify-between py-0.5"><span>Descontos</span><span>{brl(discount)}</span></div>
              <div className="flex justify-between py-0.5"><span>Impostos</span><span>{brl(taxTotal)}</span></div>
              <div className="mt-1 flex justify-between border-t border-slate-300 py-1 text-base font-semibold text-slate-800">
                <span>TOTAL GERAL</span><span className="text-[hsl(var(--snr-orange))]">{brl(total)}</span>
              </div>
            </div>
          </div>

          {notes && (
            <div className="mt-4 rounded-md bg-slate-100 p-4 text-[11px] text-slate-700">
              <p className="mb-1 font-semibold text-slate-800">INFORMAÇÕES ADICIONAIS</p>
              {notes.split("\n").map((line) => <p key={line}>• {line}</p>)}
            </div>
          )}

          <p className="mt-8 text-center text-[12px] font-semibold text-slate-800">
            Agradecemos a confiança! — SONAR ACÚSTICOS
          </p>
        </div>
      </div>
    </Layout>
  );
}
