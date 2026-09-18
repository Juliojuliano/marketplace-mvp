import { describe, expect, it } from "vitest";
import { cartItemCount, cartSubtotalCents, cartTotalCents, shippingCents } from "./price";
import { CartItem } from "./types";

const item = (unitPriceCents: number, quantity: number): CartItem => ({
  productId: "p1",
  sku: "SKU1",
  title: "Item",
  color: "Preto",
  size: "M",
  unitPriceCents,
  quantity,
  image: "img.jpg",
});

describe("cartSubtotalCents", () => {
  it("sums unit price times quantity across items", () => {
    expect(cartSubtotalCents([item(1000, 2), item(500, 3)])).toBe(3500);
  });

  it("returns 0 for an empty cart", () => {
    expect(cartSubtotalCents([])).toBe(0);
  });
});

describe("cartItemCount", () => {
  it("sums quantities, not distinct items", () => {
    expect(cartItemCount([item(1000, 2), item(500, 3)])).toBe(5);
  });
});

describe("shippingCents", () => {
  it("charges flat shipping below the free-shipping threshold", () => {
    expect(shippingCents(19899)).toBe(1490);
  });

  it("is free at or above the threshold", () => {
    expect(shippingCents(19900)).toBe(0);
    expect(shippingCents(50000)).toBe(0);
  });
});

describe("cartTotalCents", () => {
  it("adds shipping to the subtotal", () => {
    expect(cartTotalCents([item(5000, 1)])).toBe(5000 + 1490);
  });

  it("has no shipping once the subtotal clears the threshold", () => {
    expect(cartTotalCents([item(20000, 1)])).toBe(20000);
  });
});
