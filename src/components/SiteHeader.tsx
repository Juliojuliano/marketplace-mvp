"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cartItemCount } from "@/lib/price";

export function SiteHeader() {
  const { items } = useCart();
  const count = cartItemCount(items);

  return (
    <header className="sticky top-0 z-10 border-b border-black/10 bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-h-12 items-center text-lg font-bold">
          Mercadito
        </Link>
        <Link
          href="/cart"
          className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-md px-3 font-medium hover:bg-black/5"
        >
          Carrinho
          {count > 0 && (
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-600 px-1.5 text-sm text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
