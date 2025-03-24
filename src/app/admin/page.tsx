"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import {
  getAllCars,
  getAllInvoices,
  getAllJobCards,
  getAllTempCars,
  getJobCardsBetween,
} from "@/lib/appwrite";
import {
  Car,
  DateExpandedObj,
  Invoice,
  JobCard,
  TempCar,
} from "@/lib/definitions";
import CustomerSplit from "@/components/graphs/CustomerSplit";
import RevenueSplit from "@/components/graphs/RevenueSplit";
import { CurrentCarsPie } from "@/components/graphs/CurrentCarsPie";
import { InsuranceCasesBar } from "@/components/graphs/InsuranceCasesBar";
import { NightStockNew } from "@/components/graphs/NightStockNew";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminReportTimelineDrop, createDateExpandedObj } from "@/lib/helper";
import { DateRangePicker } from "@/components/DateRangePicker";
import { DateRange } from "react-day-picker";
import { set } from "react-datepicker/dist/date_utils";
import { ServiceAdvisorPerformance } from "@/components/graphs/ServiceAdvisorPerformance";
import { PartsLabourSplit } from "@/components/graphs/PartsLabourSplit";
import { RevenueHistory } from "@/components/graphs/RevenueHistory";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import { jobCardColumns } from "@/lib/column-definitions";
import { Switch } from "@/components/ui/switch";
import { ChartLineIcon, TablePropertiesIcon } from "lucide-react";
import { InsuranceCasesPie } from "@/components/graphs/NewInsurancePie";

type Props = {};

export default function Admin({}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [tempCars, setTempCars] = useState<TempCar[]>([]);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const [showTableSwitch, setShowTableSwitch] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentSelectedTimeline, setCurrentSelectedTimeline] =
    useState("thisMonth");

  // const [dateExpandedObj, setDateExpandedObj] = useState<DateExpandedObj>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [customDateRange, setCustomDateRange] = useState<DateRange>();

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      //   console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();
      console.log("THESE ARE THE CURRENT JOB CARDS - ", allJobCards);
      setJobCards((prev) => allJobCards.documents);
    };

    const getTempCars = async () => {
      const allTempCars = await getAllTempCars();
      setTempCars((prev) => allTempCars.documents);
    };

    const getCars = async () => {
      const carsObj = await getAllCars();
      setCars((prev) => carsObj.documents);
    };

    const getInvoices = async () => {
      const invoicesObj = await getAllInvoices();
      setInvoices((prev) => invoicesObj.documents);
    };

    const getTodaysDate = async () => {
      const todaysDate = await createDateExpandedObj(new Date());
      // setDateExpandedObj((prev) => todaysDate);
      setCustomDateRange({
        from: new Date(
          Number(todaysDate.year),
          Number(todaysDate.month) - 1,
          1
        ),
        to: new Date(),
      });
    };

    getUser();
    // getJobCards();
    getCars();
    getTempCars();
    getInvoices();
    getTodaysDate();
  }, []);

  useEffect(() => {
    if (customDateRange) {
      console.log("CUSTOM DATE RANGE - ", customDateRange);
      getJobCardsForTimeline(customDateRange!);
    }
  }, [customDateRange]);

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

  return (
    <div className="flex flex-col w-[90%] mt-20">
      {!(
        name &&
        tempCars &&
        cars &&
        jobCards &&
        invoices &&
        customDateRange
      ) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-3xl">Hello {name}! </div>
                <div className="font-medium">T3, Mira Road</div>
              </div>
            </div>

            <div className="mt-10">
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
          {loading ? (
            <>
              <PartsPageSkeleton />
            </>
          ) : (
            <div>
              <div className="flex flex-col mt-10 justify-evenly items-center h-fit mb-10">
                {currentSelectedTimeline === "thisMonth" ? (
                  <>
                    <div className="flex flex-row w-full justify-evenly items-center">
                      <div className="w-1/3">
                        <CustomerSplit
                          jobCards={jobCards}
                          currentSelectedTimeline={currentSelectedTimeline}
                        />
                      </div>
                      <div className="w-1/3">
                        <RevenueSplit
                          jobCards={jobCards}
                          currentSelectedTimeline={currentSelectedTimeline}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row w-full justify-evenly items-center mt-10">
                      <div className="w-1/3">
                        <PartsLabourSplit
                          jobCards={jobCards}
                          currentSelectedTimeline={currentSelectedTimeline}
                        />
                      </div>
                      <div className="w-1/3">
                        <NightStockNew
                          jobCards={jobCards}
                          tempCars={tempCars}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-row w-full justify-evenly items-center">
                    <div className="w-1/4">
                      <CustomerSplit
                        jobCards={jobCards}
                        currentSelectedTimeline={currentSelectedTimeline}
                      />
                    </div>
                    <div className="w-1/4">
                      <RevenueSplit
                        jobCards={jobCards}
                        currentSelectedTimeline={currentSelectedTimeline}
                      />
                    </div>
                    <div className="w-1/4">
                      <PartsLabourSplit
                        jobCards={jobCards}
                        currentSelectedTimeline={currentSelectedTimeline}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center items-center w-full space-y-10 mb-10">
                <div className="flex flex-col space-y-5 justify-center items-center w-full">
                  <RevenueHistory
                    jobCards={jobCards}
                    currentSelectedTimeline={currentSelectedTimeline}
                  />
                </div>

                <div className="flex flex-col space-y-5 justify-center items-center w-full">
                  <ServiceAdvisorPerformance
                    jobCards={jobCards}
                    currentSelectedTimeline={currentSelectedTimeline}
                  />
                </div>
                <div className="">
                  <InsuranceCasesPie
                    jobCards={jobCards}
                    currentSelectedTimeline={currentSelectedTimeline}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
