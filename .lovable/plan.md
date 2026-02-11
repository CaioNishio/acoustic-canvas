

## Substituir Logo e Aumentar Tamanho

### O que será feito:

1. **Salvar o novo logo** (`logo_dourado-2.png`) no lugar do logo atual em `src/assets/logo-sonar.png`

2. **Remover o fundo escuro do logo** - O logo será exibido com CSS que garante que o fundo fique branco/transparente, imperceptível no site. Será aplicado um `background-color: white` com `border-radius` e `padding` para criar um fundo limpo ao redor do logo dourado.

3. **Aumentar o tamanho do logo 3x**:
   - **Header**: de `h-14` para `h-40` (aproximadamente 3x maior)
   - **Footer**: de `h-16` para `h-44` (aproximadamente 3x maior)
   - Ajustar a altura do container do header para acomodar o logo maior

### Arquivos modificados:
- `src/assets/logo-sonar.png` - substituido pelo novo logo
- `src/components/layout/Header.tsx` - logo maior + estilo de fundo branco
- `src/components/layout/Footer.tsx` - logo maior + estilo de fundo branco

