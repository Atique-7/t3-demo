"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { getCarByCarNumber } from "@/lib/appwrite";
import { useState } from "react";
import { toast } from "sonner";

type Props = {};
type partReportListItem = {
  partId: string;
  partName: string;
  quantity: number;
};

const useDev = false;

let apiUrl: string;

if (useDev) {
  apiUrl = "http://localhost:3000";
} else {
  apiUrl = "https://t3-next-dev.vercel.app";
}

export default function DownloadReports({}: Props) {
  const [isMakingPartsOutReport, setIssMakingPartsOutReport] = useState(false);
  const [isMakingAccountsReport, setIsMakingAccountsReport] = useState(false);

  const downloadPasrtsOutReport = async () => {
    setIssMakingPartsOutReport(true);
    console.log("Downloading Parts Out Report");

    await fetch(`${apiUrl}/tally/updateInvoices`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          lastSync: "1-Dec-24 08:19:15",
        },
      }),
    }).then((result: any) => {
      let partOutObj: { [key: string]: any } = {};

      result.json().then(async (invoices: any) => {
        console.log(invoices);

        await Promise.all(
          invoices.invoices.map(
            async (invoice: {
              invoiceCode: string;
              jobCardDetails: { parts: any };
            }) => {
              partOutObj[invoice.invoiceCode] = invoice.jobCardDetails.parts;
            }
          )
        );

        let totalParts: partReportListItem[] = [];

        // Iterate over partOutObj
        for (const invoiceCode in partOutObj) {
          if (partOutObj.hasOwnProperty(invoiceCode)) {
            const parts = partOutObj[invoiceCode];
            // Perform operations with parts
            parts.forEach(
              (part: {
                partId: string;
                quantity: number;
                partName: string;
              }) => {
                const partIndex = totalParts.findIndex(
                  (partItem) => partItem.partId === part.partId
                );

                if (partIndex === -1) {
                  totalParts.push({
                    partId: part.partId,
                    partName: part.partName,
                    quantity: part.quantity,
                  });
                } else {
                  totalParts[partIndex].quantity += part.quantity;
                }
              }
            );
          }
        }

        console.log("Total Parts:", totalParts);

        const csvContent = convertArrayToCSV(totalParts);
        downloadCSV(csvContent, "total_parts_report.csv");

        toast("Report Generated \u2705");
        setIssMakingPartsOutReport(false);
      });
    });
  };

  const downloadAccountsReport = async () => {
    setIsMakingAccountsReport(true);
    console.log("Downloading Accounts Report");

    await fetch(`${apiUrl}/tally/getReport`, {
      method: "POST",
      body: JSON.stringify({
        data: {
          lastSync: "1-Dec-24 08:19:15",
        },
      }),
    }).then((result: any) => {
      result.json().then(async (invoices: any) => {
        console.log("RECIEVED INVOICES", invoices);
        const csvContent = convertArrayToCSV(invoices);
        downloadCSV(csvContent, "total_parts_report.csv");

        toast("Report Generated \u2705");
        setIsMakingAccountsReport(false);
      });
    });
  };

  return (
    <div className="flex flex-col w-[90%] mt-20">
      <>
        <div>
          <div className="font-semibold text-3xl">Reports</div>
        </div>
        <div className="flex flex-row mt-10 justify-evenly  items-center h-fit mb-10">
          <PrimaryButton
            title={"Download Parts Out Report"}
            handleButtonPress={downloadPasrtsOutReport}
            isLoading={isMakingPartsOutReport}
          />
          <PrimaryButton
            title={"Download Accounts Report"}
            handleButtonPress={downloadAccountsReport}
            isLoading={isMakingAccountsReport}
          />
        </div>
      </>
    </div>
  );
}

const convertArrayToCSV = (array: partReportListItem[]) => {
  const header = Object.keys(array[0]).join(",") + "\n";
  const rows = array
    .map((item) =>
      Object.values(item)
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return header + rows;
};

const downloadCSV = (csvContent: string, fileName: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
