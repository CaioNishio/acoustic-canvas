type QuoteRequest = {
  requestId: string;
  name: string;
  email: string;
  phone: string;
  company?: string | null;
  projectType: string;
  projectTypeLabel?: string;
  area?: string | null;
  city: string;
  description?: string | null;
  attachmentCount: number;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const headers = { "content-type": "application/json; charset=utf-8" };

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers });

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);

const clean = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

function parseQuote(value: unknown): QuoteRequest | null {
  if (!value || typeof value !== "object") return null;
  const raw = value as Record<string, unknown>;
  const name = clean(raw.name, 120);
  const email = clean(raw.email, 180).toLowerCase();
  const phone = clean(raw.phone, 32);
  const requestId = clean(raw.requestId, 80);
  const projectType = clean(raw.projectType, 80);
  const city = clean(raw.city, 120);

  if (!requestId || name.length < 2 || !emailPattern.test(email) || phone.length < 10 || !projectType || city.length < 2) {
    return null;
  }

  return {
    requestId,
    name,
    email,
    phone,
    projectType,
    projectTypeLabel: clean(raw.projectTypeLabel, 120),
    company: clean(raw.company, 120) || null,
    area: clean(raw.area, 40) || null,
    city,
    description: clean(raw.description, 4000) || null,
    attachmentCount: Math.min(Math.max(Number(raw.attachmentCount) || 0, 0), 10),
  };
}

async function sendEmail(apiKey: string, idempotencyKey: string, payload: Record<string, unknown>) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected the request (${response.status}): ${detail.slice(0, 500)}`);
  }
}

export default async (request: Request) => {
  if (request.method !== "POST") return json(405, { error: "method_not_allowed" });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_TO_EMAIL;
  const from = process.env.QUOTE_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return json(503, { error: "email_not_configured" });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const quote = parseQuote(body);
  if (!quote) return json(400, { error: "invalid_quote" });

  const protocol = `SNR-${quote.requestId.slice(0, 8).toUpperCase()}`;
  const project = quote.projectTypeLabel || quote.projectType;
  const summaryRows = [
    ["Nome", quote.name],
    ["E-mail", quote.email],
    ["Telefone", quote.phone],
    ["Empresa", quote.company || "—"],
    ["Projeto", project],
    ["Área", quote.area ? `${quote.area} m²` : "—"],
    ["Cidade/UF", quote.city],
    ["Anexos", String(quote.attachmentCount)],
  ]
    .map(([label, value]) => `<tr><td style="padding:8px 12px;color:#5b6770">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#132b3a;font-weight:600">${escapeHtml(value)}</td></tr>`)
    .join("");

  const teamHtml = `
    <div style="font-family:Arial,sans-serif;background:#f4f7f9;padding:32px;color:#132b3a">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="padding:28px 32px;background:#082a43;color:#fff"><p style="margin:0 0 6px;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#8fd2ee">Nova solicitação</p><h1 style="margin:0;font-size:24px">${escapeHtml(protocol)}</h1></div>
        <div style="padding:24px 32px"><table style="width:100%;border-collapse:collapse">${summaryRows}</table>${quote.description ? `<div style="margin-top:20px;padding:16px;background:#eef5f8;border-radius:10px"><strong>Descrição do projeto</strong><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(quote.description)}</p></div>` : ""}</div>
      </div>
    </div>`;

  const customerHtml = `
    <div style="font-family:Arial,sans-serif;background:#f4f7f9;padding:32px;color:#132b3a">
      <div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
        <div style="padding:28px 32px;background:#082a43;color:#fff"><p style="margin:0 0 6px;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#8fd2ee">Sonar Acústicos</p><h1 style="margin:0;font-size:24px">Recebemos seu projeto</h1></div>
        <div style="padding:28px 32px"><p>Olá, ${escapeHtml(quote.name)}.</p><p>Seu pedido de orçamento foi registrado com sucesso. Nossa equipe técnica vai analisar as informações e retornar em até um dia útil.</p><p style="padding:14px 16px;background:#eef5f8;border-radius:10px"><strong>Protocolo:</strong> ${escapeHtml(protocol)}</p><p>Se precisar complementar algo, responda a este e-mail ou envie uma mensagem pelo WhatsApp.</p></div>
      </div>
    </div>`;

  try {
    await Promise.all([
      sendEmail(apiKey, `quote-team-${quote.requestId}`, {
        from,
        to: [to],
        reply_to: quote.email,
        subject: `[${protocol}] ${quote.name} — ${project}`,
        html: teamHtml,
        text: `Novo orçamento ${protocol}\nNome: ${quote.name}\nE-mail: ${quote.email}\nTelefone: ${quote.phone}\nProjeto: ${project}\nCidade: ${quote.city}`,
      }),
      sendEmail(apiKey, `quote-customer-${quote.requestId}`, {
        from,
        to: [quote.email],
        reply_to: to,
        subject: `Recebemos seu pedido de orçamento — ${protocol}`,
        html: customerHtml,
        text: `Olá, ${quote.name}. Recebemos seu pedido de orçamento. Protocolo: ${protocol}. Retornaremos em até um dia útil.`,
      }),
    ]);
  } catch (error) {
    console.error("quote email delivery failed", error);
    return json(502, { error: "email_delivery_failed" });
  }

  return json(200, { ok: true, protocol });
};
