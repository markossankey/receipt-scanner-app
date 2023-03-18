import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { getReceiptDetails, getReceipts } from "../api/Receipts";
import { NotificationContext } from "../context/NotificationContext";

export function useReceiptsQuery() {
  const { setContent } = useContext(NotificationContext);
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["receipt"],
    queryFn: getReceipts,
    onSuccess: (receipts) =>
      receipts.map((receipt) => queryClient.setQueryData(["receipt", receipt.id], receipt)),
  });
}
/**
 * Provide a receiptId
 *
 */
export function useReceiptDetailsQuery(receiptId: string) {
  const { setContent } = useContext(NotificationContext);

  return useQuery({
    queryKey: ["receipt", receiptId],
    queryFn: () => getReceiptDetails(receiptId),
    enabled: !!receiptId,
  });
}
