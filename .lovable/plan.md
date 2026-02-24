

# Pagina de Envio de Fotos por Produto

## Objetivo
Criar uma pagina dedicada que lista todos os produtos do catalogo organizados por categoria. Cada produto sera um link/botao que direciona para uma area de upload de fotos especifica daquele produto, facilitando a organizacao dos envios.

## Produtos do Catalogo (40 produtos, 10 categorias)

```text
PAINEIS ACUSTICOS (7)
  - Painel Acustico SNR3250 (High-Mid)
  - Painel Acustico SNR6450 (Low-Mid)
  - Painel SNR3225 Slim (High-Mid)
  - Painel com Moldura em Madeira
  - Painel com Imagem Plotada
  - Painel com MDF Vazado Frontal
  - Revestimento Ripado Acustico

PAINEIS ESPECIAIS (7)
  - Painel Hexagonal Acustico
  - Painel Circle 360 SNR3250
  - Painel 3S Triangular SNR3250
  - Painel Acustico com LED RGB
  - Painel Acustico com LED Fosco
  - Hexagono LED Decorativo de Colar
  - Reflexive Panels

NUVENS ACUSTICAS (1)
  - Nuvem Acustica SNR3250

BASS TRAPS (2)
  - Bass Trap Corner 3S SNR6430
  - Bass Trap Membrana Profissional SNR6420

DIFUSORES (3)
  - Difusor Acustico QRD
  - Difusor Acustico Skyline
  - Difusor Acustico Bidimensional

BAFFLES & FORROS (2)
  - Baffles Acusticos
  - Forro Acustico Modular

BIOMBOS ACUSTICOS (2)
  - Biombo Acustico Retratil -- 3 Folhas
  - Biombo Acustico 1 Folha com Cavalete

PORTAS & CORTINAS (4)
  - Cortina Acustica SNR96C (Vedacao Completa)
  - Porta Acustica Dupla
  - Porta Acustica com Barra Anti-Panico
  - Painel para Isolar -- D96 com GAP e MDF

MATERIA-PRIMA (10)
  - La de Rocha -- Densidade 32 kg/m3
  - La de Rocha -- Densidade 64 kg/m3
  - La de Rocha -- Densidade 96 kg/m3
  - La de PET
  - Membrana de Borracha
  - Tecidos para Revestimento Acustico
  - Carpete Acustico
  - Piso Emborrachado
  - Drywall Acustico
  - Espuma Expansiva Acustica

ACESSORIOS & SUPORTES (6)
  - Kit de Suportes para Instalacao
  - Velcro 50mm para Fixacao Acustica
  - Microfone para Medicao Acustica
  - Cadeiras e Mesas de Estudio
  - Tapetes Acusticos
  - Kit de Fixacao Acustica

KITS COMPLETOS (3)
  - Kit Estudio Classic
  - Kit Estudio Premium
  - Kit Estudio Pro

SERVICOS (4)
  - Projeto 3D de Tratamento Acustico
  - Consultoria e Analise Tecnica
  - Visita Tecnica
  - Integracao com Transportadora
```

## Implementacao

### 1. Nova pagina: `src/pages/EnvioFotos.tsx`
- Pagina publica (sem autenticacao por enquanto) com layout limpo
- Lista todos os 40 produtos agrupados por categoria (10 categorias)
- Cada produto aparece como um card clicavel com:
  - Nome do produto
  - Imagem thumbnail atual
  - Numero de fotos ja existentes na galeria
- Ao clicar, abre uma area expandida (ou pagina dedicada) para aquele produto especifico onde voce pode enviar fotos

### 2. Area de upload por produto
- Ao clicar no produto, navega para `/envio-fotos/:slug`
- Mostra o nome do produto, fotos atuais da galeria
- Area de drag-and-drop para enviar novas imagens
- As imagens serao salvas no storage do backend vinculadas ao slug do produto
- Isso permite que depois, no CMS admin, as fotos sejam associadas ao produto correto

### 3. Nova rota no `src/App.tsx`
- `/envio-fotos` -- lista de produtos
- `/envio-fotos/:slug` -- upload para produto especifico

### 4. Tabela no banco de dados
- Tabela `product_images` com colunas: `id`, `product_slug`, `image_url`, `alt_text`, `sort_order`, `created_at`
- Bucket de storage `product-photos` para armazenar as imagens enviadas
- Politicas de acesso publico para leitura, escrita aberta (ou protegida se preferir)

## Detalhes Tecnicos

- Utiliza o array `products` de `src/data/products.ts` para listar os produtos
- Agrupa por `product.category` para organizacao visual
- Componentes existentes reutilizados: `Layout`, `SectionHeading`
- Upload via Lovable Cloud Storage com preview de imagem antes de enviar
- Interface responsiva seguindo o design system existente

