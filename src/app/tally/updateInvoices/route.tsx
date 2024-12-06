import jobCard from "@/app/biller/jobCard/[jobCardId]/page";
import {
  getAllInvoices,
  getAllTaxInvoicesAfterDateTime,
  getJobCardById,
} from "@/lib/appwrite";
import {
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
} from "@/lib/definitions";
import {
  createTaxObj,
  preciseOperation,
  roundToTwoDecimals,
  splitInsuranceAmt,
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // console.log("BODY", request.body);
  try {
    const body = await request.json();
    console.log(body);

    const dateTimeStamp = body.data.lastSync;

    const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp);

    const newInvoices = result.documents;

    console.log("Total Number of Invoices - ", newInvoices.length);

    const updatedNewInvoices = await Promise.all(
      newInvoices.map(async (invoice: Invoice, index: number) => {
        let result: JobCard = await getJobCardById(invoice.jobCardId);
        let partsArr = stringToObj(result.parts);
        let labourArr = stringToObj(result.labour);
        // let taxesObj = stringToObj(result.taxes);

        // console.log("THIS IS THE JOB CARD - ", result);

        let invoiceTypeCOPY = invoice.invoiceType;

        let insuranceInvoiceTypeCOPY = invoice.insuranceInvoiceType;

        const foundIndexParts = partsArr.findIndex(
          (part: CurrentPart) =>
            part.insurancePercentage && part.insurancePercentage != 0
        );

        const foundIndexLabour = labourArr.findIndex(
          (work: CurrentLabour) =>
            work.insurancePercentage && work.insurancePercentage != 0
        );

        const isInsurance = foundIndexParts != -1 || foundIndexLabour != -1;

        let partsTotal = 0;
        let labourTotal = 0;

        let totalTax = 0;
        let totalDiscount = 0;

        let totalSubtotal = 0;
        let insuranceDetails;

        if (isInsurance && invoice.invoiceType != "Quote") {
          insuranceDetails = JSON.parse(result.insuranceDetails);
        }

        // console.log("THESE ARE THE PARTS - ", liabilityType, parts);

        partsArr.map((part: CurrentPart) => {
          if (
            isInsurance &&
            invoice.invoiceType != "Quote" &&
            part.insurancePercentage &&
            part.insurancePercentage != 0
          ) {
            const splitPartAmount = splitInsuranceAmt(
              part.amount,
              part.insurancePercentage
            );

            // console.log("CHECK AMT - ", splitPartAmount);

            const splitPartSubTotal = splitInsuranceAmt(
              part.subTotal,
              part.insurancePercentage
            );

            const splitPartCGST = splitInsuranceAmt(
              part.cgstAmt,
              part.insurancePercentage
            );

            const splitPartSGST = splitInsuranceAmt(
              part.sgstAmt,
              part.insurancePercentage
            );

            const splitPartTotalTax = splitInsuranceAmt(
              part.totalTax,
              part.insurancePercentage
            );

            if (insuranceInvoiceTypeCOPY == "Customer") {
              part.amountCust = splitPartAmount.customerAmt;
              part.subTotalCust = splitPartSubTotal.customerAmt;
              part.cgstAmtCust = splitPartCGST.customerAmt;
              part.sgstAmtCust = splitPartSGST.customerAmt;
              part.totalTaxCust = preciseOperation(
                "add",
                splitPartCGST.customerAmt,
                splitPartSGST.customerAmt
              );

              partsTotal = preciseOperation("add", partsTotal, part.amountCust);

              totalTax = preciseOperation("add", totalTax, part.totalTaxCust);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                part.subTotalCust
              );
            } else {
              part.amountIns = splitPartAmount.insuranceAmt;
              part.subTotalIns = splitPartSubTotal.insuranceAmt;
              part.cgstAmtIns = splitPartCGST.insuranceAmt;
              part.sgstAmtIns = splitPartSGST.insuranceAmt;
              part.totalTaxIns = preciseOperation(
                "add",
                splitPartCGST.insuranceAmt,
                splitPartSGST.insuranceAmt
              );

              partsTotal = preciseOperation("add", partsTotal, part.amountIns);

              totalTax = preciseOperation("add", totalTax, part.totalTaxIns);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                part.subTotalIns
              );
            }

            if (
              part.discountPercentage &&
              part.discountAmt &&
              part.discountPercentage != 0
            ) {
              const splitPartDiscAmt = splitInsuranceAmt(
                part.discountAmt,
                part.insurancePercentage
              );

              console.log("DISCOUNT CHECK - ", splitPartDiscAmt);

              if (insuranceInvoiceTypeCOPY == "Customer") {
                part.discountAmtCust = splitPartDiscAmt.customerAmt;

                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  part.discountAmtCust
                );
              } else {
                part.discountAmtIns = splitPartDiscAmt.insuranceAmt;

                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  part.discountAmtIns
                );
              }
            }
          } else {
            if (insuranceInvoiceTypeCOPY == "Customer") {
              partsTotal = preciseOperation("add", partsTotal, part.amount);

              totalTax = preciseOperation("add", totalTax, part.totalTax);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                part.subTotal
              );

              // totalDiscount = totalDiscount , part.discountAmt

              if (
                part.discountPercentage &&
                part.discountAmt &&
                part.discountPercentage != 0
              ) {
                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  part.discountAmt
                );
              }
            } else {
              partsTotal = preciseOperation("add", partsTotal, part.amount);

              totalTax = preciseOperation("add", totalTax, part.totalTax);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                part.subTotal
              );

              // totalDiscount = totalDiscount , part.discountAmt

              if (
                part.discountPercentage &&
                part.discountAmt &&
                part.discountPercentage != 0
              ) {
                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  part.discountAmt
                );
              }
            }
          }
        });

        labourArr.map((work: CurrentLabour) => {
          if (
            isInsurance &&
            invoice.invoiceType != "Quote" &&
            work.insurancePercentage &&
            work.insurancePercentage != 0
          ) {
            const splitLabourAmount = splitInsuranceAmt(
              work.amount,
              work.insurancePercentage
            );

            const splitLabourSubTotal = splitInsuranceAmt(
              work.subTotal,
              work.insurancePercentage
            );

            const splitLabourCGST = splitInsuranceAmt(
              work.cgstAmt,
              work.insurancePercentage
            );

            const splitLabourSGST = splitInsuranceAmt(
              work.sgstAmt,
              work.insurancePercentage
            );

            const splitLabourTotalTax = splitInsuranceAmt(
              work.totalTax,
              work.insurancePercentage
            );

            if (insuranceInvoiceTypeCOPY == "Customer") {
              work.amountCust = splitLabourAmount.customerAmt;
              work.subTotalCust = splitLabourSubTotal.customerAmt;
              work.cgstAmtCust = splitLabourCGST.customerAmt;
              work.sgstAmtCust = splitLabourSGST.customerAmt;
              work.totalTaxCust = preciseOperation(
                "add",
                splitLabourCGST.customerAmt,
                splitLabourSGST.customerAmt
              );

              labourTotal = preciseOperation(
                "add",
                labourTotal,
                work.amountCust
              );

              totalTax = preciseOperation("add", totalTax, work.totalTaxCust);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                work.subTotalCust
              );
            } else {
              work.amountIns = splitLabourAmount.insuranceAmt;
              work.subTotalIns = splitLabourSubTotal.insuranceAmt;
              work.cgstAmtIns = splitLabourCGST.insuranceAmt;
              work.sgstAmtIns = splitLabourSGST.insuranceAmt;
              work.totalTaxIns = preciseOperation(
                "add",
                splitLabourCGST.insuranceAmt,
                splitLabourSGST.insuranceAmt
              );

              labourTotal = preciseOperation(
                "add",
                labourTotal,
                work.amountIns
              );

              totalTax = preciseOperation("add", totalTax, work.totalTaxIns);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                work.subTotalIns
              );
            }

            if (
              work.discountPercentage &&
              work.discountAmt &&
              work.discountPercentage != 0
            ) {
              const splitWorkDiscAmt = splitInsuranceAmt(
                work.discountAmt,
                work.insurancePercentage
              );

              // console.log("DISCOUNT CHECK LABOUR - ", splitWorkDiscAmt);

              if (insuranceInvoiceTypeCOPY == "Customer") {
                work.discountAmtCust = splitWorkDiscAmt.customerAmt;

                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  work.discountAmtCust
                );
              } else {
                work.discountAmtIns = splitWorkDiscAmt.insuranceAmt;

                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  work.discountAmtIns
                );
              }
            } else {
              // console.log("NOT REGISTERING");
            }
          } else {
            if (insuranceInvoiceTypeCOPY == "Customer") {
              labourTotal = preciseOperation("add", labourTotal, work.amount);

              totalTax = preciseOperation("add", totalTax, work.totalTax);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                work.subTotal
              );

              if (
                work.discountPercentage &&
                work.discountAmt &&
                work.discountPercentage != 0
              ) {
                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  work.discountAmt
                );
              }
            } else {
              labourTotal = preciseOperation("add", labourTotal, work.amount);

              totalTax = preciseOperation("add", totalTax, work.totalTax);

              totalSubtotal = preciseOperation(
                "add",
                totalSubtotal,
                work.subTotal
              );

              if (
                work.discountPercentage &&
                work.discountAmt &&
                work.discountPercentage != 0
              ) {
                totalDiscount = preciseOperation(
                  "add",
                  totalDiscount,
                  work.discountAmt
                );
              }
            }
          }
        });

        const keysToRetainParts: (keyof CurrentPart)[] = [
          "partId",
          "partName",
          "partNumber",
          "mrp",
          "gst",
          "hsn",
          "cgst",
          "sgst",
          "quantity",
        ];

        const revisedPartsArr: any = await Promise.all(
          partsArr.map((part: CurrentPart) => {
            const updatedObject: CurrentPart = Object.keys(part).reduce(
              (acc, key) => {
                if (keysToRetainParts.includes(key as keyof CurrentPart)) {
                  (acc as any)[key] = part[key as keyof CurrentPart];
                } else {
                  (acc as any)[key] = undefined;
                }
                return acc;
              },
              {} as CurrentPart
            ); // console.log("UPDATED OBJECT - ", updatedObject);

            if (isInsurance && invoice.invoiceType != "Quote") {
              if (part.insurancePercentage && part.insurancePercentage != 0) {
                if (insuranceInvoiceTypeCOPY == "Customer") {
                  updatedObject.amount = part.amountCust as number;
                  updatedObject.subTotal = part.subTotalCust as number;
                  updatedObject.cgstAmt = part.cgstAmtCust as number;
                  updatedObject.sgstAmt = part.sgstAmtCust as number;
                  updatedObject.totalTax = part.totalTaxCust as number;
                  updatedObject.discountPercentage =
                    part.discountPercentage as number;
                  updatedObject.discountAmt = part.discountAmtCust as number;
                } else {
                  updatedObject.amount = part.amountIns as number;
                  updatedObject.subTotal = part.subTotalIns as number;
                  updatedObject.cgstAmt = part.cgstAmtIns as number;
                  updatedObject.sgstAmt = part.sgstAmtIns as number;
                  updatedObject.totalTax = part.totalTaxIns as number;
                  updatedObject.discountPercentage =
                    part.discountPercentage as number;
                  updatedObject.discountAmt = part.discountAmtIns as number;
                }
              } else {
                if (insuranceInvoiceTypeCOPY == "Customer") {
                  updatedObject.amount = part.amount as number;
                  updatedObject.subTotal = part.subTotal as number;
                  updatedObject.cgstAmt = part.cgstAmt as number;
                  updatedObject.sgstAmt = part.sgstAmt as number;
                  updatedObject.totalTax = part.totalTax as number;
                  updatedObject.discountPercentage =
                    part.discountPercentage as number;
                  updatedObject.discountAmt = part.discountAmt as number;
                } else {
                  updatedObject.amount = 0;
                  updatedObject.subTotal = 0;
                  updatedObject.cgstAmt = 0;
                  updatedObject.sgstAmt = 0;
                  updatedObject.totalTax = 0;
                  updatedObject.discountPercentage =
                    part.discountPercentage as number;
                  updatedObject.discountAmt = 0;
                }
              }
            } else {
              updatedObject.amount = roundToTwoDecimals(part.amount as number);
              updatedObject.subTotal = roundToTwoDecimals(
                part.subTotal as number
              );
              updatedObject.cgstAmt = roundToTwoDecimals(
                part.cgstAmt as number
              );
              updatedObject.sgstAmt = roundToTwoDecimals(
                part.sgstAmt as number
              );
              updatedObject.totalTax = roundToTwoDecimals(
                part.totalTax as number
              );

              if (
                updatedObject.discountPercentage &&
                updatedObject.discountAmt
              ) {
                updatedObject.discountPercentage = roundToTwoDecimals(
                  part.discountPercentage as number
                );
                updatedObject.discountAmt = roundToTwoDecimals(
                  part.discountAmt as number
                );
              }
            }

            if (
              !updatedObject.discountPercentage ||
              !updatedObject.discountAmt
            ) {
              updatedObject.discountPercentage = 0;
              updatedObject.discountAmt = 0;
            }

            return updatedObject;
          })
        );

        const keysToRetainLabour: (keyof CurrentLabour)[] = [
          "labourId",
          "labourName",
          "labourCode",
          "mrp",
          "gst",
          "hsn",
          "cgst",
          "sgst",
          "quantity",
        ];

        const revisedLabourArr: any = await Promise.all(
          labourArr.map((work: CurrentLabour) => {
            const updatedObject: CurrentLabour = Object.keys(work).reduce(
              (acc, key) => {
                if (keysToRetainLabour.includes(key as keyof CurrentLabour)) {
                  (acc as any)[key] = work[key as keyof CurrentLabour];
                } else {
                  (acc as any)[key] = undefined;
                }
                return acc;
              },
              {} as CurrentLabour // Correctly cast the initial accumulator to `CurrentLabour`
            );

            if (isInsurance && invoice.invoiceType != "Quote") {
              if (work.insurancePercentage && work.insurancePercentage != 0) {
                if (insuranceInvoiceTypeCOPY == "Customer") {
                  updatedObject.amount = work.amountCust as number;
                  updatedObject.subTotal = work.subTotalCust as number;
                  updatedObject.cgstAmt = work.cgstAmtCust as number;
                  updatedObject.sgstAmt = work.sgstAmtCust as number;
                  updatedObject.totalTax = work.totalTaxCust as number;
                  updatedObject.discountPercentage =
                    work.discountPercentage as number;
                  updatedObject.discountAmt = work.discountAmtCust as number;
                } else {
                  updatedObject.amount = work.amountIns as number;
                  updatedObject.subTotal = work.subTotalIns as number;
                  updatedObject.cgstAmt = work.cgstAmtIns as number;
                  updatedObject.sgstAmt = work.sgstAmtIns as number;
                  updatedObject.totalTax = work.totalTaxIns as number;
                  updatedObject.discountPercentage =
                    work.discountPercentage as number;
                  updatedObject.discountAmt = work.discountAmtIns as number;
                }
              } else {
                if (insuranceInvoiceTypeCOPY == "Customer") {
                  updatedObject.amount = work.amount as number;
                  updatedObject.subTotal = work.subTotal as number;
                  updatedObject.cgstAmt = work.cgstAmt as number;
                  updatedObject.sgstAmt = work.sgstAmt as number;
                  updatedObject.totalTax = work.totalTax as number;
                  updatedObject.discountPercentage =
                    work.discountPercentage as number;
                  updatedObject.discountAmt = work.discountAmt as number;
                } else {
                  updatedObject.amount = 0;
                  updatedObject.subTotal = 0;
                  updatedObject.cgstAmt = 0;
                  updatedObject.sgstAmt = 0;
                  updatedObject.totalTax = 0;
                  updatedObject.discountPercentage =
                    work.discountPercentage as number;
                  updatedObject.discountAmt = 0;
                }
              }
            } else {
              updatedObject.amount = roundToTwoDecimals(work.amount as number);
              updatedObject.subTotal = roundToTwoDecimals(
                work.subTotal as number
              );
              updatedObject.cgstAmt = roundToTwoDecimals(
                work.cgstAmt as number
              );
              updatedObject.sgstAmt = roundToTwoDecimals(
                work.sgstAmt as number
              );
              updatedObject.totalTax = roundToTwoDecimals(
                work.totalTax as number
              );

              if (
                updatedObject.discountPercentage &&
                updatedObject.discountAmt
              ) {
                updatedObject.discountPercentage = roundToTwoDecimals(
                  work.discountPercentage as number
                );
                updatedObject.discountAmt = roundToTwoDecimals(
                  work.discountAmt as number
                );
              }
            }

            if (
              !updatedObject.discountPercentage ||
              !updatedObject.discountAmt
            ) {
              updatedObject.discountPercentage = 0;
              updatedObject.discountAmt = 0;
            }
            // console.log("UPDATED OBJECT - ", updatedObject);

            return updatedObject;
          })
        );

        result.parts = revisedPartsArr;
        result.labour = revisedLabourArr;

        result.subTotal = totalSubtotal;
        result.amount = roundToTwoDecimals(
          totalSubtotal - totalDiscount + totalTax
        );
        result.totalDiscountAmt = totalDiscount;
        result.totalTax = totalTax;
        result.placeOfSupply = "Maharashtra";

        if (
          isInsurance &&
          invoice.invoiceType != "Quote" &&
          insuranceInvoiceTypeCOPY == "Insurance"
        ) {
          result.gstin = insuranceDetails.policyProviderGST;
          result.customerName = insuranceDetails.policyProvider;
          result.customerAddress = insuranceDetails.policyProviderAddress;
          result.customerPhone = "";
        }

        const taxesSplitObj = createTaxObj(revisedPartsArr, revisedLabourArr);
        result.taxes = taxesSplitObj;

        const dateTemp = new Date(invoice["$createdAt"]);

        const day = String(dateTemp.getDate()).padStart(2, "0"); // Ensures 2 digits
        const month = String(dateTemp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = dateTemp.getFullYear();

        // Combine into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        invoice.invoiceDate = formattedDate;

        invoice.jobCardDetails = result;

        console.log("Ho Gaya", index);

        console.log(
          "AMOUNT CHECK - ",
          invoice.jobCardDetails.subTotal,
          invoice.jobCardDetails.amount,
          invoice.jobCardDetails.totalTax,
          invoice.jobCardDetails.totalDiscountAmt
        );

        console.log("INVOICE FOR - ", invoice.jobCardDetails);

        return invoice;
      })
    );

    const returnInvoicesObj = { invoices: updatedNewInvoices };

    // console.log("INVOICES OBJECT - ", returnInvoicesObj);

    return NextResponse.json(returnInvoicesObj, { status: 201 });
  } catch (error) {
    console.log("Failed");
    console.log("CAUGHT ERROR", error);

    return NextResponse.json({
      message: "HELLOOO",
      status: false,
    });
  }
}
