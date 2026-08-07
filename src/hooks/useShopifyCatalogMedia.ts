import { useCallback, useEffect, useState } from "react";
import { PRODUCTS_QUERY, storefrontApiRequest } from "@/lib/shopify";
import { shopifyHandleFor } from "@/lib/shopifyCatalog";

type MediaByHandle = Record<string, string[]>;

export function useShopifyCatalogMedia() {
  const [mediaByHandle, setMediaByHandle] = useState<MediaByHandle>({});

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100 });
        if (!active) return;
        const next: MediaByHandle = {};
        for (const edge of response?.data?.products?.edges ?? []) {
          const node = edge?.node;
          if (!node?.handle) continue;
          next[node.handle] = (node.images?.edges ?? [])
            .map((image: { node?: { url?: string } }) => image.node?.url)
            .filter((url: string | undefined): url is string => Boolean(url));
        }
        setMediaByHandle(next);
      } catch (error) {
        console.warn("[shopify] Não foi possível atualizar as imagens do catálogo.", error);
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

  const imagesFor = useCallback((slug: string) => {
    const handle = shopifyHandleFor(slug);
    return handle ? mediaByHandle[handle] ?? [] : [];
  }, [mediaByHandle]);

  return { imagesFor };
}
