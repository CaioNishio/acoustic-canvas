# STATUS

```text
CURRENT_PHASE:          C — Proposal Engine
CURRENT_OWNER:          Claude
ACTIVE_BRANCH:          ai/proposal-engine
BASE_COMMIT:            1ed68c5 (HEAD do PR #5, já validado)
ROLLBACK_COMMIT:        6a18670 (main — ponto de retorno absoluto)
LAST_VALIDATED_COMMIT:  72a8a20 (fix do formulário de orçamento)
NEXT_OWNER:             Codex — Fase B (visual), pode começar em paralelo
BLOCKERS:               nenhum para a Fase C
DEPLOY_PREVIEW_URL:     (pendente — gerado ao abrir PR de ai/proposal-engine)
LAST_UPDATED:           2026-08-03
```

## Ambiente descoberto (não presumido)

| Item | Valor real |
|---|---|
| Framework | Vite 5 + React 18 + TypeScript |
| Gerenciador (Netlify) | **bun** (`bun run build` no `netlify.toml`) |
| Gerenciador (CI) | **npm** (`npm ci` no `ci.yml`) — divergência, ver DECISIONS #6 |
| Porta de dev | **8080** (`server.port` em `vite.config.ts:17`) — não é 3000 nem 5173, então é mantida conforme `ENGINEERING_PROTOCOL §3` |
| Porta de preview | 4173 (`vite preview` padrão) |
| Testes | Vitest (jsdom) — **sem Playwright instalado** |
| Backend | Supabase (`zcnasovvuglsxoobfcbt`) + Shopify Storefront headless |
| Serverless | Supabase Edge Functions. `netlify/functions` **não existe** |
| Deploy | Netlify, SPA com redirect `/* → /index.html` |

## Baseline medido antes de qualquer alteração

```text
lint       0 erros, 11 warnings (react-refresh, inerentes ao shadcn/ui)
typecheck  limpo
testes     365 passando (8 arquivos)
build      exit 0
```

## Estado após C1

```text
lint       0 erros, 11 warnings
typecheck  limpo
testes     370 passando (9 arquivos)
build      exit 0
```
