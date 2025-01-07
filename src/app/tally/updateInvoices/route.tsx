// import jobCard from "@/app/biller/jobCard/[jobCardId]/page";
// import {
//   getAllInvoices,
//   getAllTaxInvoicesAfterDateTime,
//   getJobCardById,
// } from "@/lib/appwrite";
// import {
//   CurrentLabour,
//   CurrentPart,
//   Invoice,
//   JobCard,
// } from "@/lib/definitions";
// import {
//   createTaxObj,
//   preciseOperation,
//   roundToTwoDecimals,
//   splitInsuranceAmt,
//   stringToObj,
// } from "@/lib/helper";
// import { NextRequest, NextResponse } from "next/server";
// import Decimal from "decimal.js";

// const getLatestInvoices = (invoices: any) => {
//   const latestInvoices: Record<string, any> = {};

//   invoices.forEach((invoice: any) => {
//     const { invoiceType, $createdAt, insuranceInvoiceType } = invoice;

//     // Create a unique key for each combination of invoiceType and insuranceInvoiceType
//     const key = insuranceInvoiceType
//       ? `${invoiceType}-${insuranceInvoiceType}`
//       : invoiceType;

//     // Ensure `$createdAt` is valid
//     if (!$createdAt) {
//       console.warn(
//         `Invoice with key ${key} has no '$createdAt' field:`,
//         invoice
//       );
//       return;
//     }

//     if (!latestInvoices[key]) {
//       // Initialize with the first invoice for this key
//       latestInvoices[key] = invoice;
//     } else {
//       // Compare timestamps to find the latest
//       const currentTimestamp = new Date($createdAt).getTime();
//       const existingTimestamp = new Date(
//         latestInvoices[key].$createdAt
//       ).getTime();

//       if (currentTimestamp > existingTimestamp) {
//         latestInvoices[key] = invoice;
//       }
//     }
//   });

//   // Validate final output to ensure no duplicate keys
//   const uniqueInvoices = Object.values(latestInvoices);
//   // console.log("Final Unique Invoices:", uniqueInvoices);

//   return uniqueInvoices; // Return only the latest invoices
// };

// const curateInvoices = (invoices: any) => {
//   let invoiceArr: any[] = [];

//   // console.log("ACTUAL", invoices.length);

//   const groupedByJobCardId = invoices.reduce((acc: any, invoice: any) => {
//     const jobCardId = invoice.jobCardId;
//     if (!acc[jobCardId]) {
//       acc[jobCardId] = [];
//     }
//     acc[jobCardId].push(invoice);
//     return acc;
//   }, {});

//   let total = 0;

//   Object.keys(groupedByJobCardId).map((key) => {
//     const latestInvoices = getLatestInvoices(groupedByJobCardId[key]);
//     total = total + groupedByJobCardId[key].length;
//     invoiceArr = [...invoiceArr, ...latestInvoices];
//   });

//   invoiceArr.sort((a, b) =>
//     a.invoiceNumber > b.invoiceNumber
//       ? 1
//       : b.invoiceNumber > a.invoiceNumber
//       ? -1
//       : 0
//   );

//   return invoiceArr;
// };

// const getFixedData = (data: any) => {
//   const fixedData = data.map((obj: any) =>
//     Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [
//         key,
//         typeof value === "number" ? Math.ceil(value * 100) / 100 : value,
//       ])
//     )
//   );

//   return fixedData;
// };

// export async function POST(request: NextRequest) {
//   // console.log("BODY", request.body);
//   try {
//     const body = await request.json();
//     console.log(body);

//     const dateTimeStamp = body.data.lastSync;

//     const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp);

//     const newInvoices = result.documents;

//     const curatedInvoices = curateInvoices(newInvoices);

//     // const testCuratedIncoices = curatedInvoices.filter((invoice: Invoice) => {if(invoice.carNumber == "MH04HF9172") return invoice});

//     // console.log("INVOICES - ", testCuratedIncoices);
//     const updatedNewInvoices = await Promise.all(
//       curatedInvoices.map(async (invoice: Invoice, index: number) => {
//         let result: JobCard = await getJobCardById(invoice.jobCardId);
//         let partsArr = getFixedData(stringToObj(result.parts));
//         let labourArr = getFixedData(stringToObj(result.labour));

