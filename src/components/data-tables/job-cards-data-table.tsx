"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobCardStatusKey } from "@/lib/helper";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function JobCardsDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const displayStatus = (jobCardStatus: number) => {
    const statusObj = jobCardStatusKey.find(
      (status: any) => status.code === jobCardStatus
    );
    return (
      <div className="flex items-center px-4 py-2  rounded-full font-semibold space-x-5">
        <div
          className={`h-5 w-5 rounded-full 
        ${jobCardStatus == 0 && "bg-[#0040c1]"}
        ${jobCardStatus == 1 && "bg-[#1849a9]"}
        ${jobCardStatus == 2 && "bg-[#065986]"}
        ${jobCardStatus == 3 && "bg-[#107569]"}
        ${jobCardStatus == 4 && "bg-[#099250]"}
        ${jobCardStatus == 5 && "bg-[#4ca30d]"}
        ${jobCardStatus == 6 && "bg-[#737373]"}`}
        ></div>
        <div>{statusObj?.description}</div>
      </div>
    );
  };

  const displayActionButton = (row: any) => {
    const pathname = usePathname();

    const token = getCookie("user");

    const parsedToken = JSON.parse(String(token));

    const userAccess = parsedToken.labels[0];

    const jobCard = row.original;

    switch (userAccess) {
      case "parts":
        return (
          <div className="flex justify-center items-center">
            <Link
              href={`${pathname}/jobCard/${jobCard.$id}`}
              className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                ? "Add"
                : "Edit"}
            </Link>
          </div>
        );

      case "biller":
        return (
          <div className="flex justify-center items-center">
            <Link
              href={`${pathname}/jobCard/${jobCard.$id}`}
              className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                jobCard.jobCardStatus == 1
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {jobCard.jobCardStatus == 1 ? "Add" : "Edit"}
            </Link>
          </div>
        );

      case "security":
        return <></>;
      case "service":
        return (
          <div className="flex justify-center items-center">
            <Link
              href={`${pathname}/createJobCard/${jobCard.$id}`}
              className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-200`}
            >
              {"View"}
            </Link>
          </div>
        );

      default:
        break;
    }
  };

  return (
    <div>
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filter by Car Number"
          value={
            (table.getColumn("carNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("carNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div>
          <Select
            onValueChange={(value) => {
              if (value == "999") {
                table.resetColumnFilters();
              } else {
                table.getColumn("jobCardStatus")?.setFilterValue(Number(value));
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {jobCardStatusKey.map((status, index) => (
                <SelectItem key={index} value={String(status.code)}>
                  {status.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (header.id != "jobCardStatus") {
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
                  }
                })}
                <TableHead key={"STATUS"}>Status</TableHead>
                <TableHead key={"ACTION"}></TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id != "jobCardStatus") {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    }
                  })}
                  <TableCell key={"STATUS"}>
                    {displayStatus(row.getValue("jobCardStatus"))}
                  </TableCell>
                  <TableCell key={"ACTION"}>
                    {displayActionButton(row)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
