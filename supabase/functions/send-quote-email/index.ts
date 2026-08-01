// Envia o orcamento/pedido de venda por e-mail (para a Sonar e para o cliente)
// usando a conta Gmail da empresa via SMTP com senha de app.
//
// Configuracao necessaria (Supabase > Project Settings > Edge Functions > Secrets):
//   GMAIL_USER          e-mail que envia (ex: sonar.acusticos@gmail.com)
//   GMAIL_APP_PASSWORD  senha de app de 16 caracteres gerada em
//                        myaccount.google.com/apppasswords (exige verificacao
//                        em duas etapas ativada na conta). NUNCA a senha normal.
//   COMPANY_EMAIL       opcional — para onde vai a copia interna.
//                        Se omitido, usa GMAIL_USER.
//
// Sem essas variaveis configuradas a funcao responde 503 com uma mensagem
// clara, em vez de falhar silenciosamente.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import nodemailer from "npm:nodemailer@6.9.15";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteItem {
  description: string;
  sku?: string;
  dimensions?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface QuoteEmailPayload {
  docNumber: number;
  issueDate: string;
  validUntil: string;
  client: {
    name: string;
    document?: string;
    address?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    email: string;
    stateRegistration?: string;
  };
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  taxTotal: number;
  total: number;
  notes?: string;
}

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dateBr = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

