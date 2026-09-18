"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cartSubtotalCents, cartTotalCents, formatCents, shippingCents } from "@/lib/price";

export default function CartPage() {
  const { items, removeItem, setQuantity } = useCart();
  const subtotal = cartSubtotalCents(items);
  const shipping = shippingCents(subtotal);
  const total = cartTotalCents(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="mb-4 text-black/60">Seu carrinho está vazio.</p>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-md bg-blue-600 px-6 font-medium text-white">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-6 sm:px-6 md:grid-cols-[1fr_280px]">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li key={item.sku} className="flex gap-4 rounded-lg border border-black/10 p-3">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-black/5">
              <Image src={item.image} alt={item.title} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-black/60">
                {item.color} · {item.size}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    aria-label="Diminuir quantidade"
                    onClick={() => setQuantity(item.sku, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-black/15"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    aria-label="Aumentar quantidade"
                    onClick={() => setQuantity(item.sku, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-black/15"
                  >
                    +
                  </button>
                </div>
                <span className="font-medium">{formatCents(item.unitPriceCents * item.quantity)}</span>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.sku)}
              className="min-h-12 self-start text-sm text-red-600"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-lg border border-black/10 p-4">
        <h2 className="mb-3 font-semibold">Resumo</h2>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-black/60">Subtotal</span>
          <span>{formatCents(subtotal)}</span>
        </div>
        <div className="flex justify-between py-1 text-sm">
          <span className="text-black/60">Frete</span>
          <span>{shipping === 0 ? "Grátis" : formatCents(shipping)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-black/10 pt-2 font-bold">
          <span>Total</span>
          <span>{formatCents(total)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex min-h-12 items-center justify-center rounded-md bg-blue-600 px-4 font-medium text-white"
        >
          Finalizar compra
        </Link>
      </aside>
    </div>
  );
}
