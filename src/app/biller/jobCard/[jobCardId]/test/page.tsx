"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../../../../public/assets/Logomark.png";
import { usePathname } from "next/navigation";
import {
  getAllInvoices,
  getAllJobCards,
  getInvoiceUrl,
  getJobCardById,
  getTempCarById,
  inputLabourAppwrite,
  inputPartsAppwrite,
  // updateInvoiceIsInsurance,
  updateJobCardJobCardStatus,
} from "@/lib/appwrite";
import {
  Car,
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
} from "@/lib/definitions";
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

  const fixJobCards = async () => {
    const allJobCards = await getAllJobCards();
    let jobCardsToUpdate: JobCard[] = [];

    await Promise.all(
      allJobCards.documents.map(async (jobCard: JobCard) => {
        const result = await getTempCarById(jobCard.carId);
        if (result) {
          console.log("THIK HAI");
        } else {
          if (jobCard.jobCardStatus != 6) {
            console.log("FLAGGED FLAGGED FLAGGED");
          } else {
            // await updateJobCardJobCardStatus(jobCard.$id, 7);
          }
        }
      })
    );
  };

  // const fixInvoices = async () => {
  //   const allInvoices = await getAllInvoices();

  //   let doneCounter = 0;
  //   let notDoneCounter = 0;

  //   await Promise.all(
  //     allInvoices.documents.map(async (invoice: Invoice) => {
  //       if (invoice.insuranceInvoiceType) {
  //         // console.log("INSURANCE INVOICE - ", invoice.insuranceInvoiceType);
  //         // console.log("INVOICE ID - ", invoice.isInsuranceInvoice);
  //         if (invoice.insuranceInvoiceType == "Customer") {
  //           // console.log("Check", invoice.isInsuranceInvoice);
  //           if (invoice.isInsuranceInvoice) {
  //             doneCounter++;
  //           } else {
  //             notDoneCounter++;
  //             // console.log(await updateInvoiceIsInsurance(invoice.$id, true));
  //           }
  //         }
  //       }
  //     })
  //   );

  //   console.log("DONE - ", doneCounter);
  //   console.log("NOT DONE - ", notDoneCounter);
  // };

  const InvoiceUrl = async () => {
    const result = await getInvoiceUrl("677e083f00063d9e93da");
    console.log("PDF URL - ", result);
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
              onClick={InvoiceUrl}
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
