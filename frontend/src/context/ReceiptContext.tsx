import { createContext, ReactNode, useState } from "react";

const defaultContext = {
  openReceiptId: null,
  doOpenReceipt: () => null,
};

export const DashboardContext = createContext(defaultContext as unknown as DashboardContextType);

export const DashboardContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openReceiptId, setOpenReceiptId] = useState<DashboardContextType["openReceiptId"]>("");

  const doOpenReceipt: DashboardContextType["doOpenReceipt"] = (receiptId) => {
    setOpenReceiptId(receiptId);
  };

  const props = {
    openReceiptId,
    doOpenReceipt,
  };

  return <DashboardContext.Provider value={props}>{children}</DashboardContext.Provider>;
};

export type DashboardContextType = {
  openReceiptId: string;
  doOpenReceipt: (receiptId: string) => void;
};
