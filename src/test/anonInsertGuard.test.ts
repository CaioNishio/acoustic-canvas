import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Guarda de regressao para um bug que derrubou o formulario de orcamento em
 * producao e fez o site perder todo lead enviado por ele.
 *
 * O QUE ACONTECEU
 * `Orcamento.tsx` fazia `.insert({...}).select("id").single()`. O `.select()`
 * transforma a chamada em `INSERT ... RETURNING id`, e o RETURNING passa pela
 * policy de SELECT da tabela. `quote_requests` so permite SELECT para admin —
 * de proposito, porque guarda nome, e-mail e telefone de clientes e a anon key
 * e publica no bundle do site. Resultado: o visitante anonimo passava no
 * INSERT e era barrado na leitura de volta; o envio inteiro falhava.
 *
 * A CORRECAO
 * Gerar o id no cliente (`crypto.randomUUID()`) e nao reler do banco.
 *
 * POR QUE ESTE TESTE E ESTATICO
 * O defeito nao esta em nenhuma funcao isolada que de para chamar num teste:
 * esta na FORMA da consulta. Um teste de comportamento com o Supabase mockado
 * passaria mesmo com o bug de volta, porque o mock nao aplica RLS. Ler o
 * codigo-fonte e o que de fato prende o invariante.
 *
 * Se um formulario publico novo aparecer, adicione-o em ARQUIVOS_PUBLICOS.
 */

/** Telas que rodam com a anon key, sem login. */
const ARQUIVOS_PUBLICOS = [
  "src/pages/Orcamento.tsx",
  "src/pages/Contato.tsx",
];

/** Casa `.insert(...)` seguido de `.select(` antes do fim da expressao. */
function temSelectDepoisDeInsert(fonte: string): boolean {
  // Remove comentarios de linha para nao casar com a explicacao acima.
  const semComentarios = fonte.replace(/^\s*\/\/.*$/gm, "");
  const chamadas = semComentarios.split(".insert(").slice(1);
  return chamadas.some((trecho) => {
    // Olha so ate o fim do statement (`;`), senao um `.select()` de outra
    // consulta mais abaixo no arquivo geraria falso positivo.
    const ateFimDoStatement = trecho.split(";")[0];
    return ateFimDoStatement.includes(".select(");
  });
}

describe("formularios publicos nao releem a linha que acabaram de inserir", () => {
  it.each(ARQUIVOS_PUBLICOS)("%s nao encadeia .select() depois de .insert()", (caminho) => {
    const fonte = readFileSync(resolve(process.cwd(), caminho), "utf8");
    expect(temSelectDepoisDeInsert(fonte)).toBe(false);
  });

  it("o orcamento gera o proprio id em vez de pedir de volta ao banco", () => {
    const fonte = readFileSync(resolve(process.cwd(), "src/pages/Orcamento.tsx"), "utf8");
    expect(fonte).toContain("crypto.randomUUID()");
  });

  // Sem isto, um detector quebrado passaria despercebido e a guarda acima
  // viraria decoracao: ela responderia "tudo certo" para qualquer codigo.
  it("o detector reconhece o padrao defeituoso original", () => {
    const codigoDefeituoso = `
      const { data } = await supabase
        .from("quote_requests")
        .insert({ name: form.name })
        .select("id")
        .single();
    `;
    expect(temSelectDepoisDeInsert(codigoDefeituoso)).toBe(true);
  });

  it("o detector nao acusa um .select() de outra consulta no mesmo arquivo", () => {
    const codigoCorreto = `
      await supabase.from("quote_requests").insert({ id, name });
      const { data } = await supabase.from("produtos").select("*");
    `;
    expect(temSelectDepoisDeInsert(codigoCorreto)).toBe(false);
  });
});
