import { useCallback, useEffect, useState } from "react";
import { PRODUCTS_QUERY, storefrontApiRequest } from "@/lib/shopify";
import { shopifyHandleFor } from "@/lib/shopifyCatalog";

export type ShopifyCatalogContent = {
  title: string;
  description: string;
  images: string[];
};

type ContentByHandle = Record<string, ShopifyCatalogContent>;

export function useShopifyCatalogMedia() {
  const [contentByHandle, setContentByHandle] = useState<ContentByHandle>({});

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
        if (!active) return;
        const next: ContentByHandle = {};
        for (const edge of response?.data?.products?.edges ?? []) {
          const node = edge?.node;
          if (!node?.handle) continue;
          next[node.handle] = {
            title: typeof node.title === "string" ? node.title.trim() : "",
            description: typeof node.description === "string" ? node.description.trim() : "",
            images: (node.images?.edges ?? [])
              .map((image: { node?: { url?: string } }) => image.node?.url)
              .filter((url: string | undefined): url is string => Boolean(url)),
          };
        }
        setContentByHandle(next);
      } catch (error) {
        console.warn("[shopify] Não foi possível atualizar o conteúdo do catálogo.", error);
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 120_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, []);

  const contentFor = useCallback((slug: string) => {
    const handle = shopifyHandleFor(slug);
    return handle ? contentByHandle[handle] : undefined;
  }, [contentByHandle]);

  const imagesFor = useCallback((slug: string) =>
    contentFor(slug)?.images ?? [], [contentFor]);

  return { contentFor, imagesFor };
}