//         // let taxesObj = stringToObj(result.taxes);

//         // console.log("THIS IS THE JOB CARD - ", result);

//         let invoiceTypeCOPY = invoice.invoiceType;

//         let insuranceInvoiceTypeCOPY = invoice.insuranceInvoiceType;

//         const foundIndexParts = partsArr.findIndex(
//           (part: CurrentPart) =>
//             part.insurancePercentage && part.insurancePercentage != 0
//         );

//         const foundIndexLabour = labourArr.findIndex(
//           (work: CurrentLabour) =>
//             work.insurancePercentage && work.insurancePercentage != 0
//         );

//         const isInsurance = foundIndexParts != -1 || foundIndexLabour != -1;

//         let partsTotal = 0;
//         let labourTotal = 0;

//         let totalTax = 0;
//         let totalDiscount = 0;

//         let totalSubtotal = 0;
//         let insuranceDetails;

//         if (isInsurance && invoice.invoiceType != "Quote") {
//           insuranceDetails = JSON.parse(result.insuranceDetails);
//         }

//         // console.log("THESE ARE THE PARTS - ", liabilityType, parts);

//         partsArr.map((part: CurrentPart) => {
//           if (
//             isInsurance &&
//             invoice.invoiceType != "Quote" &&
//             part.insurancePercentage &&
//             part.insurancePercentage != 0
//           ) {
//             const splitPartAmount = splitInsuranceAmt(
//               part.amount,
//               part.insurancePercentage
//             );

//             // console.log("CHECK AMT - ", splitPartAmount);

//             const splitPartSubTotal = splitInsuranceAmt(
//               part.subTotal,
//               part.insurancePercentage
//             );

//             const splitPartCGST = splitInsuranceAmt(
//               part.cgstAmt,
//               part.insurancePercentage
//             );

//             const splitPartSGST = splitInsuranceAmt(
//               part.sgstAmt,
//               part.insurancePercentage
//             );

//             const splitPartTotalTax = splitInsuranceAmt(
//               part.totalTax,
//               part.insurancePercentage
//             );

//             if (insuranceInvoiceTypeCOPY == "Customer") {
//               part.amountCust = splitPartAmount.customerAmt;
//               part.subTotalCust = splitPartSubTotal.customerAmt;
//               part.cgstAmtCust = splitPartCGST.customerAmt;
//               part.sgstAmtCust = splitPartSGST.customerAmt;
//               part.totalTaxCust = preciseOperation(
//                 "add",
//                 splitPartCGST.customerAmt,
//                 splitPartSGST.customerAmt
//               );

//               partsTotal = preciseOperation("add", partsTotal, part.amountCust);

//               totalTax = preciseOperation("add", totalTax, part.totalTaxCust);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 part.subTotalCust
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitPartSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }
//             } else {
//               part.amountIns = splitPartAmount.insuranceAmt;
//               part.subTotalIns = splitPartSubTotal.insuranceAmt;
//               part.cgstAmtIns = splitPartCGST.insuranceAmt;
//               part.sgstAmtIns = splitPartSGST.insuranceAmt;
//               part.totalTaxIns = preciseOperation(
//                 "add",
//                 splitPartCGST.insuranceAmt,
//                 splitPartSGST.insuranceAmt
//               );

//               partsTotal = preciseOperation("add", partsTotal, part.amountIns);

//               totalTax = preciseOperation("add", totalTax, part.totalTaxIns);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 part.subTotalIns
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitPartSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }
//             }

//             if (
//               part.discountPercentage &&
//               part.discountAmt &&
//               part.discountPercentage != 0
//             ) {
//               const splitPartDiscAmt = splitInsuranceAmt(
//                 part.discountAmt,
//                 part.insurancePercentage
//               );

//               // console.log("DISCOUNT CHECK - ", splitPartDiscAmt);

//               if (insuranceInvoiceTypeCOPY == "Customer") {
//                 part.discountAmtCust = splitPartDiscAmt.customerAmt;

