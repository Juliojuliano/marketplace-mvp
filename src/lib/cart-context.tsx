"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import { CartItem } from "./types";

type CartState = { items: CartItem[] };
type CartAction =
  | { type: "add"; item: CartItem }
  | { type: "remove"; sku: string }
  | { type: "setQuantity"; sku: string; quantity: number }
  | { type: "clear" }
  | { type: "hydrate"; items: CartItem[] };

const STORAGE_KEY = "marketplace.cart.v1";

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { items: action.items };
    case "add": {
      const existing = state.items.find((i) => i.sku === action.item.sku);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.sku === action.item.sku ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "remove":
      return { items: state.items.filter((i) => i.sku !== action.sku) };
    case "setQuantity":
      return {
        items: state.items.map((i) =>
          i.sku === action.sku ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      };
    case "clear":
      return { items: [] };
  }
}

const CartContext = createContext<{
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      // ignore corrupted storage
    }
  }, []);

  // Skip the very first flush: it fires before the hydrate effect's dispatch
  // has been applied, so writing here would overwrite stored data with the
  // empty initial state.
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage unavailable (private mode, quota) — cart just won't persist
    }
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      addItem: (item: CartItem) => dispatch({ type: "add", item }),
      removeItem: (sku: string) => dispatch({ type: "remove", sku }),
      setQuantity: (sku: string, quantity: number) => dispatch({ type: "setQuantity", sku, quantity }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
