"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import DisplayCard from "@/components/DisplayCard";
import { CarFront, Wrench, ListChecks } from "lucide-react";

import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { getAllJobCards, getJobCardsBetween } from "@/lib/appwrite";
import { jobCardColumns } from "@/lib/column-definitions";
import { createDateExpandedObj } from "@/lib/helper";
import { JobCard } from "@/lib/definitions";
import { get } from "http";

type Props = {};

export default function Parts({}: Props) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [totalNumberOfCars, setTotalNumberOfCars] = useState(0);
  const [numberOfCarsInProgress, setNumberOfCarsInProgress] = useState(0);
  const [completedJobCars, setCompletedJobCars] = useState(0);
  const [currentJobCards, setCurrentJobCards] = useState([]);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getJobCardsForTimeline = async () => {
      const todaysDate = await createDateExpandedObj(new Date());

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

      // return filteredJobCards;
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();
      console.log("THESE ARE THE CURRENT JOB CARDS - ", allJobCards);
      setCurrentJobCards(allJobCards.documents);
    };

    getUser();
    getJobCards();
    getJobCardsForTimeline();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-10">
      {!(name && currentJobCards) ? (
        <PartsPageSkeleton />
      ) : (
        <div>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="flex flex-row space-x-8 mt-16 w-full justify-center">
            <DisplayCard
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
            />
          </div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Cars</div>
            <JobCardsDataTable
              columns={jobCardColumns}
              data={currentJobCards}
            />
          </div>
        </div>
      )}
    </div>
  );
}
