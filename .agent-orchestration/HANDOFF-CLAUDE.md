# HANDOFF — CLAUDE

```text
AGENT:              Claude
ROLE:               Arquitetura, auditoria, integrações, segurança, Proposal Engine
DATE:               2026-08-03
BRANCH:             ai/proposal-engine
BASE_COMMIT:        1ed68c5
FINAL_COMMIT:       (em andamento)
OBJECTIVE:          Fases C e D — MASTER_SPECIFICATION §5
NEXT_OWNER:         Codex — Fase B, pode começar em paralelo
NEXT_ACTION:        instalar Playwright, capturar baseline, iniciar Fase B
```

---

## O achado mais importante desta fase

O formulário de `/orcamento` **descartava todo lead enviado pelo site**, e a
causa não era a que parecia.

A mensagem exibida era *"recusado por permissão"*, o que aponta para RLS mal
configurada. As policies estão corretas. O defeito estava na **forma da
consulta**:

```ts
.from("quote_requests").insert({...}).select("id").single()
```

O `.select()` transforma em `INSERT ... RETURNING id`. O RETURNING passa pela
policy de **SELECT**, e `quote_requests` só permite SELECT para admin — de
propósito, porque guarda nome, e-mail e telefone de clientes, e a anon key é
pública no bundle. Abrir SELECT para `anon` exporia a base de contatos inteira.

Resultado: o visitante anônimo passava no INSERT e era barrado ao reler a linha;
o envio inteiro falhava.

**Prova por contraste:** `/contato` (`src/pages/Contato.tsx:34`) faz o mesmo
insert **sem** `.select()` e sempre funcionou.

**Correção:** gerar o id no cliente com `crypto.randomUUID()` e inserir com id
explícito. Nenhuma policy nova, nenhuma leitura aberta, protocolo idêntico.

Isto interessa ao Codex por um motivo prático: se a Fase B mexer em
`Orcamento.tsx` para aplicar etapas e estados visuais
(`COMPONENT_SPECIFICATION §9`), **não reintroduza o `.select()`**. A guarda em
`src/test/anonInsertGuard.test.ts` falha o CI se isso acontecer.

---

## FILES_CHANGED

```text
src/pages/Orcamento.tsx            correção da causa raiz
src/test/anonInsertGuard.test.ts   guarda de regressão (novo)
.agent-orchestration/**            protocolo (novo)
docs/proposal-engine/, docs/architecture/   (novos, sendo preenchidos)
```

## DEPENDENCIES_ADDED

Nenhuma até aqui. C2 vai precisar de uma biblioteca de PDF (`pdf-lib`, sem
headless browser).

## DECISIONS

Ver `DECISIONS.md`. As de maior impacto:

- **D1** — o PDF oficial **não pode** virar camada base: o raster de 300 DPI
  contém os dados pessoais da M20 Arquitetura, que seriam embutidos em todo
  orçamento de todo cliente. Adotada reprodução vetorial validada por diff.
- **D3** — Playwright é atribuição do Codex; os gates correspondentes estão
  vermelhos até existir.
- **D6** — Netlify builda com `bun`, CI valida com `npm`, três lockfiles. Risco
  real de o CI aprovar árvore diferente da publicada. Aberto para a Fase D.

## TESTS

```text
lint       0 erros, 11 warnings
typecheck  limpo
testes     370 passando (eram 365)
build      exit 0
```

## SCREENSHOTS

Não aplicável a esta fase — sem alteração visual. Captura é atribuição do Codex.

## DEPLOY_PREVIEW

Pendente. Será gerado ao abrir o PR de `ai/proposal-engine`, conforme decisão de
só abrir PR com tudo verde.

## KNOWN_RISKS

1. **A correção C1 ainda não foi validada com envio real.** Está commitada e
   coberta por teste, mas o teste é estático — prova a forma da consulta, não o
   caminho fim a fim. Precisa de um envio no Deploy Preview.
2. **E-mail continua sem funcionar.** A Edge Function nunca foi implantada e os
   segredos não estão configurados. Depende de ação do usuário.
3. **`Orcamento.tsx` está travado por mim** até o fim da Fase C. O Codex vai
   precisar dele na Fase B — coordenar por `TASK-QUEUE.md`, não editar.

## UNFINISHED_ITEMS

C2 (PDF vetorial), C3 (e-mail com retry), C4 (rastreabilidade), C5 (painel),
toda a Fase D.
