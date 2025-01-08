import {
  createInvoice,
  getAllInvoices,
  getInvoiceNumber,
  getInvoiceUrl,
  uploadInvoice,
} from "@/lib/appwrite";
import {
  base64Logo,
  invoiceTypes,
  streamToBuffer,
  convertStringsToArray,
  base64MarutiLogo,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { InvoicePDF } from "@/components/InvoiceTest";
import { renderToStream } from "@react-pdf/renderer";
import { CurrentLabour, CurrentPart, Invoice } from "@/lib/definitions";

export const maxDuration = 30; // This function can run for a maximum of 5 seconds
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { jobCardId: any } }
) {
  try {
    const {
      jobCard,
      car,
      currentParts,
      currentLabour,
      currentJobCardStatus,
      invoiceSeries,
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
    let invoiceType = invoiceTypes.find(
      (a) => a.code == currentJobCardStatus + 1
    );
    let invoiceTypeString: any = invoiceType?.description;
    const invoices = await getAllInvoices();
    const jobCardInvoicesArr = invoices.documents.filter(
      (invoice: Invoice) => invoice.jobCardId == params.jobCardId
    );
    let isUpdatedInvoice = false;
    jobCardInvoicesArr.map((invoice: Invoice) => {
      if (invoice.invoiceType == invoiceTypeString) {
        isUpdatedInvoice = true;
        return;
      }
    });
    const povs = convertStringsToArray(car.purposeOfVisitAndAdvisors);

    if (isInsurance && invoiceTypeString != "Quote") {
      let customerInvoice, insuranceInvoice;
      customerInvoice = await getInvoiceNumber(
        jobCard.$id,
        invoiceTypeString,
        false,
        invoiceSeries
      );

      insuranceInvoice = await getInvoiceNumber(
        jobCard.$id,
        invoiceTypeString,
        true,
        invoiceSeries
      );

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
          invoiceNumber={customerInvoice?.invoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          liabilityType={"Customer"}
        />
      );

      const buffer1 = await streamToBuffer(stream1);

      // Convert the buffer into a Blob
      const blob1 = new Blob([buffer1], { type: "application/pdf" });

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

      // Create a File object (ensure 'File' is available in your environment)
      const file1 = new File(
        [blob1],
        `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr1}_Customer.pdf`,
        { type: "application/pdf" }
      );

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
          invoiceNumber={insuranceInvoice?.invoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          liabilityType={"Insurance"}
        />
      );

      const buffer2 = await streamToBuffer(stream2);

      // Convert the buffer into a Blob
      const blob2 = new Blob([buffer2], { type: "application/pdf" });

      // Create a File object (ensure 'File' is available in your environment)
      const file2 = new File(
        [blob2],
        `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr2}_Insurance.pdf`,
        {
          type: "application/pdf",
        }
      );

      const uploadResult1 = await uploadInvoice(file1);
      const uploadResult2 = await uploadInvoice(file2);

      const fileResult1 = await getInvoiceUrl(uploadResult1.$id);
      const fileResult2 = await getInvoiceUrl(uploadResult2.$id);

      // Get the URL of the uploaded PDF
      const pdfUrl1 = fileResult1.href;
      const pdfUrl2 = fileResult2.href;

      // Create a new ReadableStream from the buffer for the response

      let result1 = await createInvoice(
        pdfUrl1,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        customerInvoice?.invoiceNumber,
        invoiceSeries,
        customerInvoice?.invoiceCode,
        isUpdatedInvoice,
        "Customer",
        isInsurance
      );

      let result2 = await createInvoice(
        pdfUrl2,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        insuranceInvoice?.invoiceNumber,
        invoiceSeries,
        insuranceInvoice?.invoiceCode,
        isUpdatedInvoice,
        "Insurance",
        isInsurance
      );

      // console.log("This is the result - ", result1, result2);

      return NextResponse.json([result1, result2], { status: 201 });
    } else {
      // console.log("There is no insurance or ITS QUOTE");
      let customerInvoice = await getInvoiceNumber(
        jobCard.$id,
        invoiceTypeString,
        false,
        invoiceSeries
      );

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
          invoiceNumber={customerInvoice?.invoiceCode}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={false}
        />
      );

      // console.log("THIS IS THE STREAM", stream);

      const buffer = await streamToBuffer(stream);

      // Convert the buffer into a Blob
      const blob = new Blob([buffer], { type: "application/pdf" });

      // Create a File object (ensure 'File' is available in your environment)

      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let uniqueStr = "";

      for (let i = 0; i <= 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueStr += characters.charAt(randomIndex);
      }

      const file = new File(
        [blob],
        `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr}.pdf`,
        { type: "application/pdf" }
      );

      const uploadResult = await uploadInvoice(file);
      console.log("Upload Result", uploadResult);

      // // Upload the buffer to ImageKit
      // const uploadResponse = await imagekit.upload({
      //   file: buffer, // Buffer object
      //   fileName: `${
      //     params.jobCardId
      //   }_${invoiceTypeString?.toLowerCase()}_${uniqueStr}.pdf`, // Name of the file
      //   //folder: `/Invoices/${invoiceTypeString}`, // Optional folder
      //   useUniqueFileName: true, // Ensure file name uniqueness
      //   isPrivateFile: false, // If you want a public URL
      // });

      // Get the URL of the uploaded PDF
      const fileResult = await getInvoiceUrl(uploadResult.$id);
      const pdfUrl = fileResult.href;

      console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

      // // Create a new ReadableStream from the buffer for the response
      let result = await createInvoice(
        pdfUrl,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        customerInvoice?.invoiceNumber,
        invoiceSeries,
        customerInvoice?.invoiceCode,
        isUpdatedInvoice
      );

      // console.log("This is the result - ", result);

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
