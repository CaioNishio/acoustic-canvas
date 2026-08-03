# FIELD-MAPPING

Mapeamento formulário → proposta → PDF, conforme `PROPOSAL_ENGINE §7`.

Referência visual: `Alexandre - Porto Seguro - SNR PDV 2 - atualizado (1).pdf`
(documento nº 3215, A4 retrato, 595,32 × 841,92 pt).

> Sobre a origem do layout: o PDF de referência é uma imagem raster de 300 DPI
> com uma fina camada de texto. Os rótulos e a estrutura foram extraídos dele
> por leitura visual e reproduzidos em vetor — o arquivo original **não** é
> embutido, porque contém os dados pessoais do cliente M20 Arquitetura. Ver
> `DECISIONS.md#D1`.

---

## Cabeçalho

| Origem | Destino no PDF | Observação |
|---|---|---|
| *fixo* | logo Sonar Acústicos | asset do projeto |
| *fixo* | `SONAR ACÚSTICOS` | |
| *fixo* | `CNPJ: 50.208.185/0001-00` | |
| *fixo* | `Chave PIX (CNPJ): 50.208.185/0001-00` | |
| *fixo* | `Avenida Lindóia, 388 - Centro` | |
| *fixo* | `Bragança Paulista - SP - CEP 12900-000` | |
| *fixo* | `Telefone: (11) 96748-4000` | |
| *fixo* | `contato@sonaracusticos.com.br` | |
| *fixo* | `www.sonaracusticos.com.br` | |
| *fixo* | título `ORÇAMENTO` | com fio dourado abaixo |
| `proposal.number` | `Nº DO DOCUMENTO` | 4 dígitos, zero à esquerda |
| `proposal.createdAt` | `DATA DE EMISSÃO` | `dd/MM/yyyy` |
| `proposal.validUntil` | `VALIDADE DA PROPOSTA` | `dd/MM/yyyy` |

## DADOS DO CLIENTE

Faixa azul-petróleo com ícone. Campo sem valor imprime `—`, como no original.

| Origem | Destino | Rótulo impresso |
|---|---|---|
| `form.customer.name` | `pdf.customer.name` | `Razão Social / Nome:` |
| `form.customer.document` | `pdf.customer.document` | `CNPJ / CPF:` |
| `form.customer.address` | `pdf.customer.address` | `Endereço:` |
| `form.customer.neighborhood` | `pdf.customer.neighborhood` | `Bairro:` |
| `form.customer.city` + `state` | `pdf.customer.city` | `Cidade / UF:` — `São Paulo - SP` |
| `form.customer.zip` | `pdf.customer.zip` | `CEP:` |
| `form.customer.phone` | `pdf.customer.phone` | `Telefone:` |
| `form.customer.email` | `pdf.customer.email` | `E-mail:` |
| `form.customer.stateRegistration` | `pdf.customer.stateRegistration` | `Inscrição Estadual:` |

## Tabela de itens

Cabeçalho azul-petróleo: `#` · `DESCRIÇÃO` · `UN.` · `QTD.` · `VALOR UNITÁRIO` ·
`VALOR TOTAL`.

| Origem | Destino | Formato |
|---|---|---|
| índice | `#` | 1, 2, 3… |
| `item.description` | linha principal, negrito | |
| `item.sku` + `item.finish` + `item.dimensions` + `item.leadTime` | sublinha cinza menor | `SKU: X \| Natural • 52,43 x 46,67 cm, envernizado e selado - Prazo em torno de 7 dias úteis` |
| `item.unit` | `UN.` | `un.` / `serv.` / `m²` |
| `item.quantity` | `QTD.` | 2 casas, vírgula decimal |
| `item.unitPrice` | `VALOR UNITÁRIO` | `R$ 1.234,56` |
| `item.total` | `VALOR TOTAL` | `R$ 1.234,56`, negrito |

Abaixo da tabela, fixo: `Os valores podem sofrer alterações sem aviso prévio.`

**Overflow (`§8`):** ao exceder a página, criar página adicional repetindo o
cabeçalho da tabela. Fonte não reduz abaixo do limite legível.

## IMPOSTOS

Colunas `TIPO DE IMPOSTO` · `ALÍQUOTA (%)` · `BASE DE CÁLCULO` · `VALOR`.
Linhas `ISS`, `PIS`, `COFINS`; ausente imprime `—`.
Rodapé fixo: `OBS.: Empresa optante pelo Simples Nacional.`

## TOTAIS

| Origem | Destino | Formato |
|---|---|---|
| `proposal.subtotal` | `SUBTOTAL` | `R$ 5.888,62` |
| `proposal.discount` | `DESCONTOS` | negativo: `- R$ 294,43` |
| `proposal.taxBase` | `BASE DE CÁLCULO` | |
| `proposal.taxes` | `TOTAL DE IMPOSTOS` | |
| `proposal.total` | `TOTAL GERAL` | **dourado, maior** |

## MEIOS DE PAGAMENTO

Bloco fixo: **PIX** (`Chave (CNPJ): 50.208.185/0001-00`), **TRANSFERÊNCIA
BANCÁRIA** (`Solicite os dados bancários.`), **CARTÃO DE CRÉDITO**
(`Parcelas em até 12x` / `Taxa cobrada de acordo com a quantidade de parcelas.`).

## INFORMAÇÕES ADICIONAIS

`proposal.additionalInfo[]` → lista com marcadores. Padrão do original:

```text
Esta proposta é válida até a data informada no cabeçalho.
Prazo: cerca de N dias úteis. Entrega: dd/MM/yyyy (dia da semana).
Pagamento exclusivamente via Pix, com 5% de desconto.
50% para início da fabricação e 50% na entrega, em dd/MM/yyyy.
Garantia dos produtos: conforme especificações dos fabricantes.
Instalação: dd/MM/yyyy (dia da semana), por equipe da SONAR ACÚSTICOS.
```

Encerramento fixo: `Agradecemos a confiança!` / `S O N A R  A C Ú S T I C O S`.

## Rodapé

Fixo, com ícones: `Avenida Lindóia, 388, Centro / Bragança Paulista - SP` ·
`(11) 96748-4000` · `contato@sonaracusticos.com.br`.

---

## Regras de formatação

- **Moeda:** `pt-BR`, `R$ 1.234,56`. Negativo com hífen antes: `- R$ 294,43`.
- **Datas:** `dd/MM/yyyy`. Dia da semana por extenso quando o original traz.
- **Acentuação:** fonte com suporte a Latin-1 estendido — validar `ç ã õ é ú`.
- **Vazio:** travessão `—`, nunca `null`, `undefined` ou string vazia.
