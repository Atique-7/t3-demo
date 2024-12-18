// import { NextRequest, NextResponse } from "next/server";
// import { Client, Databases, Query } from "node-appwrite";



// import { config } from "@/lib/appwrite";
// // Initialize Appwrite Server SDK
// const client = new Client();
// const databases = new Databases(client);

// client
//   .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
//   .setProject("66b10a0100095b4634e4") // Replace with your project ID
//   .setKey("standard_ccfafcfdb4ab4b7460d7379de12a0df172814cd321d0c231626e0e03264112144430c0a3eea131046a21b35d9d06766f6b6a8bb2404af24c25c48eea47696d20e1b91271d8b737094c9a8c363c13fcf15ae571f3c78bdef565d3bc93cafed20d9a724658a780267ae9b4bb98ed8dc36f8eede5cbbc571cde970b9894cb15cc21"); // Replace with your API Key

// // Update database using Appwrite Server SDK
// const updateInvoicesInDatabase = async (invoices: any[]) => {
//   try {
//     for (const invoice of invoices) {
//       await databases.updateDocument(
//         config.databaseId,
//         config.invoicesCollectionId,
//         invoice.$id,
//         {
//           invoiceNumber: invoice.invoiceNumber,
//           invoiceCode: invoice.invoiceCode,
//         }
//       );
//       console.log(`Updated Invoice: ${invoice.invoiceCode}`);
//     }
//   } catch (error) {
//     console.error("Error updating invoices in database:", error);
//     throw error;
//   }
// };

// export async function POST(req: NextRequest) {
  
//   try {
//     // Step 1: Group invoices
//     const groupedInvoices = await groupInvoicesByJobCardAndSeries();
//     console.log("Grouped Invoices:", groupedInvoices);

//     // Step 2: Rearrange invoices
//     const rearrangedInvoices = rearrangeJobCardsByDate(groupedInvoices);
//     console.log("Rearranged Invoices:", rearrangedInvoices);

//     // Step 3: Assign invoice numbers
//     const seriesCounters = { BDS: 1000, SER: 1000 };
//     const updatedInvoices = assignInvoiceNumbersBySeries(rearrangedInvoices, seriesCounters);
//     console.log("Updated Invoices with Numbers:", updatedInvoices);

//     // Step 4: Write to database using node-appwrite
//     for (const series of Object.keys(updatedInvoices)) {
//       for (const jobCard of updatedInvoices[series]) {
//         await updateInvoicesInDatabase(jobCard.invoices);
//       }
//     }

//     return NextResponse.json({ message: "Invoices reassigned successfully!" });
//   } catch (error) {
//     console.error("Error in reassigning invoices:", error);
//     return NextResponse.json({ message: "Error during execution", error });
//   }
// }
// export const groupInvoicesByJobCardAndSeries = async () => {
//   try {
//     // Fetch all invoices
//     const invoices = await databases.listDocuments(
//       config.databaseId,
//       config.invoicesCollectionId,
//       [Query.limit(99999), Query.orderDesc("$createdAt")]
//     );

//     console.log("GGGGG", invoices);

//     const x = 0;

//     // Group by jobCardId and invoiceSeries
//     const groupedInvoices = invoices.documents.reduce(
//       (acc: any, invoice: any) => {
//         const { jobCardId, invoiceSeries } = invoice;

//         if (!acc[invoiceSeries]) {
//           acc[invoiceSeries] = {};
//         }
//         if (!acc[invoiceSeries][jobCardId]) {
//           acc[invoiceSeries][jobCardId] = [];
//         }

//         acc[invoiceSeries][jobCardId].push(invoice);
//         return acc;
//       },
//       {}
//     );

//     console.log(groupedInvoices);

//     return groupedInvoices;
//   } catch (error) {
//     console.error("Error fetching and grouping invoices by series:", error);
//     return {};
//   }
// };

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
//   console.log("Final Unique Invoices:", uniqueInvoices);

//   return uniqueInvoices; // Return only the latest invoices
// };

// export const assignInvoiceNumbersBySeries = (
//   groupedInvoices: Record<string, { jobCardId: string; invoices: any[] }[]>,
//   seriesCounters: any
// ) => {
//   // Deep clone to avoid shared references
//   const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));
//   const clonedGroupedInvoices = deepClone(groupedInvoices);

//   Object.keys(clonedGroupedInvoices).forEach((series) => {
//     const jobCards = clonedGroupedInvoices[series];

//     jobCards.forEach((jobCard: any) => {
//       const { jobCardId, invoices } = jobCard;

//       // Step 1: Check if the job card has insurance
//       const hasInsurance = invoices.some(
//         (invoice: any) => invoice.isInsuranceInvoice
//       );

//       // Step 4: Assign invoice numbers and codes
//       invoices.forEach((invoice: any) => {
//         const { invoiceType, isInsuranceInvoice, insuranceInvoiceType } =
//           invoice;

