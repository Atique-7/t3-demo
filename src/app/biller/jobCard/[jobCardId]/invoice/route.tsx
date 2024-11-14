import {
  createInvoice,
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
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { InvoicePDF } from "@/components/InvoiceTest";
import { renderToStream } from "@react-pdf/renderer";
import { CurrentLabour, CurrentPart } from "@/lib/definitions";

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

    console.log(
      "VALUES",
      jobCard,
      car,
      currentParts,
      currentLabour,
      currentJobCardStatus
    );

    const foundIndexParts = currentParts.findIndex(
      (part: CurrentPart) =>
        part.insurancePercentage && part.insurancePercentage != 0
    );

    const foundIndexLabour = currentLabour.findIndex(
      (work: CurrentLabour) =>
        work.insurancePercentage && work.insurancePercentage != 0
    );

    const isInsurance = foundIndexParts != -1 || foundIndexLabour != -1;

    console.log("THIS INVOICE HAS INSURANCE", isInsurance);

    let invoiceType = invoiceTypes.find(
      (a) => a.code == currentJobCardStatus + 1
    );

    let invoiceTypeString = invoiceType?.description;

    console.log("THIS IS THE INVOICE TYPE - ", invoiceTypeString);

    const povs = convertStringsToArray(car.purposeOfVisitAndAdvisors);

    if (isInsurance && invoiceTypeString != "Quote") {
      const stream1 = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={invoiceCounter}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          isCutomer={true}
        />
      );

      const buffer1 = await streamToBuffer(stream1);

      const stream2 = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={invoiceCounter}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
          isCutomer={false}
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

      // Upload the buffer to ImageKit
      const uploadResponse1 = await imagekit.upload({
        file: buffer1, // Buffer object
        fileName: `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr1}_Customer.pdf`, // Name of the file
        folder: "/pdfs/", // Optional folder
        useUniqueFileName: false, // Ensure file name uniqueness
        isPrivateFile: false, // If you want a public URL
      });

      const uploadResponse2 = await imagekit.upload({
        file: buffer2, // Buffer object
        fileName: `${
          params.jobCardId
        }_${invoiceTypeString?.toLowerCase()}_${uniqueStr1}_Insurance.pdf`, // Name of the file
        folder: "/pdfs/", // Optional folder
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
        invoiceCode
      );

      let result2 = await createInvoice(
        pdfUrl2,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        invoiceCounter,
        invoiceSeries,
        invoiceCode
      );

      console.log("This is the result - ", result1, result2);
    } else {
      const stream = await renderToStream(
        <InvoicePDF
          jobCard={jobCard}
          parts={currentParts}
          labour={currentLabour}
          logo={base64Logo}
          car={car}
          currentDate={new Date()}
          invoiceType={invoiceTypeString}
          invoiceNumber={invoiceCounter}
          purposeOfVisitAndAdvisors={povs}
          isInsurance={isInsurance}
        />
      );

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
        folder: "/pdfs/", // Optional folder
        useUniqueFileName: false, // Ensure file name uniqueness
        isPrivateFile: false, // If you want a public URL
      });

      // Get the URL of the uploaded PDF
      const pdfUrl = uploadResponse.url;

      console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

      // Determine the series based on job card purpose of visit
      const invoiceSeries =
        jobCard.purposeOfVisit === "BodyShop" ? "bds" : "src";

      // Create a new ReadableStream from the buffer for the response
      let result = await createInvoice(
        pdfUrl,
        jobCard.$id,
        jobCard.carNumber,
        invoiceTypeString!,
        invoiceCounter,
        invoiceSeries,
        invoiceCode
      );

      console.log("This is the result - ", result);

      return NextResponse.json(result, { status: 201 });
    }

    // return;
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
