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

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${params.jobCardId}_jobCard.pdf"`,
      },
    });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
