import { CartItem } from "./types";

export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function cartSubtotalCents(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

const FREE_SHIPPING_THRESHOLD_CENTS = 19900;
const FLAT_SHIPPING_CENTS = 1490;

export function shippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

export function cartTotalCents(items: CartItem[]): number {
  const subtotal = cartSubtotalCents(items);
  return subtotal + shippingCents(subtotal);
}
