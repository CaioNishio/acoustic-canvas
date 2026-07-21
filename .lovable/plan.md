## Gerar arquivo ZIP completo do projeto

### Objetivo
Criar um arquivo `.zip` contendo todos os arquivos do site, incluindo assets de imagem, para download direto, sem realizar nenhuma alteração no projeto.

### Escopo do ZIP
- Incluir: todo o código-fonte (`src/`), configurações (`package.json`, `tsconfig.json`, `vite.config.ts`, etc.), estilos (`index.css`, `tailwind.config.ts`), assets (`src/assets/`, `public/`), páginas, componentes, dados e integrações.
- Excluir: `node_modules/`, pastas de build/dist, `.env`, arquivos de cache, `.git/` e logs.

### Passos
1. Listar e verificar os arquivos presentes no projeto.
2. Compactar o conteúdo relevante em um arquivo ZIP.
3. Salvar o arquivo em `/mnt/documents/site-sonar-completo.zip`.
4. Disponibilizar o arquivo como artifact para download/visualização.

### Entrega
Arquivo `site-sonar-completo.zip` em `/mnt/documents/`, pronto para download.