//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   part.discountAmtCust
//                 );
//               } else {
//                 part.discountAmtIns = splitPartDiscAmt.insuranceAmt;

//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   part.discountAmtIns
//                 );
//               }
//             }
//           } else {
//             if (result.carNumber == "MH04HF9172") {
//               console.log("CHECKING - ", part.insurancePercentage! >= 0);
//             }
//             if (part.insurancePercentage! >= 0) {
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("YAHAAAANNN");
//               }
//               const splitPartTotalTax = splitInsuranceAmt(
//                 part.totalTax,
//                 part.insurancePercentage!
//               );

//               const splitPartAmount = splitInsuranceAmt(
//                 part.amount,
//                 part.insurancePercentage!
//               );

//               // console.log("CHECK AMT - ", splitPartAmount);

//               const splitPartSubTotal = splitInsuranceAmt(
//                 part.subTotal,
//                 part.insurancePercentage!
//               );

//               if (insuranceInvoiceTypeCOPY == "Customer") {
//                 partsTotal = preciseOperation(
//                   "add",
//                   partsTotal,
//                   splitPartAmount.customerAmt
//                 );

//                 totalTax = preciseOperation(
//                   "add",
//                   totalTax,
//                   splitPartTotalTax.customerAmt
//                 );

//                 totalSubtotal = preciseOperation(
//                   "add",
//                   totalSubtotal,
//                   splitPartSubTotal.customerAmt
//                 );
//               } else {
//                 partsTotal = preciseOperation(
//                   "add",
//                   partsTotal,
//                   splitPartAmount.insuranceAmt
//                 );

//                 totalTax = preciseOperation(
//                   "add",
//                   totalTax,
//                   splitPartTotalTax.insuranceAmt
//                 );

//                 totalSubtotal = preciseOperation(
//                   "add",
//                   totalSubtotal,
//                   splitPartSubTotal.insuranceAmt
//                 );
//               }

//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitPartSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }

//               // totalDiscount = totalDiscount , part.discountAmt

//               if (
//                 part.discountPercentage &&
//                 part.discountAmt &&
//                 part.discountPercentage != 0
//               ) {
//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   part.discountAmt
//                 );
//               }
//             } else {
//               partsTotal = preciseOperation("add", partsTotal, part.amount);

//               totalTax = preciseOperation("add", totalTax, part.totalTax);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 part.subTotal
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, "CHECK");
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }

//               if (
//                 part.discountPercentage &&
//                 part.discountAmt &&
//                 part.discountPercentage != 0
//               ) {
//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   part.discountAmt
//                 );
//               }
//             }
//           }
//         });

//         labourArr.map((work: CurrentLabour) => {
//           // if (result.carNumber == "MH01DE4865") {
//           //   console.log("THIS IS THE CAR - ", labourArr);
//           // }
//           if (
//             isInsurance &&
//             invoice.invoiceType != "Quote" &&
//             work.insurancePercentage &&
//             work.insurancePercentage != 0
//           ) {
//             const splitLabourAmount = splitInsuranceAmt(
//               work.amount,
//               work.insurancePercentage
//             );

//             const splitLabourSubTotal = splitInsuranceAmt(
//               work.subTotal,
//               work.insurancePercentage
//             );

//             const splitLabourCGST = splitInsuranceAmt(
//               work.cgstAmt,
//               work.insurancePercentage
//             );

//             const splitLabourSGST = splitInsuranceAmt(
//               work.sgstAmt,
//               work.insurancePercentage
//             );

//             const splitLabourTotalTax = splitInsuranceAmt(
//               work.totalTax,
//               work.insurancePercentage
//             );

//             if (insuranceInvoiceTypeCOPY == "Customer") {
//               work.amountCust = splitLabourAmount.customerAmt;
//               work.subTotalCust = splitLabourSubTotal.customerAmt;
//               work.cgstAmtCust = splitLabourCGST.customerAmt;
//               work.sgstAmtCust = splitLabourSGST.customerAmt;
//               work.totalTaxCust = preciseOperation(
//                 "add",
//                 splitLabourCGST.customerAmt,
//                 splitLabourSGST.customerAmt
//               );

