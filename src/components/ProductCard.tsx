import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatCents } from "@/lib/price";

export function ProductCard({ product }: { product: Product }) {
  const hasStock = product.variants.some((v) => v.stock > 0);
  const minPrice = Math.min(...product.variants.map((v) => v.priceCents));

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-black/10 transition hover:shadow-md"
    >
      <div className="relative aspect-square w-full bg-black/5">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition group-hover:scale-105"
        />
        {!hasStock && (
          <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            Esgotado
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-black/50">{product.category}</span>
        <h3 className="line-clamp-2 min-h-10 font-medium">{product.title}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold">{formatCents(minPrice)}</span>
          <span className="text-sm text-black/60">★ {product.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
