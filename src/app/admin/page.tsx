"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import {
  getAllCars,
  getAllInvoices,
  getAllJobCards,
  getAllLabour,
  getAllParts,
  getAllTempCars,
} from "@/lib/appwrite";
import {
  Car,
  Invoice,
  JobCard,
  Labour,
  Part,
  TempCar,
} from "@/lib/definitions";
import { TestComponent } from "@/components/graphTest";
import CustomerSplit from "@/components/graphs/CustomerSplit";
import RevenueSplit from "@/components/graphs/RevenueSplit";
import DisplayCard from "@/components/DisplayCard";
import { Check, Wrench } from "lucide-react";
import { TimeAverage } from "@/components/graphs/TimeAverage";
import { CurrentCars } from "@/components/graphs/CurrentCars";
import { NightStock } from "@/components/graphs/NightStock";
import { InsuranceCases } from "@/components/graphs/InsuranceCases";
import { CurrentCarsPie } from "@/components/graphs/CurrentCarsPie";
import { InsuranceCasesBar } from "@/components/graphs/InsuranceCasesBar";
import { NightStockNew } from "@/components/graphs/NightStockNew";

type Props = {};

export default function Admin({}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [tempCars, setTempCars] = useState<TempCar[] | null>(null);
  const [jobCards, setJobCards] = useState<JobCard[] | null>(null);
  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [cars, setCars] = useState<Car[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      //   console.log(parsedToken);
      setName(parsedToken.name);
    };

    const getJobCards = async () => {
      const allJobCards = await getAllJobCards();
      setJobCards(allJobCards.documents);
    };

    const getTempCars = async () => {
      const allTempCars = await getAllTempCars();
      setTempCars(allTempCars);
    };

    const getParts = async () => {
      const partsObj = await getAllParts();
      // console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    const getLabour = async () => {
      const labourObj = await getAllLabour();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setLabours((prev) => labourObj.documents);
    };

    const getCars = async () => {
      const carsObj = await getAllCars();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setCars((prev) => carsObj.documents);
    };

    const getInvoices = async () => {
      const invoicesObj = await getAllInvoices();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setInvoices((prev) => invoicesObj.documents);
    };

    getUser();
    getJobCards();
    getCars();
    getTempCars();
    getParts();
    getLabour();
    getInvoices();
  }, []);

  return (
    <div className="flex flex-col w-[90%] mt-20">
      {!(
        name &&
        tempCars &&
        cars &&
        jobCards &&
        parts &&
        labours &&
        invoices
      ) ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">Hello {name}! </div>
            <div className="font-medium">T3, Mira Road</div>
          </div>
          <div className="flex flex-row mt-10 justify-evenly  items-center h-fit mb-10">
            <div className="w-1/4">
              <CustomerSplit />
            </div>
            <div className="w-1/4">
              <RevenueSplit />
            </div>
            <div className="w-1/4">
              <TimeAverage />
            </div>
            {/* <div className="w-1/4 flex-row space-y-2">
              <DisplayCard
                icon={<Check />}
                desc={"Cars Completed"}
                value={352}
              />
              <DisplayCard
                icon={<Wrench />}
                desc={"Cars In Progress"}
                value={26}
              />
            </div> */}
          </div>
          <div className="flex justify-center items-center w-full space-x-5 mb-10">
            <div className="w-[60%]">
              <InsuranceCasesBar />
            </div>
            <div className="flex flex-col space-y-5 justify-center items-center">
              <NightStockNew />
              <CurrentCarsPie />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
