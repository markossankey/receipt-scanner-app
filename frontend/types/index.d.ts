import "@tanstack/react-table";
import { RowData } from "@tanstack/react-table";
import { SafeParseReturnType } from "zod";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    validator?: (value: any) => SafeParseReturnType;
    inputType: "string" | "number";
  }
}

declare global {
  type Without<Obj, Key> = {
    [AllKeys in Exclude<keyof Obj, Key>]: Obj[AllKeys];
  };
}
