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
  FilterFn,
} from "@tanstack/react-table";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { set } from "react-datepicker/dist/date_utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  deleteInvoiceById,
  deleteJobCardById,
  deleteTempCarById,
  getInvoicesByJobCardId,
} from "@/lib/appwrite";
import { Invoice, TempCar } from "@/lib/definitions";
import { Trash2 } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  povCategories?: string[];
}

export function TempCarsDataTable<TData, TValue>({
  columns,
  data,
  povCategories,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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

  const [deletingJobCard, setDeletingJobCard] = useState("");
  const [reopeningJobCard, setReopeningJobCard] = useState(false);
  const [deletingTempCar, setDeletingTempCar] = useState("");

  const token = getCookie("user");
  const parsedToken = JSON.parse(String(token));
  const userAccess = parsedToken.labels[0];

  const deleteJobCard = async (tempCar: any) => {
    const tempCarObj: TempCar = JSON.parse(tempCar);
    console.log(tempCarObj);

    if (tempCarObj.jobCardId) {
      const invoices = await getInvoicesByJobCardId(tempCarObj.jobCardId);
      await Promise.all(
        invoices.map(async (invoice: Invoice) => {
          // const result = await deleteInvoiceById(invoice.$id);
          // console.log(result);
        })
      );

      // const deletedJobCard = await deleteJobCardById(tempCarObj.jobCardId);
      // const deletedTempCar = await deleteJobCardById(tempCarObj.$id);
    }
  };

  const deleteTempCar = async (tempCar: any) => {
    const tempCarObj: TempCar = JSON.parse(tempCar);
    // const result = await deleteTempCarById(tempCarObj.$id);
  };

  return (
    <div>
      <div className="flex flex-col items-center py-4 justify-between space-y-5">
        <Input
          placeholder="Filter Cars"
          value={
            (table.getColumn("carNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("carNumber")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="w-full">
          {povCategories && (
            <Select
              onValueChange={(value) => {
                table
                  .getColumn("purposeOfVisitAndAdvisors") // Filter column for purposeOfVisitAndAdvisors
                  ?.setFilterValue(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Purpose of Visit" />
              </SelectTrigger>
              <SelectContent>
                {povCategories.map((pov, index) => (
                  <SelectItem key={index} value={pov}>
                    {pov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
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
                {userAccess === "admin" && <TableHead></TableHead>}
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {userAccess === "admin" && (
                    <>
                      <TableCell>
                        <div className="flex space-x-4 justify-center">
                          {(row.original as TempCar).jobCardId ? (
                            <>
                              {(row.original as TempCar).carStatus === 2 && (
                                <>
                                  <Button
                                    variant="outline"
                                    className="px-8 py-2  hover:bg-red-400 hover:text-white"
                                    size="lg"
                                    onClick={() => setReopeningJobCard(true)}
                                  >
                                    Reopen JobCard
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                                size="lg"
                                onClick={() =>
                                  setDeletingJobCard(
                                    JSON.stringify(row.original)
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>

                              {deletingJobCard && (
                                <Dialog
                                  open={deletingJobCard != ""}
                                  onOpenChange={() => setDeletingJobCard("")}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Are you absolutely sure?
                                      </DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the job card.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        className="bg-red-500"
                                        onClick={() =>
                                          deleteJobCard(deletingJobCard)
                                        }
                                      >
                                        Delete
                                      </Button>
                                      <Button
                                        type="submit"
                                        onClick={() => setDeletingJobCard("")}
                                      >
                                        Cancel
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                                size="lg"
                                onClick={() =>
                                  setDeletingTempCar(
                                    JSON.stringify(row.original)
                                  )
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {deletingTempCar && (
                                <Dialog
                                  open={deletingTempCar != ""}
                                  onOpenChange={() => setDeletingTempCar("")}
                                >
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>
                                        Are you absolutely sure?
                                      </DialogTitle>
                                      <DialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the temp car.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <Button
                                        type="submit"
                                        className="bg-red-500"
                                        onClick={() =>
                                          deleteTempCar(deletingTempCar)
                                        }
                                      >
                                        Delete
                                      </Button>
                                      <Button
                                        type="submit"
                                        onClick={() => setDeletingTempCar("")}
                                      >
                                        Cancel
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </>
                  )}
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
