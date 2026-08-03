/**
 * Formatacao dos valores que vao para o PDF da proposta.
 *
 * Vive separado do gerador porque e a parte com regra de negocio de verdade —
 * moeda, sinal de desconto, campo vazio — e a unica que da para testar sem
 * renderizar um PDF inteiro.
 *
 * Referencia de formato: documento oficial nº 3215.
 */

/** Travessao usado pelo documento original quando o campo nao tem valor. */
export const VAZIO = "—";

/**
 * `R$ 1.234,56`.
 *
 * Nao uso `toLocaleString` com `style: "currency"` porque o Node e o navegador
 * divergem no separador entre "R$" e o numero: um usa espaco normal, o outro
 * usa espaco estreito (U+00A0 ou U+202F). Num PDF isso vira largura diferente
 * da do documento original, e o diff visual acusa. Formatando o numero e
 * concatenando o prefixo, o resultado e identico nos dois ambientes.
 */
export function brl(valor: number): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  const absoluto = Math.abs(seguro).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `R$ ${absoluto}`;
}

/**
 * Desconto no formato do original: `- R$ 294,43`, com espaco depois do hifen.
 * Zero imprime `R$ 0,00` sem sinal — o documento nao mostra "- R$ 0,00".
 */
export function brlDesconto(valor: number): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  if (seguro === 0) return brl(0);
  return `- ${brl(seguro)}`;
}

/** Quantidade com duas casas e virgula decimal: `21,00`. */
export function quantidade(valor: number): string {
  const seguro = Number.isFinite(valor) ? valor : 0;
  return seguro.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * `dd/MM/yyyy` a partir de `yyyy-MM-dd` ou de um Date.
 *
 * Uma string `yyyy-MM-dd` e tratada como data local, nao UTC: `new Date(
 * "2026-08-03")` resolve para meia-noite UTC e, em fuso negativo como o do
 * Brasil, volta um dia. Um orcamento com a data errada e um erro visivel para
 * o cliente, entao a string e desmontada em partes.
 */
export function dataBr(valor: string | Date): string {
  if (valor instanceof Date) {
    const d = String(valor.getDate()).padStart(2, "0");
    const m = String(valor.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}/${valor.getFullYear()}`;
  }
  const iso = valor.slice(0, 10).split("-");
  if (iso.length !== 3) return VAZIO;
  const [ano, mes, dia] = iso;
  return `${dia}/${mes}/${ano}`;
}

/** Numero do documento com quatro digitos, como no original (`3215`, `0031`). */
export function numeroDocumento(n: number): string {
  return String(Math.max(0, Math.trunc(n))).padStart(4, "0");
}

/** Devolve o travessao quando o campo esta ausente, em branco ou so espacos. */
export function ouVazio(valor: string | null | undefined): string {
  const limpo = (valor ?? "").trim();
  return limpo.length > 0 ? limpo : VAZIO;
}

/**
 * `Cidade - UF`. Se faltar um dos dois, imprime so o que existe, sem deixar
 * hifen solto.
 */
export function cidadeUf(cidade?: string | null, uf?: string | null): string {
  const c = (cidade ?? "").trim();
  const u = (uf ?? "").trim().toUpperCase();
  if (c && u) return `${c} - ${u}`;
  return ouVazio(c || u);
}
