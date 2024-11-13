import {
  getAllInvoices,
  getAllTaxInvoicesAfterDateTime,
  getJobCardById,
} from "@/lib/appwrite";
import { Invoice } from "@/lib/definitions";
import { stringToObj } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  //   console.log("BODY", request.body);
  try {
    const dateTimeStamp = await request.json();

    const result = await getAllInvoices();

    const newInvoices = result.documents.slice(0, 5);

    console.log("THESE ARE THE NEW INVOICES ROUTREEEEEEE", newInvoices);

    const updatedNewInvoices = await Promise.all(
      newInvoices.map(async (invoice: Invoice, index: number) => {
        let result = await getJobCardById(invoice.jobCardId);
        result.parts = stringToObj(result.parts);
        result.labour = stringToObj(result.labour);
        result.taxes = stringToObj(result.taxes);

        invoice.jobCardDetails = result;

        return invoice;
      })
    );

    return NextResponse.json(updatedNewInvoices, { status: 201 });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