function buildHtml(q: QuoteEmailPayload): string {
  const rows = q.items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;">${i + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;">
          <strong>${item.description}</strong>
          ${item.sku ? `<br><span style="color:#64748b;font-size:12px;">SKU: ${item.sku}</span>` : ""}
          ${item.dimensions ? `<br><span style="color:#64748b;font-size:12px;">${item.dimensions}</span>` : ""}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;">${item.unit}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;text-align:right;">${item.quantity}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;text-align:right;">${brl(item.unitPrice)}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #e2e8f0;color:#0f2437;text-align:right;"><strong>${brl(item.total)}</strong></td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:680px;margin:0 auto;color:#0f2437;">
    <table width="100%" style="border-collapse:collapse;">
      <tr>
        <td>
          <h1 style="font-size:14px;letter-spacing:0.08em;color:#64748b;margin:0 0 4px;">SONAR ACÚSTICOS</h1>
          <p style="font-size:13px;color:#64748b;margin:0;">Avenida Lindóia, 388 - Centro, Bragança Paulista - SP - CEP 12900-000</p>
        </td>
        <td style="text-align:right;">
          <h2 style="font-size:24px;color:#0f2437;margin:0;">ORÇAMENTO</h2>
        </td>
      </tr>
    </table>
    <hr style="border:none;border-top:2px solid #c17a2e;margin:16px 0;" />

    <table width="100%" style="font-size:13px;margin-bottom:16px;">
      <tr>
        <td><strong>N° DO DOCUMENTO:</strong> ${String(q.docNumber).padStart(4, "0")}</td>
        <td style="text-align:right;"><strong>EMISSÃO:</strong> ${dateBr(q.issueDate)}</td>
      </tr>
      <tr><td colspan="2" style="text-align:right;"><strong>VALIDADE:</strong> ${dateBr(q.validUntil)}</td></tr>
    </table>

    <div style="background:#0f2437;color:#ffffff;padding:12px 16px;border-radius:8px 8px 0 0;font-size:12px;letter-spacing:0.08em;">DADOS DO CLIENTE</div>
    <div style="background:#f1f5f9;padding:16px;border-radius:0 0 8px 8px;font-size:13px;margin-bottom:20px;">
      <p style="margin:2px 0;"><strong>Nome/Razão social:</strong> ${q.client.name}</p>
      ${q.client.document ? `<p style="margin:2px 0;"><strong>CNPJ/CPF:</strong> ${q.client.document}</p>` : ""}
      ${q.client.address ? `<p style="margin:2px 0;"><strong>Endereço:</strong> ${q.client.address}</p>` : ""}
      ${q.client.city ? `<p style="margin:2px 0;"><strong>Cidade/UF:</strong> ${q.client.city}${q.client.state ? ` - ${q.client.state}` : ""}</p>` : ""}
      ${q.client.phone ? `<p style="margin:2px 0;"><strong>Telefone:</strong> ${q.client.phone}</p>` : ""}
      <p style="margin:2px 0;"><strong>E-mail:</strong> ${q.client.email}</p>
    </div>

    <table width="100%" style="border-collapse:collapse;font-size:13px;margin-bottom:16px;">
      <thead>
        <tr style="background:#0f2437;color:#ffffff;">
          <th style="padding:10px 8px;text-align:left;">#</th>
          <th style="padding:10px 8px;text-align:left;">Descrição</th>
          <th style="padding:10px 8px;text-align:left;">Un.</th>
          <th style="padding:10px 8px;text-align:right;">Qtd.</th>
          <th style="padding:10px 8px;text-align:right;">Valor unit.</th>
          <th style="padding:10px 8px;text-align:right;">Valor total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <table width="100%" style="font-size:13px;margin-bottom:16px;">
      <tr><td style="text-align:right;padding:2px 0;color:#64748b;">Subtotal</td><td style="text-align:right;padding:2px 0;width:120px;">${brl(q.subtotal)}</td></tr>
      <tr><td style="text-align:right;padding:2px 0;color:#64748b;">Descontos</td><td style="text-align:right;padding:2px 0;">${brl(q.discount)}</td></tr>
      <tr><td style="text-align:right;padding:2px 0;color:#64748b;">Impostos</td><td style="text-align:right;padding:2px 0;">${brl(q.taxTotal)}</td></tr>
      <tr><td style="text-align:right;padding:8px 0;font-size:18px;"><strong>TOTAL GERAL</strong></td><td style="text-align:right;padding:8px 0;font-size:18px;color:#c17a2e;"><strong>${brl(q.total)}</strong></td></tr>
    </table>

    ${q.notes ? `<div style="background:#f1f5f9;padding:16px;border-radius:8px;font-size:13px;margin-bottom:16px;"><strong>Observações:</strong><br>${q.notes.replace(/\n/g, "<br>")}</div>` : ""}

    <p style="font-size:12px;color:#94a3b8;margin-top:24px;">Esta proposta é válida até a data informada acima. Prazo de entrega e condições de pagamento a combinar conforme escopo do projeto.</p>
    <p style="font-size:13px;margin-top:16px;">Agradecemos a confiança!<br><strong>SONAR ACÚSTICOS</strong></p>
  </div>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const gmailUser = Deno.env.get("GMAIL_USER");
  const gmailAppPassword = Deno.env.get("GMAIL_APP_PASSWORD");
  const companyEmail = Deno.env.get("COMPANY_EMAIL") || gmailUser;

  if (!gmailUser || !gmailAppPassword) {
    return new Response(
      JSON.stringify({
        error:
          "Envio de e-mail ainda não configurado: faltam os secrets GMAIL_USER e GMAIL_APP_PASSWORD no projeto Supabase.",
      }),
      { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const payload = (await req.json()) as QuoteEmailPayload;

    if (!payload?.client?.email || !payload.items?.length) {
      return new Response(JSON.stringify({ error: "Dados do orçamento incompletos." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    const subject = `Orçamento Sonar Acústicos N° ${String(payload.docNumber).padStart(4, "0")} — ${payload.client.name}`;
    const html = buildHtml(payload);

    // Uma unica chamada, cliente em "to" e a empresa em copia — garante que
    // as duas caixas recebam o mesmo e-mail, sem duplicar o envio.
    await transporter.sendMail({
      from: `Sonar Acústicos <${gmailUser}>`,
      to: payload.client.email,
      cc: companyEmail,
      subject,
      html,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Falha ao enviar e-mail do orçamento:", err);
    return new Response(
      JSON.stringify({ error: "Não foi possível enviar o e-mail. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
