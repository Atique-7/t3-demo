import { NextRequest, NextResponse } from "next/server";
import { Client, Databases, Query } from "node-appwrite";

// Initialize Appwrite Client
const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint("https://cloud.appwrite.io/v1") 
  .setProject("67cbecaa002877aff9d1") 
  .setKey("standard_6c561ebb631cc7217e78905352cb1deb1e9279eb71678973ae0f1aff1cd1331fadcd650b6ad827adf01a2926d05c153db447f9926cd4da448ab129086ca45b836f90f8bacc3e1097c689b07971c05ed0fb9e697c3e58c21196edfad50e25f2644d26824d832e608bc8e69bfbd1df5918fe70a5f480abf4ca255ade07f2600703"); 

  export async function POST(req: NextRequest, res:NextResponse) {

  try {
    // Extract input from the request body
    const body = await req.json();
    const { jobCardId, invoiceType, isInsuranceInvoice, series } = body;

    if (!jobCardId || !series || !invoiceType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Step 1: Fetch existing invoices for the job card
    const existingInvoices = await databases.listDocuments(
      "67cbf28e001bd9202750",
      "67d7de6300233b0a014f",
      [Query.equal("jobCardId", jobCardId), Query.equal("invoiceSeries", series)]
    );

    let customerInvoiceNumber: number | null = null;
    let insuranceInvoiceNumber: number | null = null;

    // Check existing invoices
    existingInvoices.documents.forEach((inv) => {
      if (!inv.isInsuranceInvoice) {
        customerInvoiceNumber = inv.invoiceNumber; // Reuse customer invoice number
      } else if (inv.isInsuranceInvoice) {
        insuranceInvoiceNumber = inv.invoiceNumber; // Track insurance invoice number
      }
    });

    // Step 2: Get or initialize the global counter for the series
    const counterId = `counter_${series}`;
    let globalCounter;

    try {
      globalCounter = await databases.getDocument(
        "67cbf28e001bd9202750",
        "67d7de6e002d1723d043",
        counterId
      );
    } catch (error) {
      // Initialize the counter if it doesn't exist
      globalCounter = await databases.createDocument(
        "67cbf28e001bd9202750",
        "67d7de6e002d1723d043",
        counterId,
        { series, currentNumber: 1000 }
      );
    }

    // Step 3: Determine the invoice number
    let invoiceNumber;

    if (invoiceType === "Quote") {
      // Reuse the customer invoice number or generate a new one
      invoiceNumber = customerInvoiceNumber || globalCounter.currentNumber + 1;
    } else if (isInsuranceInvoice) {
      // Insurance invoices get a new global number
      invoiceNumber = insuranceInvoiceNumber || globalCounter.currentNumber + 1;
    } else {
      // For customer Pro-Forma or Tax Invoices, reuse the Quote number
      invoiceNumber = customerInvoiceNumber || globalCounter.currentNumber + 1;
    }

    // Step 4: Update the global counter if a new number is used
    if (invoiceNumber > globalCounter.currentNumber) {
      await databases.updateDocument(
        "67cbf28e001bd9202750",
        "67d7de6e002d1723d043",
        counterId,
        { currentNumber: invoiceNumber }
      );
    }

    // Step 5: Generate the invoice code
    const invoiceCode = `${series}/${invoiceNumber}`;

    // Step 6: Return the response
    return NextResponse.json({
      invoiceNumber,
      invoiceCode,
      message: "Invoice number generated successfully",
    });
  } catch (error) {
    console.error("Error generating invoice number:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
