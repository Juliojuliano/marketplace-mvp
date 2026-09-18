"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { cartTotalCents, formatCents } from "@/lib/price";
import { CheckoutResponse, CheckoutResponseSchema } from "@/lib/types";

async function submitCheckout(payload: unknown): Promise<CheckoutResponse> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("checkout_failed");
  return CheckoutResponseSchema.parse(await res.json());
}

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const total = cartTotalCents(items);
  // Stable per-attempt key: retries (slow network, double-click) reuse it,
  // so the API can recognize duplicates instead of creating two orders.
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const mutation = useMutation({
    mutationFn: submitCheckout,
    onSuccess: (data) => {
      if (data.status === "confirmed") clear();
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate({ idempotencyKey, items, customer: form });
  }

  if (items.length === 0 && !mutation.data) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="mb-4 text-black/60">Seu carrinho está vazio.</p>
        <Link href="/" className="inline-flex min-h-12 items-center rounded-md bg-blue-600 px-6 font-medium text-white">
          Ver produtos
        </Link>
      </div>
    );
  }

  if (mutation.data) {
    const order = mutation.data;
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">Pedido confirmado!</h1>
        <p className="text-black/60">Número do pedido: {order.orderId}</p>
        <p className="mt-4 text-lg font-medium">{formatCents(order.totalCents)}</p>
        <p className="mt-2 text-sm text-black/60">
          Entrega via {order.estimatedShipping.carrier} em até {order.estimatedShipping.etaDays} dias
          {order.estimatedShipping.isFallback && " (estimativa padrão)"}
        </p>
        <Link href="/" className="mt-6 inline-flex min-h-12 items-center rounded-md bg-blue-600 px-6 font-medium text-white">
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-4 px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold">Finalizar compra</h1>
      <p className="text-black/60">Total: {formatCents(total)}</p>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Nome completo</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="min-h-12 rounded-md border border-black/15 px-3"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">E-mail</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="min-h-12 rounded-md border border-black/15 px-3"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Endereço de entrega</span>
        <input
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="min-h-12 rounded-md border border-black/15 px-3"
        />
      </label>

      {mutation.isError && (
        <p className="text-sm text-red-600">Não foi possível concluir o pedido. Tente novamente.</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="min-h-12 rounded-md bg-blue-600 px-6 font-medium text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Processando…" : "Confirmar pedido"}
      </button>
    </form>
  );
}
