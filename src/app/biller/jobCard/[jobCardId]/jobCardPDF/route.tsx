import {
  createInvoice,
  getJobCardById,
  getTempCarById,
  imagekit,
  uploadPDF,
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
import { JobCardPDF } from "@/components/JobCardTest";

export async function POST(
  request: NextRequest,
  { params }: { params: { jobCardId: any } }
) {
  //   console.log("BODY", request.body);
  try {
    const { jobCard, car } = await request.json();

    // console.log("VALUES", jobCard, car);

    const stream = await renderToStream(
      <JobCardPDF
        jobCard={jobCard}
        logo={base64Logo}
        marutiLogo={base64MarutiLogo}
        car={car}
        invoiceType={"Job Card"}
      />
    );
    // Upload the buffer to ImageKit
    // const uploadResponse = await imagekit.upload({
    //   file: buffer, // Buffer object
    //   fileName: `${params.jobCardId}_jobCard_${uniqueStr}.pdf`, // Name of the file
    //   folder: "/pdfs/", // Optional folder
    //   useUniqueFileName: false, // Ensure file name uniqueness
    //   isPrivateFile: false, // If you want a public URL
    // });

    const buffer = await streamToBuffer(stream);

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let uniqueStr = "";

    for (let i = 0; i <= 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uniqueStr += characters.charAt(randomIndex);
    }

    const uploadResponse = await uploadPDF(
      buffer,
      `${params.jobCardId}_jobCard_${uniqueStr}.pdf`
    );

    // Get the URL of the uploaded PDF
    const pdfUrl = uploadResponse?.downloadUrl;

    console.log("PDF uploaded to ImageKit, URL:", pdfUrl);

    return NextResponse.json([pdfUrl], { status: 201 });

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
