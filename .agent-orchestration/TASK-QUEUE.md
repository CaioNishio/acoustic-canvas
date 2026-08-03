# TASK-QUEUE

Status válidos: `pending` `claimed` `in_progress` `blocked` `review` `approved`
`rejected` `completed`

---

```text
ID:                  C1
TITLE:               Corrigir a perda de leads no formulário de orçamento
OWNER:               Claude
STATUS:              completed
DEPENDENCIES:        —
FILES_AFFECTED:      src/pages/Orcamento.tsx, src/test/anonInsertGuard.test.ts
ACCEPTANCE_CRITERIA: envio retorna protocolo SNR-XXXXXXXX; linha gravada em
                     quote_requests; nenhuma policy nova de SELECT para anon
TESTS_REQUIRED:      guarda de regressão estática, auto-verificada
RESULT:              commit 72a8a20 — 370 testes verdes, lint 0 erros, build ok.
                     Falta validar no Deploy Preview com envio real.
```

```text
ID:                  C2
TITLE:               Gerar PDF vetorial fiel ao template oficial
OWNER:               Claude
STATUS:              in_progress
DEPENDENCIES:        —
FILES_AFFECTED:      src/lib/proposal/**, src/pages/AdminOrcamentos.tsx,
                     docs/proposal-engine/FIELD-MAPPING.md
ACCEPTANCE_CRITERIA: layout idêntico ao doc 3215 por diff de imagem; acentuação
                     e BRL corretos; itens que excedem a página geram página
                     adicional com cabeçalho de tabela repetido; nenhum dado de
                     terceiro embutido no arquivo
TESTS_REQUIRED:      unitários de moeda/data/cálculo; diff visual contra o original
RESULT:              —
```

```text
ID:                  C3
TITLE:               Entrega de e-mail confiável (retry, idempotência, estados)
OWNER:               Claude
STATUS:              pending
DEPENDENCIES:        C2 (o e-mail leva o PDF anexo)
FILES_AFFECTED:      supabase/functions/send-quote-email/**, supabase/migrations/**
ACCEPTANCE_CRITERIA: correlation id; reenvio não duplica; falha entra em retry
                     exponencial e termina em dead_letter; estado persistido
TESTS_REQUIRED:      unitários da política de retry e da chave de idempotência
RESULT:              —
```

```text
ID:                  C4
TITLE:               Rastreabilidade — histórico, entregas e eventos
OWNER:               Claude
STATUS:              pending
DEPENDENCIES:        —
FILES_AFFECTED:      supabase/migrations/**, src/integrations/supabase/types.ts
ACCEPTANCE_CRITERIA: migração puramente aditiva com ROLLBACK.sql par a par;
                     nenhum DROP de tabela ou coluna existente
TESTS_REQUIRED:      aplicação e reversão da migração
RESULT:              —
```

```text
ID:                  C5
TITLE:               Painel administrativo — buscar, filtrar, reenviar, histórico
OWNER:               Claude
STATUS:              pending
DEPENDENCIES:        C3, C4
FILES_AFFECTED:      src/pages/AdminOrcamentos.tsx
ACCEPTANCE_CRITERIA: PROPOSAL_ENGINE §13 atendido
TESTS_REQUIRED:      smoke de montagem da página
RESULT:              —
```

```text
ID:                  D1
TITLE:               Auditoria de segurança e LGPD
OWNER:               Claude
STATUS:              pending
DEPENDENCIES:        —
FILES_AFFECTED:      a definir pela auditoria
ACCEPTANCE_CRITERIA: upload valida MIME e tamanho; anexos por URL assinada;
                     consentimento explícito; logs sem dado sensível
TESTS_REQUIRED:      unitários de validação de upload
RESULT:              —
```

```text
ID:                  D2
TITLE:               Unificar gerenciador de pacotes entre CI e Netlify
OWNER:               Claude
STATUS:              pending
DEPENDENCIES:        —
FILES_AFFECTED:      .github/workflows/ci.yml, netlify.toml, lockfiles
ACCEPTANCE_CRITERIA: CI e Netlify usam o mesmo gerenciador e o mesmo lockfile
RESULT:              ver DECISIONS D6
```

---

## Para o CODEX

```text
ID:                  B0
TITLE:               Instalar Playwright e capturar baseline visual
OWNER:               Codex
STATUS:              pending
DEPENDENCIES:        —
ACCEPTANCE_CRITERIA: baseline nas 6 resoluções de VISUAL_SYSTEM §13
OBSERVAÇÃO:          hoje o projeto não tem Playwright — ver DECISIONS D3.
                     O gate de visual regression fica vermelho até isto existir.
```

```text
ID:                  B1
TITLE:               Fase B — cabeçalho, logo, azul, vão branco, filtros, tipografia
OWNER:               Codex
STATUS:              pending
DEPENDENCIES:        B0
FILES_AFFECTED:      ver LOCKS.md, seção "Travado por CODEX"
OBSERVAÇÃO:          parte do diagnóstico de VISUAL_SYSTEM §3 já foi endereçada
                     no PR #5, que é a base de develop. Antes de refazer,
                     confira o estado atual — MASTER §11: "não repita trabalho
                     concluído". Já feitos: peso tipográfico 700→600, alinhamento
                     dos ícones do cabeçalho, destaque do logo no hover,
                     contraste do card de produto, quebra do trecho branco da
                     home, prefers-reduced-motion no documento inteiro.
```
