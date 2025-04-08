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
    const { verificationResult }: { verificationResult: boolean } =
      await request.json();
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}
