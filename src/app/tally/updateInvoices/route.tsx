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
  roundToTwoDecimals,
  splitInsuranceAmt,
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //   console.log("BODY", request.body);
  try {
    const dateTimeStamp = await request.json();

    const result = await getAllInvoices();

    const newInvoices = result.documents.slice(4, 6);

    console.log("THESE ARE THE NEW INVOICES ROUTREEEEEEE", newInvoices);
    // newInvoices.slic

    const updatedNewInvoices = await Promise.all(
      newInvoices.map(async (invoice: Invoice, index: number) => {
        let result: JobCard = await getJobCardById(invoice.jobCardId);

        let partsArr = stringToObj(result.parts);
        let labourArr = stringToObj(result.labour);
        // let taxesObj = stringToObj(result.taxes);

        console.log("THIS IS THE JOB CARD - ", result);

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
              part.totalTaxCust = splitPartTotalTax.customerAmt;

              partsTotal = partsTotal + part.amountCust;
              totalTax = totalTax + part.totalTaxCust;
              totalSubtotal = totalSubtotal + part.subTotalCust;
            } else {
              part.amountIns = splitPartAmount.insuranceAmt;
              part.subTotalIns = splitPartSubTotal.insuranceAmt;
              part.cgstAmtIns = splitPartCGST.insuranceAmt;
              part.sgstAmtIns = splitPartSGST.insuranceAmt;
              part.totalTaxIns = splitPartTotalTax.insuranceAmt;

              partsTotal = partsTotal + part.amountIns;
              totalTax = totalTax + part.totalTaxIns;
              totalSubtotal = totalSubtotal + part.subTotalIns;
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

              // console.log("DISCOUNT CHECK - ", splitPartDiscAmt);

              if (insuranceInvoiceTypeCOPY == "Customer") {
                part.discountAmtCust = splitPartDiscAmt.customerAmt;

                totalDiscount = totalDiscount + part.discountAmtCust;
              } else {
                part.discountAmtIns = splitPartDiscAmt.insuranceAmt;

                totalDiscount = totalDiscount + part.discountAmtIns;
              }
            }
          } else {
            if (insuranceInvoiceTypeCOPY == "Customer") {
              partsTotal = partsTotal + part.amount;
              totalTax = totalTax + part.totalTax;

              totalSubtotal = totalSubtotal + part.subTotal;
              // totalDiscount = totalDiscount + part.discountAmt

              if (
                part.discountPercentage &&
                part.discountAmt &&
                part.discountPercentage != 0
              ) {
                totalDiscount = totalDiscount + part.discountAmt;
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
              work.totalTaxCust = splitLabourTotalTax.customerAmt;

              labourTotal = labourTotal + work.amountCust;
              totalTax = totalTax + work.totalTaxCust;
              totalSubtotal = totalSubtotal + work.subTotalCust;
            } else {
              work.amountIns = splitLabourAmount.insuranceAmt;
              work.subTotalIns = splitLabourSubTotal.insuranceAmt;
              work.cgstAmtIns = splitLabourCGST.insuranceAmt;
              work.sgstAmtIns = splitLabourSGST.insuranceAmt;
              work.totalTaxIns = splitLabourTotalTax.insuranceAmt;

              labourTotal = labourTotal + work.amountIns;
              totalTax = totalTax + work.totalTaxIns;
              totalSubtotal = totalSubtotal + work.subTotalIns;
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

                totalDiscount = totalDiscount + work.discountAmtCust;
              } else {
                work.discountAmtIns = splitWorkDiscAmt.insuranceAmt;

                totalDiscount = totalDiscount + work.discountAmtIns;
              }
            } else {
              // console.log("NOT REGISTERING");
            }
          } else {
            if (insuranceInvoiceTypeCOPY == "Customer") {
              labourTotal = labourTotal + work.amount;
              totalTax = totalTax + work.totalTax;

              totalSubtotal = totalSubtotal + work.subTotal;
              if (
                work.discountPercentage &&
                work.discountAmt &&
                work.discountPercentage != 0
              ) {
                totalDiscount = totalDiscount + work.discountAmt;
              }
            }
          }
        });

        partsTotal = roundToTwoDecimals(partsTotal);
        labourTotal = roundToTwoDecimals(labourTotal);
        totalTax = roundToTwoDecimals(totalTax);
        totalDiscount = roundToTwoDecimals(totalDiscount);
        totalSubtotal = roundToTwoDecimals(totalSubtotal);

        console.log("HELLOOO PRINTING", {
          partsTotal,
          labourTotal,
          totalTax,
          totalDiscount,
          totalSubtotal,
        });

        // console.log("OBJECTIFIED RESULTS _ ", {
        //   partsArr,
        //   labourArr,
        //   taxesObj,
        // });

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
              updatedObject.amount = part.amount as number;
              updatedObject.subTotal = part.subTotal as number;
              updatedObject.cgstAmt = part.cgstAmt as number;
              updatedObject.sgstAmt = part.sgstAmt as number;
              updatedObject.totalTax = part.totalTax as number;
              updatedObject.discountPercentage =
                part.discountPercentage as number;
              updatedObject.discountAmt = part.discountAmt as number;
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
              updatedObject.amount = work.amount as number;
              updatedObject.subTotal = work.subTotal as number;
              updatedObject.cgstAmt = work.cgstAmt as number;
              updatedObject.sgstAmt = work.sgstAmt as number;
              updatedObject.totalTax = work.totalTax as number;
              updatedObject.discountPercentage =
                work.discountPercentage as number;
              updatedObject.discountAmt = work.discountAmt as number;
            }

            return updatedObject;
          })
        );

        result.parts = revisedPartsArr;
        result.labour = revisedLabourArr;

        result.subTotal = roundToTwoDecimals(totalSubtotal);
        result.amount = roundToTwoDecimals(partsTotal + labourTotal);
        result.discountAmt = roundToTwoDecimals(totalDiscount);
        result.totalTax = roundToTwoDecimals(totalTax);
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

        // Extract the date in "YYYY-MM-DD" format
        const dateString = dateTemp.toISOString().split("T")[0];

        invoice.invoiceDate = dateString;

        invoice.jobCardDetails = result;

        return invoice;
      })
    );
    console.log("HELLO TEST", updatedNewInvoices);

    const returnInvoicesObj = { invoices: updatedNewInvoices };

    return NextResponse.json(returnInvoicesObj, { status: 201 });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
