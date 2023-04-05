import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { DashboardContext } from "../context/ReceiptContext";
import { useUpdateReceipt } from "../hooks/mutations";
import { useReceiptDetailsQuery } from "../hooks/queries";
import { convertToUsCents, convertToUsd } from "../utils/money";
import { LineItems } from "./LineItems";
import { DatePicker } from "./reusable/DatePicker";

export const ReceiptDetailsForm = () => {
  const { openReceiptId } = useContext(DashboardContext);
  const receiptMutation = useUpdateReceipt(openReceiptId);
  const { isLoading, isError, data, status } = useReceiptDetailsQuery(openReceiptId);

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      id: "",
      total: "",
      city: "",
      date: "",
      tax: "",
      discountTotal: "",
      vendorName: "",
    },
    values: {
      id: data?.id,
      total: convertToUsd(data?.total),
      city: data?.city,
      date: data?.date,
      tax: convertToUsd(data?.tax),
      discountTotal: convertToUsd(data?.discountTotal),
      vendorName: data?.vendorName,
    },
    resolver: zodResolver(formSchema),
  });

  if (!openReceiptId) return <div>Click a receipt to get started</div>;
  if (isLoading) return <div>{status}</div>;
  if (isError) return <div>Error...</div>;

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    receiptMutation.mutate(data);
  };

  const handleVerifyReceipt = (_event: any) => {
    receiptMutation.mutate({ isVerified: true });
  };

  return (
    <div className="grid grid-rows-24 h-full gap-4 p-4">
      {/* @ts-expect-error */}
      <form className="row-span-6 grid grid-cols-24 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label className="flex-col font-semibold col-span-10 hidden">
          <input {...register("id")} />
        </label>
        <label className="flex flex-col font-semibold col-span-8">
          Vendor:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("vendorName")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-8">
          City:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("city")}
          />
        </label>
        <Controller
          control={control}
          name="date"
          render={({ field: { ref: _ref, ...field } }) => (
            <label className="flex flex-col font-semibold col-span-8">
              Date:
              <DatePicker {...field} />
            </label>
          )}
        />
        <label className="flex flex-col font-semibold col-span-8">
          Amount:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("total")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-8">
          Tax:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("tax")}
          />
        </label>
        <label className="flex flex-col font-semibold col-span-8">
          Discount:
          <input
            className="border rounded-sm bg-opacity-50 px-1 border-malibu-700 bg-malibu-800 font-normal focus:outline-malibu-500 focus:outline-none mt-1"
            {...register("discountTotal")}
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

const formSchema = z.object({
  id: z.string(),
  total: z
    .preprocess(
      (input) => (typeof input === "string" && input !== "" ? convertToUsCents(input) : 0),
      z.number()
    )
    .nullable()
    .optional(),
  city: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  tax: z
    .preprocess(
      (input) => (typeof input === "string" && input !== "" ? convertToUsCents(input) : 0),
      z.number()
    )
    .nullable()
    .optional(),
  discountTotal: z
    .preprocess(
      (input) => (typeof input === "string" && input !== "" ? convertToUsCents(input) : 0),
      z.number()
    )
    .nullable()
    .optional(),
  vendorName: z.string().nullable().optional(),
});
