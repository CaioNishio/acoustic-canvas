import { describe, it, expect } from 'vitest';
import { formatMoney, isPrecoInvalido } from '@/lib/formatCurrency';

describe('formatMoney', () => {
  // Intl separa simbolo e numero com espaco nao-quebravel (U+00A0), nao com
  // espaco comum. Normalizar aqui deixa a intencao do teste legivel. O NBSP e
  // construido em runtime para nao deixar caractere invisivel no fonte.
  const NBSP = String.fromCharCode(160);
  const normalizar = (s: string) => s.split(NBSP).join(' ');

  it('formata BRL no padrao brasileiro', () => {
    expect(normalizar(formatMoney({ amount: '92.45', currencyCode: 'BRL' }))).toBe('R$ 92,45');
  });

  it('formata milhar com separador correto', () => {
    expect(normalizar(formatMoney({ amount: '1349.45', currencyCode: 'BRL' }))).toBe(
      'R$ 1.349,45',
    );
  });

  it('nao estoura com moeda desconhecida — cai no fallback', () => {
    expect(formatMoney({ amount: '10.00', currencyCode: 'XXXX' })).toBe('XXXX 10.00');
  });

  it('devolve string vazia para preco ausente ou ilegivel', () => {
    expect(formatMoney(null)).toBe('');
    expect(formatMoney(undefined)).toBe('');
    expect(formatMoney({ amount: 'abc', currencyCode: 'BRL' })).toBe('');
  });
});

describe('isPrecoInvalido', () => {
  it('barra o caso real que motivou a funcao: produto ativo a 0,00', () => {
    // `revestimento-ripado` estava assim na loja em 28/07/2026.
    expect(isPrecoInvalido({ amount: '0.00', currencyCode: 'BRL' })).toBe(true);
  });

  it('barra preco negativo e ilegivel', () => {
    expect(isPrecoInvalido({ amount: '-5.00', currencyCode: 'BRL' })).toBe(true);
    expect(isPrecoInvalido({ amount: 'abc', currencyCode: 'BRL' })).toBe(true);
  });

  it('barra preco ausente', () => {
    expect(isPrecoInvalido(null)).toBe(true);
    expect(isPrecoInvalido(undefined)).toBe(true);
  });

  it('libera preco normal, inclusive centavos baixos', () => {
    expect(isPrecoInvalido({ amount: '92.45', currencyCode: 'BRL' })).toBe(false);
    expect(isPrecoInvalido({ amount: '0.01', currencyCode: 'BRL' })).toBe(false);
  });
});
