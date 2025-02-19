import { getAllTaxInvoicesAfterDateTime, getJobCardById } from "@/lib/appwrite";
import {
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
} from "@/lib/definitions";
import {
  preciseOperation,
  roundToTwoDecimals,
  splitInsuranceAmt,
  stringToObj,
} from "@/lib/helper";
import { console } from "inspector";
import { NextRequest, NextResponse } from "next/server";

let totalErrors = 0;
let totalCorrect = 0;
let totalItems = 0;
let totalInsuranceCases = 0;
let closerToOriginal = 0;
let closerToRounded = 0;

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

const getFixedData = (data: any) => {
  const fixedData = data.map((obj: any) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === "number" ? roundToTwoDecimals(value) : value,
      ])
    )
  );

  return fixedData;
};

const hasMoreThanTwoDecimalPlaces = (value: number): boolean => {
  return value.toString().split(".")[1]?.length > 2;
};

const calculateItemValues = (
  item: CurrentPart | CurrentLabour,
  invoice: Invoice
) => {
  let subTotal, cgstAmt, sgstAmt, totalTax, amount, discountedSubTotal;

  // Step 1: Calculate subTotal
  subTotal = roundToTwoDecimals(item.mrp * item.quantity);
  // console.log("SUBT", subTotal, item.subTotal);

  // Step 2: Apply discount if available
  if (item.discountPercentage && item.discountAmt) {
    discountedSubTotal = roundToTwoDecimals(subTotal - item.discountAmt);
  } else {
    discountedSubTotal = subTotal;
  }

  // Step 3: Split subTotal based on insurance percentage
  if (item.insurancePercentage && invoice.isInsuranceInvoice) {
    totalInsuranceCases++;
    const splitSubTotal = splitInsuranceAmt(
      discountedSubTotal,
      item.insurancePercentage
    );

    if (invoice.insuranceInvoiceType === "Customer") {
      discountedSubTotal = splitSubTotal.customerAmt;
    } else if (invoice.insuranceInvoiceType === "Insurance") {
      discountedSubTotal = splitSubTotal.insuranceAmt;
    }
  }

  // Step 4: Calculate totalTax
  cgstAmt = roundToTwoDecimals((discountedSubTotal * item.cgst) / 100);
  sgstAmt = roundToTwoDecimals((discountedSubTotal * item.sgst) / 100);
  totalTax = roundToTwoDecimals(cgstAmt + sgstAmt);
  // console.log("TTAX", totalTax, item.totalTax);

  // Step 5: Calculate amount
  amount = roundToTwoDecimals(discountedSubTotal + totalTax);

  return { subTotal, discountedSubTotal, cgstAmt, sgstAmt, totalTax, amount };
};

const checkIfItemCorrect = async (
  item: CurrentPart | CurrentLabour,
  invoice: Invoice
) => {
  totalItems++;
  let currentError = 0.0;

  if (
    Math.abs(
      roundToTwoDecimals(
        item.subTotal - (item.discountAmt || 0) + item.totalTax
      ) - item.amount
    ) != 0
  ) {
    currentError = roundToTwoDecimals(
      item.subTotal - (item.discountAmt || 0) + item.totalTax - item.amount
    );
    // console.log(
    //   "Amount Error",
    //   currentError,
    //   roundToTwoDecimals(
    //     item.subTotal - (item.discountAmt || 0) + item.totalTax
    //   ),
    //   item.amount
    // );
    const correctedValues = calculateItemValues(item, invoice);
    const amtErr = Math.abs(
      roundToTwoDecimals(correctedValues.amount) - item.amount
    );
    console.log(amtErr, "Amount Error");

    totalErrors++;
  } else {
    // if (item.discountAmt != 0) {
    //   console.log("Amount Correct", item);
    // }
    // console.log("Amount Correct", item);
    totalCorrect++;
  }
};

