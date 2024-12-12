"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { History } from "lucide-react";
import { Car, JobCard, TempCar } from "@/lib/definitions";
import { getCarById, getJobCardById } from "@/lib/appwrite";

type Props = {
  carsTableId: string;
  currentJobCardId: string;
  currentJobCardStatus: number;
};

const CarHistory = (props: Props) => {
  const [car, setCar] = useState<Car>();
  useEffect(() => {
    const getCarDetails = async (id: string) => {
      const carObj = await getCarById(id);
      setCar(carObj);
      await createCarHistoryModel(carObj);
    };

    const createCarHistoryModel = async (carObj: Car) => {
      let testObj: any = {};
      carObj.allJobCards.map(async (jobCardId: string) => {
        const jobCardObj: JobCard = await getJobCardById(jobCardId);
        testObj[jobCardId] = jobCardObj;
      });
      console.log("CREATED HISTORY - ", testObj);
    };

    getCarDetails(props.carsTableId);
  }, []);

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="flex justify-center items-center border bordre-red-500 text-red-500 hover:bg-red-500 hover:text-white space-x-2"
          >
            <History />
            <div className="font-semibold">History</div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
          <DialogHeader>
            <DialogTitle className="flex justify-start items-center space-x-2">
              <History />
              <div>Car History</div>
            </DialogTitle>
            <DialogDescription>Previous entries for this car</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {car?.allJobCards.map((a, index) => (
              <div
                key={index}
                className="p-5 flex justify-between items-center rounded-xl border-2 border-red-500"
              >
                <div
                  className={`font-semibold ${
                    a == props.currentJobCardId ? "text-red-500" : ""
                  }`}
                >
                  {a}
                </div>
                <div className="text-white font-semibold text-sm py-2 px-4 bg-red-500 rounded-full">
                  {a == props.currentJobCardId ? <>Current</> : <></>}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            {/* <Button
              type="submit"
              className="bg-red-500"
              onClick={saveInsuranceDetails}
            >
              Save
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarHistory;
