import {
  getAllTaxInvoicesAfterDateTime,
  getCarByCarNumber,
  getJobCardById,
} from "@/lib/appwrite";
import { Invoice, JobCard } from "@/lib/definitions";
import {
  createInvoiceObj,
  createInvoiceObjReport,
  curateInvoices,
  roundDecimal,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("BODY", body);

    const dateTimeStamp = body.data.lastSync;

    const result = await getAllTaxInvoicesAfterDateTime(dateTimeStamp);

    const newInvoices = result.documents;

    const curatedInvoices = curateInvoices(newInvoices);

    const updatedNewInvoices = await Promise.all(
      curatedInvoices.map(async (invoice: Invoice, index: number) => {
        // console.log("INVOICE", invoice.invoiceCode);

        let result: JobCard = await getJobCardById(invoice.jobCardId);

        let carObj = await getCarByCarNumber(result.carNumber);

        const totals = await createInvoiceObjReport(result, invoice);

        const returnObj = {
          invoiceCode: invoice.invoiceCode,
          billType: invoice.invoiceType,
          customerName: result.customerName,
          mobileNo: result.customerPhone,
          vehicleRegNo: result.carNumber,
          model: carObj.carModel,
          roNo: result.jobCardNumber,
          roDate: invoice.invoiceDate,
          serviceAdvisor: result.serviceAdvisorID,
          totalAmt: roundDecimal(
            Number(totals.partsTotal) + Number(totals.labourTotal)
          ),
          labourAmt: Number(totals.labourTotal),
          partAmt: Number(totals.partsTotal),
          workType: result.purposeOfVisit,

          roundOff: totals.invoice.jobCardDetails!.roundOffValue,
          totalDisc: roundDecimal(
            Number(totals.partsDiscount) + Number(totals.labourDiscount)
          ),
          partDisc: Number(totals.partsDiscount),
          labourDisc: Number(totals.labourDiscount),
          insCompName: "",
        };

        if (
          invoice.isInsuranceInvoice &&
          invoice.insuranceInvoiceType === "Insurance"
        ) {
          returnObj.insCompName = totals.invoice.jobCardDetails!.customerName;
        }

        return returnObj;
      })
    );

    const returnInvoicesObj = { invoices: updatedNewInvoices };

    return NextResponse.json(returnInvoicesObj, { status: 201 });
  } catch (e) {
    console.log(e);
  }
}
