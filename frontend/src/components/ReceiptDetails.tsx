import { FormEvent, FormEventHandler, useContext } from "react";
import { DashboardContext } from "../context/ReceiptContext";
import { useReceiptDetailsQuery } from "../hooks/queries";
import { money } from "../utils/money";
import { LineItems } from "./LineItems";
import { DatePicker } from "./reusable/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { ReceiptSchema } from "../schemas";
import { useMutation } from "@tanstack/react-query";
import { patchReceipt } from "../api/Receipts";
import { useUpdateReceipt } from "../hooks/mutations";

export const ReceiptDetails = () => {
  const { openReceiptId } = useContext(DashboardContext);
  const receiptMutation = useUpdateReceipt(openReceiptId);
  const { isLoading, isError, data, isInitialLoading, isPaused, status } =
    useReceiptDetailsQuery(openReceiptId);

  const { register, handleSubmit, control } = useForm<Partial<ReceiptSchema>>({
    defaultValues: {
      id: "",
      total: 0,
      city: "",
      date: "",
      tax: 0,
      discountTotal: 0,
      vendorName: "",
    },
    values: {
      id: data?.id,
      total: data?.total,
      city: data?.city,
      date: data?.date,
      tax: data?.tax,
      discountTotal: data?.discountTotal,
      vendorName: data?.vendorName,
    },
  });
  if (!openReceiptId) return <div>Click a receipt to get started</div>;
  if (isLoading) return <div>{status}</div>;
  if (isError) return <div>Error...</div>;
  const onSubmit = (data: Partial<ReceiptSchema>) => {
    receiptMutation.mutate(data);
  };

  const handleVerifyReceipt = (_event: any) => {
    receiptMutation.mutate({ isVerified: true });
  };

  return (
    <div className="grid grid-rows-24 h-full gap-4 p-4">
      <form className="row-span-6 grid grid-cols-24 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="flex flex-col font-semibold col-span-10 ">
          ID:
          <input
            {...register("id")}
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal text-gray-400 focus:outline-malibu-500 focus:outline-none mt-1"
            disabled
          />
        </label>
        <label className="flex flex-col font-semibold col-span-7">
          Vendor:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("vendorName")}
          />
        </label>
        <Controller
          control={control}
          name="date"
          render={({ field: { ref: _ref, ...field } }) => (
            <label className="flex flex-col font-semibold col-span-7">
              Date:
              <DatePicker {...field} />
            </label>
          )}
        />
        <label className="flex flex-col font-semibold col-span-6">
          Amount:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("total")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-6">
          Tax:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("tax")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-6">
          Discount:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("discountTotal")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-6">
          City:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("city")}
          />
        </label>
        <div className="flex gap-4 col-span-24 justify-end">
          <button type="submit" className="btn-secondary">
            Save
          </button>
          <button
            className={
              data.lineItems.every((item) => item.isVerified) ? "btn-primary" : "btn-disabled"
            }
            onClick={handleVerifyReceipt}
          >
            Verify Receipt
          </button>
        </div>
      </form>
      <div className="overflow-y-scroll row-span-18">
        <LineItems />
      </div>
    </div>
  );
};
