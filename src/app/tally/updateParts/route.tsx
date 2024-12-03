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

    getDeifferenceBetweenArrs(
      prevPartsArr.documents,
      cleanedPartsArr,
      keysToCompare
    );

    console.log("ORIGINAL First Array:", prevPartsArr.documents.length);
    console.log("ORIGINAL to Second Array:", cleanedPartsArr.length);
    // console.log("Unique to First Array:", result.uniqueToFirst.length);
    // console.log("Unique to Second Array:", result.uniqueToSecond.length);

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

function getDeifferenceBetweenArrs(
  firstArray: any[],
  secondArray: any[],
  keysToCompare: string[]
) {
  let arr1: any[] = [];
  let arr2: any[] = [];
  let arr3: any[] = [];

  let changes: any = {
    partName: [],
    partNumber: [],
    category: [],
    hsn: [],
    cgst: [],
    sgst: [],
    gst: [],
    mrp: [],
  };

  secondArray.map((a: any) => {
    let secondArrFlag = false;
    const foundObjInFirstArr = firstArray.find(
      (b) => b.partNumber == a.partNumber
    );
    if (foundObjInFirstArr) {
      // console.log("PART IN BOTH ARR");
      keysToCompare.map((key) => {
        if (foundObjInFirstArr[key] != a[key]) {
          secondArrFlag = true;

          switch (key) {
            case "partName":
              changes.partName = [
                ...changes.partName,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "partNumber":
              changes.partNumber = [
                ...changes.partNumber,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "category":
              changes.category = [
                ...changes.category,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "hsn":
              changes.hsn = [
                ...changes.hsn,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "cgst":
              changes.cgst = [
                ...changes.cgst,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "sgst":
              changes.sgst = [
                ...changes.sgst,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "gst":
              changes.gst = [
                ...changes.gst,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;
            case "mrp":
              changes.mrp = [
                ...changes.mrp,
                { prevVal: foundObjInFirstArr[key], newVal: a[key] },
              ];
              break;

            default:
              break;
          }
        }
      });

      if (secondArrFlag) {
        arr1.push(a);
      } else {
        arr3.push("NAHI");
      }
    } else {
      arr2.push(a);
    }
  });

  console.log("FINALS - ", arr1.slice(0, 5), arr2.length, arr3.length);
  console.log(changes);
}
