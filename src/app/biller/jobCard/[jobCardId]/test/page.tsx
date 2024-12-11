"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../../../../public/assets/Logomark.png";
import { usePathname } from "next/navigation";
import {
  getAllInvoices,
  getJobCardById,
  getTempCarById,
  inputLabourAppwrite,
  inputPartsAppwrite,
} from "@/lib/appwrite";
import { Car, CurrentLabour, CurrentPart, JobCard } from "@/lib/definitions";
import {
  convertStringsToArray,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";

export default function page() {
  const pathname = usePathname();

  const [jobCard, setJobCard] = useState<JobCard | null>(null);
  const [car, setCar] = useState<Car | null>(null);

  const [parts, setParts] = useState<CurrentPart[] | null>(null);
  const [labour, setLabour] = useState<CurrentLabour[] | null>(null);

  const currentDate = new Date();

  useEffect(() => {
    const getJobCardDetails = async () => {
      const jobCardId = pathname.slice(16, 36);
      const jobCardObj = await getJobCardById(jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      const carObj = await getTempCarById(jobCardObj.carId);
      console.log("This is the car details - ", carObj);

      const prevParts = stringToObj(jobCardObj.parts);
      setParts(prevParts);

      const prevLabour = stringToObj(jobCardObj.labour);
      setLabour(prevLabour);

      setJobCard((prev) => jobCardObj);
      setCar((prev) => carObj);
    };

    getJobCardDetails();
  }, []);

  const getData = async () => {
    await fetch(`http://localhost:3000/tally/updateInvoices`, {
      // await fetch(`https://t3-next-dev.vercel.app/tally/updateInvoices`, {
      method: "POST",
      body: JSON.stringify({ data: { lastSync: "18-Nov-24 00:00:00" } }),
    }).then((result: any) => {
      result.json().then((invoiceDetails: any) => {
        console.log("HELLOOO", invoiceDetails);
      });
    });
  };

  // const inputParts = async () => {
  //   const partData = [
  //     {
  //       partName: "001165  A/C MAGANET CLUTCH ASSY XUV500",
  //       partNumber: "1165",
  //       category: "Spare Parts",
  //       hsn: 7312.0,
  //       cgst: 9.0,
  //       sgst: 9.0,
  //       gst: 18.0,
  //       mrp: 0.0,
  //     },
  //   ];

  //   const result = inputPartsAppwrite(partData.slice(0, 100));
  // };

  // const inputLabour = async () => {
  //   const labourData = [
  //     {
  //       labourCode: "L2023-11-001",
  //       labourName: "GENERAL CHECKUP",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-002",
  //       labourName: "FRONT SUSPENSION CHECK",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-003",
  //       labourName: "PAID SERVICE DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-004",
  //       labourName: "DENTING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-005",
  //       labourName: "PAINTING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-006",
  //       labourName: "REMOVE & REFITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2023-11-007",
  //       labourName: "POWDER CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-008",
  //       labourName: "SCANNING DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-009",
  //       labourName: "ENGINE OIL & OIL FILTER REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-010",
  //       labourName: "3M CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-011",
  //       labourName: "WIRING REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-012",
  //       labourName: "AC GAS TOPUP",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-013",
  //       labourName: "ALL DOOR SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-014",
  //       labourName: "BRAKE DISC CUTTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-01-015",
  //       labourName: "BALANCE ROD LINK CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-016",
  //       labourName: "UNDER BODY COATING ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-017",
  //       labourName: "TEFLON COATING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-018",
  //       labourName: "OTHER LABOUR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-019",
  //       labourName: "REMOVE & REFITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-020",
  //       labourName: "ENGINE OIL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-021",
  //       labourName: "STREEING COLUM REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-022",
  //       labourName: "FRONT SUSPENSION REM /REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-023",
  //       labourName: "FRONT LH SET LOCK FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-024",
  //       labourName: "FRONT RH GLASS FAN CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-025",
  //       labourName: "FRONT RH GLASS RUN CHANNEL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-026",
  //       labourName: "AC COOLING COIL REPL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-027",
  //       labourName: "REMOVE & REFITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-028",
  //       labourName: "REM/REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-029",
  //       labourName: "FRONT DISH FACING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-030",
  //       labourName: "BATTERY CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-031",
  //       labourName: "FRONT LOWERARM REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-032",
  //       labourName: "LOWERARM BUSH PRESSING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-033",
  //       labourName: "WHEEL ALIGMENT",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-034",
  //       labourName: "INTER COOLER SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-035",
  //       labourName: "AC PRESSURE TESTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-036",
  //       labourName: "AC GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-037",
  //       labourName: "GAS CHARGING AC",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-038",
  //       labourName: "AC SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-039",
  //       labourName: "AC GAS CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-040",
  //       labourName: "DASH BOARD REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-041",
  //       labourName: "BRAKE DISC POLISHING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-046",
  //       labourName: "WASHING & CLEANING DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-047",
  //       labourName: "INJECTOR CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-048",
  //       labourName: "AC PIPE REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-049",
  //       labourName: "AC COMPRESSURE REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-050",
  //       labourName: "AC CONDENSOR REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-051",
  //       labourName: "AXLE REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-052",
  //       labourName: "SUSP. REM REF REAR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-053",
  //       labourName: "MACHINE POLISHING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-054",
  //       labourName: "ENGINE OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-055",
  //       labourName: "GEAR OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-056",
  //       labourName: "SUSP.OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-057",
  //       labourName: "BRAKE OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-058",
  //       labourName: "STEERING OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-059",
  //       labourName: "DENTING CHARGES ( CASH JOB )",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-060",
  //       labourName: "PAINTING CHARGES ( CASH JOB )",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-061",
  //       labourName: "REMOVE . REFFING. CHARGES ( CASH JOB )",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-062",
  //       labourName: "FRONT SHOKUP CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-063",
  //       labourName: "BALANCE ROD CUT BUSH CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-064",
  //       labourName: "BRAKE PAD CHANGE FRONT",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-065",
  //       labourName: "3RD FREE SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-066",
  //       labourName: "CLUTCH CYLINDER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-067",
  //       labourName: "FRONT RH DOOR WINDER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-068",
  //       labourName: "CLAIM PROCESSING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-069",
  //       labourName: "FRONT DISH POLISHING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-70",
  //       labourName: "WASHING CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-71",
  //       labourName: "VSS SENSOR CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-72",
  //       labourName: "AC BLOWER MOTOR AC FILTER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-73",
  //       labourName: "AC BLOWER MOTOR AC FILTER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-74",
  //       labourName: "VSS SENSOR CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-75",
  //       labourName: "AC BLOWER MOTOR AC FILTER CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-76",
  //       labourName: "AC BLOWER MOTOR AC FILTER CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-77",
  //       labourName: "ROGER PAD FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-78",
  //       labourName: "ALTERNATOR REPAIR CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-79",
  //       labourName: "FRONT RH ENGINE MOUNTING CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-80",
  //       labourName:
  //         "AC COMPRESSURE CHANGE,AC CONDENSOR CHANGE,AC GAS CHARGING,AC PRESSURE TESTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-81",
  //       labourName: "CALIPER PIN GREASING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-82",
  //       labourName: "FRONT BUMPER REPAIRING ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-83",
  //       labourName: "AC COMPRESSOR CLUTCH CHANGE,AC GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-84",
  //       labourName: "AC COMPRESSOR CLUTCH CHANGE,AC GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-85",
  //       labourName: "STARTER MOTOR  REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-86",
  //       labourName: "LABOUR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-87",
  //       labourName: "AC SERVICING & GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-88",
  //       labourName: "2ND FREE SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-89",
  //       labourName: "CHECKING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-90",
  //       labourName: "CHECKING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-91",
  //       labourName: "CHARGES CHECKING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-92",
  //       labourName: "CHARGES CHECKING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-93",
  //       labourName: "FRONT SUSPENSION O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-94",
  //       labourName: "STREEING RACK O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-95",
  //       labourName: "BRAKE DISC CUTTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-96",
  //       labourName: "FRONT BRAKE SERVICE ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-97",
  //       labourName: "HEAD LIGHT HOLDER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-98",
  //       labourName: "REAR SHOCKUP CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-99",
  //       labourName:
  //         "AC COMPRESSOR CHANGE,AC CONDENSOR HANGE,AC COOLING COIL CHANGE,DASH BOARD REM REF,AC PRESSURE TESTING,AC GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-100",
  //       labourName: "BATTERY CHARGING DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-101",
  //       labourName: "TRANSMITION GEAR OVERHUAL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-102",
  //       labourName: "RADIATOR ASSAMBLY CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-103",
  //       labourName: "FRONT STRUT CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-104",
  //       labourName: "RADIATOR CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-105",
  //       labourName: "AC BLOWER CHANGE AC FILTER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-106",
  //       labourName: "2 HEAD LIGHT CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-107",
  //       labourName: "ENGINE PLUG NEW FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-108",
  //       labourName: "TOWING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-109",
  //       labourName: "ENGINE OIL CHANGE & GENERAL CHECKUP",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-110",
  //       labourName: "RADIATOR HOSE PIPE CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-111",
  //       labourName: "DASH BOARD REM,AC COOLING COIL CHANGE,AC GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-112",
  //       labourName: "OTHER WORK",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-113",
  //       labourName: "COWL TOP PANEL",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-114",
  //       labourName: "THERMOSET ALBO CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-115",
  //       labourName: "RIGHT DOOR GLASS RUN CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-116",
  //       labourName: "AC SERVICING GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-117",
  //       labourName: "FUEL TANK REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-118",
  //       labourName: "FUEL PUMP REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-119",
  //       labourName: "AC GRILL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-120",
  //       labourName: "RADIATOR REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-121",
  //       labourName: "RADIATOR REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-122",
  //       labourName: "AC COMRESSURE CLUTCH PULLEY CHANGE & GAS CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-123",
  //       labourName: "BUMPER REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-124",
  //       labourName: "2 MIRROR LENS CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-125",
  //       labourName: "FRONT BOTH EXCEL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-126",
  //       labourName: "REAR RIGHT OUTER HANDEL FRAME CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-127",
  //       labourName: "RIGHT POWDER WINDOW SWITCH CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-128",
  //       labourName: "RIGHT POWDER WINDOW SWITCH CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-129",
  //       labourName: "THORTAL BODY SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-130",
  //       labourName: "THORTAL BODY SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-131",
  //       labourName: "STEERING COLUM REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-132",
  //       labourName: "STEERING COLUM REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-133",
  //       labourName: "DIAGNOSIS CHECKING CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-134",
  //       labourName: "AC PRESSURE TESTING & GAS CHARGING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-135",
  //       labourName: "BOTH REAR SHOCKUP CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-136",
  //       labourName: "BOTH REAR SHOCKUP CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-137",
  //       labourName: "FRONT LH DOOR LOCK CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-138",
  //       labourName: "DOOR LOCK CHANGE FRONT LH",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-139",
  //       labourName: "RADIO ANNTENNA CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-140",
  //       labourName: "WHEEL RIM FILLING & WHEEL BALANCING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-141",
  //       labourName: "RIGHT MIRROR CHANGE PAINTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-142",
  //       labourName: "FRONT LH DOOR LOCK CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-143",
  //       labourName: "BALLENO ROD LINKAGE CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-144",
  //       labourName:
  //         "PAID SERVICE,POWDER CLEANING ,WHEEL ALIGMENT, WHEEL BALANNCING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-145",
  //       labourName: "DASH BOARD REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-146",
  //       labourName: "ALTERNATOR REPAIR & REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-147",
  //       labourName: "ALTERNATOR REPAIR & REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-148",
  //       labourName: "AC SERVICE & GAS CHANGE DASH BOARD REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-149",
  //       labourName: "ENGINE OIL FILTER &DICKY HANDEL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-150",
  //       labourName: "BCM POWER STEERING REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-151",
  //       labourName: "BRAKE SERVICE & BRAKE PIPE CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-152",
  //       labourName: "BALANCE ROD LINKAGE CHANGE &BALANCE ROD CUT BUSH CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-153",
  //       labourName: "RIGHT MOUNTING CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-154",
  //       labourName: "3M INTERIOR CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-155",
  //       labourName: "2BOTH LOWERARM CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-156",
  //       labourName: "REAR RIGHT DOOR HANDEL CHANGE & PAINTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-157",
  //       labourName: "IGNITION COIL REPLACEMENT",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-158",
  //       labourName: "STEERING RACK REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-159",
  //       labourName: "REVERSE SENSOR PAINTING FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-160",
  //       labourName: "SCANING & COADING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-161",
  //       labourName: "TUNER LABOUR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-162",
  //       labourName: "ALL ENGINE MOUNTING CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-163",
  //       labourName: "BRAKE DISC POLISH",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-164",
  //       labourName: "STEERING RACK O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-165",
  //       labourName: "NEW KEY",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-166",
  //       labourName: "REPLACE NEW KEY",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-167",
  //       labourName: "INTERRIOR CLEANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-168",
  //       labourName: "TIMING REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-169",
  //       labourName: "REAR RH DOOR WINDER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-170",
  //       labourName: "TUNER LABOUR BUSHING KIT PRESSING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-171",
  //       labourName: "COOLANT ELBOW CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-172",
  //       labourName: "COOLANT ELBOW REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-173",
  //       labourName: "WIPER MOTOR CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-174",
  //       labourName: "DOOR GLASS RUN REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-175",
  //       labourName: "REAR BRAKE O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-176",
  //       labourName: "COMPRESSOR CHANGE & AC SERVICE ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-177",
  //       labourName: "CLUTCH PLATE REPLACEMENT",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-178",
  //       labourName: "DOOR HANDEL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-179",
  //       labourName: "RH TAIL LIGHT REM REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-180",
  //       labourName: "GEAR LIVER NOB CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-181",
  //       labourName: "SILENSOR REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-182",
  //       labourName: "FRONT SUSPENSION O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-183",
  //       labourName: "EXHAUST MENIFOLD REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-184",
  //       labourName: "AC SERVICE & GAS CHANGE & HEATER COIL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-185",
  //       labourName: "AC SERVICE & GAS CHANGE ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-186",
  //       labourName: "HEATER COIL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-187",
  //       labourName: "3M POLISHING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-188",
  //       labourName: "FAN BELT AC BELT CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-189",
  //       labourName: "ENGINE TUNE UP",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-190",
  //       labourName: "TIMING CHAIN CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-191",
  //       labourName: "CLUTCH O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-192",
  //       labourName: "REAR RH DOOR LOCK REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-193",
  //       labourName: "HORN FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-194",
  //       labourName: "DICKY",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-195",
  //       labourName: "FRONT WHINSHILED GLASS FRAM PACH WORK",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-196",
  //       labourName: "ENGINE MOUNTING REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-197",
  //       labourName: "ENGINE TUNE UP SCANING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-198",
  //       labourName: "HAND BRAKE PADS REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-199",
  //       labourName: "AC CONDENSOR CHANGE & AC GAS CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-200",
  //       labourName: "FRONT BRAKE O/H",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-201",
  //       labourName: "ENGINE TUNE UP & THORTAL SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-202",
  //       labourName: "DASH BOARD REM & AC COOLING COIL CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-203",
  //       labourName: "FUEL INJECTOR SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-204",
  //       labourName: "CHANGE FRONT CROSS MEMBER REPAIR ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-205",
  //       labourName: "AC COMPRESSURE REPAIR ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-206",
  //       labourName: "AC PIPE TURNER LABOUR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-207",
  //       labourName: "ALL BRAKE SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-208",
  //       labourName: "FRONT LH WHEEL BEARING CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-209",
  //       labourName: "FLYWHEEL CUTTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-210",
  //       labourName: "TURNER LABOUR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-211",
  //       labourName: "DIAGNOSIS CHARGES",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-212",
  //       labourName: "AC CONDENSOR SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-213",
  //       labourName: "WIPER REPAIR ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-214",
  //       labourName: "GENERAL CHECKUP PACKAGE ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-215",
  //       labourName: "FRONT BRAKE DISC CUTTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-216",
  //       labourName: "REAR BUMPER REM",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-217",
  //       labourName: "REAR BRAKE CALIBER SERVICE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-218",
  //       labourName: "REAR LEFT DOOR HANDEL FRAM CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-219",
  //       labourName: "DICKY SHOCKUP CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-220",
  //       labourName: "REAR LH DOOR WINDER REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-221",
  //       labourName: "NEW HORN FITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-222",
  //       labourName: "ECM REPAIR  & WIRING REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-223",
  //       labourName: "AC PIPE REPAIRING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-224",
  //       labourName: "FRONT RH WINDER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-225",
  //       labourName: "INTERIOR CLEANING ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-226",
  //       labourName: "SERVICE PLUS",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-227",
  //       labourName: "DICKY SWITCH REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-228",
  //       labourName: "DOOR REM/REF",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-242",
  //       labourName: "DICKY HANDLE REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-240",
  //       labourName: "DICKY PANNEL PAINTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-245",
  //       labourName: "A/C GAS TOPUP AND NITROGEN TESTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-246",
  //       labourName: "TYRE REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-247",
  //       labourName: "DOOR TRIM POLISH",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-248",
  //       labourName: "BRAKE DOWN ATTENDED",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-249",
  //       labourName: "COWL PANEL REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-250",
  //       labourName: "SUFRAME REPAIR",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-251",
  //       labourName: "UNDER BODY COATING ",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-252",
  //       labourName: "FOG LIGHT BULB REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-253",
  //       labourName: "TAIL LIGHT REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-254",
  //       labourName: "REAR WIPER CHANGE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-255",
  //       labourName: "SYNTHETIC OIL FILTER",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-256",
  //       labourName: "HEAD LIGHT BULB REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-257",
  //       labourName: "WHEEL CAP REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-258",
  //       labourName: "POWER WINDOW MOTOR REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-259",
  //       labourName: "STEERING BOLT JOINT REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-260",
  //       labourName: "WORK NOT DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-261",
  //       labourName: "SPECIAL CHECKUP DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-262",
  //       labourName: "CNG REGULATOR REMOVE & REFITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-263",
  //       labourName: "HEAD LIGHT POLISH DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-264",
  //       labourName: "STEERING RACK REMOVE & REFITTING",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-265",
  //       labourName: "THARMOSTER SENSOR REPLACE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //     {
  //       labourCode: "L2024-04-266",
  //       labourName: "BRAKE BEEDING DONE",
  //       hsn: 998729,
  //       mrp: 100,
  //       gst: 18,
  //       cgst: 9,
  //       sgst: 9,
  //       category: "labour",
  //     },
  //   ];

  //   const result = inputLabourAppwrite(labourData);
  // };

  const reNumberInvoices = async () => {
    const result = await getAllInvoices();
    console.log(result);
  };

  return (
    <div className="flex  flex-col w-[90%] mx-auto p-8 bg-white border border-gray-300">
      {jobCard && parts && labour && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">T3 ALL CAR SERVICE</h2>
          </div>
          <div className="flex justify-between font-medium text-right text-sm">
            <Image
              src={logo}
              width={100}
              height={50}
              alt="Logo"
              onClick={reNumberInvoices}
            />
            <div>
              <h3 className="text-md font-bold">CHAMUNDA MOTORS PVT LTD</h3>
              <p className="text-right text-sm">
                21/1-1, RAM BAUGH, OFF S V ROAD, <br />
                BORIVALI WEST, MUMBAI SUBURBAN,
                <br />
              </p>
              <div className="font-bold">GST NO: 27AAACC1903H1Z4</div>
            </div>
          </div>

          <div className="mb-6 text-center font-bold">Tax Invoice</div>

          <div className="flex flex-row justify-evenly text-md font-semibold mb-10 w-full">
            <div className="border border-black h-fit w-[30%]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold border border-black"
                      colSpan={2}
                    >
                      Customer Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Name:</td>
                    <td className=" border border-black">
                      {jobCard?.customerName}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Mobile:</td>
                    <td className=" border border-black">
                      {jobCard?.customerPhone}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Email ID:
                    </td>
                    <td className=" border border-black">-</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Address:</td>
                    <td className=" border border-black">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border h-fit border-black w-[30%]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th className="text-center font-bold" colSpan={2}>
                      Vehicle Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Registration:
                    </td>
                    <td className=" border border-black">
                      {jobCard?.carNumber}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Make:</td>
                    <td className=" border border-black">{car?.carMake}</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">Model:</td>
                    <td className=" border border-black">{car?.carModel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border border-black h-fit w-[30%]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={2}
                    >
                      Invoice Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Invoice No:
                    </td>
                    <td className=" border border-black">SER/5171</td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Invoice Date:
                    </td>
                    <td className=" border border-black">
                      {currentDate.toLocaleDateString()}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Job Card No:
                    </td>
                    <td className=" border border-black">
                      {jobCard.jobCardNumber}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border border-black font-bold">
                      Service Type:
                    </td>
                    <td className=" border border-black">
                      {jobCard.purposeOfVisit}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={9}
                    >
                      Parts
                    </th>
                  </tr>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Sr. No</th>
                    <th className="p-1 border border-black">Part No.</th>
                    <th className="p-1 border border-black">Description</th>
                    <th className="p-1 border border-black">Tax (%)</th>
                    <th className="p-1 border border-black">HSN</th>
                    <th className="p-1 border border-black">Quantity</th>
                    <th className="p-1 border border-black">Rate</th>
                    <th className="p-1 border border-black">Disc (%)</th>
                    <th className="p-1 border border-black">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {parts.map((part, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-black">{index + 1}</td>
                        <td className="p-1 border border-black">
                          {part.partNumber}
                        </td>
                        <td className="p-1 border border-black">
                          {part.partName}
                        </td>
                        <td className="p-1 border border-black">{part.gst}</td>
                        <td className="p-1 border border-black">{part.hsn}</td>
                        <td className="p-1 border border-black">
                          {part.quantity}
                        </td>
                        <td className="p-1 border border-black">{part.mrp}</td>
                        <td className="p-1 border border-black">
                          {part.discountAmt}
                        </td>

                        <td className="p-1 border border-black">
                          {part.amount}
                        </td>
                      </tr>
                    ))}
                  </>

                  <tr className="bg-gray-200 border border-black">
                    <td
                      className="text-right font-medium border border-black"
                      colSpan={8}
                    >
                      Subtotal
                    </td>
                    <td className="text-right font-medium border border-black">
                      {jobCard?.partsTotalPostTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={10}
                    >
                      Labour
                    </th>
                  </tr>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Sr. No</th>
                    {/* <th className="p-1 border border-black">Part No.</th> */}
                    <th className="p-1 border border-black">Description</th>
                    <th className="p-1 border border-black">Tax (%)</th>
                    <th className="p-1 border border-black">SAC</th>
                    <th className="p-1 border border-black">Quantity</th>
                    <th className="p-1 border border-black">Rate</th>
                    <th className="p-1 border border-black">Disc (%)</th>
                    <th className="p-1 border border-black">Disc Amount</th>
                    <th className="p-1 border border-black">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {labour.map((work, index) => (
                      <tr key={index}>
                        <td className="p-1 border border-black">{index + 1}</td>
                        <td className="p-1 border border-black">
                          {work.labourName}
                        </td>
                        <td className="p-1 border border-black">{work.gst}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {work.quantity}
                        </td>
                        <td className="p-1 border border-black">{work.mrp}</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">-</td>
                        <td className="p-1 border border-black">
                          {work.amount}
                        </td>
                      </tr>
                    ))}
                  </>

                  <tr className="bg-gray-200 border border-black">
                    <td
                      className="text-right font-medium border border-black"
                      colSpan={8}
                    >
                      Subtotal
                    </td>
                    <td className="text-right font-medium border border-black">
                      {jobCard?.labourTotalPostTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="mb-8">
            <div className="border border-black h-fit">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className=" border-black bg-gray-200">
                    <th className="p-1 border border-black">Type</th>
                    <th className="p-1 border border-black">Taxable Value</th>
                    <th className="p-1 border border-black">GST (%)</th>
                    <th className="p-1 border border-black">GST Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black text-center">
                    <td className="border border-black">PARTS</td>
                    <td className="border border-black">
                      {jobCard?.partsTotalPreTax}
                    </td>

                    <td className="border border-black">{parts[0].gst}</td>

                    <td className="border border-black">
                      {jobCard?.partsTotalPostTax - jobCard?.partsTotalPreTax}
                    </td>
                  </tr>
                  <tr className="border border-black text-center">
                    <td className="border border-black">LABOUR</td>
                    <td className="border border-black">
                      {jobCard?.labourTotalPreTax}
                    </td>

                    <td className="border border-black">{labour[0].gst}</td>

                    <td className="border border-black">
                      {jobCard?.labourTotalPostTax - jobCard?.labourTotalPreTax}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div> */}

          <div className="flex flex-row mb-8 justify-between">
            <div className="border border-black h-fit w-[45%]">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 border border-black">
                    <th
                      className="text-center font-bold  border border-black"
                      colSpan={10}
                    >
                      Observations and Remarks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border border-black">
                    <td className="text-left font-normal border border-black">
                      -
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="border border-black h-fit w-[45%]">
              <table className="table-auto border-collapse w-full">
                <tbody>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      Total Taxable Value:
                    </td>
                    <td className=" border border-black px-3">
                      {jobCard.partsTotalPreTax + jobCard.labourTotalPreTax}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      Total GST Amount:
                    </td>
                    <td className=" border border-black px-3">
                      {roundToTwoDecimals(
                        jobCard.partsTotalPostTax -
                          jobCard.partsTotalPreTax +
                          (jobCard.labourTotalPostTax -
                            jobCard.labourTotalPreTax)
                      )}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      TOTAL:
                    </td>
                    <td className=" border border-black px-3">
                      {Math.round(
                        (jobCard.partsTotalPostTax +
                          jobCard.labourTotalPostTax) *
                          100
                      ) / 100}
                    </td>
                  </tr>
                  <tr className="border border-black">
                    <td className=" border bg-gray-200 border-black font-bold">
                      TOTAL (rounded off):
                    </td>
                    <td className=" border border-black px-3 font-bold">
                      {Math.round(
                        jobCard.partsTotalPostTax + jobCard.labourTotalPostTax
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
