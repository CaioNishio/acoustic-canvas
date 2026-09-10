import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const allowedOrigins = new Set([
  "https://sonaracusticos.com",
  "https://www.sonaracusticos.com",
  "https://sonaracusticos.netlify.app",
]);

const corsHeaders = (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://sonaracusticos.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
};

const json = (request: Request, status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request), "Content-Type": "application/json; charset=utf-8" },
  });

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;",
  })[character] ?? character);

async function adminRequest(path: string, init: RequestInit = {}) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) throw new Error("supabase_server_config_missing");
  return fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function getResendKey() {
  const response = await adminRequest("rpc/get_resend_api_key", {
    method: "POST",
    body: "{}",
  });
  if (!response.ok) throw new Error(`vault_read_failed_${response.status}`);
  const key = await response.json();
  if (typeof key !== "string" || !key.startsWith("re_")) throw new Error("resend_key_missing");
  return key;
}

async function getQuote(requestId: string) {
  const select = "id,name,email,phone,company,project_type,area,city,description,attachments,status,created_at";
  const response = await adminRequest(
    `quote_requests?id=eq.${encodeURIComponent(requestId)}&select=${select}`,
    { method: "GET" },
  );
  if (!response.ok) throw new Error(`quote_lookup_failed_${response.status}`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows[0] ?? null : null;
}

async function markQuoteEmailSent(requestId: string) {
  const response = await adminRequest(`quote_requests?id=eq.${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({ status: "email_enviado" }),
  });
  if (!response.ok) throw new Error(`quote_status_update_failed_${response.status}`);
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
    throw new Error(`resend_rejected_${response.status}_${detail.slice(0, 160)}`);
  }
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(request) });
  if (request.method !== "POST") return json(request, 405, { error: "method_not_allowed" });

  let body: unknown;
  try { body = await request.json(); } catch { return json(request, 400, { error: "invalid_json" }); }
  const requestId = typeof (body as { requestId?: unknown })?.requestId === "string"
    ? (body as { requestId: string }).requestId.trim()
    : "";
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(requestId)) {
    return json(request, 400, { error: "invalid_request_id" });
  }

  try {
    const quote = await getQuote(requestId);
    if (!quote) return json(request, 404, { error: "quote_not_found" });

    if (quote.status === "email_enviado") {
      return json(request, 200, { ok: true, alreadySent: true, protocol: `SNR-${quote.id.slice(0, 8).toUpperCase()}` });
    }

    const createdAt = Date.parse(quote.created_at);
    if (!Number.isFinite(createdAt) || Date.now() - createdAt > 30 * 24 * 60 * 60 * 1000) {
      return json(request, 409, { error: "quote_expired" });
    }

    const apiKey = await getResendKey();
    const protocol = `SNR-${quote.id.slice(0, 8).toUpperCase()}`;
    const projectLabels: Record<string, string> = {
      estudio: "Estúdio", igreja: "Igreja", auditorio: "Auditório",
      corporativo: "Corporativo", residencial: "Residencial", outro: "Outro",
    };
    const project = projectLabels[quote.project_type] ?? quote.project_type;
    const attachmentCount = Array.isArray(quote.attachments) ? quote.attachments.length : 0;
    const teamTo = "contato@sonaracusticos.com.br";
    const from = "Sonar Acústicos <orcamentos@sonaracusticos.com.br>";

    const rows = [
      ["Nome", quote.name], ["E-mail", quote.email], ["Telefone", quote.phone],
      ["Empresa", quote.company || "—"], ["Projeto", project],
      ["Área", quote.area ? `${quote.area} m²` : "—"], ["Cidade/UF", quote.city],
      ["Anexos", String(attachmentCount)],
    ].map(([label, value]) =>
      `<tr><td style="padding:8px 12px;color:#5b6770">${escapeHtml(String(label))}</td><td style="padding:8px 12px;color:#132b3a;font-weight:600">${escapeHtml(String(value))}</td></tr>`
    ).join("");

    const teamHtml = `<div style="font-family:Arial,sans-serif;background:#f4f7f9;padding:32px;color:#132b3a"><div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="padding:28px 32px;background:#082a43;color:#fff"><p style="margin:0 0 6px;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#8fd2ee">Nova solicitação</p><h1 style="margin:0;font-size:24px">${escapeHtml(protocol)}</h1></div><div style="padding:24px 32px"><table style="width:100%;border-collapse:collapse">${rows}</table>${quote.description ? `<div style="margin-top:20px;padding:16px;background:#eef5f8;border-radius:10px"><strong>Descrição do projeto</strong><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(quote.description)}</p></div>` : ""}</div></div></div>`;

    const customerHtml = `<div style="font-family:Arial,sans-serif;background:#f4f7f9;padding:32px;color:#132b3a"><div style="max-width:680px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="padding:28px 32px;background:#082a43;color:#fff"><p style="margin:0 0 6px;font-size:12px;letter-spacing:1.8px;text-transform:uppercase;color:#8fd2ee">Sonar Acústicos</p><h1 style="margin:0;font-size:24px">Recebemos seu projeto</h1></div><div style="padding:28px 32px"><p>Olá, ${escapeHtml(quote.name)}.</p><p>Seu pedido de orçamento foi registrado com sucesso. Nossa equipe técnica vai analisar as informações e retornar em até um dia útil.</p><p style="padding:14px 16px;background:#eef5f8;border-radius:10px"><strong>Protocolo:</strong> ${escapeHtml(protocol)}</p><p>Se precisar complementar algo, responda a este e-mail ou envie uma mensagem pelo WhatsApp.</p></div></div></div>`;

    await Promise.all([
      sendEmail(apiKey, `quote-team-${quote.id}`, {
        from, to: [teamTo], reply_to: quote.email,
        subject: `[${protocol}] ${quote.name} — ${project}`,
        html: teamHtml,
        text: `Novo orçamento ${protocol}\nNome: ${quote.name}\nE-mail: ${quote.email}\nTelefone: ${quote.phone}\nProjeto: ${project}\nCidade: ${quote.city}`,
      }),
      sendEmail(apiKey, `quote-customer-${quote.id}`, {
        from, to: [quote.email], reply_to: teamTo,
        subject: `Recebemos seu pedido de orçamento — ${protocol}`,
        html: customerHtml,
        text: `Olá, ${quote.name}. Recebemos seu pedido de orçamento. Protocolo: ${protocol}. Retornaremos em até um dia útil.`,
      }),
    ]);

    await markQuoteEmailSent(quote.id);
    return json(request, 200, { ok: true, protocol });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("quote_request_failed", message);
    const diagnostic = message.match(/^(supabase_server_config_missing|vault_read_failed_\d+|resend_key_missing|quote_lookup_failed_\d+|resend_rejected_\d+|quote_status_update_failed_\d+)/)?.[1] ?? "internal_delivery_error";
    return json(request, 502, { error: "email_delivery_failed", diagnostic });
  }
});

