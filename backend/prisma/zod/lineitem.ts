import * as z from "zod"
import { CompleteReceipt, RelatedReceiptModel } from "./index"

export const LineItemModel = z.object({
  id: z.string(),
  receiptId: z.string(),
  name: z.string().nullish(),
  unitPrice: z.number().int().nullish(),
  totalPrice: z.number().int().nullish(),
  quantity: z.number().int().nullish(),
  venderCode: z.string().nullish(),
  currency: z.string(),
  isVerified: z.boolean(),
})

export interface CompleteLineItem extends z.infer<typeof LineItemModel> {
  receipt: CompleteReceipt
}

/**
 * RelatedLineItemModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLineItemModel: z.ZodSchema<CompleteLineItem> = z.lazy(() => LineItemModel.extend({
  receipt: RelatedReceiptModel,
}))
