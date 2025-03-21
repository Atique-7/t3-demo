"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import PrimaryButton from "@/components/PrimaryButton";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import DisplayCard, { DisplayAdvisorJobCards } from "@/components/DisplayCard";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { CarFront, Wrench, ListChecks, IndianRupee } from "lucide-react";
import { jobCardColumns } from "@/lib/column-definitions";
import { getAllJobCards, getJobCardsBetween } from "@/lib/appwrite";
import { DateRange } from "react-day-picker";
import { createDateExpandedObj, createJobCardObjReport } from "@/lib/helper";
import { JobCard } from "@/lib/definitions";
import Decimal from "decimal.js";

type Props = {};

export default function Biller({}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [totalNumberOfCars, setTotalNumberOfCars] = useState(0);
  const [numberOfCarsInProgress, setNumberOfCarsInProgress] = useState(0);
  const [completedJobCars, setCompletedJobCars] = useState(0);
  const [currentJobCards, setCurrentJobCards] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      console.log(parsedToken);
      setName(parsedToken.name);
    };
    const getJobCardsForTimeline = async () => {
      const todaysDate: any = await createDateExpandedObj(new Date());

      // setLoading((prev) => true);
      const from = new Date(
        Number(todaysDate.year),
        Number(todaysDate.month) - 1,
        1
      );
      const to = new Date();

      const jobcards = await getJobCardsBetween(from!, to!);

      console.log("JOB CARDS FOR TIMELINE - ", jobcards);

      const onGoingJobCards = jobcards.documents.filter(
        (jobCard: JobCard) => jobCard.jobCardStatus < 6
      );

      const completedJobCards = jobcards.documents.filter(
        (jobCard: JobCard) => jobCard.jobCardStatus >= 6
      );

      setTotalNumberOfCars(jobcards.total);
      setNumberOfCarsInProgress(onGoingJobCards.length);
      setCompletedJobCars(completedJobCards.length);
      setTotalRevenue(await getTotalRevenue(completedJobCards));

      // return filteredJobCards;
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();

      console.log("THESE ARE THE CURRENT JOB CARDS - ", allJobCards);
      setCurrentJobCards(allJobCards.documents);
    };

    const getTotalRevenue = async (jobCards: JobCard[]) => {
      let totalRevenue = new Decimal(0);
      await Promise.all(
        jobCards.map(async (jobCard: JobCard) => {
          let jobCardParts = new Decimal(0);
          let jobCardLabour = new Decimal(0);
          let jobCardRevenue = new Decimal(0);

          const jobCardTotals = await createJobCardObjReport(jobCard);

          jobCardParts = jobCardParts.add(
            new Decimal(Number(jobCardTotals.partsSubtotal))
          );

          jobCardLabour = jobCardLabour.add(
            new Decimal(Number(jobCardTotals.labourSubtotal))
          );

          jobCardParts = jobCardParts.minus(
            new Decimal(Number(jobCardTotals.partsDiscount))
          );

          jobCardLabour = jobCardLabour.minus(
            new Decimal(Number(jobCardTotals.labourDiscount))
          );

          jobCardRevenue = jobCardRevenue.add(jobCardParts);
          jobCardRevenue = jobCardRevenue.add(jobCardLabour);

          totalRevenue = totalRevenue.add(jobCardRevenue);
        })
      );

      console.log("TOTAL REVENUE", Number(totalRevenue));

      return Number(totalRevenue);
    };

    getUser();
    getJobCards();
    getJobCardsForTimeline();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-10">
      {!name && currentJobCards ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="flex flex-row space-x-8 mt-16 w-full justify-center">
            {/* <DisplayCard
              icon={<CarFront />}
              desc={"Cars so far this month"}
              value={totalNumberOfCars}
            />
            <DisplayCard
              icon={<Wrench />}
              desc={"In Progress"}
              value={numberOfCarsInProgress}
            />
            <DisplayCard
              icon={<ListChecks />}
              desc={"Completed"}
              value={completedJobCars}
            /> */}
            <DisplayAdvisorJobCards
              completedCars={completedJobCars}
              totalCars={totalNumberOfCars}
              advisorEmail={"Complete Garage"}
            />
            <DisplayCard
              icon={<IndianRupee />}
              desc={"Revenue So far"}
              value={totalRevenue}
            />
          </div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Cars</div>
            <JobCardsDataTable
              columns={jobCardColumns}
              data={currentJobCards}
            />
          </div>
        </>
      )}
    </div>
  );
}
