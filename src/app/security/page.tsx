"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import DisplayCard from "@/components/DisplayCard";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { Wrench, Plus } from "lucide-react";
import { tempCarsColumns } from "@/lib/column-definitions";
import { getAllTempCars } from "@/lib/appwrite";
import { TempCarsDataTable } from "@/components/data-tables/temp-cars-data-table";
import { TempCar } from "@/lib/definitions";

type Props = {};

export default function Security({}: Props) {
  const pathname = usePathname();
  console.log("This is the pathname - ", pathname);

  const [name, setName] = useState("");
  const [numberOfCarsInProgress, setNumberOfCarsInProgress] = useState(0);
  const [tempCars, setTempCars] = useState<TempCar[]>([]);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      // console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getTempCars = async () => {
      const allTempCars = await getAllTempCars();
      const toExitCars = allTempCars.documents.filter(
        (car: TempCar) => car.carStatus == 2
      );
      console.log("TEMP CARS - ", allTempCars);
      setTempCars(toExitCars);
      setNumberOfCarsInProgress(allTempCars.total);
    };

    getUser();
    getTempCars();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-32">
      {!(name && tempCars) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <Link
            className="fixed z-20 bottom-7 right-7 bg-red-500 p-3 rounded-xl border-2 border-black"
            href={`${pathname}/addCar`}
          >
            <Plus size={40} color="white" />
          </Link>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="flex flex-row space-x-8 mt-16 w-full justify-center lg:justify-normal">
            <DisplayCard
              icon={<Wrench />}
              desc={"In Garage"}
              value={numberOfCarsInProgress}
            />
          </div>
          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Cars to Exit</div>
            <TempCarsDataTable columns={tempCarsColumns} data={tempCars} />
          </div>
        </>
      )}
    </div>
  );
}
