import {
  getAllInvoices,
  getAllParts,
  getAllTaxInvoicesAfterDateTime,
  getJobCardById,
} from "@/lib/appwrite";
import {
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
} from "@/lib/definitions";
import {
  createTaxObj,
  preciseOperation,
  roundToTwoDecimals,
  splitInsuranceAmt,
  stringToObj,
} from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // console.log("BODY", request.body);
  try {
    const body = await request.json();
    // console.log(body);

    const partsArr = body.data.items;

    const checkArr = partsArr.slice(0, 5);

    const prevPartsArr = await getAllParts();

    // console.log(prevPartsArr);

    const naRemovedParts = partsArr.filter(
      (item: any) =>
        !(
          (parseFloat(item.item_msp_rate) === 0 &&
            parseFloat(item.item_rate) === 0) ||
          item.part_no == "null" ||
          (parseFloat(item.cgst) == 0 && parseFloat(item.sgst))
        )
    );

    const cleanedPartsArr = naRemovedParts.map((item: any) => ({
      partName: item.name,
      partNumber: item.part_no || "",
      category: item.group || "",
      hsn: item.hsn || "",
      cgst: parseFloat(item.cgst) || 0.0,
      sgst: parseFloat(item.sgst) || 0.0,
      gst: parseFloat(item.cgst || 0) + parseFloat(item.sgst || 0),
      mrp: parseFloat(item.item_msp_rate) || parseFloat(item.item_rate) || 0,
    }));

    // console.log(cleanedPartsArr);

    //  console.log("Type of array1:", typeof checkArr);
    // console.log(Array.isArray(checkArr));
    // console.log(Array.isArray(cleanedPartsArr)); // true if it's an array
    // console.log(checkArr);
    // console.log("Type of array2:", typeof cleanedPartsArr);

    const keysToCompare = [
      "partName",
      "partNumber",
      "category",
      "hsn",
      "cgst",
      "sgst",
      "gst",
      "mrp",
    ];

    // const differences = getArrayDifferences(
    //   prevPartsArr,
    //   cleanedPartsArr,
    //   keysToCompare
    // );

    console.log("Unique in array1:", prevPartsArr.documents.length);
    console.log("Unique in array2:", cleanedPartsArr.length);

    return NextResponse.json("HELLOOOOO", { status: 201 });
  } catch (error) {
    console.log("Failed");
    console.log(error);

    return NextResponse.json({
      message: "Failed",
      status: false,
    });
  }
}

function getArrayDifferences(
  array1: any,
  array2: any,
  keysToCompare: string[]
) {
  // Function to create a comparable string for each object based on the keys
  const createComparisonString = (obj: any) =>
    keysToCompare.map((key) => obj[key] || "").join("|");

  // Create a Set of comparison strings for array2
  const array2ComparisonSet = new Set(array2.map(createComparisonString));

  // Find differences from array1
  const uniqueInArray1 = array1.filter(
    (item: any) => !array2ComparisonSet.has(createComparisonString(item))
  );

  // Create a Set of comparison strings for array1
  const array1ComparisonSet = new Set(array1.map(createComparisonString));

  // Find differences from array2
  const uniqueInArray2 = array2.filter(
    (item: any) => !array1ComparisonSet.has(createComparisonString(item))
  );

  return { uniqueInArray1, uniqueInArray2 };
}
