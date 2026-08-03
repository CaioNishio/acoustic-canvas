# LOCKS

Nenhum agente modifica um caminho travado pelo outro. Se precisar mexer em algo
travado, registre em `TASK-QUEUE.md` como dependência e aguarde a liberação —
não edite mesmo que pareça trivial.

---

## Travado por CLAUDE — Fases C e D

```text
COMPONENT:         Proposal Engine, banco, serverless, segurança
OWNER:             Claude
BRANCH:            ai/proposal-engine
STARTED_AT:        2026-08-03
EXPECTED_RELEASE:  ao fim da Fase C
```

| Caminho | Por quê |
|---|---|
| `src/pages/Orcamento.tsx` | fluxo de proposta e persistência |
| `src/pages/AdminOrcamentos.tsx` | painel de propostas |
| `src/pages/Contato.tsx` | mesma classe de persistência anônima |
| `src/lib/proposal/**` | gerador de PDF (a criar) |
| `supabase/migrations/**` | esquema e RLS |
| `supabase/functions/**` | Edge Functions e envio de e-mail |
| `src/integrations/supabase/**` | cliente e tipos |
| `src/test/anonInsertGuard.test.ts` | guarda de regressão do bug de RLS |
| `.agent-orchestration/**` | protocolo (exceto `HANDOFF-CODEX.md`) |
| `docs/proposal-engine/**`, `docs/architecture/**` | documentação das Fases C/D |

**Atenção em `Orcamento.tsx`:** o Codex pode precisar dele para a Fase B
(etapas, progress bar, estados visuais — `COMPONENT_SPECIFICATION §9`). Está
travado por mim **até o fim da Fase C**. Depois eu libero e registro aqui.
O motivo é concreto: o arquivo acabou de receber a correção do bug que fazia o
site perder todo lead, e uma edição concorrente reintroduziria o defeito num
merge malfeito.

---

## Travado por CODEX — Fases B e E

```text
COMPONENT:         Visual, motion, catálogo, acessibilidade visual
OWNER:             Codex
BRANCH:            ai/codex-visual-v3
STARTED_AT:        (a preencher pelo Codex)
EXPECTED_RELEASE:  ao fim da Fase B
```

| Caminho | Por quê |
|---|---|
| `src/components/sonar/**` | sistema visual da home |
| `src/components/layout/**` | cabeçalho, rodapé, layout |
| `src/components/gik/**` | componentes de referência visual |
| `src/styles/sonar-system.css` | tokens e design system |
| `src/index.css` | base global e CSS de impressão |
| `src/pages/Produtos.tsx` | catálogo e filtros |
| `src/pages/Conhecimento.tsx`, `src/pages/Artigo.tsx` | área editorial |
| `src/components/shared/WhatsAppButton.tsx` | oclusão de conteúdo |
| `tailwind.config.ts` | escala tipográfica e paleta |
| `docs/visual/**` | documentação da Fase B |

**Exceção combinada:** se eu precisar corrigir um problema de **acessibilidade
ou segurança** em arquivo do Codex durante a Fase D, abro item em
`TASK-QUEUE.md` com `OWNER: Codex` descrevendo o defeito e a correção sugerida,
em vez de editar. Auditoria aponta; quem conserta o visual é o dono do arquivo.

---

## Zona livre (qualquer agente, avisando em DECISIONS.md)

```text
src/data/**            catálogo e conteúdo
src/hooks/**
src/lib/** (exceto src/lib/proposal/**)
.github/workflows/**
README.md
```
