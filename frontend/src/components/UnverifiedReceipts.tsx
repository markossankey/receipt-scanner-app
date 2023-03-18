import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getReceipts, postReceipt } from "../api/Receipts";
import { DashboardContext } from "../context/ReceiptContext";
import { formatDate } from "../utils/date";
import { money } from "../utils/money";

export const UnverifiedReceipts = ({}) => {
  const { doOpenReceipt } = useContext(DashboardContext);
  const { isLoading, isError, isFetching, data } = useQuery({
    queryKey: ["receipt"],
    queryFn: getReceipts,
  });

  const { mutate } = useMutation({
    mutationKey: ["receipt", "upload"],
    mutationFn: (file: File) => postReceipt(file),
  });

  if (isLoading) return <div>Is Loadiing</div>;
  if (isError) return <div>Is Error</div>;

  return (
    <>
      <div className="space-y-4">
        <div className="border-b pb-2 min-h-[3rem] pt-1 flex justify-between items-center sticky top-0 bg-malibu-900">
          <span>
            Sort:&nbsp;
            <span className="text-golden-fizz-300">Newest to Oldest</span>
          </span>
          <label className="btn-primary">
            add
            <input
              type="file"
              onChange={(e) => (!!e.target.files?.length ? mutate(e.target.files[0]) : null)}
              className=" hidden"
            />
          </label>
        </div>
        {data.map(({ vendorName, date, total, id, isVerified }) => (
          <div
            key={id}
            className="flex justify-between border border-malibu-800 rounded min-h-[4rem] p-2 bg-white bg-opacity-5 "
          >
            <div>
              <span className="mb-4 flex flex-col">{formatDate(date)}</span>
              {isVerified ? (
                <button className="btn-secondary " onClick={() => doOpenReceipt(id)}>
                  View
                </button>
              ) : (
                <button className="btn-primary " onClick={() => doOpenReceipt(id)}>
                  Edit
                </button>
              )}
            </div>
            <div className="text-right flex flex-col">
              <span className="mb-4 font-bold">{vendorName}</span>
              <span>{money(total)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
