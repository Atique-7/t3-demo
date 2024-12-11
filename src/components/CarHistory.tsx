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
import { Car, TempCar } from "@/lib/definitions";
import { getCarById } from "@/lib/appwrite";

type Props = {
  carObj: TempCar | Car;
};

const CarHistory = (props: Props) => {
  const [car, setCar] = useState<Car>();
  useEffect(() => {
    const getCar = async (id: string) => {
      // console.log(parsedToken);
      const result = await getCarById(id);
      console.log("CAR MILA HAI - ", result);
    };

    console.log("Car Obj - ", props.carObj);
    if (props.carObj.carsTableId) {
      console.log("HAS IN TEMP CAR");
      getCar(props.carObj.carsTableId);
      //   console.log("CAR MILA HAI - ", car);
    } else {
      console.log("HAS IN CAR");
    }
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
            <DialogTitle>Insurance Details</DialogTitle>
            <DialogDescription>
              Enter the details of your vehicle insurance
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="policyProvider" className="text-right">
                Policy Provider
              </Label>
              {/* <div className="col-span-3">
                <SearchSelectNEW
                  data={policyProviders}
                  placeholder="Select a provider"
                  value={policyProvider || ""}
                  onChange={setPolicyProvider}
                />
              </div> */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="policyNumber" className="text-right">
                Policy Number
              </Label>
              {/* <Input
                id="policyNumber"
                className="col-span-3"
                onChange={(event) => setPolicyNumber(event.target.value)}
                value={policyNumber}
              /> */}
            </div>
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