const splitSubTotalFunc = (subTotal: number, insurancePercentage: number) => {
  const insuranceAmt = (insurancePercentage / 100) * subTotal;
  const customerAmt = subTotal - insuranceAmt;

  return { customerAmt, insuranceAmt };
};

const convertToHundreds = (item: CurrentPart | CurrentLabour) => {};

const correctItem = (item: CurrentPart | CurrentLabour, invoice: Invoice) => {
  let subTotal, cgstAmt, sgstAmt, totalTax, amount, discountedSubTotal;

  // Step 1: Calculate subTotal
  subTotal = item.mrp * item.quantity * 100;

  console.log("SUBT", subTotal, item.subTotal);

  if (item.discountPercentage && item.discountAmt) {
    discountedSubTotal = subTotal - item.discountAmt * 100;
  } else {
    discountedSubTotal = subTotal;
  }

  if (item.insurancePercentage && invoice.isInsuranceInvoice) {
    totalInsuranceCases++;
    const splitSubTotal = splitSubTotalFunc(
      discountedSubTotal,
      item.insurancePercentage
    );

    if (invoice.insuranceInvoiceType === "Customer") {
      discountedSubTotal = splitSubTotal.customerAmt;
    } else if (invoice.insuranceInvoiceType === "Insurance") {
      discountedSubTotal = splitSubTotal.insuranceAmt;
    }
  }
};

export async function POST(request: NextRequest) {
  // console.log("BODY", request.body);

  totalErrors = 0;
  totalCorrect = 0;
  totalItems = 0;
  totalInsuranceCases = 0;
  closerToOriginal = 0;
  closerToRounded = 0;

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
          "BDS/1033",
          "BDS/1017",
          "BDS/1004",
          "SER/1113",
          "SER/1100",
          "SER/1092",
          "SER/1086",
          "SER/1080",
          "SER/1072",
          "SER/1067",
          "SER/1066",
          "SER/1058",
          "SER/1052",
          "SER/1042",
          "SER/1023",
          "SER/1019",
          "SER/1009",
          "BDS/1090",
          "BDS/1060",
          "BDS/1053",
          "BDS/1003",
        ].includes(invoice.invoiceCode)
      )
        return invoice;
    });

    // console.log("INVOICES - ", testCuratedIncoices);

    const updatedNewInvoices = await Promise.all(
      curatedInvoices.map(async (invoice: Invoice, index: number) => {
        console.log("INVOICE - ", invoice.invoiceCode);
        let result: JobCard = await getJobCardById(invoice.jobCardId);

        let partsArr = getFixedData(stringToObj(result.parts));
        let labourArr = getFixedData(stringToObj(result.labour));

        let partsTotal = 0.0;
        let labourTotal = 0.0;

        let partsSubtotal = 0.0;
        let labourSubtotal = 0.0;

        let partsDiscount = 0.0;
        let labourDiscount = 0.0;

        let totalTax = 0.0;

        let insuranceDetails;

        if (invoice.isInsuranceInvoice && invoice.invoiceType != "Quote") {
          insuranceDetails = JSON.parse(result.insuranceDetails);
          //   console.log(true);
        }

        const revisedPartsArr: any = await Promise.all(
          partsArr.map(async (part: CurrentPart) => {
            correctItem(part, invoice);
            // checkIfItemCorrect(updatedPart, invoice);

            return part;
          })
        );

        const revisedLabourArr: any = await Promise.all(
          labourArr.map(async (labour: CurrentLabour) => {
            correctItem(labour, invoice);
            // checkIfItemCorrect(updatedLabour, invoice);
          })
        );
      })
    );

    return NextResponse.json(
      {
        totalErrors,
        totalCorrect,
        totalItems,
        closerToOriginal,
        closerToRounded,
        totalInsuranceCases,
        curatedInvoiceLength,
      },
      { status: 201 }
    );
  } catch (e) {
    console.log(e);
  }
}
