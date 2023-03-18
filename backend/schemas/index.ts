import { z } from "zod";
import { ReceiptModel } from "../prisma/zod";

export const dirtyLineItemPatchSchema = z
  .object({
    id: z.string(),
    cleanedLineItemId: z.string().nullable(),
    cleanReceiptId: z.string().nullable(),
    dirtyReceiptId: z.string(),
    name: z.string().nullable(),
    unitPrice: z.coerce.number().nullable(),
    totalPrice: z.coerce.number().nullable(),
    quantity: z.coerce.number().nullable(),
    venderCode: z.string().nullable(),
    currency: z.string(),
    isVerified: z.coerce.boolean(),
  })
  .strict()
  .partial();

export const receiptPatchSchema = z
  .object({
    id: z.string(),
    date: z.string().nullish(),
    total: z.coerce.number().int().nullish(),
    tax: z.coerce.number().int().nullish(),
    amountPaid: z.coerce.number().int().nullish(),
    discountTotal: z.coerce.number().int().nullish(),
    vendorName: z.string().nullish(),
    street: z.string().nullish(),
    city: z.string().nullish(),
    state: z.string().nullish(),
    vendorReceiptId: z.string().nullish(),
    isVerified: z.boolean(),
  })
  .strict()
  .partial();
