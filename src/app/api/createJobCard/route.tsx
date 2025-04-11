import { getInvoiceUrl, updateJobCardPDF, uploadInvoice } from "@/lib/appwrite";
import {
  base64Logo,
  base64MarutiLogo,
  streamToBuffer,
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { JobCardPDF } from "@/components/JobCardTest";
import { Car, JobCard } from "@/lib/definitions";

export async function POST(request: NextRequest) {
  //   console.log("BODY", request.body);
  try {
    const { jobCard, car }: { jobCard: JobCard; car: Car } =
      await request.json();

    console.log("THIS IS THE JOBCARD", jobCard);

    // if (typeof jobCard.images[0] === "string") {
    //   const newImages = stringToObj(jobCard.images);
    //   console.log("CHANGED IMAGES", newImages);
    //   // jobCard.images = newImages;
    //   console.log("STRING HAI");
    // } else {
    //   ("STRING NAHI HAI");
    // }

    // console.log("VALUES", jobCard.images);

    const stream = await renderToStream(
      <JobCardPDF
        jobCard={jobCard}
        logo={base64Logo}
        marutiLogo={base64MarutiLogo}
        car={car}
        invoiceType={"Job Card"}
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

    const file = new File([blob], `${jobCard.$id}_jobCard_${uniqueStr}.pdf`, {
      type: "application/pdf",
    });

    const uploadResult = await uploadInvoice(file);
    // console.log("Upload Result", uploadResult);

    // Get the URL of the uploaded PDF
    const fileResult = await getInvoiceUrl(uploadResult.$id);
    const pdfUrl = fileResult.href;

    // console.log("PDF uploaded to APPWRITE, URL:", pdfUrl);

    await updateJobCardPDF(jobCard.$id, pdfUrl);

    // console.log(isDone);
    // if (isDone) {
    //   toast("Observation and Remarks have been Updated \u2705");
    // }

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
