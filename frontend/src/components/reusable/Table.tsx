import { flexRender, Row, Table as TableType } from "@tanstack/react-table";

export const Table = <T extends unknown>({ table, isFetching, onRowClick }: TableProps<T>) => {
  return (
    <table className="w-full">
      <thead
        className={`sticky top-0 bg-malibu-700 text-white z-10  ${
          isFetching ? "border-pulse" : ""
        }`}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="p-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border border-malibu-700"
            onClick={onRowClick ? () => onRowClick(row) : () => null}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="py-2 text-center">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export type TableProps<T> = {
  table: TableType<T>;
  isFetching: boolean;
  onRowClick?: (row: Row<T>) => void;
};