//               labourTotal = preciseOperation(
//                 "add",
//                 labourTotal,
//                 work.amountCust
//               );

//               totalTax = preciseOperation("add", totalTax, work.totalTaxCust);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 work.subTotalCust
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitLabourSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }
//             } else {
//               work.amountIns = splitLabourAmount.insuranceAmt;
//               work.subTotalIns = splitLabourSubTotal.insuranceAmt;
//               work.cgstAmtIns = splitLabourCGST.insuranceAmt;
//               work.sgstAmtIns = splitLabourSGST.insuranceAmt;
//               work.totalTaxIns = preciseOperation(
//                 "add",
//                 splitLabourCGST.insuranceAmt,
//                 splitLabourSGST.insuranceAmt
//               );

//               labourTotal = preciseOperation(
//                 "add",
//                 labourTotal,
//                 work.amountIns
//               );

//               totalTax = preciseOperation("add", totalTax, work.totalTaxIns);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 work.subTotalIns
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitLabourSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }
//             }

//             if (
//               work.discountPercentage &&
//               work.discountAmt &&
//               work.discountPercentage != 0
//             ) {
//               const splitWorkDiscAmt = splitInsuranceAmt(
//                 work.discountAmt,
//                 work.insurancePercentage
//               );

//               // console.log("DISCOUNT CHECK LABOUR - ", splitWorkDiscAmt);

//               if (insuranceInvoiceTypeCOPY == "Customer") {
//                 work.discountAmtCust = splitWorkDiscAmt.customerAmt;

//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   work.discountAmtCust
//                 );
//               } else {
//                 work.discountAmtIns = splitWorkDiscAmt.insuranceAmt;

//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   work.discountAmtIns
//                 );
//               }
//             } else {
//               // console.log("NOT REGISTERING");
//             }
//           } else {
//             if (work.insurancePercentage! >= 0) {
//               const splitLabourTotalTax = splitInsuranceAmt(
//                 work.totalTax,
//                 work.insurancePercentage!
//               );
//               const splitLabourAmount = splitInsuranceAmt(
//                 work.amount,
//                 work.insurancePercentage!
//               );

//               const splitLabourSubTotal = splitInsuranceAmt(
//                 work.subTotal,
//                 work.insurancePercentage!
//               );

//               if (insuranceInvoiceTypeCOPY == "Customer") {
//                 labourTotal = preciseOperation(
//                   "add",
//                   labourTotal,
//                   splitLabourAmount.customerAmt
//                 );

//                 totalTax = preciseOperation(
//                   "add",
//                   totalTax,
//                   splitLabourTotalTax.customerAmt
//                 );

//                 totalSubtotal = preciseOperation(
//                   "add",
//                   totalSubtotal,
//                   splitLabourSubTotal.customerAmt
//                 );
//               } else {
//                 labourTotal = preciseOperation(
//                   "add",
//                   labourTotal,
//                   splitLabourAmount.insuranceAmt
//                 );

//                 totalTax = preciseOperation(
//                   "add",
//                   totalTax,
//                   splitLabourTotalTax.insuranceAmt
//                 );

//                 totalSubtotal = preciseOperation(
//                   "add",
//                   totalSubtotal,
//                   splitLabourSubTotal.insuranceAmt
//                 );
//               }

//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, splitLabourSubTotal);
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }

//               if (
//                 work.discountPercentage &&
//                 work.discountAmt &&
//                 work.discountPercentage != 0
//               ) {
//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   work.discountAmt
//                 );
//               }
//             } else {
//               labourTotal = preciseOperation("add", labourTotal, work.amount);

//               totalTax = preciseOperation("add", totalTax, work.totalTax);

//               totalSubtotal = preciseOperation(
//                 "add",
//                 totalSubtotal,
//                 work.subTotal
//               );
//               if (result.carNumber == "MH04HF9172") {
//                 console.log("UPDATED - ", totalSubtotal, "CHECK");
//                 console.log("TYPE - ", invoice.insuranceInvoiceType);
//               }

