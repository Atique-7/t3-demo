"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import PrimaryButton from "@/components/PrimaryButton";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import DisplayCard from "@/components/DisplayCard";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { CarFront, Wrench, ListChecks } from "lucide-react";
import { tempCarsColumns } from "@/lib/column-definitions";
import { getAllJobCards, getAllTempCars } from "@/lib/appwrite";
import { TempCarsDataTable } from "@/components/data-tables/temp-cars-data-table";
import { TempCar } from "@/lib/definitions";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { convertStringsToArray, purposeOfVisits } from "@/lib/helper";

type Props = {};

export default function Service({}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [totalNumberOfCars, setTotalNumberOfCars] = useState(0);
  const [numberOfCarsInProgress, setNumberOfCarsInProgress] = useState(0);
  const [completedJobCars, setCompletedJobCars] = useState(0);
  const [currentJobCards, setCurrentJobCards] = useState([]);
  const [tempCars, setTempCars] = useState<TempCar[]>([]);

  const [servicePOV, setServicePOV] = useState<string[]>([]);

  useEffect(() => {
    let povArr: string[] = [];

    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      console.log(parsedToken);

      setUser(parsedToken);

      let foundObjs;

      if (parsedToken.labels[0] == "admin") {
        foundObjs = purposeOfVisits;
      } else {
        foundObjs = purposeOfVisits.filter(
          (pov) =>
            pov.code == parsedToken.labels[2] ||
            pov.code == parsedToken.labels[3]
        );
      }

      // let foundObjs = purposeOfVisits.filter(
      //   (pov) =>
      //     pov.code == parsedToken.labels[2] || pov.code == parsedToken.labels[3]
      // );

      foundObjs.map((pov) => povArr.push(pov.description));

      console.log("HELLOO", povArr);

      setServicePOV(povArr);

      setName(parsedToken.name);
      setEmail(parsedToken.email);
      console.log(email);
    };

    const getTempCars = async () => {
      const allTempCars = await getAllTempCars();
      const token = getCookie("user");
      const parsedToken = JSON.parse(String(token));
      console.log("TEMP CARS - ", allTempCars);

      if (parsedToken.labels[0] == "admin") {
        setTempCars(allTempCars.documents);
      } else {
        const toCreateCars = allTempCars.documents.filter((car: TempCar) => {
          if (car.purposeOfVisitAndAdvisors) {
            const purpose = convertStringsToArray(
              car.purposeOfVisitAndAdvisors
            );
            const cars = purpose.filter((item: any) => {
              return (
                // povArr.includes(item.description) &&
                parsedToken.email === item.advisorEmail
              );
            });
            return cars.length > 0; // Return true if any matching item is found
          }
        });
        console.log("JNOJOJ", toCreateCars);
        setTempCars(toCreateCars);
      }
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();
      console.log("THESE ARE THE CURRENT JOB CARDS - ", allJobCards);
      setTotalNumberOfCars(allJobCards.total);
      setCurrentJobCards(allJobCards.documents);

      const currentJobCardsArray = allJobCards.documents.filter(
        (jobCard: any) =>
          (jobCard.jobCardStatus == 0 || jobCard.jobCardStatus == 1) &&
          jobCard.sendToPartsManager == true
      );
      setNumberOfCarsInProgress(currentJobCardsArray.length);

      const completedJobCarsArray = allJobCards.documents.filter(
        (jobCard: any) => jobCard.jobCardStatus == null
      );
      setCompletedJobCars(completedJobCarsArray.length);
    };

    getUser();
    getJobCards();
    getTempCars();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-32">
      {!(name && tempCars) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="hidden lg:flex flex-row space-x-8 mt-16 w-full justify-center lg:justify-normal">
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
          <div className="flex lg:hidden w-full justify-center mt-10">
            <Carousel className="w-[70%]">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <DisplayCard
                      icon={<CarFront />}
                      desc={"Cars so far this month"}
                      value={totalNumberOfCars}
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <DisplayCard
                      icon={<Wrench />}
                      desc={"In Progress"}
                      value={numberOfCarsInProgress}
                    />
                  </div>
                </CarouselItem>
                <CarouselItem>
                  <div className="p-1">
                    <DisplayCard
                      icon={<ListChecks />}
                      desc={"Completed"}
                      value={completedJobCars}
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Cars in Garage</div>
            <TempCarsDataTable
              columns={tempCarsColumns}
              data={tempCars}
              povCategories={servicePOV}
            />
          </div>
        </>
      )}
    </div>
  );
}
