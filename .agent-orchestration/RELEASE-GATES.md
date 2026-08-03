# RELEASE-GATES

Espelha `ACCEPTANCE_PROTOCOL`. Um gate só vira ✅ com evidência: commit,
screenshot, saída de teste ou URL de preview. Percepção subjetiva não aprova.

Legenda: ✅ verde · ⬜ não verificado · ❌ vermelho · 🔒 pertence ao outro agente

---

## Gate de engenharia

| Item | Estado | Evidência |
|---|---|---|
| Build | ✅ | `npm run build` exit 0 |
| Lint | ✅ | 0 erros, 11 warnings (react-refresh, shadcn/ui) |
| Typecheck | ✅ | `tsc --noEmit` limpo |
| Unit tests | ✅ | 370 passando, 9 arquivos |
| Integration tests | ⬜ | formulário → banco → PDF → e-mail, na Fase C |
| Playwright | ❌ | não instalado — DECISIONS D3, atribuição do Codex |
| Visual regression | ❌ | depende de Playwright |
| Accessibility | ⬜ | Fase D |
| Performance | ⬜ | Fase D |
| Security | ⬜ | Fase D |
| Netlify preview | ⬜ | gerado ao abrir PR de `ai/proposal-engine` |
| Rollback | ✅ | `main` em `6a18670`, intocada; cada etapa é commit isolado |
| Documentation | ✅ | `.agent-orchestration/`, `docs/` |
| Commits | ✅ | pequenos, sem force-push, sem segredo |
| Pull Request | ⬜ | só depois dos gates verdes |

## Gate funcional

| Item | Estado | Evidência |
|---|---|---|
| Shopify | ⬜ | 21 de 51 produtos com contraparte publicada |
| Supabase | ⬜ | 5 tabelas confirmadas pelo usuário via `information_schema` |
| Calculadora | ✅ | 332 testes de `acousticsEngine` + `layoutEngine` |
| Catálogo | ⬜ | teste de integridade cobre dados, não a UI |
| Filtros | 🔒 | Codex |
| Busca | 🔒 | Codex |
| Formulários | ⬜ | C1 corrigido no código; falta envio real no preview |
| Checkout | ⬜ | validar `checkoutUrl` no preview |
| Rotas | ✅ | smoke de montagem em 6 páginas |
| Analytics | ⬜ | Fase D |
| SEO | ⬜ | Fase D |
| WhatsApp alternativo | ✅ | ação no toast de erro, com dados preenchidos |

## Gate Proposal Engine

| Item | Estado |
|---|---|
| Formulário validado | ✅ |
| Dados salvos | ⬜ (código corrigido, falta envio real) |
| Número sequencial | ✅ `commercial_quote_number_seq` a partir de 32 |
| PDF fiel | ⬜ C2 |
| Template preservado | ⬜ C2 |
| E-mail enviado | ❌ função nunca implantada |
| Cópia interna | ❌ idem |
| Histórico | ⬜ C4 |
| Logs | ⬜ C3 |
| Retry | ❌ inexistente |
| Reenvio | ❌ inexistente |
| Download | ⬜ C2 |
| Painel | ⬜ C5 |
| Proposta preliminar | ⬜ C2 |
| Proposta automática | ⬜ C2 |
| Sem dependência exclusiva de WhatsApp | ✅ |

## Gate visual — 🔒 CODEX

Todos os 16 itens de `ACCEPTANCE_PROTOCOL §2` pertencem ao Codex. Parte já foi
endereçada no PR #5 (base de `develop`) — ver observação em `TASK-QUEUE.md#B1`
antes de refazer.

---

## Bloqueadores conhecidos

1. **E-mail não funciona.** A Edge Function existe no repositório mas nunca foi
   implantada, e os segredos `GMAIL_USER` / `GMAIL_APP_PASSWORD` não estão
   configurados. Depende de ação do usuário no painel Supabase — credencial não
   entra no repositório.
2. **Playwright ausente.** Trava os gates de Playwright e visual regression.
   Atribuição do Codex.
3. **Envio de orçamento validado só em código.** A correção C1 está commitada e
   coberta por teste, mas ainda não houve envio real no Deploy Preview.