//               if (
//                 work.discountPercentage &&
//                 work.discountAmt &&
//                 work.discountPercentage != 0
//               ) {
//                 totalDiscount = preciseOperation(
//                   "add",
//                   totalDiscount,
//                   work.discountAmt
//                 );
//               }
//             }
//           }
//         });

//         const keysToRetainParts: (keyof CurrentPart)[] = [
//           "partId",
//           "partName",
//           "partNumber",
//           "mrp",
//           "gst",
//           "hsn",
//           "cgst",
//           "sgst",
//           "quantity",
//         ];

//         const revisedPartsArr: any = await Promise.all(
//           partsArr.map((part: CurrentPart) => {
//             const updatedObject: CurrentPart = Object.keys(part).reduce(
//               (acc, key) => {
//                 if (keysToRetainParts.includes(key as keyof CurrentPart)) {
//                   (acc as any)[key] = part[key as keyof CurrentPart];
//                 } else {
//                   (acc as any)[key] = undefined;
//                 }
//                 return acc;
//               },
//               {} as CurrentPart
//             ); // console.log("UPDATED OBJECT - ", updatedObject);

//             if (isInsurance && invoice.invoiceType != "Quote") {
//               if (part.insurancePercentage && part.insurancePercentage != 0) {
//                 if (insuranceInvoiceTypeCOPY == "Customer") {
//                   updatedObject.amount = part.amountCust as number;
//                   updatedObject.subTotal = part.subTotalCust as number;
//                   updatedObject.cgstAmt = part.cgstAmtCust as number;
//                   updatedObject.sgstAmt = part.sgstAmtCust as number;
//                   updatedObject.totalTax = part.totalTaxCust as number;
//                   updatedObject.discountPercentage =
//                     part.discountPercentage as number;
//                   updatedObject.discountAmt = part.discountAmtCust as number;
//                 } else {
//                   updatedObject.amount = part.amountIns as number;
//                   updatedObject.subTotal = part.subTotalIns as number;
//                   updatedObject.cgstAmt = part.cgstAmtIns as number;
//                   updatedObject.sgstAmt = part.sgstAmtIns as number;
//                   updatedObject.totalTax = part.totalTaxIns as number;
//                   updatedObject.discountPercentage =
//                     part.discountPercentage as number;
//                   updatedObject.discountAmt = part.discountAmtIns as number;
//                 }
//               } else {
//                 if (insuranceInvoiceTypeCOPY == "Customer") {
//                   updatedObject.amount = part.amount as number;
//                   updatedObject.subTotal = part.subTotal as number;
//                   updatedObject.cgstAmt = part.cgstAmt as number;
//                   updatedObject.sgstAmt = part.sgstAmt as number;
//                   updatedObject.totalTax = part.totalTax as number;
//                   updatedObject.discountPercentage =
//                     part.discountPercentage as number;
//                   updatedObject.discountAmt = part.discountAmt as number;
//                 } else {
//                   updatedObject.amount = 0;
//                   updatedObject.subTotal = 0;
//                   updatedObject.cgstAmt = 0;
//                   updatedObject.sgstAmt = 0;
//                   updatedObject.totalTax = 0;
//                   updatedObject.discountPercentage =
//                     part.discountPercentage as number;
//                   updatedObject.discountAmt = 0;
//                 }
//               }
//             } else {
//               updatedObject.amount = roundToTwoDecimals(part.amount as number);
//               updatedObject.subTotal = roundToTwoDecimals(
//                 part.subTotal as number
//               );
//               updatedObject.cgstAmt = roundToTwoDecimals(
//                 part.cgstAmt as number
//               );
//               updatedObject.sgstAmt = roundToTwoDecimals(
//                 part.sgstAmt as number
//               );
//               updatedObject.totalTax = roundToTwoDecimals(
//                 part.totalTax as number
//               );

//               if (part.discountPercentage && part.discountAmt) {
//                 updatedObject.discountPercentage = roundToTwoDecimals(
//                   part.discountPercentage as number
//                 );
//                 updatedObject.discountAmt = roundToTwoDecimals(
//                   part.discountAmt as number
//                 );
//               }
//             }

