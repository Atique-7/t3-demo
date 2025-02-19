"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  partsTotal: number | undefined;
}

export function ViewCurrentPartsDataTable<TData, TValue>({
  columns,
  data,
  partsTotal,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Parts</div>
        </div>

        <Table className="border-b">
          <TableHeader className="bg-gray-100 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getCoreRowModel().rows?.length ? (
              table.getCoreRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
        <div className="flex p-2 justify-between items-center px-5">
          <div className="font-semibold text-gray-700">
            Total :{" "}
            <span className="ml-2 text-xl font-bold text-black mb-4">
              &#8377;{partsTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
