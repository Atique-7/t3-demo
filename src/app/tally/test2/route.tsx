import { getAllTaxInvoicesAfterDateTime, getJobCardById } from "@/lib/appwrite";
import {
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
} from "@/lib/definitions";
import {
  createTaxObj,
  createTaxObjNew,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

const Decimal = require("decimal.js");

export async function POST(request: NextRequest) {
  let totalErrors = 0;
  let totalCorrects = 0;
  let TotalItems = 0;
  try {
    const body = await request.json();
    console.log("BODY", body);

    const dateTimeStamp = body.data.lastSync;

    const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp);

    const newInvoices = result.documents;

    const curatedInvoices = curateInvoices(newInvoices);

    const curatedInvoiceLength = curatedInvoices.length;

    const testCuratedIncoices = curatedInvoices.filter((invoice: Invoice) => {
      if (
        [
          // "BDS/1033",
          // "BDS/1017",
          "BDS/1004",
          // "SER/1113",
          // "SER/1100",
          // "SER/1092",
          // "SER/1086",
          // "SER/1080",
          // "SER/1072",
          // "SER/1067",
          // "SER/1066",
          // "SER/1058",
          // "SER/1052",
          // "SER/1042",
          // "SER/1023",
          // "SER/1019",
          // "SER/1009",
          // "BDS/1090",
          // "BDS/1060",
          // "BDS/1053",
          "BDS/1003",
        ].includes(invoice.invoiceCode)
      )
        return invoice;
    });

    const updatedNewInvoices = await Promise.all(
      curatedInvoices.map(async (invoice: Invoice, index: number) => {
        // console.log("INVOICE", invoice.invoiceCode);

        let result: JobCard = await getJobCardById(invoice.jobCardId);

        let partsArr = stringToObj(result.parts);
        let labourArr = stringToObj(result.labour);

        let partsTotal = new Decimal(0);
        let labourTotal = new Decimal(0);

        let partsSubtotal = new Decimal(0);
        let labourSubtotal = new Decimal(0);

        let partsDiscount = new Decimal(0);
        let labourDiscount = new Decimal(0);

        let totalTax = new Decimal(0);

        let insuranceDetails;

        if (invoice.isInsuranceInvoice && invoice.invoiceType != "Quote") {
          insuranceDetails = JSON.parse(result.insuranceDetails);
          //   console.log(true);
        }

        const revisedPartsArr: any = await Promise.all(
          partsArr.map(async (part: CurrentPart) => {
            let tempSubTotal = new Decimal(0);
            let liabilitySubtotalWithoutDisc = new Decimal(0);
            let discountedSubtotal = new Decimal(0);
            let liabilitySubtotal = new Decimal(0);

            let tempCgstAmt = new Decimal(0);
            let tempSgstAmt = new Decimal(0);

            let tempTotalTax = new Decimal(0);

            let tempAmount = new Decimal(0);

            // Convert inputs to Decimal
            const mrp = new Decimal(part["mrp"]);
            const quantity = new Decimal(part["quantity"]);
            const discountAmt = new Decimal(part["discountAmt"] || 0);
            const discountPercentage = new Decimal(
              part["discountPercentage"] || 0
            );
            const cgst = new Decimal(part["cgst"]);
            const sgst = new Decimal(part["sgst"]);
            const insurancePercentage = new Decimal(
              part["insurancePercentage"] || 0
            );
            const isInsuranceInvoice = invoice["isInsuranceInvoice"];
            const insuranceInvoiceType = invoice["insuranceInvoiceType"];

            // Calculate subtotal
            tempSubTotal = roundDecimal(mrp.times(quantity));

            // Calculate discounted subtotal
            if (part["discountPercentage"] && !discountAmt.isZero()) {
              discountedSubtotal = roundDecimal(
                tempSubTotal.minus(discountAmt)
              );
            } else {
              discountedSubtotal = tempSubTotal;
            }

            // Calculate liability subtotal
            if (isInsuranceInvoice) {
              // if (part.partId == "6735aad50037493df474") {
              //   console.log("AAYA TOH HAIU ANDAR");
              // }
              if (insuranceInvoiceType === "Customer") {
                liabilitySubtotal = roundDecimal(
                  discountedSubtotal.times(
                    new Decimal(1).minus(insurancePercentage.dividedBy(100))
                  )
                );

                liabilitySubtotalWithoutDisc = roundDecimal(
                  tempSubTotal.times(
                    new Decimal(1).minus(insurancePercentage.dividedBy(100))
                  )
                );
              } else {
                liabilitySubtotal = roundDecimal(
                  discountedSubtotal.times(insurancePercentage.dividedBy(100))
                );

                liabilitySubtotalWithoutDisc = roundDecimal(
                  tempSubTotal.times(insurancePercentage.dividedBy(100))
                );
              }
            } else {
              liabilitySubtotal = discountedSubtotal;
              liabilitySubtotalWithoutDisc = tempSubTotal;
            }

            // Calculate tax amounts
            tempCgstAmt = roundDecimal(
              cgst.dividedBy(100).times(liabilitySubtotal)
            );
            tempSgstAmt = roundDecimal(
              sgst.dividedBy(100).times(liabilitySubtotal)
            );

            // Calculate total tax and total amount
            tempTotalTax = roundDecimal(tempSgstAmt.plus(tempCgstAmt));
            tempAmount = roundDecimal(liabilitySubtotal.plus(tempTotalTax));

            //Calculating IOnvoice Totals

            partsTotal = roundDecimal(partsTotal.plus(tempAmount));
            partsSubtotal = roundDecimal(
              partsSubtotal.plus(liabilitySubtotalWithoutDisc)
            );
            partsDiscount = roundDecimal(partsDiscount.plus(discountAmt));
            totalTax = roundDecimal(totalTax.plus(tempTotalTax));

            let updatedPart = {
              partId: part.partId,
              partName: part.partName,
              partNumber: part.partNumber,
              mrp: part.mrp,
              gst: part.gst,
              hsn: part.hsn,
              cgst: part.cgst,
              sgst: part.sgst,
              quantity: part.quantity,
              subTotal: Number(liabilitySubtotalWithoutDisc),
              cgstAmt: Number(tempCgstAmt),
              sgstAmt: Number(tempSgstAmt),
              totalTax: Number(tempTotalTax),
              amount: Number(tempAmount),
              discountAmt: Number(discountAmt) || 0,
            };

            return updatedPart;
          })
        );

        const revisedLabourArr: any = await Promise.all(
          labourArr.map(async (labour: CurrentLabour) => {
            let tempSubTotal = new Decimal(0);
            let liabilitySubtotalWithoutDisc = new Decimal(0);
            let discountedSubtotal = new Decimal(0);
            let liabilitySubtotal = new Decimal(0);

            let tempCgstAmt = new Decimal(0);
            let tempSgstAmt = new Decimal(0);

            let tempTotalTax = new Decimal(0);

            let tempAmount = new Decimal(0);

            // Convert inputs to Decimal
            const mrp = new Decimal(labour["mrp"]);
            const quantity = new Decimal(labour["quantity"]);
            const discountAmt = new Decimal(labour["discountAmt"] || 0);
            const discountPercentage = new Decimal(
              labour["discountPercentage"] || 0
            );
            const cgst = new Decimal(labour["cgst"]);
            const sgst = new Decimal(labour["sgst"]);
            const insurancePercentage = new Decimal(
              labour["insurancePercentage"] || 0
            );
            const isInsuranceInvoice = invoice["isInsuranceInvoice"];
            const insuranceInvoiceType = invoice["insuranceInvoiceType"];

            // Calculate subtotal
            tempSubTotal = roundDecimal(mrp.times(quantity));

            // Calculate discounted subtotal
            if (labour["discountPercentage"] && !discountAmt.isZero()) {
              discountedSubtotal = roundDecimal(
                tempSubTotal.minus(discountAmt)
              );
            } else {
              discountedSubtotal = tempSubTotal;
            }

            console.log();

            // Calculate liability subtotal
            if (isInsuranceInvoice) {
              if (insuranceInvoiceType === "Customer") {
                liabilitySubtotal = roundDecimal(
                  discountedSubtotal.times(
                    new Decimal(1).minus(insurancePercentage.dividedBy(100))
                  )
                );

                liabilitySubtotalWithoutDisc = roundDecimal(
                  tempSubTotal.times(
                    new Decimal(1).minus(insurancePercentage.dividedBy(100))
                  )
                );
              } else {
                liabilitySubtotal = roundDecimal(
                  discountedSubtotal.times(insurancePercentage.dividedBy(100))
                );

                liabilitySubtotalWithoutDisc = roundDecimal(
                  tempSubTotal.times(insurancePercentage.dividedBy(100))
                );
              }
            } else {
              liabilitySubtotal = discountedSubtotal;
              liabilitySubtotalWithoutDisc = tempSubTotal;
            }

            // Calculate tax amounts
            tempCgstAmt = roundDecimal(
              cgst.dividedBy(100).times(liabilitySubtotal)
            );
            tempSgstAmt = roundDecimal(
              sgst.dividedBy(100).times(liabilitySubtotal)
            );

            // Calculate total tax and total amount
            tempTotalTax = roundDecimal(tempSgstAmt.plus(tempCgstAmt));
            tempAmount = roundDecimal(liabilitySubtotal.plus(tempTotalTax));

            //Calculating IOnvoice Totals

            labourTotal = roundDecimal(labourTotal.plus(tempAmount));
            labourSubtotal = roundDecimal(
              labourSubtotal.plus(liabilitySubtotalWithoutDisc)
            );
            labourDiscount = roundDecimal(labourDiscount.plus(discountAmt));
            totalTax = roundDecimal(totalTax.plus(tempTotalTax));

            let updatedLabour = {
              labourId: labour.labourId,
              labourName: labour.labourName,
              labourCode: labour.labourCode,
              mrp: labour.mrp,
              hsn: labour.hsn,
              gst: labour.gst,
              cgst: labour.cgst,
              sgst: labour.cgst,
              quantity: labour.quantity,
              subTotal: Number(liabilitySubtotalWithoutDisc),
              cgstAmt: Number(tempCgstAmt),
              sgstAmt: Number(tempSgstAmt),
              totalTax: Number(tempTotalTax),
              amount: Number(tempAmount),
              discountAmt: Number(discountAmt) || 0,
            };

            return updatedLabour;
          })
        );

        let invoiceTotals = {
          amount: Number(roundDecimal(partsTotal.plus(labourTotal))),
          subtotal: Number(roundDecimal(partsSubtotal.plus(labourSubtotal))),
          discount: Number(roundDecimal(partsDiscount.plus(labourDiscount))),
          totalTax: Number(totalTax),
        };

        result.parts = revisedPartsArr;
        result.labour = revisedLabourArr;

        result.subTotal = Number(
          roundDecimal(partsSubtotal.plus(labourSubtotal))
        );
        result.amount = Number(roundDecimal(partsTotal.plus(labourTotal)));

        result.totalDiscountAmt = Number(
          roundDecimal(partsDiscount.plus(labourDiscount))
        );
        result.totalTax = Number(totalTax);
        result.placeOfSupply = "Maharashtra";
        result.totalRoundedOffAmount = Math.round(
          roundToTwoDecimals(
            result.subTotal - result.totalDiscountAmt + result.totalTax
          )
        );
        result.roundOffValue = roundToTwoDecimals(
          result.totalRoundedOffAmount - result.amount
        );

        if (
          invoice.isInsuranceInvoice &&
          invoice.invoiceType != "Quote" &&
          invoice.insuranceInvoiceType == "Insurance"
        ) {
          result.gstin = insuranceDetails.policyProviderGST;
          result.customerName = insuranceDetails.policyProvider;
          result.customerAddress = insuranceDetails.policyProviderAddress;
          result.customerPhone = "";
        }

        const taxesSplitObj = createTaxObjNew(
          revisedPartsArr,
          revisedLabourArr
        );

        result.taxes = taxesSplitObj;

        const dateTemp = new Date(invoice["$createdAt"]);

        const day = String(dateTemp.getDate()).padStart(2, "0"); // Ensures 2 digits
        const month = String(dateTemp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = dateTemp.getFullYear();

        // Combine into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        invoice.invoiceDate = formattedDate;

        invoice.jobCardDetails = result;

        return invoice;
      })
    );

    const returnResult = JSON.stringify(updatedNewInvoices);

    return NextResponse.json(updatedNewInvoices, { status: 201 });
  } catch (e) {
    console.log(e);
  }
}

const curateInvoices = (invoices: any) => {
  let invoiceArr: any[] = [];

  // console.log("ACTUAL", invoices.length);

  const groupedByJobCardId = invoices.reduce((acc: any, invoice: any) => {
    const jobCardId = invoice.jobCardId;
    if (!acc[jobCardId]) {
      acc[jobCardId] = [];
    }
    acc[jobCardId].push(invoice);
    return acc;
  }, {});

  let total = 0;

  Object.keys(groupedByJobCardId).map((key) => {
    const latestInvoices = getLatestInvoices(groupedByJobCardId[key]);
    total = total + groupedByJobCardId[key].length;
    invoiceArr = [...invoiceArr, ...latestInvoices];
  });

  invoiceArr.sort((a, b) =>
    a.invoiceNumber > b.invoiceNumber
      ? 1
      : b.invoiceNumber > a.invoiceNumber
      ? -1
      : 0
  );

  return invoiceArr;
};

const getLatestInvoices = (invoices: any) => {
  const latestInvoices: Record<string, any> = {};

  invoices.forEach((invoice: any) => {
    const { invoiceType, $createdAt, insuranceInvoiceType } = invoice;

    // Create a unique key for each combination of invoiceType and insuranceInvoiceType
    const key = insuranceInvoiceType
      ? `${invoiceType}-${insuranceInvoiceType}`
      : invoiceType;

    // Ensure `$createdAt` is valid
    if (!$createdAt) {
      console.warn(
        `Invoice with key ${key} has no '$createdAt' field:`,
        invoice
      );
      return;
    }

    if (!latestInvoices[key]) {
      // Initialize with the first invoice for this key
      latestInvoices[key] = invoice;
    } else {
      // Compare timestamps to find the latest
      const currentTimestamp = new Date($createdAt).getTime();
      const existingTimestamp = new Date(
        latestInvoices[key].$createdAt
      ).getTime();

      if (currentTimestamp > existingTimestamp) {
        latestInvoices[key] = invoice;
      }
    }
  });

  // Validate final output to ensure no duplicate keys
  const uniqueInvoices = Object.values(latestInvoices);
  // console.log("Final Unique Invoices:", uniqueInvoices);

  return uniqueInvoices; // Return only the latest invoices
};

function roundDecimal(value: any) {
  return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}
