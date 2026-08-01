import { describe, it, expect } from "vitest";
import { products, categories } from "@/data/products";
import { productPrices } from "@/data/productPrices";

/**
 * Rede de seguranca do catalogo. Nao testa regra de negocio: testa que os
 * dados que a vitrine consome estao integros — slug unico, imagem resolvida,
 * categoria conhecida. Um erro aqui vira card quebrado ou rota 404 em producao.
 */
describe("integridade do catálogo", () => {
  it("não tem slug duplicado", () => {
    const seen = new Map<string, number>();
    for (const p of products) seen.set(p.slug, (seen.get(p.slug) ?? 0) + 1);
    const duplicados = [...seen.entries()].filter(([, n]) => n > 1).map(([s]) => s);
    expect(duplicados).toEqual([]);
  });

  it("todo produto tem nome, slug e imagem de capa resolvida", () => {
    const quebrados = products
      .filter((p) => !p.slug?.trim() || !p.name?.trim() || !p.image)
      .map((p) => p.slug || p.name);
    expect(quebrados).toEqual([]);
  });

  it("nenhuma imagem de galeria vem vazia ou indefinida", () => {
    const quebrados = products
      .filter((p) => p.gallery.some((img) => !img))
      .map((p) => p.slug);
    expect(quebrados).toEqual([]);
  });

  it("toda categoria usada existe na lista de categorias", () => {
    const conhecidas = new Set<string>(categories);
    const orfas = [...new Set(products.map((p) => p.category))].filter((c) => !conhecidas.has(c));
    expect(orfas).toEqual([]);
  });

  it("todo slug com preço cadastrado existe no catálogo", () => {
    const slugs = new Set(products.map((p) => p.slug));
    const orfaos = Object.keys(productPrices).filter((slug) => !slugs.has(slug));
    expect(orfaos).toEqual([]);
  });
});
