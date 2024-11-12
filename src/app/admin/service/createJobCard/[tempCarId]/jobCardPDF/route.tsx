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
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { GatePassPDF } from "@/components/GatePassTest";

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
    } = await request.json();

    console.log(
      "VALUES",
      jobCard,
      car,
      currentParts,
      currentLabour,
      currentJobCardStatus
    );

    const stream = await renderToStream(
      <GatePassPDF
        jobCard={jobCard}
        parts={currentParts}
        labour={currentLabour}
        logo={base64Logo}
        car={car}
        currentDate={new Date()}
        invoiceType={"Job Card"}
        invoiceNumber={invoiceCounter}
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
      fileName: `${params.jobCardId}_gatePass_${uniqueStr}.pdf`, // Name of the file
      folder: "/pdfs/", // Optional folder
      useUniqueFileName: false, // Ensure file name uniqueness
      isPrivateFile: false, // If you want a public URL
    });

    // Get the URL of the uploaded PDF
    const pdfUrl = uploadResponse.url;

    console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

    // Create a new ReadableStream from the buffer for the response
    //let result = await updateJobCardGatePass(jobCard.$id, pdfUrl);

    //console.log("This is the result - ", result);

    //return NextResponse.json(result, { status: 201 });

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