//             if (!part.discountPercentage || !part.discountAmt) {
//               updatedObject.discountPercentage = 0;
//               updatedObject.discountAmt = 0;
//             }

//             return updatedObject;
//           })
//         );

//         const keysToRetainLabour: (keyof CurrentLabour)[] = [
//           "labourId",
//           "labourName",
//           "labourCode",
//           "mrp",
//           "gst",
//           "hsn",
//           "cgst",
//           "sgst",
//           "quantity",
//         ];

//         const revisedLabourArr: any = await Promise.all(
//           labourArr.map((work: CurrentLabour) => {
//             // if (result.carNumber == "MH01DE4865") {
//             //   console.log("THIS IS THE OBJECT FROM TOP - ", work);
//             // }
//             const updatedObject: CurrentLabour = Object.keys(work).reduce(
//               (acc, key) => {
//                 if (keysToRetainLabour.includes(key as keyof CurrentLabour)) {
//                   (acc as any)[key] = work[key as keyof CurrentLabour];
//                 } else {
//                   (acc as any)[key] = undefined;
//                 }
//                 return acc;
//               },
//               {} as CurrentLabour // Correctly cast the initial accumulator to `CurrentLabour`
//             );

//             if (isInsurance && invoice.invoiceType != "Quote") {
//               if (work.insurancePercentage && work.insurancePercentage != 0) {
//                 if (insuranceInvoiceTypeCOPY == "Customer") {
//                   updatedObject.amount = work.amountCust as number;
//                   updatedObject.subTotal = work.subTotalCust as number;
//                   updatedObject.cgstAmt = work.cgstAmtCust as number;
//                   updatedObject.sgstAmt = work.sgstAmtCust as number;
//                   updatedObject.totalTax = work.totalTaxCust as number;
//                   updatedObject.discountPercentage =
//                     work.discountPercentage as number;
//                   updatedObject.discountAmt = work.discountAmtCust as number;
//                 } else {
//                   updatedObject.amount = work.amountIns as number;
//                   updatedObject.subTotal = work.subTotalIns as number;
//                   updatedObject.cgstAmt = work.cgstAmtIns as number;
//                   updatedObject.sgstAmt = work.sgstAmtIns as number;
//                   updatedObject.totalTax = work.totalTaxIns as number;
//                   updatedObject.discountPercentage =
//                     work.discountPercentage as number;
//                   updatedObject.discountAmt = work.discountAmtIns as number;
//                 }
//               } else {
//                 if (insuranceInvoiceTypeCOPY == "Customer") {
//                   updatedObject.amount = work.amount as number;
//                   updatedObject.subTotal = work.subTotal as number;
//                   updatedObject.cgstAmt = work.cgstAmt as number;
//                   updatedObject.sgstAmt = work.sgstAmt as number;
//                   updatedObject.totalTax = work.totalTax as number;
//                   updatedObject.discountPercentage =
//                     work.discountPercentage as number;
//                   updatedObject.discountAmt = work.discountAmt as number;
//                 } else {
//                   updatedObject.amount = 0;
//                   updatedObject.subTotal = 0;
//                   updatedObject.cgstAmt = 0;
//                   updatedObject.sgstAmt = 0;
//                   updatedObject.totalTax = 0;
//                   updatedObject.discountPercentage =
//                     work.discountPercentage as number;
//                   updatedObject.discountAmt = 0;
//                 }
//               }
//             } else {
//               updatedObject.amount = roundToTwoDecimals(work.amount as number);
//               updatedObject.subTotal = roundToTwoDecimals(
//                 work.subTotal as number
//               );
//               updatedObject.cgstAmt = roundToTwoDecimals(
//                 work.cgstAmt as number
//               );
//               updatedObject.sgstAmt = roundToTwoDecimals(
//                 work.sgstAmt as number
//               );
//               updatedObject.totalTax = roundToTwoDecimals(
//                 work.totalTax as number
//               );

//               if (work.discountPercentage && work.discountAmt) {
//                 updatedObject.discountPercentage = roundToTwoDecimals(
//                   work.discountPercentage as number
//                 );
//                 updatedObject.discountAmt = roundToTwoDecimals(
//                   work.discountAmt as number
//                 );
//               }
//             }

