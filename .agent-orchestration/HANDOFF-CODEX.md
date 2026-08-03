# HANDOFF — CODEX

> Arquivo de propriedade do **Codex**. Claude não edita, exceto este bloco
> inicial de contexto, escrito na abertura do ciclo.

```text
AGENT:              Codex
ROLE:               Direção visual, front-end, UX, motion, Playwright, visão computacional
DATE:               (a preencher)
BRANCH:             ai/codex-visual-v3   (criar a partir de develop)
BASE_COMMIT:        (a preencher)
FINAL_COMMIT:       (a preencher)
OBJECTIVE:          Fases B e E
NEXT_OWNER:         Claude — Fase D
```

---

## Contexto que você precisa antes de começar

### 1. `develop` já contém trabalho visual — confira antes de refazer

`develop` nasce do PR #5, que já endereçou parte do diagnóstico de
`VISUAL_SYSTEM §3`. `MASTER_SPECIFICATION §11` diz para **não repetir trabalho
concluído**. Já está feito:

| Item de `VISUAL_SYSTEM §3` | Situação |
|---|---|
| tipografia pouco contemporânea | peso 700 → 600 em todos os títulos |
| logo com baixa presença | destaque sutil no hover + alinhamento corrigido |
| cabeçalho desproporcional | barra de ícones realinhada (margens arbitrárias removidas) |
| excesso de superfícies brancas | `ProcessLine` movido para tom `wash`; gradientes de profundidade em `Section` |
| ritmo vertical repetitivo | alternância de tons restabelecida na home |

**Ainda abertos**, e seus: azul pouco profundo, vão branco abaixo do cabeçalho,
**filtro cobrindo o catálogo**, cards excessivamente altos, pouca densidade
editorial, WhatsApp ocluindo conteúdo, Área do Conhecimento.

### 2. Playwright não existe neste projeto

Só há Vitest + jsdom. Os gates de Playwright e visual regression estão
**vermelhos** em `RELEASE-GATES.md` e dependem de você (`TASK-QUEUE.md#B0`).
A porta de dev é **8080** (`vite.config.ts:17`) — não é 3000 nem 5173, então
mantenha, conforme `ENGINEERING_PROTOCOL §3`.

### 3. Não reintroduza um bug que acabou de ser corrigido

`src/pages/Orcamento.tsx` está **travado por Claude** até o fim da Fase C
(`LOCKS.md`). Quando for liberado e você for aplicar etapas e estados visuais
(`COMPONENT_SPECIFICATION §9`), atenção a isto:

**Nunca encadeie `.select()` depois de `.insert()` em formulário público.**

O `.select()` vira `INSERT ... RETURNING`, que passa pela policy de SELECT.
As tabelas de formulário só permitem SELECT para admin — de propósito, porque
guardam dados pessoais e a anon key é pública no bundle. Isso derrubou o
formulário de orçamento e fez o site perder todo lead enviado por ele.

`src/test/anonInsertGuard.test.ts` falha o CI se o padrão voltar.

### 4. Fora dos seus arquivos, aponte em vez de consertar

Se encontrar problema de segurança ou acessibilidade em arquivo travado por
Claude, abra item em `TASK-QUEUE.md` com `OWNER: Claude`. O inverso vale para
mim: defeito visual que eu achar na auditoria vira tarefa sua, não commit meu.

---

## FILES_CHANGED

(a preencher)

## DEPENDENCIES_ADDED

(a preencher)

## DECISIONS

(a preencher — registre também em `DECISIONS.md`)

## TESTS

(a preencher)

## SCREENSHOTS

Resoluções obrigatórias (`VISUAL_SYSTEM §13`): 360×800, 390×844, 768×1024,
1024×768, 1440×900, 1920×1080.

## DEPLOY_PREVIEW

(a preencher)

## KNOWN_RISKS

(a preencher)

## UNFINISHED_ITEMS

(a preencher)
