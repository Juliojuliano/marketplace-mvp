import { z } from "zod";

export const VariantSchema = z.object({
  sku: z.string(),
  color: z.string(),
  size: z.string(),
  voltage: z.string().optional(),
  stock: z.number().int().min(0),
  priceCents: z.number().int().positive(),
});
export type Variant = z.infer<typeof VariantSchema>;

export const ProductSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  images: z.array(z.string()).min(1),
  basePriceCents: z.number().int().positive(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  variants: z.array(VariantSchema).min(1),
});
export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = z.object({
  productId: z.string(),
  sku: z.string(),
  title: z.string(),
  color: z.string(),
  size: z.string(),
  unitPriceCents: z.number().int().positive(),
  quantity: z.number().int().min(1),
  image: z.string(),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CheckoutRequestSchema = z.object({
  idempotencyKey: z.string().uuid(),
  items: z.array(CartItemSchema).min(1),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
  }),
});
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const CheckoutResponseSchema = z.object({
  orderId: z.string(),
  status: z.enum(["confirmed", "duplicate"]),
  totalCents: z.number().int().positive(),
  estimatedShipping: z.object({
    carrier: z.string(),
    etaDays: z.number().int().positive(),
    isFallback: z.boolean(),
  }),
});
export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;
