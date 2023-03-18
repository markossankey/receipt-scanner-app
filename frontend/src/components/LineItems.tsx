import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Cell,
  CellContext,
  ColumnDef,
  getCoreRowModel,
  isRowSelected,
  useReactTable,
} from "@tanstack/react-table";
import { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { getReceiptDetails, patchLineItem } from "../api/Receipts";
import { DashboardContext } from "../context/ReceiptContext";
import { usePatchLineItem } from "../hooks/mutations";
import { LineItemSchema } from "../schemas";
import { Table } from "./reusable/Table";
import { Toggle } from "./reusable/Toggle";

export const LineItems = () => {
  const { openReceiptId } = useContext(DashboardContext);
  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ["receipt", openReceiptId],
    queryFn: () => getReceiptDetails(openReceiptId!),
    enabled: !!openReceiptId,
  });

  const table = useReactTable({
    defaultColumn: {
      cell: getDefaultInputCell,
    },
    columns,
    data: data?.lineItems ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) return <div>Loading</div>;
  if (isError) return <div>Error</div>;

  return <Table table={table} isFetching={isFetching} />;
};

const columns: ColumnDef<LineItemSchema>[] = [
  {
    accessorKey: "name",
    accessorFn: (rowData) => (rowData.name ? rowData.name : ""),
    meta: {
      validator: z.string().safeParse,
      inputType: "string",
    },
  },
  { accessorKey: "vendorCode" },
  { accessorKey: "quantity" },
  {
    accessorKey: "unitPrice",
    accessorFn: (rowData) => (rowData.unitPrice ? rowData.unitPrice : ""),
    meta: {
      validator: z.coerce.number().safeParse,
      inputType: "number",
    },
  },
  {
    accessorKey: "totalPrice",
    accessorFn: (rowData) => (rowData.totalPrice ? rowData.totalPrice : ""),
    meta: {
      validator: z.coerce.number().safeParse,
      inputType: "number",
    },
  },
  {
    accessorKey: "isVerified",
    cell: ({ getValue, row, column }) => {
      const [value, setValue] = useState(getValue<boolean>());
      const updateLineItem = usePatchLineItem(row.original.id);

      const handleClick = () => {
        setValue((old) => {
          updateLineItem.mutate({ isVerified: !old });
          return !old;
        });
      };

      return (
        <div className="w-full flex justify-center">
          <Toggle value={value} onClick={handleClick} />
        </div>
      );
    },
  },
];

function getDefaultInputCell({ getValue, row, column }: CellContext<LineItemSchema, unknown>) {
  const validator = column.columnDef.meta?.validator;
  const type = column.columnDef.meta?.inputType ?? "string";
  const initialValue = getValue<string | number>();
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  const updateLineItem = usePatchLineItem(row.original.id);

  const updateValue = (v: any) => {
    if (!validator) {
      console.log("no validator");
      return setValue(v);
    }
    const validatedInput = validator(v);
    if (validatedInput.data) {
      setError("");
      setValue(validatedInput.data);
    } else {
      setValue(v);
      setError(validatedInput.error);
    }
  };
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      className={`bg-transparent ${!!error ? "outline-red-500 border border-red-500" : ""}`}
      value={value}
      onChange={(e) => updateValue(e.target.value)}
      onBlur={() => (!!error ? null : updateLineItem.mutate({ [column.id]: value }))}
      type={type}
    />
  );
}
