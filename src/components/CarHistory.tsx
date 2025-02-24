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
import { CarHistoryCollapsible } from "./CarHistoryCollapsible";

type Props = {
  carsTableId: string;
  currentJobCardId: string;
  currentJobCardStatus: number;
};

const CarHistory = (props: Props) => {
  const [car, setCar] = useState<Car>();
  const [carHistory, setCarHistory] = useState<JobCard[]>([]);

  useEffect(() => {
    const getCarDetails = async (id: string) => {
      const carObj = await getCarById(id);
      setCar(carObj);
      await createCarHistoryModel(carObj);
    };

    const createCarHistoryModel = async (carObj: Car) => {
      const carHistoryObj: any = await Promise.all(
        carObj.allJobCards.map(async (jobCardId: string) => {
          const jobCardObj: JobCard = await getJobCardById(jobCardId);
          return jobCardObj;
        })
      );

      const filteredHistory = carHistoryObj.filter((item: any) => item != null);

      console.log("CREATED HISTORY - ", filteredHistory);

      setCarHistory(filteredHistory);
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
        <DialogContent className="overflow-scroll max-h-dvh focus:outline-none">
          <DialogHeader>
            <DialogTitle className="flex justify-start items-center space-x-2">
              <History />
              <div>Car History</div>
            </DialogTitle>
            <DialogDescription>Previous entries for this car</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {carHistory.map((jobCard: JobCard, index: number) => (
              // <div
              //   key={index}
              //   className="p-5 flex justify-between items-center rounded-xl border-2 border-red-500"
              // >
              //   <div
              //     className={`font-semibold ${
              //       jobCard.$id == props.currentJobCardId ? "text-red-500" : ""
              //     }`}
              //   >
              //     {jobCard.$id}
              //   </div>
              //   {jobCard.$id == props.currentJobCardId ? (
              //     <div className="text-white font-semibold text-sm py-2 px-4 bg-red-500 rounded-full">
              //       Current
              //     </div>
              //   ) : (
              //     <></>
              //   )}
              // </div>
              <div key={index}>
                <CarHistoryCollapsible
                  jobCard={jobCard}
                  current={jobCard.$id === props.currentJobCardId}
                />
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
