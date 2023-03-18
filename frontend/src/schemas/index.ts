import { z } from "zod";
import { LineItemModel, ReceiptModel } from "./generated";

export const receiptSchema = ReceiptModel;
export type ReceiptSchema = z.infer<typeof receiptSchema>;

export const receiptWithLineItemsSchema = z.lazy(() =>
  ReceiptModel.extend({
    lineItems: LineItemModel.array(),
  })
);
export type ReceiptWithLineItemsSchema = z.infer<typeof receiptWithLineItemsSchema>;

export const lineItemSchema = LineItemModel;
export type LineItemSchema = z.infer<typeof lineItemSchema>;
