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
  Row,
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
import { Check, Minus, Percent, Plus, Shield, Trash2, X } from "lucide-react";
import {
  changeMiscName,
  createTempLabourZeroObj,
  getUserAccess,
  removeTempLabourObjDiscount,
  roundToTwoDecimals,
  splitInsuranceAmt,
  taxAmtHelper,
  updateTempLabourObjDiscount,
  updateTempLabourObjMRP,
  updateTempLabourObjQuantity,
} from "@/lib/helper";
import { CurrentLabour, Labour, UserType } from "@/lib/definitions";
import LabourSearch from "../LabourSearch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";

const MISCELLANEOUS_LABOUR_CODE = "998800";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[] | any;
  data: TData[];
  currentLabours: CurrentLabour[] | null;
  labourTotal: number | undefined;
  disable?: boolean;
}

export function ViewCurrentLabourDataTable<TData, TValue>({
  columns,
  data,
  currentLabours,
  labourTotal,
  disable = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddingLabour, setIsAddingLabour] = useState(false);

  const [isDiscount, setIsDiscount] = useState(false);
  const [isAlreadyDiscount, setIsAlreadyDiscount] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [isAlreadyInsurance, setIsAlreadyInsurance] = useState(false);

  const [miscUpdateState, setMiscUpdateState] = useState<{
    row: string;
    isEditing: true;
  }>();

  useEffect(() => {
    let foundIndexDisc = currentLabours?.findIndex(
      (work) => work.discountPercentage && work.discountPercentage != 0
    );
    console.log("FOUND INDEX", foundIndexDisc);
    setIsAlreadyDiscount(foundIndexDisc != -1);

    let foundIndexInsurance = currentLabours?.findIndex(
      (work) => work.insurancePercentage && work.insurancePercentage != 0
    );
    console.log("FOUND INDEX", foundIndexInsurance);
    setIsAlreadyInsurance(foundIndexInsurance != -1);
  }, []);

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

  const getAmountSplit = (amount: number, insurance: string) => {
    let splitAmts = splitInsuranceAmt(amount, Number(insurance));

    return (
      <div className="flex flex-col space-y-4">
        <div className="text-blue-500">
          <span className="font-bold"> I : </span>
          {Math.round(splitAmts.insuranceAmt * 100) / 100}
        </div>
        <div className="text-red-500">
          <span className="font-bold"> C : </span>
          {Math.round(splitAmts.customerAmt * 100) / 100}
        </div>{" "}
      </div>
    );
  };

  return (
    <div className="">
      <div className="rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Labour</div>
        </div>

        <Table className="border-b">
          <TableHeader className="bg-gray-100 w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (
                    header.id != "quantity" &&
                    header.id != "amount" &&
                    header.id != "mrp" &&
                    header.id != "discountPercentage" &&
                    header.id != "insurancePercentage"
                  ) {
                    if (header.id != "quantity") {
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
                  }
                })}
                <TableHead key={"handleMrp"} className="text-center">
                  Basic Price
                </TableHead>
                <TableHead key={"handleQuantity"} className="text-center">
                  Quantity
                </TableHead>
                {(isDiscount || isAlreadyDiscount) && (
                  <TableHead key={"DISCOUNT"} className="text-center">
                    Discount %
                  </TableHead>
                )}
                <TableHead key={"AMOUNT"}>Amount</TableHead>

                {(isInsurance || isAlreadyInsurance) && (
                  <TableHead key={"INSURANCE"} className="text-center">
                    Insurance %
                  </TableHead>
                )}

                <TableHead key={"DELETE"}> </TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getCoreRowModel().rows?.length ? (
              table.getCoreRowModel().rows.map((row, index) => (
                <>
                  {row.getValue("labourCode") == MISCELLANEOUS_LABOUR_CODE ? (
                    <>
                      <TableRow
                        key={row.id + Math.random()}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        <TableCell
                          key={"labourName"}
                          className="flex justify-start items-center h-full"
                        >
                          <div className="flex flex-row items-center space-x-2 w-full">
                            <Input
                              placeholder="labourName"
                              value={
                                row.index == index
                                  ? row.getValue("labourName")
                                  : "NOOOO"
                              }
                              type="text"
                              // onChange={(event) => {
                              //   // if (event.target.value != "") {
                              //   //   handleMRPUpdate(row, Number(event.target.value));
                              //   // }
                              //   handleMISC(row, event.target.value);
                              //   console.log(event.target.value);
                              // }}
                              className="w-[80%]"
                              disabled={disable}
                            />
                          </div>
                        </TableCell>
                        {row.getVisibleCells().map((cell) => {
                          if (
                            cell.column.id != "labourName" &&
                            cell.column.id != "quantity" &&
                            cell.column.id != "insurancePercentage" &&
                            cell.column.id != "amount" &&
                            cell.column.id != "mrp" &&
                            cell.column.id != "discountPercentage"
                          ) {
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
                        <TableCell
                          key={"MRP"}
                          className="flex justify-center items-center h-full"
                        >
                          <Input
                            placeholder="%"
                            value={row.getValue("mrp") || 0}
                            type="number"
                            // onChange={(event) => {
                            //   // if (event.target.value != "") {
                            //   //   handleMRPUpdate(row, Number(event.target.value));
                            //   // }
                            //   handleMRPUpdate(row, Number(event.target.value));
                            //   console.log(event.target.value);
                            // }}
                            className="w-20"
                            disabled={disable}
                          />
                        </TableCell>
                        <TableCell key={"handleQuantity"} className="space-x-2">
                          <div className="flex flex-row justify-evenly w-full items-center space-x-2">
                            <Button
                              variant="link"
                              size="icon"
                              // onClick={() => handleQuantityUpdate(row, -1)}
                              disabled={disable}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div>{row.getValue("quantity")}</div>
                            <Button
                              variant="link"
                              size="icon"
                              // onClick={() => handleQuantityUpdate(row, 1)}
                              disabled={disable}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {(isDiscount || isAlreadyDiscount) && (
                          <TableCell
                            key={"DISCOUNT"}
                            className="flex justify-center items-center h-full"
                          >
                            <Input
                              placeholder="%"
                              value={row.getValue("discountPercentage") || 0}
                              // onChange={(event) =>
                              //   handleDiscount(row, Number(event.target.value))
                              // }
                              className="w-10"
                              disabled={disable}
                            />
                          </TableCell>
                        )}

                        <TableCell key={"AMOUNT"}>
                          {isInsurance || isAlreadyInsurance ? (
                            <>
                              {getAmountSplit(
                                Number(
                                  taxAmtHelper(
                                    row.getValue("mrp"),
                                    row.getValue("quantity"),
                                    row.getValue("gst"),
                                    row.getValue("discountPercentage"),
                                    "value"
                                  )
                                ),
                                row.getValue("insurancePercentage")
                              )}
                            </>
                          ) : (
                            <>{roundToTwoDecimals(row.getValue("amount"))}</>
                          )}
                        </TableCell>

                        {(isInsurance || isAlreadyInsurance) && (
                          <TableCell
                            key={"INSURANCE"}
                            className="flex justify-center items-center h-full w-fit"
                          >
                            <Input
                              placeholder="%"
                              value={row.getValue("insurancePercentage") || 0}
                              // onChange={(event) =>
                              //   handleInsurance(row, Number(event.target.value))
                              // }
                              className="w-12"
                              disabled={disable}
                            />
                          </TableCell>
                        )}

                        <TableCell key={"DELETE"}>
                          <Button
                            variant="outline"
                            size="icon"
                            // onClick={() => deleteRow(row)}
                            disabled={disable}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <>
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => {
                          if (
                            cell.column.id != "quantity" &&
                            cell.column.id != "insurancePercentage" &&
                            cell.column.id != "amount" &&
                            cell.column.id != "mrp" &&
                            cell.column.id != "discountPercentage"
                          ) {
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
                        <TableCell
                          key={"MRP"}
                          className="flex justify-center items-center h-full"
                        >
                          <Input
                            placeholder="%"
                            value={row.getValue("mrp") || 0}
                            type="number"
                            // onChange={(event) => {
                            //   // if (event.target.value != "") {
                            //   //   handleMRPUpdate(row, Number(event.target.value));
                            //   // }
                            //   handleMRPUpdate(row, Number(event.target.value));
                            //   console.log(event.target.value);
                            // }}
                            className="w-20"
                            disabled={disable}
                          />
                        </TableCell>
                        <TableCell key={"handleQuantity"} className="space-x-2">
                          <div className="flex flex-row justify-evenly w-full items-center space-x-2">
                            <Button
                              variant="link"
                              size="icon"
                              // onClick={() => handleQuantityUpdate(row, -1)}
                              disabled={disable}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <div>{row.getValue("quantity")}</div>
                            <Button
                              variant="link"
                              size="icon"
                              // onClick={() => handleQuantityUpdate(row, 1)}
                              disabled={disable}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>

                        {(isDiscount || isAlreadyDiscount) && (
                          <TableCell
                            key={"DISCOUNT"}
                            className="flex justify-center items-center h-full"
                          >
                            <Input
                              placeholder="%"
                              value={row.getValue("discountPercentage") || 0}
                              // onChange={(event) =>
                              //   handleDiscount(row, Number(event.target.value))
                              // }
                              className="w-10"
                              disabled={disable}
                            />
                          </TableCell>
                        )}

                        <TableCell key={"AMOUNT"}>
                          {isInsurance || isAlreadyInsurance ? (
                            <>
                              {getAmountSplit(
                                Number(
                                  taxAmtHelper(
                                    row.getValue("mrp"),
                                    row.getValue("quantity"),
                                    row.getValue("gst"),
                                    row.getValue("discountPercentage"),
                                    "value"
                                  )
                                ),
                                row.getValue("insurancePercentage")
                              )}
                            </>
                          ) : (
                            <>{roundToTwoDecimals(row.getValue("amount"))}</>
                          )}
                        </TableCell>

                        {(isInsurance || isAlreadyInsurance) && (
                          <TableCell
                            key={"INSURANCE"}
                            className="flex justify-center items-center h-full w-fit"
                          >
                            <Input
                              placeholder="%"
                              value={row.getValue("insurancePercentage") || 0}
                              // onChange={(event) =>
                              //   handleInsurance(row, Number(event.target.value))
                              // }
                              className="w-10"
                              disabled={disable}
                            />
                          </TableCell>
                        )}

                        <TableCell key={"DELETE"}>
                          <Button
                            variant="outline"
                            size="icon"
                            // onClick={() => deleteRow(row)}
                            disabled={disable}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </>
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
              &#8377;{labourTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