//             if (!work.discountPercentage || !work.discountAmt) {
//               updatedObject.discountPercentage = 0;
//               updatedObject.discountAmt = 0;
//             }
//             // console.log("UPDATED OBJECT - ", updatedObject);
//             // if (result.carNumber == "MH01DE4865") {
//             //   console.log("THIS IS THE OBJECT AFTER- ", updatedObject);
//             // }

//             return updatedObject;
//           })
//         );

//         result.parts = revisedPartsArr;
//         result.labour = revisedLabourArr;

//         result.subTotal = totalSubtotal;
//         result.amount = roundToTwoDecimals(
//           totalSubtotal - totalDiscount + totalTax
//         );
//         result.totalDiscountAmt = totalDiscount;
//         result.totalTax = totalTax;
//         result.placeOfSupply = "Maharashtra";
//         result.totalRoundedOffAmount = Math.round(
//           roundToTwoDecimals(totalSubtotal - totalDiscount + totalTax)
//         );
//         result.roundOffValue = roundToTwoDecimals(
//           result.totalRoundedOffAmount - result.amount
//         );

//         if (
//           isInsurance &&
//           invoice.invoiceType != "Quote" &&
//           insuranceInvoiceTypeCOPY == "Insurance"
//         ) {
//           result.gstin = insuranceDetails.policyProviderGST;
//           result.customerName = insuranceDetails.policyProvider;
//           result.customerAddress = insuranceDetails.policyProviderAddress;
//           result.customerPhone = "";
//         }

//         const taxesSplitObj = createTaxObj(
//           partsArr,
//           labourArr,
//           isInsurance,
//           invoice.insuranceInvoiceType
//         );

//         if (result.carNumber == "MH04HF9172") {
//           console.log("TYPE - ", invoice.insuranceInvoiceType);
//           console.log(
//             "THIS IS THE JOB CARD - ",
//             taxesSplitObj,
//             result.subTotal,
//             result.amount,
//             result.totalTax,
//             result.totalDiscountAmt
//           );
//         }
//         result.taxes = taxesSplitObj;

//         const dateTemp = new Date(invoice["$createdAt"]);

//         const day = String(dateTemp.getDate()).padStart(2, "0"); // Ensures 2 digits
//         const month = String(dateTemp.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
//         const year = dateTemp.getFullYear();

//         // Combine into the desired format
//         const formattedDate = `${day}-${month}-${year}`;

//         invoice.invoiceDate = formattedDate;

//         invoice.jobCardDetails = result;

//         // console.log("Ho Gaya", index);

//         // console.log(
//         //   "AMOUNT CHECK - ",
//         //   invoice.jobCardDetails.subTotal,
//         //   invoice.jobCardDetails.amount,
//         //   invoice.jobCardDetails.totalTax,
//         //   invoice.jobCardDetails.totalDiscountAmt
//         // );

//         // console.log("INVOICE FOR - ", invoice.jobCardDetails);

//         return invoice;
//       })
//     );

//     const returnInvoicesObj = { invoices: updatedNewInvoices };

//     // console.log("INVOICES OBJECT - ", returnInvoicesObj);

//     return NextResponse.json(returnInvoicesObj, { status: 201 });
//   } catch (error) {
//     // console.log("Failed");
//     // console.log("CAUGHT ERROR", error);

//     return NextResponse.json({
//       message: "HELLOOO",
//       status: false,
//     });
//   }
// }

// function roundDecimal(value: any) {
//   return new Decimal(value).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
// }

// const processItem = async (
//   itemType: "Part" | "Labour",
//   item: CurrentPart | CurrentLabour,
//   invoice: Invoice
// ) => {
//   return new Promise((resolve, reject) => {
//     try {
//       let tempSubTotal = new Decimal(0);
//       let liabilitySubtotalWithoutDisc = new Decimal(0);
//       let discountedSubtotal = new Decimal(0);
//       let liabilitySubtotal = new Decimal(0);

