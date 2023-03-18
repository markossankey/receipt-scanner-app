import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReceiptDetails } from "./components/ReceiptDetails";
import { UnverifiedReceipts } from "./components/UnverifiedReceipts";
import { NotificationContextProvider } from "./context/NotificationContext";
import { DashboardContextProvider } from "./context/ReceiptContext";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationContextProvider>
        <DashboardContextProvider>
          <div className="grid grid-cols-12 grid-rows-24 gap-4 w-screen h-screen p-8 overflow-hidden bg-malibu-900 text-white">
            <div className="row-span-1 col-span-12">
              <a href="#">Editor</a> | <a href="#">Overview</a>
            </div>
            <div className="col-span-9 row-span-23 rounded-lg border border-malibu-800 overflow-hidden p-2 bg-white bg-opacity-5">
              <ReceiptDetails />
            </div>
            <div className="col-span-3 row-span-23 overflow-y-scroll">
              <UnverifiedReceipts />
            </div>
          </div>
        </DashboardContextProvider>
      </NotificationContextProvider>
    </QueryClientProvider>
  );
}

export default App;
