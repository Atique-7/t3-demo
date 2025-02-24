import { getAllTaxInvoicesAfterDateTime, getJobCardById } from "@/lib/appwrite";
import { Invoice, JobCard } from "@/lib/definitions";
import { createInvoiceObj, curateInvoices } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let trueCounter = 0;
    let falseCounter = 0;

    const body = await request.json();
    console.log("BODY", body);

    const dateTimeStamp = body.data.lastSync;

    const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp);

    const newInvoices = result.documents;

    const curatedInvoices = curateInvoices(newInvoices);

    const updatedNewInvoices = await Promise.all(
      curatedInvoices.map(async (invoice: Invoice, index: number) => {
        let result: JobCard = await getJobCardById(invoice.jobCardId);

        invoice = await createInvoiceObj(result, invoice);

        if (invoice.isUpdatedInvoice) {
          trueCounter++;
        } else {
          falseCounter++;
        }

        return invoice;
      })
    );

    const returnInvoicesObj = { invoices: updatedNewInvoices };

    console.log("TRUE", trueCounter);
    console.log("FALSE", falseCounter);

    return NextResponse.json(returnInvoicesObj, { status: 201 });
  } catch (e) {
    console.log(e);
  }
}