//       let tempCgstAmt = new Decimal(0);
//       let tempSgstAmt = new Decimal(0);

//       let tempTotalTax = new Decimal(0);

//       let tempAmount = new Decimal(0);

//       // Convert inputs to Decimal
//       const mrp = new Decimal(item["mrp"]);
//       const quantity = new Decimal(item["quantity"]);
//       const discountAmt = new Decimal(item["discountAmt"] || 0);
//       const discountPercentage = new Decimal(item["discountPercentage"] || 0);
//       const cgst = new Decimal(item["cgst"]);
//       const sgst = new Decimal(item["sgst"]);
//       const insurancePercentage = new Decimal(item["insurancePercentage"] || 0);
//       const isInsuranceInvoice = invoice["isInsuranceInvoice"];
//       const insuranceInvoiceType = invoice["insuranceInvoiceType"];

//       // Calculate subtotal
//       tempSubTotal = roundDecimal(mrp.times(quantity));

//       // Calculate discounted subtotal
//       if (item["discountPercentage"] && !discountAmt.isZero()) {
//         discountedSubtotal = roundDecimal(tempSubTotal.minus(discountAmt));
//       } else {
//         discountedSubtotal = tempSubTotal;
//       }

//       // Calculate liability subtotal
//       if (isInsuranceInvoice) {
//         if (insuranceInvoiceType === "Customer") {
//           liabilitySubtotal = roundDecimal(
//             discountedSubtotal.times(
//               new Decimal(1).minus(insurancePercentage.dividedBy(100))
//             )
//           );

//           liabilitySubtotalWithoutDisc = roundDecimal(
//             tempSubTotal.times(
//               new Decimal(1).minus(insurancePercentage.dividedBy(100))
//             )
//           );
//         } else {
//           liabilitySubtotal = roundDecimal(
//             discountedSubtotal.times(insurancePercentage.dividedBy(100))
//           );

//           liabilitySubtotalWithoutDisc = roundDecimal(
//             tempSubTotal.times(insurancePercentage.dividedBy(100))
//           );
//         }
//       } else {
//         liabilitySubtotal = discountedSubtotal;
//         liabilitySubtotalWithoutDisc = tempSubTotal;
//       }

//       // Calculate tax amounts
//       tempCgstAmt = roundDecimal(cgst.dividedBy(100).times(liabilitySubtotal));
//       tempSgstAmt = roundDecimal(sgst.dividedBy(100).times(liabilitySubtotal));

//       // Calculate total tax and total amount
//       tempTotalTax = roundDecimal(tempSgstAmt.plus(tempCgstAmt));
//       tempAmount = roundDecimal(liabilitySubtotal.plus(tempTotalTax));

//       let updatedItem = {
//         mrp: item.mrp,
//         gst: item.gst,
//         hsn: item.hsn,
//         cgst: item.cgst,
//         sgst: item.sgst,
//         quantity: item.quantity,
//         subTotal: Number(liabilitySubtotalWithoutDisc),
//         cgstAmt: Number(tempCgstAmt),
//         sgstAmt: Number(tempSgstAmt),
//         totalTax: Number(tempTotalTax),
//         amount: Number(tempAmount),
//         discountAmt: Number(discountAmt) || 0,
//         discountPercentage: Number(discountPercentage) || 0,
//       };

//       if (itemType == "Part") {
//         (updatedItem as CurrentPart).partId = (item as CurrentPart).partId;
//         (updatedItem as CurrentPart).partName = (item as CurrentPart).partName;
//         (updatedItem as CurrentPart).partNumber = (
//           item as CurrentPart
//         ).partNumber;
//       } else {
//         (updatedItem as CurrentLabour).labourId = (
//           item as CurrentLabour
//         ).labourId;
//         (updatedItem as CurrentLabour).labourName = (
//           item as CurrentLabour
//         ).labourName;
//         (updatedItem as CurrentLabour).labourCode = (
//           item as CurrentLabour
//         ).labourCode;
//       }
//       resolve(updatedItem);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  return NextResponse.json("Please Hit /tally/updateInvoices/v2", {
    status: 201,
  });
}