//         if (invoiceType === "Quote") {
//           // Assign number for Quotes
//           invoice.invoiceNumber = seriesCounters[series];
//           invoice.invoiceCode = `${series}/${seriesCounters[series]}`;
//         } else if (
//           invoiceType === "Pro-Forma Invoice" ||
//           invoiceType === "Tax Invoice"
//         ) {
//           if (!isInsuranceInvoice || insuranceInvoiceType === "Customer") {
//             // Assign number for Customer Pro-Forma or Tax Invoice
//             invoice.invoiceNumber = seriesCounters[series];
//             invoice.invoiceCode = `${series}/${seriesCounters[series]}`;
//           } else if (
//             isInsuranceInvoice &&
//             insuranceInvoiceType === "Insurance"
//           ) {
//             // Assign number for Insurance Pro-Forma or Tax Invoice
//             invoice.invoiceNumber = seriesCounters[series] + 1;
//             invoice.invoiceCode = `${series}/${seriesCounters[series] + 1}`;
//           }
//         }
//       });

//       // Step 5: Increment counters for the next jobCardId in this series
//       if (hasInsurance) {
//         // If there's insurance, increment by 2
//         seriesCounters[series] += 2;
//       } else {
//         // Otherwise, increment by 1
//         seriesCounters[series] += 1;
//       }

//       // Save the updated invoices back to clonedGroupedInvoices
//       // clonedGroupedInvoices[series][jobCardId] = latestInvoices.map(
//       //   (invoice: any) => ({
//       //     ...invoice,
//       //     invoiceNumber: invoice.invoiceNumber,
//       //     invoiceCode: invoice.invoiceCode,
//       //   })
//       // );
//     });
//   });

//   // Return the cloned and updated groupedInvoices
//   return clonedGroupedInvoices;
// };

// export const reassignInvoiceNumbers = async () => {
//   try {
//     // Step 1: Fetch and group invoices by series and jobCardId
//     const groupedInvoices = await groupInvoicesByJobCardAndSeries();
//     console.log("Grouped Invoices BEFORE Assignment:", groupedInvoices);

//     // Step 2: Track counters separately for each series
//     const seriesCounters = { BDS: 1000, SER: 1000 };

//     const x = rearrangeJobCardsByDate(groupedInvoices);

//     // Step 3: Assign invoice numbers
//     const updatedGroupedInvoices = assignInvoiceNumbersBySeries(
//       x,
//       seriesCounters
//     );

//     console.log("FFFF", updatedGroupedInvoices);

//     // Step 4: Update the database with new invoice numbers
//     // Object.keys(updatedGroupedInvoices).forEach((series) => {
//     //   Object.values(updatedGroupedInvoices[series]).forEach((invoices) => {
//     //     updateInvoicesInDatabase(invoices);
//     //   });
//     // });

//     Object.keys(updatedGroupedInvoices).forEach((series) => {
//       const jobCards = updatedGroupedInvoices[series];

//       jobCards.forEach(async (jobCard: any) => {
//         try {
//           await updateInvoicesInDatabase(jobCard.invoices);
//         } catch (err) {
//           console.error(
//             `Failed to update invoices for jobCard ${jobCard.jobCardId}`,
//             err
//           );
//         }
//       });
//     });

//     console.log("Invoice numbers reassigned successfully!");
//   } catch (error) {
//     console.error("Error reassigning invoice numbers:", error);
//   }
// };

// export const rearrangeJobCardsByDate = (
//   groupedInvoices: Record<string, Record<string, any[]>>
// ) => {
//   const sortInvoicesByDate = (invoices: any[]) =>
//     invoices.sort(
//       (a, b) =>
//         new Date(a.$createdAt).getTime() - new Date(b.$createdAt).getTime()
//     );

//   const rearrangedDivisions: Record<
//     string,
//     { jobCardId: string; invoices: any[] }[]
//   > = {};

//   // Process each division (SER, BDS, etc.)
//   Object.keys(groupedInvoices).forEach((division) => {
//     const jobCards = groupedInvoices[division];

//     // Sort job cards based on the earliest $createdAt date of their invoices
//     const sortedJobCards = Object.entries(jobCards)
//       .map(([jobCardId, invoices]) => {
//         if (!Array.isArray(invoices) || invoices.length === 0) {
//           throw new Error(`Invoices for job card ${jobCardId} are invalid.`);
//         }

//         // Sort invoices within the job card
//         const sortedInvoices = sortInvoicesByDate(invoices);

//         // Return the job card with its earliest creation date
//         return {
//           jobCardId,
//           invoices: sortedInvoices,
//           earliestDate: new Date(sortedInvoices[0]?.$createdAt).getTime(),
//         };
//       })
//       .sort((a, b) => a.earliestDate - b.earliestDate); // Sort job cards by earliest invoice date

//     // Save sorted job cards as an array to preserve order
//     rearrangedDivisions[division] = sortedJobCards.map(
//       ({ jobCardId, invoices }) => ({
//         jobCardId,
//         invoices,
//       })
//     );
//   });

//   return rearrangedDivisions;
// };

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// // const updateInvoicesInDatabase = async (
// //   invoices: any,
// //   rateLimitDelay = 1000
// // ) => {
// //   try {
// //     for (const invoice of invoices) {
// //       await databases.updateDocument(
// //         config.databaseId,
// //         config.invoicesCollectionId,
// //         invoice.$id,
// //         {
// //           invoiceNumber: invoice.invoiceNumber,
// //           invoiceCode: invoice.invoiceCode,
// //         }
// //       );

// //       console.log(`Updated Invoice: ${invoice.invoiceCode}`);

// //       // Wait before making the next request to avoid hitting the rate limit
// //       await delay(rateLimitDelay);
// //     }
// //   } catch (error) {
// //     console.error("Error updating invoices in database:", error);
// //   }
// // };