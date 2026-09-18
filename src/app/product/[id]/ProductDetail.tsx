"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { formatCents } from "@/lib/price";
import { useCart } from "@/lib/cart-context";

export function ProductDetail({ product }: { product: Product }) {
  const colors = useMemo(() => [...new Set(product.variants.map((v) => v.color))], [product]);
  const [color, setColor] = useState(colors[0]);
  const sizesForColor = useMemo(
    () => product.variants.filter((v) => v.color === color),
    [product, color]
  );
  const [size, setSize] = useState<string | undefined>(sizesForColor[0]?.size);
  const selected = product.variants.find((v) => v.color === color && v.size === size);

  const { addItem } = useCart();
  const router = useRouter();
  const [justAdded, setJustAdded] = useState(false);

  function handleColorChange(nextColor: string) {
    setColor(nextColor);
    const firstAvailable = product.variants.find((v) => v.color === nextColor);
    setSize(firstAvailable?.size);
  }

  function handleAddToCart() {
    if (!selected || selected.stock === 0) return;
    addItem({
      productId: product.id,
      sku: selected.sku,
      title: product.title,
      color: selected.color,
      size: selected.size,
      unitPriceCents: selected.priceCents,
      quantity: 1,
      image: product.images[0],
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 md:grid-cols-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-black/5">
        <Image src={product.images[0]} alt={product.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <span className="text-sm text-black/50">{product.category}</span>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="mt-1 text-sm text-black/60">
            ★ {product.rating.toFixed(1)} · {product.reviewCount} avaliações
          </p>
        </div>

        <p className="text-3xl font-bold">
          {selected ? formatCents(selected.priceCents) : "Selecione uma variante"}
        </p>

        <p className="text-black/70">{product.description}</p>

        <div>
          <p className="mb-2 text-sm font-medium">Cor</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => handleColorChange(c)}
                className={`min-h-12 rounded-md border px-4 text-sm ${
                  c === color ? "border-blue-600 bg-blue-50 font-medium" : "border-black/15"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Tamanho / Modelo</p>
          <div className="flex flex-wrap gap-2">
            {sizesForColor.map((v) => (
              <button
                key={v.sku}
                disabled={v.stock === 0}
                onClick={() => setSize(v.size)}
                className={`min-h-12 min-w-12 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-40 ${
                  v.size === size ? "border-blue-600 bg-blue-50 font-medium" : "border-black/15"
                }`}
                title={v.stock === 0 ? "Sem estoque" : `${v.stock} em estoque`}
              >
                {v.size}
                {v.stock === 0 && " (esgotado)"}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selected || selected.stock === 0}
          className="min-h-12 rounded-md bg-blue-600 px-6 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {selected?.stock === 0 ? "Sem estoque" : justAdded ? "Adicionado ✓" : "Adicionar ao carrinho"}
        </button>

        {justAdded && (
          <button
            onClick={() => router.push("/cart")}
            className="min-h-12 rounded-md border border-black/15 px-6 font-medium"
          >
            Ir para o carrinho
          </button>
        )}
      </div>
    </div>
  );
}
