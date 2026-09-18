import { NextRequest, NextResponse } from "next/server";
import { CheckoutRequestSchema, CheckoutResponse } from "@/lib/types";
import { cartTotalCents } from "@/lib/price";

// In-memory stand-in for a Redis idempotency cache. A real deployment would
// use Redis SETNX + TTL so this survives restarts and works across instances;
// here a single Map with a manual expiry sweep demonstrates the same contract.
const IDEMPOTENCY_TTL_MS = 5 * 60 * 1000;
const idempotencyStore = new Map<string, { response: CheckoutResponse; expiresAt: number }>();

function sweepExpired() {
  const now = Date.now();
  for (const [key, entry] of idempotencyStore) {
    if (entry.expiresAt < now) idempotencyStore.delete(key);
  }
}

type ShippingQuote = CheckoutResponse["estimatedShipping"];

async function simulateCarrierApi(): Promise<ShippingQuote> {
  const latency = 200 + Math.random() * 900; // occasionally exceeds the timeout below on purpose
  await new Promise((resolve) => setTimeout(resolve, latency));
  return { carrier: "Transportadora Expressa", etaDays: 3, isFallback: false };
}

async function quoteShipping(): Promise<ShippingQuote> {
  const SHIPPING_API_TIMEOUT_MS = 800;
  try {
    return await Promise.race([
      simulateCarrierApi(),
      new Promise<ShippingQuote>((_, reject) =>
        setTimeout(() => reject(new Error("shipping quote timed out")), SHIPPING_API_TIMEOUT_MS)
      ),
    ]);
  } catch {
    return { carrier: "Correios (padrão)", etaDays: 7, isFallback: true };
  }
}

export async function POST(request: NextRequest) {
  sweepExpired();

  const body = await request.json().catch(() => null);
  const parsed = CheckoutRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.issues }, { status: 400 });
  }

  const { idempotencyKey, items } = parsed.data;

  const cached = idempotencyStore.get(idempotencyKey);
  if (cached) {
    return NextResponse.json({ ...cached.response, status: "duplicate" } satisfies CheckoutResponse);
  }

  const shipping = await quoteShipping();
  const response: CheckoutResponse = {
    orderId: `ord_${idempotencyKey.slice(0, 8)}`,
    status: "confirmed",
    totalCents: cartTotalCents(items),
    estimatedShipping: shipping,
  };

  idempotencyStore.set(idempotencyKey, { response, expiresAt: Date.now() + IDEMPOTENCY_TTL_MS });
  return NextResponse.json(response);
}
