# Pasta de imagens dos produtos

Esta é a pasta que você controla. O que estiver aqui aparece no site; o que
for apagado daqui some do site. Nenhuma mudança de código é necessária.

## Como usar

Crie uma pasta com o **slug do produto** e coloque as fotos dentro:

```
src/assets/produtos/
  painel-acustico-snr3250/
    01-capa.png
    02-ambiente.jpg
    03-detalhe.jpg
  difusor-skyline/
    01-capa.png
    02-instalado.jpg
```

- **A primeira imagem em ordem alfabética vira a capa** do produto. Por isso
  o prefixo numérico (`01-`, `02-`, `03-`) — ele define a ordem da galeria.
- Formatos aceitos: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Produtos sem pasta aqui continuam usando as imagens padrão já configuradas.

## Para a mudança aparecer

- Rodando `npm run dev`: aparece na hora, ao salvar.
- Para o site publicado: rode `npm run build` depois de mexer nas fotos.

## Onde encontrar o slug de cada produto

O slug é o que aparece no endereço da página do produto:
`/produtos/painel-acustico-snr3250` → slug é `painel-acustico-snr3250`.

Para listar todos de uma vez:

```
node scripts/covers.mjs
```

## Fundo transparente nas capas

O padrão das capas é o produto **sem fundo**. Se você adicionar uma foto com
fundo branco e quiser recortá-la:

```
node scripts/remove-background.mjs src/assets/produtos/<slug>/01-capa.jpg
```

Sem `--apply` ele só simula e mostra o que faria. Com `--apply` ele grava.
O recorte só acontece quando o produto está sobre fundo liso — fotos de
ambiente são preservadas automaticamente.
