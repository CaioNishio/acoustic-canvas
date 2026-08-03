# DECISIONS

Registro de decisões técnicas e de divergências entre a especificação e o que o
repositório realmente é. Ordem de precedência em caso de conflito, conforme
`MASTER_SPECIFICATION §9`: MASTER → ENGINEERING → ACCEPTANCE → documento de domínio.

---

## D1 — O PDF oficial não pode ser usado como camada base

**Contexto.** `PROPOSAL_ENGINE §2` manda usar
`Alexandre - Porto Seguro - SNR PDV 2 - atualizado (1).pdf` como camada base,
mapeando coordenadas e mascarando apenas as áreas variáveis.

**Medição do arquivo** (não suposição):

- saída de *"Microsoft: Print To PDF"*, A4, 1 página, `Form: none`;
- contém **uma imagem raster de página inteira**, 2481×3509 px a 300 DPI;
- a camada de texto tem **somente** linhas de item, valores dos totais e condições;
- logo, "ORÇAMENTO", nº do documento, datas, cabeçalhos de tabela, rótulos,
  meios de pagamento, rodapé **e os dados do cliente M20 Arquitetura (CNPJ,
  endereço, telefone)** estão **dentro da imagem**.

Verificação reproduzível:

```bash
pdftotext arquivo.pdf - | grep -i "M20\|06.892\|Guianazes\|ORÇAMENTO"   # nada
pdfimages -list arquivo.pdf                                            # 2481x3509, 300dpi
```

**Decisão.** Reproduzir o template **em vetor**, usando o PDF oficial como
referência pixel a pixel e validando por diff de imagem.

**Por quê.** Dois motivos concretos, não estéticos:

1. **LGPD — bloqueador.** Embutir esse raster como fundo faria todo orçamento
   gerado para qualquer cliente carregar, dentro do arquivo, o CNPJ, endereço e
   telefone da M20 Arquitetura. Máscara branca esconde à vista, mas o dado
   continua extraível. Viola a minimização de `PROPOSAL_ENGINE §14` e o "não
   expor" de `MASTER_SPECIFICATION §3` — que têm precedência sobre `§2`.
2. **Multi-página.** `PROPOSAL_ENGINE §8` exige criar página adicional
   repetindo o cabeçalho da tabela quando os itens excedem a página. Um fundo
   raster fixo não reflui.

**Ganhos colaterais.** Texto nítido em qualquer zoom, arquivo leve (contra
~311 KB de raster por proposta), acentuação e moeda BRL corretas.

**Aprovado pelo usuário**, que pediu textualmente: *"pegue o que já tem como a
própria referência de como é realmente, copiando o original de forma segura"* e
*"deixe os espaços pra preencher vazios"*.

---

## D2 — `netlify/functions` não existe

`netlify.toml:31` declara `functions = "netlify/functions"`, mas o diretório
não existe no repositório. O envio de e-mail é **Supabase Edge Function**
(`supabase/functions/send-quote-email/`), não Netlify Function.

`ENGINEERING_PROTOCOL §6` presume Netlify Functions ao mandar "testar functions"
no Deploy Preview. **Decisão:** manter Supabase Edge Function (já existe, já tem
o segredo no lugar certo) e validar por invocação direta, não pela Netlify.
A linha do `netlify.toml` é inofensiva — a Netlify ignora diretório ausente —
e fica como está para não mexer em configuração de deploy sem necessidade.

---

## D3 — Playwright não está instalado

`ENGINEERING_PROTOCOL §8` e `ACCEPTANCE_PROTOCOL §5` exigem Playwright e visual
regression. Hoje o projeto tem apenas Vitest + jsdom.

**Decisão:** Playwright, screenshots e visão computacional são atribuição do
**Codex** (`MASTER_SPECIFICATION §5`). Registrado como dependência dele; não
implemento para não invadir a Fase B. O gate correspondente fica **vermelho**
em `RELEASE-GATES.md` até o Codex entregar.

---

## D4 — Subconjunto das entidades de banco

`PROPOSAL_ENGINE §12` lista 9 entidades como *"recomendadas"* (não MUST).
O repositório já tem `quote_requests` (lead público) e `commercial_quotes`
(documento comercial do admin), ambas em uso e populadas.

**Decisão:** estender de forma **aditiva** com três tabelas que entregam o que
falta de fato — máquina de estados (`§5`), estados de envio (`§9`) e trilha de
auditoria: `proposal_status_history`, `proposal_email_deliveries`,
`proposal_events`. Não duplico `customers`/`proposals`/`proposal_items` porque
isso criaria dois modelos concorrentes para o mesmo dado, e a regra de
preservação (`MASTER_SPECIFICATION §3`) pesa mais que a completude do diagrama.

---

## D5 — Branch `develop` criada a partir do PR #5

Não existia `develop`. O PR #5 tem 13 commits verdes e não mergeados, com
correções reais já validadas (botão Comprar, formulário de contato que
descartava mensagens, contraste ilegível, 16 erros de lint zerados).

**Decisão do usuário:** trabalhar em branches com Deploy Preview e só abrir PR
quando tudo estiver verde. `main` permanece intocada como rollback absoluto
(`6a18670`). `develop` nasce do HEAD do PR #5 (`1ed68c5`) — verificado como
superconjunto limpo de `main`.

---

## D6 — Divergência de gerenciador de pacotes (risco aberto)

A Netlify builda com **bun** (`netlify.toml:28`), o CI valida com **npm**
(`ci.yml:23`), e há **três lockfiles**: `bun.lock`, `bun.lockb`,
`package-lock.json`.

**Risco concreto:** o CI pode aprovar uma árvore de dependências e a Netlify
publicar outra. Um pacote com resolução diferente entre os dois passa verde no
CI e quebra em produção.

**Status:** aberto, endereçado na Fase D. Não corrigido junto com C1 de
propósito — mexer em lockfile e comando de build no mesmo commit da correção do
formulário misturaria mudanças não relacionadas e dificultaria o rollback.

---

## D7 — Porta de desenvolvimento mantida em 8080

`ENGINEERING_PROTOCOL §3` proíbe 3000 e 5173 e manda reutilizar a porta
existente quando segura. A porta real do projeto é **8080**
(`vite.config.ts:17`), que não é nenhuma das proibidas.

**Decisão:** manter 8080. Nenhuma alteração.
