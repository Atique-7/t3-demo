"use client";

import { DateRangePicker } from "@/components/DateRangePicker";
import PrimaryButton from "@/components/PrimaryButton";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getCarByCarNumber,
  getInvoicesBetween,
  getJobCardById,
  getJobCardsBetween,
} from "@/lib/appwrite";
import { Invoice, JobCard } from "@/lib/definitions";
import {
  adminReportTimelineDrop,
  createDateExpandedObj,
  createInvoiceObjReport,
  curateInvoices,
  roundDecimal,
  stringToObj,
} from "@/lib/helper";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
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

  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [invoicesArr, setInvoicesArr] = useState<Invoice[]>([]);

  const [loading, setLoading] = useState(false);

  const [customDateRange, setCustomDateRange] = useState<DateRange>();
  const [currentSelectedTimeline, setCurrentSelectedTimeline] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (customDateRange) {
      console.log("CUSTOM DATE RANGE - ", customDateRange);
      getJobCardsForTimeline(customDateRange!);
      getInvoicesForTimeline(customDateRange!);
    }
  }, [customDateRange]);

  const downloadPartsOutReport = async () => {
    setIssMakingPartsOutReport(true);
    console.log("Downloading Parts Out Report");

    let partOutObj: any = {};

    await Promise.all(
      jobCards.map(async (jobCard: JobCard) => {
        if (jobCard.jobCardStatus >= 5) {
          let parts = stringToObj(jobCard.parts);
          partOutObj[jobCard.jobCardNumber] = parts;
        }
      })
    );

    let totalParts: partReportListItem[] = [];

    // Iterate over partOutObj
    for (const invoiceCode in partOutObj) {
      if (partOutObj.hasOwnProperty(invoiceCode)) {
        const parts = partOutObj[invoiceCode];
        // Perform operations with parts
        parts.forEach(
          (part: { partId: string; quantity: number; partName: string }) => {
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
    downloadCSV(csvContent, `parts_report_${currentSelectedTimeline}.csv`);

    toast("Report Generated \u2705");
    setIssMakingPartsOutReport(false);
  };

  const downloadAccountsReport = async () => {
    setIsMakingAccountsReport(true);
    console.log("Downloading Accounts Report");

    const updatedNewInvoices = await Promise.all(
      invoicesArr.map(async (invoice: Invoice, index: number) => {
        // console.log("INVOICE", invoice.invoiceCode);

        let result: JobCard = await getJobCardById(invoice.jobCardId);

        let carObj = await getCarByCarNumber(result.carNumber);

        const totals = await createInvoiceObjReport(result, invoice);

        const returnObj = {
          invoiceCode: invoice.invoiceCode,
          billType: invoice.invoiceType,
          customerName: result.customerName,
          mobileNo: result.customerPhone,
          vehicleRegNo: result.carNumber,
          model: carObj.carModel,
          roNo: result.jobCardNumber,
          roDate: invoice.invoiceDate,
          serviceAdvisor: result.serviceAdvisorID,
          totalAmt: roundDecimal(
            Number(totals.partsTotal) + Number(totals.labourTotal)
          ),
          labourAmt: Number(totals.labourTotal),
          partAmt: Number(totals.partsTotal),
          workType: result.purposeOfVisit,

          roundOff: totals.invoice.jobCardDetails!.roundOffValue,
          totalDisc: roundDecimal(
            Number(totals.partsDiscount) + Number(totals.labourDiscount)
          ),
          partDisc: Number(totals.partsDiscount),
          labourDisc: Number(totals.labourDiscount),
          insCompName: "",
        };

        if (
          invoice.isInsuranceInvoice &&
          invoice.insuranceInvoiceType === "Insurance"
        ) {
          returnObj.insCompName = totals.invoice.jobCardDetails!.customerName;
        }

        return returnObj;
      })
    );

    console.log("RECIEVED INVOICES", updatedNewInvoices);
    const csvContent = convertArrayToCSV(updatedNewInvoices);
    downloadCSV(csvContent, `accounts_report_${currentSelectedTimeline}.csv`);

    toast("Report Generated \u2705");
    setIsMakingAccountsReport(false);
  };

  const modifyReportsTimeline = async (timeline: string) => {
    setShowDatePicker((prev) => false);
    const todaysDate = await createDateExpandedObj(new Date());
    switch (timeline) {
      case "thisMonth":
        setCustomDateRange({
          from: new Date(
            Number(todaysDate.year),
            Number(todaysDate.month) - 1,
            1
          ),
          to: new Date(),
        });

        break;
      case "lastMonth":
        if (Number(todaysDate.month) != 1) {
          setCustomDateRange({
            from: new Date(
              Number(todaysDate.year),
              Number(todaysDate.month) - 2,
              1
            ),
            to: new Date(
              Number(todaysDate.year),
              Number(todaysDate.month) - 1,
              0
            ),
          });
        } else {
          setCustomDateRange({
            from: new Date(Number(todaysDate.year) - 1, 11, 1),
            to: new Date(Number(todaysDate.year) - 1, 12, 0),
          });
        }

        break;
      case "lastSixMonths":
        if (Number(todaysDate.month) - 6 > 0) {
          setCustomDateRange({
            from: new Date(
              Number(todaysDate.year),
              Number(todaysDate.month) - 7,
              1
            ),
            to: new Date(
              Number(todaysDate.year),
              Number(todaysDate.month) - 1,
              0
            ),
          });
        } else {
          setCustomDateRange({
            from: new Date(
              Number(todaysDate.year) - 1,
              11 - (6 - Number(todaysDate.month)),
              1
            ),
            to: new Date(
              Number(todaysDate.year),
              Number(todaysDate.month) - 1,
              0
            ),
          });
        }
        break;
      case "lastYear":
        setCustomDateRange({
          from: new Date(
            Number(todaysDate.year) - 1,
            Number(todaysDate.month) - 1,
            1
          ),
          to: new Date(
            Number(todaysDate.year),
            Number(todaysDate.month) - 1,
            0
          ),
        });
        break;
      case "custom":
        setShowDatePicker((prev) => true);

        break;

      default:
        break;
    }
    setCurrentSelectedTimeline(timeline);
  };

  const getJobCardsForTimeline = async (customDateRange: DateRange) => {
    setLoading((prev) => true);
    const from = customDateRange.from;
    const to = customDateRange.to;

    const jobcards = await getJobCardsBetween(from!, to!);

    console.log("JOB CARDS FOR TIMELINE - ", jobcards);

    if (jobcards) {
      setJobCards((prev) => jobcards.documents);
    }
    setLoading((prev) => false);

    // return filteredJobCards;
  };

  const getInvoicesForTimeline = async (customDateRange: DateRange) => {
    setLoading((prev) => true);
    const from = customDateRange.from;
    const to = customDateRange.to;

    const invoices = await getInvoicesBetween(from!, to!);

    const curatedInvoices = await curateInvoices(invoices.documents);

    console.log("INVOICES FOR TIMELINE - ", curatedInvoices);

    if (curatedInvoices) {
      setInvoicesArr((prev) => curatedInvoices);
    }
    setLoading((prev) => false);

    // return filteredJobCards;
  };

  return (
    <div className="flex flex-col w-[90%] mt-20">
      <>
        <div>
          <div className="font-semibold text-3xl">Reports</div>
          <div className="mt-5">
            <Select
              onValueChange={(reportTimeline) =>
                modifyReportsTimeline(reportTimeline)
              }
            >
              <SelectTrigger className="w-full mb-10">
                <SelectValue placeholder="Select Reports Timeline" />
              </SelectTrigger>
              <SelectContent>
                {adminReportTimelineDrop.map((timeline) => (
                  <SelectItem key={timeline.key} value={timeline.key}>
                    <div className="flex space-x-5 items-center">
                      <div>{timeline.value}</div>
                      {currentSelectedTimeline === timeline.key && (
                        <div className="text-xs font-semibold text-red-500">
                          Current
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentSelectedTimeline === "custom" && showDatePicker && (
            <div>
              <DateRangePicker
                dateRange={customDateRange}
                setCustomDateRange={setCustomDateRange}
              />
            </div>
          )}
        </div>
        <div className="flex flex-row mt-10 justify-evenly  items-center h-fit mb-10">
          {loading ? (
            <>
              <PartsPageSkeleton />
            </>
          ) : (
            <>
              {currentSelectedTimeline && (
                <>
                  <PrimaryButton
                    title={"Download Parts Out Report"}
                    handleButtonPress={downloadPartsOutReport}
                    isLoading={isMakingPartsOutReport}
                  />
                  <PrimaryButton
                    title={"Download Accounts Report"}
                    handleButtonPress={downloadAccountsReport}
                    isLoading={isMakingAccountsReport}
                  />
                </>
              )}
            </>
          )}
        </div>
      </>
    </div>
  );
}

const convertArrayToCSV = (array: partReportListItem[] | any) => {
  const header = Object.keys(array[0]).join(",") + "\n";
  const rows = array
    .map((item: any) =>
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
