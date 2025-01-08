import {
  createInvoice,
  getInvoiceUrl,
  getJobCardById,
  getTempCarById,
  imagekit,
  updateJobCardGatePassDetails,
  updateTempCarById,
  uploadInvoice,
  //updateJobCardGatePass,
} from "@/lib/appwrite";
import {
  base64Logo,
  base64MarutiLogo,
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
    const { jobCard, car, currentParts, currentLabour, currentJobCardStatus } =
      await request.json();

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
        marutiLogo={base64MarutiLogo}
        car={car}
        currentDate={new Date()}
        invoiceType={"Gate Pass"}
      />
    );

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
      `${params.jobCardId}_gatePass_${uniqueStr}.pdf`,
      { type: "application/pdf" }
    );

    const uploadResult = await uploadInvoice(file);
    console.log("Upload Result", uploadResult);

    const fileResult = await getInvoiceUrl(uploadResult.$id);
    const pdfUrl = fileResult.href;

    console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

    // Create a new ReadableStream from the buffer for the response
    let result = await updateJobCardGatePassDetails(jobCard.$id, pdfUrl);

    const tempCar = await getTempCarById(jobCard.carId);
    const allJobCardIds = tempCar.allJobCardIds;

    const checkGatePasses = async (allJobCardIds: any[]): Promise<boolean> => {
      if (allJobCardIds.length > 1) {
        for (const jobCardId of allJobCardIds) {
          const jobcard = await getJobCardById(jobCardId);
          const gatePass = jobcard.gatePassPDF;
          if (gatePass === null) {
            return false; // Return false immediately if any gatePass is null
          }
        }
      }
      return true; // Return true if all gatePasses are non-null
    };

    if ((await checkGatePasses(allJobCardIds)) === true) {
      await updateTempCarById(jobCard.carId, 2);
    }

    console.log("This is the result - ", result);

    return NextResponse.json(pdfUrl, { status: 201 });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
