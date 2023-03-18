import * as z from "zod"
import { CompleteLineItem, RelatedLineItemModel } from "./index"

export const ReceiptModel = z.object({
  id: z.string(),
  date: z.string().nullish(),
  total: z.number().int().nullish(),
  tax: z.number().int().nullish(),
  amountPaid: z.number().int().nullish(),
  discountTotal: z.number().int().nullish(),
  vendorName: z.string().nullish(),
  street: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  vendorReceiptId: z.string().nullish(),
  isVerified: z.boolean(),
})

export interface CompleteReceipt extends z.infer<typeof ReceiptModel> {
  lineItems: CompleteLineItem[]
}

/**
 * RelatedReceiptModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedReceiptModel: z.ZodSchema<CompleteReceipt> = z.lazy(() => ReceiptModel.extend({
  lineItems: RelatedLineItemModel.array(),
}))
