import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { patchLineItem, patchReceipt } from "../api/Receipts";
import { NotificationContext } from "../context/NotificationContext";
import { LineItemSchema, ReceiptSchema, ReceiptWithLineItemsSchema } from "../schemas";

export function useUpdateReceipt(receiptId: string) {
  const queryClient = useQueryClient();
  const { setContent } = useContext(NotificationContext);
  return useMutation({
    mutationKey: ["receipt", receiptId],
    mutationFn: (dataToUpdate: Partial<ReceiptSchema>) => patchReceipt({ receiptId, dataToUpdate }),
    onError: () => setContent("Uh-oh.  An error occurred"),
    onSuccess: ({ id, ...rest }: ReceiptSchema) => {
      setContent(
        <div className="text-green-500">
          <span className="font-bold">Big</span>
          <span>success</span>
        </div>
      );
      queryClient.setQueryData(
        ["receipt", receiptId],
        (oldData: ReceiptWithLineItemsSchema | undefined) =>
          oldData === undefined ? undefined : { id, ...rest, lineItems: oldData.lineItems }
      );
      queryClient.setQueryData(["receipt"], (receipts: Array<ReceiptSchema> | undefined) => {
        if (receipts === undefined) return undefined;
        return [{ id, ...rest }, ...receipts.filter((oldReceipt) => oldReceipt.id !== id)];
      });
      queryClient.invalidateQueries({ queryKey: ["receipt"] });
    },
  });
}

export function usePatchLineItem(lineItemId: string) {
  const { setContent } = useContext(NotificationContext);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["lineItem", lineItemId],
    mutationFn: (data: Partial<LineItemSchema>) =>
      patchLineItem({ lineItemId, dataToUpdate: data }),
    onError: () =>
      setContent(<div className="text-red-700">An error occurred updating the line item</div>),
    onSuccess: (resData: LineItemSchema) => {
      queryClient.setQueryData(
        ["receipt", resData.receiptId],
        (receipt: ReceiptWithLineItemsSchema | undefined) => {
          if (receipt === undefined) return undefined;
          return {
            ...receipt,
            lineItems: [resData, ...receipt.lineItems.filter(({ id }) => lineItemId !== id)],
          };
        }
      );
      setContent(<div className="text-green-700">Big Success</div>);
    },
  });
}
