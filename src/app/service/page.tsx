"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import PrimaryButton from "@/components/PrimaryButton";
import { JobCardsDataTable } from "@/components/data-tables/job-cards-data-table";
import DisplayCard, { DisplayAdvisorJobCards } from "@/components/DisplayCard";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { CarFront, Wrench, ListChecks, IndianRupee } from "lucide-react";
import { tempCarsColumns } from "@/lib/column-definitions";
import {
  getAllJobCards,
  getAllTempCars,
  getJobCardsBetween,
} from "@/lib/appwrite";
import { TempCarsDataTable } from "@/components/data-tables/temp-cars-data-table";
import { JobCard, TempCar } from "@/lib/definitions";
import Link from "next/link";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import {
  convertStringsToArray,
  createDateExpandedObj,
  purposeOfVisits,
  roundToTwoDecimals,
} from "@/lib/helper";

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

  const [serviceAdvisorStats, setServiceAdvisorStats] = useState({
    email: "",
    numberOfJobCards: 0,
    completedJobCards: 0,
    incompleteJobCards: 0,
    totalJobCardAmt: 0,
  });

  const [servicePOV, setServicePOV] = useState<string[]>([]);

  useEffect(() => {
    let povArr: string[] = [];

    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      console.log("TOKEN", parsedToken);

      setUser(parsedToken);

      let foundObjs;

      if (parsedToken.labels[0] == "admin") {
        foundObjs = purposeOfVisits;
      } else {
        const advisorRoles: number[] = JSON.parse(
          parsedToken.prefs.advisorRoleId
        );
        foundObjs = purposeOfVisits.filter((pov) =>
          advisorRoles.includes(pov.code)
        );
      }

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

      advisorStats(jobcards.documents);

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

    const advisorStats = async (jobCards: JobCard[]) => {
      let serviceAdvisors: any = [];

      jobCards.forEach((jobCard: JobCard) => {
        const index = serviceAdvisors.findIndex(
          (advisor: any) => advisor.email === jobCard.serviceAdvisorID
        );
        if (index === -1) {
          serviceAdvisors.push({
            email: jobCard.serviceAdvisorID,
            numberOfJobCards: 1,
            completedJobCards: jobCard.jobCardStatus >= 6 ? 1 : 0,
            incompleteJobCards: jobCard.jobCardStatus >= 6 ? 0 : 1,
            totalJobCardAmt: jobCard.amount,
          });
        } else {
          serviceAdvisors[index].numberOfJobCards += 1;
          if (jobCard.jobCardStatus >= 6) {
            serviceAdvisors[index].completedJobCards += 1;
            serviceAdvisors[index].totalJobCardAmt += jobCard.amount;
          } else {
            serviceAdvisors[index].incompleteJobCards += 1;
          }
        }
      });

      serviceAdvisors: [] = serviceAdvisors.map((advisor: any) => ({
        ...advisor,
        totalJobCardAmt: roundToTwoDecimals(advisor.totalJobCardAmt),
      }));

      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));

      const selectedStat = serviceAdvisors.find(
        (obj: any) => obj.email == parsedToken.email
      );

      setServiceAdvisorStats(selectedStat);

      console.log(
        "SERVICE ADVISOR STAT",
        serviceAdvisors.find((obj: any) => obj.email == parsedToken.email)
      );
    };

    getUser();
    getJobCardsForTimeline();
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
              completedCars={serviceAdvisorStats.completedJobCards}
              totalCars={serviceAdvisorStats.numberOfJobCards}
              advisorEmail={serviceAdvisorStats.email}
            />
            <DisplayCard
              icon={<IndianRupee />}
              desc={"Revenue So far"}
              value={serviceAdvisorStats.totalJobCardAmt}
            />
          </div>
          <div className="flex lg:hidden w-full justify-center mt-10">
            <Carousel className="w-[70%]">
              <CarouselContent>
                <CarouselItem>
                  <div className="p-1">
                    <DisplayAdvisorJobCards
                      completedCars={serviceAdvisorStats.completedJobCards}
                      totalCars={serviceAdvisorStats.numberOfJobCards}
                      advisorEmail={serviceAdvisorStats.email}
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
