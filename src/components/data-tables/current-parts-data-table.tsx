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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Minus, Percent, Plus, Shield, Trash2, X } from "lucide-react";
import PartsSearch from "@/components/PartsSearch";
import {
  createTempPartZeroObj,
  getUserAccess,
  removeTempPartObjDiscount,
  roundToTwoDecimals,
  splitInsuranceAmt,
  taxAmtHelper,
  updateTempPartObjDiscount,
  updateTempPartObjMRP,
  updateTempPartObjQuantity,
} from "@/lib/helper";
import { CurrentPart, Part, UserType } from "@/lib/definitions";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  parts: Part[] | null;
  currentParts: CurrentPart[] | null;
  setCurrentParts: any;
  setIsEdited: any;
  user: UserType;
  currentJobCardStatus?: number;
  isInsuranceDetails: boolean;
  partsTotal: number | undefined;
  disable?: boolean;
}

export function CurrentPartsDataTable<TData, TValue>({
  columns,
  data,
  parts,
  currentParts,
  setCurrentParts,
  setIsEdited,
  user,
  currentJobCardStatus,
  isInsuranceDetails,
  partsTotal,
  disable = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isAddingParts, setIsAddingParts] = useState(false);

  const [isDiscount, setIsDiscount] = useState(false);
  const [isAlreadyDiscount, setIsAlreadyDiscount] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);
  const [isAlreadyInsurance, setIsAlreadyInsurance] = useState(false);

  // console.log("THIS IS THE CURRENT JOBCARD STATUS - ", currentJobCardStatus);

  useEffect(() => {
    let foundIndexDisc = currentParts?.findIndex(
      (part) => part.discountPercentage && part.discountPercentage != 0
    );
    console.log("FOUND INDEX", foundIndexDisc);
    setIsAlreadyDiscount(foundIndexDisc != -1);

    let foundIndexInsurance = currentParts?.findIndex(
      (part) => part.insurancePercentage && part.insurancePercentage != 0
    );
    console.log("FOUND INDEX", foundIndexInsurance);
    setIsAlreadyInsurance(foundIndexInsurance != -1);
  }, []);

  const deleteRow = (row: any) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    setCurrentParts([...arrayFirstHalf, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const handleQuantityUpdate = (row: any, toUpdate: number) => {
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("partNumber");
    const prevQty = (row.getValue("quantity") as number) ?? 0;

    if (prevQty == 1 && toUpdate < 0) {
      return deleteRow(row);
    }

    let toUpdateQty = currentParts?.find(
      (part) => part.partNumber == partNumber
    );

    let updatedObj;

    if (toUpdateQty) {
      if (toUpdate > 0) {
        updatedObj = updateTempPartObjQuantity(toUpdateQty, 1);
      } else {
        updatedObj = updateTempPartObjQuantity(toUpdateQty, -1);
      }

      setCurrentParts([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
      setIsEdited(true);
    } else {
      console.log("Some Error has Occured");
    }
  };

  const handleMRPUpdate = (row: any, mrp: number) => {
    let updatedObj;

    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("partNumber");

    let toUpdateMRP = currentParts?.find(
      (part) => part.partNumber == partNumber
    );

    if (mrp == 0) {
      if (toUpdateMRP) {
        updatedObj = createTempPartZeroObj(toUpdateMRP);
        console.log("INVALID VALUE - ", updatedObj);

        setCurrentParts([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
        setIsEdited(true);
      }
    } else {
      // const partNumberRow = row.getValue("partNumber");
      // const foundPart = parts?.find((a) => a.partNumber == partNumberRow);
      // const newMaxMRP = foundPart!.mrp * 1.25;

      // if (mrp > newMaxMRP) {
      //   console.log({ foundPart, newMaxMRP });
      //   toast("Price can only be increased upto 25%");
      //   return;
      // }

      if (toUpdateMRP) {
        updatedObj = updateTempPartObjMRP(toUpdateMRP, mrp);

        setCurrentParts([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
        setIsEdited(true);
      } else {
        console.log("Some Error has Occured");
      }
    }
  };

  const handleAllDiscount = (discount: number) => {
    if (!currentParts) {
      return;
    }

    if (Number(discount) > 15) {
      toast("Discount More than 15% is not allowed");
      return;
    }

    // Prepare a new array with updated discount values
    const newArr: CurrentPart[] = currentParts.map((part: any) => {
      if (discount === 0) {
        // Reset discountPercentage and amount if discount is cleared
        return removeTempPartObjDiscount(part);
      } else {
        // Apply the specified discount
        return updateTempPartObjDiscount(part, discount) || part;
      }
    });

    // Only update state if all parts are successfully updated
    if (newArr.length === currentParts.length) {
      setCurrentParts(newArr);
      setIsEdited(true);
    }
  };

  const removeAllDiscount = () => {
    let newArr: CurrentPart[] = [];
    currentParts?.map((part: CurrentPart) => {
      const updatedPartObj = removeTempPartObjDiscount(part);
      newArr.push(updatedPartObj!);
    });
    setCurrentParts([...newArr!]);
    setIsDiscount(false);
    // setIsEdited(true);
  };

  const handleDiscount = (row: any, discount: number) => {
    if (discount > 15) {
      toast("Discount more than 15% is not allowed");
      return;
    }

    const partNumber = row.getValue("partNumber");
    const toUpdateDisc = currentParts?.find(
      (part) => part.partNumber === partNumber
    );

    if (!toUpdateDisc) {
      console.log("Part not found or invalid part number");
      return;
    }

    let updatedObj;

    if (discount === 0) {
      // Reset discountPercentage to 0 and restore original amount
      updatedObj = removeTempPartObjDiscount(toUpdateDisc);
    } else {
      // Apply the discount using your helper function
      updatedObj = updateTempPartObjDiscount(toUpdateDisc, discount);
    }

    if (!updatedObj) {
      console.log("Failed to update discount. Check helper function.");
      return;
    }

    // Update the parts list with the modified part
    const arrayFirstHalf = currentParts!.slice(0, row.index);
    const arraySecondHalf = currentParts!.slice(row.index + 1);
    setCurrentParts([...arrayFirstHalf, updatedObj, ...arraySecondHalf]);
    setIsEdited(true);
  };

  const handleAllInsurance = (insurance: number) => {
    // if (insurance > 15) {
    //   toast("Discount more than 15% is not allowed");
    //   return;
    // }
    let tempObj = currentParts;
    console.log("ALL insurance - ", insurance);
    tempObj!.map((part) => {
      part.insurancePercentage = Number(insurance);
      // console.log(splitInsuranceAmt(part.amount, Number(insurance)));
      let splitAmts = splitInsuranceAmt(
        Number(
          taxAmtHelper(
            part.mrp,
            part.quantity,
            part.gst,
            part.discountPercentage,
            "value"
          )
        ),
        Number(insurance)
      );
      part.customerAmt = splitAmts.customerAmt;
      part.insuranceAmt = splitAmts.insuranceAmt;
    });
    setCurrentParts([...tempObj!]);
    // setIsEdited(true);
  };

  const removeAllInsurance = () => {
    let tempObj = currentParts;

    tempObj!.map((part) => {
      part.insurancePercentage = undefined;
      part.customerAmt = undefined;
      part.insuranceAmt = undefined;
    });
    setCurrentParts([...tempObj!]);
    setIsInsurance(false);
    // setIsEdited(true);
  };

  const handleInsurance = (row: any, insurance: number) => {
    // if (insurance > 15) {
    //   toast("Discount more than 15% is not allowed");
    //   return;
    // }
    let arrayFirstHalf = currentParts!.slice(0, row.index);
    let arraySecondHalf = currentParts!.slice(row.index + 1);

    const partNumber = row.getValue("partNumber");

    const toUpdateInsurance = currentParts?.find(
      (part) => part.partNumber == partNumber
    );

    if (toUpdateInsurance) {
      toUpdateInsurance.insurancePercentage = Number(insurance);

      let newTaxAmt = taxAmtHelper(
        toUpdateInsurance.mrp,
        toUpdateInsurance.quantity,
        toUpdateInsurance.gst,
        toUpdateInsurance.discountPercentage,
        "value"
      );

      let splitAmts = splitInsuranceAmt(Number(newTaxAmt), Number(insurance));

      toUpdateInsurance.customerAmt = splitAmts.customerAmt;
      toUpdateInsurance.insuranceAmt = splitAmts.insuranceAmt;

      toUpdateInsurance.amount = Number(newTaxAmt);
      setCurrentParts([
        ...arrayFirstHalf,
        toUpdateInsurance,
        ...arraySecondHalf,
      ]);
      setIsEdited(true);
    }
  };

  const getAmountSplit = (amount: number, insurance: string) => {
    let splitAmts = splitInsuranceAmt(amount, Number(insurance));

    return (
      <div className="flex flex-col space-y-4">
        <div className="text-blue-500">
          <span className="font-bold"> I : </span>
          {roundToTwoDecimals(splitAmts.insuranceAmt)}
        </div>
        <div className="text-red-500">
          <span className="font-bold"> C : </span>
          {roundToTwoDecimals(splitAmts.customerAmt)}
        </div>{" "}
      </div>
    );
  };

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

  console.log("PRINTING TABLE ROWS - ", table.getCoreRowModel().rows);

  return (
    <div>
      <div className="flex flex-col rounded-md border">
        <div className="flex flex-row justify-between items-center">
          <div className="font-semibold text-lg p-5">Parts</div>
          {getUserAccess(user) == "biller" && (
            <div className="flex flex-row space-x-5 mr-5 items-center">
              {currentJobCardStatus == 2 && (
                <>
                  {isDiscount ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Discount on All Parts"
                        type="number"
                        onChange={(event) =>
                          handleAllDiscount(Number(event.target.value))
                        }
                        className="max-w-sm"
                        disabled={disable}
                      />
                      <X onClick={removeAllDiscount} />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500"
                      onClick={() => setIsDiscount((prev) => true)}
                      disabled={disable}
                    >
                      <Percent />
                    </Button>
                  )}
                </>
              )}

              {currentJobCardStatus == 3 && (
                <>
                  {isInsurance ? (
                    <div className="flex justify-around w-fit items-center space-x-3">
                      <Input
                        placeholder="Insurance on All Parts"
                        type="number"
                        // value={
                        //   (table
                        //     .getColumn("carNumber")
                        //     ?.getFilterValue() as string) ?? ""
                        // }
                        onChange={(event) =>
                          handleAllInsurance(Number(event.target.value))
                        }
                        className="max-w-sm"
                        disabled={disable}
                      />
                      <X onClick={removeAllInsurance} />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="border border-red-500 text-red-500"
                      onClick={() => {
                        if (isInsuranceDetails) {
                          setIsInsurance((prev) => true);
                        } else {
                          toast("Add Insurance Details to Proceed");
                        }
                      }}
                      disabled={disable}
                    >
                      <Shield />
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
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
              table.getCoreRowModel().rows.map((row) => (
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
                      onChange={(event) => {
                        // if (event.target.value != "") {
                        //   handleMRPUpdate(row, Number(event.target.value));
                        // }
                        handleMRPUpdate(row, Number(event.target.value));
                        console.log(event.target.value);
                      }}
                      className="w-20"
                      disabled={disable}
                    />
                  </TableCell>
                  <TableCell key={"handleQuantity"} className="space-x-2">
                    <div className="flex flex-row justify-evenly w-full items-center space-x-2">
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, -1)}
                        disabled={disable}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <div>{row.getValue("quantity")}</div>
                      <Button
                        variant="link"
                        size="icon"
                        onClick={() => handleQuantityUpdate(row, 1)}
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
                        onChange={(event) =>
                          handleDiscount(row, Number(event.target.value))
                        }
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
                        onChange={(event) =>
                          // handleDiscount(row, event.target.value)
                          handleInsurance(row, Number(event.target.value))
                        }
                        className="w-12"
                        disabled={disable}
                      />
                    </TableCell>
                  )}

                  <TableCell key={"DELETE"}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => deleteRow(row)}
                      disabled={disable}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
        <div className="flex p-2 justify-between items-center px-5">
          {isAddingParts ? (
            <div className="flex px-3 space-x-3">
              <PartsSearch
                items={parts}
                setCurrentParts={setCurrentParts}
                currentParts={currentParts}
                setIsEdited={setIsEdited}
              />
              <Button
                variant="link"
                onClick={() => setIsAddingParts((prev) => false)}
                disabled={disable}
              >
                <X />
              </Button>
            </div>
          ) : (
            <Button
              variant="link"
              onClick={() => setIsAddingParts((prev) => true)}
              disabled={disable}
            >
              <div className="flex flex-row space-x-3 text-red-500 items-center">
                <div>+ Add Parts</div>
              </div>
            </Button>
          )}
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
