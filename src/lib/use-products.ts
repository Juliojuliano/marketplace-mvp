"use client";

import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useMemo } from "react";
import { products } from "./mock-data";
import { Product } from "./types";

// Simulates a network round-trip to a catalog service. Swap this for a real
// fetch() against /api/products (backed by Meilisearch/Elasticsearch) later —
// the fuzzy search below is the client-side fallback the skill spec calls for
// when the search engine is unavailable or not yet provisioned.
async function fetchProducts(): Promise<Product[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return products;
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

export function useProductSearch(allProducts: Product[], query: string) {
  const fuse = useMemo(
    () =>
      new Fuse(allProducts, {
        keys: ["title", "description", "category"],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [allProducts]
  );

  return useMemo(() => {
    if (!query.trim()) return allProducts;
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, allProducts]);
}
