<#
.SYNOPSIS
    Valida um Storefront API access token contra a loja Sonar antes de coloca-lo
    em producao.

.DESCRIPTION
    Existe porque ja se perdeu tempo com tokens que parecem certos e nao sao.
    O Storefront token nao tem prefixo: sao 32 caracteres hexadecimais crus.
    Os que costumam ser confundidos com ele:

      shpss_...  API secret key do app (client secret do OAuth). E PRIVADO.
      shpat_...  Admin API token. Poderoso e privado — NUNCA vai para o site.
      atkn_...   Token de sessao de outro servico Shopify.

    Todos os tres devolvem HTTP 401 na Storefront API.

.EXAMPLE
    .\scripts\validar-token-shopify.ps1 -Token 36246b064de1d99f686bab0e2ce19424

.EXAMPLE
    # Le do .env do site
    .\scripts\validar-token-shopify.ps1
#>
[CmdletBinding()]
param(
    # Token a validar. Se omitido, tenta ler VITE_SHOPIFY_STOREFRONT_TOKEN do .env.
    [string]$Token,

    # Dominio permanente da loja.
    [string]$Loja = 'sonaracusticos.myshopify.com',

    [string]$ApiVersion = '2025-07'
)

$ErrorActionPreference = 'Stop'

if (-not $Token) {
    $envPath = Join-Path (Split-Path $PSScriptRoot -Parent) '.env'
    if (-not (Test-Path $envPath)) {
        Write-Error "Nenhum -Token informado e nao existe .env em $envPath"
        exit 1
    }
    $linha = Get-Content $envPath | Where-Object { $_ -match '^\s*VITE_SHOPIFY_STOREFRONT_TOKEN\s*=' } | Select-Object -First 1
    $Token = ($linha -split '=', 2)[1].Trim().Trim('"').Trim("'")
    if (-not $Token) {
        Write-Error 'VITE_SHOPIFY_STOREFRONT_TOKEN esta vazio no .env'
        exit 1
    }
    Write-Host "Token lido de .env" -ForegroundColor DarkGray
}

# --- Conferencia de formato, antes de gastar uma request ---
# Barato e pega o erro mais comum: token com prefixo.
if ($Token -match '^(shpss_|shpat_|shpca_|atkn_|shpua_)') {
    $prefixo = $Matches[1]
    Write-Host "[X] FORMATO INVALIDO" -ForegroundColor Red
    Write-Host "    Este token comeca com '$prefixo' — nao e um Storefront token." -ForegroundColor Red
    switch ($prefixo) {
        'shpss_' { Write-Host "    'shpss_' e a API secret key do app (client secret). E PRIVADA." -ForegroundColor Yellow }
        'shpat_' { Write-Host "    'shpat_' e o Admin API token. NUNCA colocar no site." -ForegroundColor Yellow }
        'atkn_'  { Write-Host "    'atkn_' e token de sessao de outro servico Shopify." -ForegroundColor Yellow }
        default  { Write-Host "    Token de outro tipo." -ForegroundColor Yellow }
    }
    Write-Host "    O Storefront token tem 32 caracteres hex, SEM prefixo." -ForegroundColor Yellow
    exit 1
}

if ($Token -notmatch '^[0-9a-f]{32}$') {
    Write-Host "[!] Formato inesperado: esperado 32 caracteres hexadecimais, recebido $($Token.Length)." -ForegroundColor Yellow
    Write-Host "    Testando mesmo assim..." -ForegroundColor DarkGray
}

# --- Teste real contra a loja ---
$url = "https://$Loja/api/$ApiVersion/graphql.json"
$corpo = @{ query = '{ shop { name primaryDomain { url } } products(first: 3) { edges { node { title } } } }' } | ConvertTo-Json

try {
    $r = Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' `
        -Headers @{ 'X-Shopify-Storefront-Access-Token' = $Token } -Body $corpo -ErrorAction Stop
}
catch {
    $codigo = [int]$_.Exception.Response.StatusCode
    Write-Host "[X] TOKEN REJEITADO (HTTP $codigo)" -ForegroundColor Red
    switch ($codigo) {
        401 { Write-Host "    401 = token invalido para esta loja, ou app nao instalado." -ForegroundColor Yellow }
        402 { Write-Host "    402 = a LOJA precisa de plano pago. O token pode estar certo." -ForegroundColor Yellow }
        403 { Write-Host "    403 = falta o escopo unauthenticated_read_product_listings." -ForegroundColor Yellow }
        404 { Write-Host "    404 = dominio '$Loja' nao existe. Confira o dominio permanente." -ForegroundColor Yellow }
    }
    exit 1
}

if ($r.errors) {
    Write-Host "[X] A Shopify respondeu com erros de GraphQL:" -ForegroundColor Red
    $r.errors | ForEach-Object { Write-Host "    - $($_.message)" -ForegroundColor Yellow }
    exit 1
}

$qtd = @($r.data.products.edges).Count
Write-Host "[OK] TOKEN VALIDO" -ForegroundColor Green
Write-Host "     Loja:     $($r.data.shop.name)" -ForegroundColor Green
Write-Host "     Dominio:  $($r.data.shop.primaryDomain.url)" -ForegroundColor Green
Write-Host "     Produtos: leu $qtd na amostra" -ForegroundColor Green

if ($qtd -eq 0) {
    Write-Host "[!] O token autentica, mas nenhum produto foi retornado." -ForegroundColor Yellow
    Write-Host "    Provavel causa: os produtos nao estao publicados no canal de vendas" -ForegroundColor Yellow
    Write-Host "    do app. Admin > Produtos > (produto) > Publicacao." -ForegroundColor Yellow
    exit 2
}

Write-Host ''
Write-Host 'Proximo passo: colocar em .env (local) e nas variaveis de ambiente da' -ForegroundColor Cyan
Write-Host 'hospedagem, como VITE_SHOPIFY_STOREFRONT_TOKEN. Ver docs/DEPLOY.md.' -ForegroundColor Cyan
exit 0
