"use client";

import { useState } from "react";
import { useProducts, useProductSearch } from "@/lib/use-products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const { data, isLoading, isError } = useProducts();
  const [query, setQuery] = useState("");
  const results = useProductSearch(data ?? [], query);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produtos, marcas e categorias…"
          className="min-h-12 w-full rounded-lg border border-black/15 px-4 text-base focus:border-blue-500 focus:outline-none"
        />
      </div>

      {isLoading && (
        <p className="py-12 text-center text-black/50">Carregando catálogo…</p>
      )}

      {isError && (
        <p className="py-12 text-center text-red-600">
          Não foi possível carregar o catálogo agora. Tente novamente em instantes.
        </p>
      )}

      {data && results.length === 0 && (
        <p className="py-12 text-center text-black/50">
          Nenhum produto encontrado para &ldquo;{query}&rdquo;.
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
