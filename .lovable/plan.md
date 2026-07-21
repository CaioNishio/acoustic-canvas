## Exportar todo o conteúdo do site em arquivo único

### Objetivo
Gerar um arquivo consolidado com todo o conteúdo do site criado até o momento, sem realizar nenhuma alteração no projeto. O arquivo será entregue por aqui para download/visualização.

### Formato proposto
Arquivo `.md` (Markdown) organizado por seções:
1. Estrutura do projeto (lista de arquivos relevantes)
2. Páginas principais (`src/pages/*.tsx`)
3. Componentes (`src/components/**/*.tsx`)
4. Dados e configurações (`src/data/*.ts`, `src/App.tsx`, etc.)
5. Estilos globais (`src/index.css`, `tailwind.config.ts`)
6. Assets utilizados (lista de imagens e recursos)

Cada arquivo será apresentado com seu caminho relativo e conteúdo completo dentro de blocos de código.

### Escopo
- Incluir: todo código fonte React/TypeScript, dados de produtos, projetos, soluções, artigos educacionais, configurações de estilo e estrutura de rotas.
- Excluir: `node_modules`, arquivos de build, `.env`, credenciais, e binários de imagem (apenas listar os caminhos das imagens).

### Entrega
O arquivo será salvo em `/mnt/documents/export-site-sonar.md` e disponibilizado como artifact para visualização/download.

### Pergunta ao usuário
Você prefere o arquivo em Markdown (.md) ou em outro formato (por exemplo, .txt ou .zip com os arquivos separados)?