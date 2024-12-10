import {
  createInvoice,
  getAllInvoices,
  getInvoicesByJobCardId,
  getJobCardById,
  getTempCarById,
  imagekit,
} from "@/lib/appwrite";
import {
  base64Logo,
  invoiceTypes,
  streamToBuffer,
  convertStringsToArray,
  stringToObj,
  base64MarutiLogo,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { InvoicePDF } from "@/components/InvoiceTest";
import { renderToStream } from "@react-pdf/renderer";
import { CurrentLabour, CurrentPart, Invoice } from "@/lib/definitions";
import { Console } from "console";

export const maxDuration = 30; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { jobCardId: any } }
) {
  //   console.log("BODY", request.body);
  try {
    const {
      jobCard,
      car,
      currentParts,
      currentLabour,
      currentJobCardStatus,
      invoiceCounter,
      invoiceSeries,
      invoiceCode,
    } = await request.json();

    const foundIndexParts = currentParts.findIndex(
      (part: CurrentPart) =>
        part.insurancePercentage && part.insurancePercentage != 0
    );

    const foundIndexLabour = currentLabour.findIndex(
      (work: CurrentLabour) =>
        work.insurancePercentage && work.insurancePercentage != 0
    );

    const isInsurance = foundIndexParts !== -1 || foundIndexLabour !== -1;

    // console.log("THIS INVOICE HAS INSURANCE", isInsurance);

    let invoiceType = invoiceTypes.find(
      (a) => a.code == currentJobCardStatus + 1
    );

    const insuranceInvoiceCode = `${invoiceSeries}/${invoiceCounter + 1}`;

    let invoiceTypeString = invoiceType?.description;

    const invoices = await getAllInvoices();

    const jobCardInvoicesArr = invoices.documents.filter(
      (invoice: Invoice) => invoice.jobCardId == params.jobCardId
    );
    const customerInvoices = jobCardInvoicesArr.filter(
      (invoice: Invoice) => !invoice.isInsuranceInvoice
    );

    let baseInvoiceNumber = invoiceCounter; // Fallback

    if (customerInvoices.length > 0) {
      customerInvoices.sort(
        (a: Invoice, b: Invoice) => b.invoiceNumber - a.invoiceNumber
      );
      baseInvoiceNumber = customerInvoices[0].invoiceNumber;
    }

    let isUpdatedInvoice = false;

    jobCardInvoicesArr.map((invoice: Invoice) => {
      if (invoice.invoiceType == invoiceTypeString) {
        isUpdatedInvoice = true;
        return;
      }
    });

    const povs = convertStringsToArray(car.purposeOfVisitAndAdvisors);

    if (isInsurance && invoiceTypeString != "Quote") {
      const customerInvoiceCode = `${invoiceSeries}/${baseInvoiceNumber}`;
      const insuranceInvoiceCode = `${invoiceSeries}/${baseInvoiceNumber + 1}`;
      const stream1 = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          marutiLogo={base64MarutiLogo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={customerInvoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          liabilityType={"Customer"}
        />
      );

      const buffer1 = await streamToBuffer(stream1);

      const stream2 = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          marutiLogo={base64MarutiLogo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={insuranceInvoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          liabilityType={"Insurance"}
        />
      );

      const buffer2 = await streamToBuffer(stream2);

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      let uniqueStr1 = "";
      let uniqueStr2 = "";

      for (let i = 0; i <= 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueStr1 += characters.charAt(randomIndex);
      }

      for (let i = 0; i <= 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueStr2 += characters.charAt(randomIndex);
      }

      console.log(
        `/Invoices/${invoiceTypeString?.slice(
          0,
          -8
        )}/InsuranceInvoices/Insurance`
      );

      // Upload the buffer to ImageKit
      const uploadResponse1 = await imagekit.upload({
        file: buffer1, // Buffer object
        fileName: `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr1}_Customer.pdf`, // Name of the file
        // folder: `/Invoices/${invoiceTypeString?.slice(
        //   0,
        //   -8
        // )}/InsuranceInvoices/Customer`, // Optional folder
        useUniqueFileName: false, // Ensure file name uniqueness
        isPrivateFile: false, // If you want a public URL
      });

      const uploadResponse2 = await imagekit.upload({
        file: buffer2, // Buffer object
        fileName: `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr2}_Insurance.pdf`, // Name of the file
        // folder: `/Invoices/${invoiceTypeString?.slice(
        //   0,
        //   -8
        // )}/InsuranceInvoices/Insurance`, // Optional folder
        useUniqueFileName: false, // Ensure file name uniqueness
        isPrivateFile: false, // If you want a public URL
      });

      // Get the URL of the uploaded PDF
      const pdfUrl1 = uploadResponse1.url;
      const pdfUrl2 = uploadResponse2.url;

      console.log("PDF uploaded to ImageKit, URL:", pdfUrl1, pdfUrl2);

      // Create a new ReadableStream from the buffer for the response

      let result1 = await createInvoice(
        pdfUrl1,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        invoiceCounter,
        invoiceSeries,
        customerInvoiceCode,
        isUpdatedInvoice,
        "Customer"
      );

      let result2 = await createInvoice(
        pdfUrl2,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        invoiceCounter + 1,
        invoiceSeries,
        insuranceInvoiceCode,
        isUpdatedInvoice,
        "Insurance",
        isInsurance
      );

      console.log("This is the result - ", result1, result2);

      return NextResponse.json([result1, result2], { status: 201 });
    } else {
      // console.log("There is no insurance or ITS QUOTE");
      const invoiceCode = `${invoiceSeries}/${baseInvoiceNumber}`;

      const stream = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          marutiLogo={base64MarutiLogo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={invoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={false}
        />
      );

      // console.log("THIS IS THE STREAM", stream);

      const buffer = await streamToBuffer(stream);

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let uniqueStr = "";

      for (let i = 0; i <= 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueStr += characters.charAt(randomIndex);
      }

      // Upload the buffer to ImageKit
      const uploadResponse = await imagekit.upload({
        file: buffer, // Buffer object
        fileName: `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr}.pdf`, // Name of the file
        //folder: `/Invoices/${invoiceTypeString}`, // Optional folder
        useUniqueFileName: true, // Ensure file name uniqueness
        isPrivateFile: false, // If you want a public URL
      });

      // Get the URL of the uploaded PDF
      const pdfUrl = uploadResponse.url;

      console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

      // // Create a new ReadableStream from the buffer for the response
      let result = await createInvoice(
        pdfUrl,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        invoiceCounter,
        invoiceSeries,
        invoiceCode,
        isUpdatedInvoice
      );

      console.log("This is the result - ", result);

      return NextResponse.json([result], { status: 201 });
    }
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
