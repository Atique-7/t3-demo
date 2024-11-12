"use client";

import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { createJobCard, getTempCarById } from "@/lib/appwrite";
import { ImageObj, TempCar } from "@/lib/definitions";
import React, { useEffect, useState } from "react";
import ImageCard from "@/components/ImageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter, useSearchParams } from "next/navigation";
import AddDiagnosis from "@/components/AddDiagnosis";
import { Checkbox } from "@/components/ui/checkbox";
import { objToStringArr } from "@/lib/helper";
import { toast } from "sonner";
import loader from "../../../../../public/assets/t3-loader.gif";
import Image from "next/image";

type Props = {};

export default function CreateJobCard({
  params,
}: {
  params: { tempCarId: any };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCounter = searchParams.get("currentCounter");

  const [currTempCar, setCurrTempCar] = useState<TempCar>();
  const [images, setImages] = useState<ImageObj[]>([]);
  const [currentState, setCurrentState] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [carFuel, setCarFuel] = useState("");
  const [carOdometer, setCarOdometer] = useState("");

  const [carDiagnosis, setCarDiagnosis] = useState([
    {
      diagnosis: "",
      id: Math.random().toString(36).slice(2),
    },
  ]);
  const [sendToPartsManager, setSendToPartsManager] = useState(true);

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const imageTypes: string[] = [
    "Fuel",
    "Odometer",
    "Front",
    "Back",
    "Left",
    "Right",
  ];
  useEffect(() => {
    const getCurrentTempCar = async () => {
      const tempCarObj = await getTempCarById(params.tempCarId);
      console.log("DETAILS - ", tempCarObj);
      setCurrTempCar(tempCarObj);
    };
    getCurrentTempCar();
  }, []);

  const handleContinue = () => {
    // console.log("VALIDITY - ", checkValidity());
    setCurrentState((prev) => prev + 1);
    console.log(images);
  };

  const handleCreateJobCard = async () => {
    setIsButtonLoading((prev) => true);

    const diagnosisStrings = carDiagnosis.map((item) => item.diagnosis);
    console.log(diagnosisStrings);

    const carImages = objToStringArr(images);
    console.log("Current Images - ", carImages);

    if (currTempCar) {
      let newJobCard = await createJobCard(
        currTempCar.$id,
        currTempCar.carNumber,
        carImages,
        carOdometer,
        carFuel,
        diagnosisStrings,
        customerName,
        customerPhone,
        customerAddress,
        sendToPartsManager,
        String(currTempCar.carsTableId),
        Number(currentCounter!)
      );

      if (newJobCard) {
        toast("Job Card has been Created \u2705");
        setTimeout(() => {
          router.push("/service");
        }, 2000);
      }
    }
    setIsButtonLoading((prev) => false);
  };

  return (
    <div className="flex flex-col w-[87%] lg:w-[90%] mt-32 lg:mt-10">
      {!currTempCar ? (
        <PartsPageSkeleton />
      ) : (
        <div>
          <div>
            <div className="font-semibold text-3xl">Create Job Card</div>
            <div className="font-medium">
              Car number - {currTempCar.carNumber}
            </div>
          </div>
          <div className="flex flex-col space-y-8 mt-10 w-full justify-center pb-10">
            <div className="flex flex-col space-y-5 w-full">
              <div className="font-semibold text-lg">Car Details</div>
              <div className="text-xs lg:text-sm">max size 5MB</div>
              <Input
                id="fuelReading"
                placeholder="Fuel Reading"
                onChange={(e) => setCarFuel(e.target.value)}
              />
              <Input
                id="odometer"
                type="number"
                placeholder="Odometer Reading"
                onChange={(e) => setCarOdometer(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                {imageTypes.map((type: string, index: number) => (
                  <ImageCard
                    key={index}
                    type={type}
                    images={images}
                    setImages={setImages}
                  />
                ))}
              </div>
            </div>
            {currentState == 0 && (
              <Button
                onClick={handleContinue}
                disabled={
                  !(carFuel != "" && carOdometer != "" && images.length >= 2)
                }
              >
                Next
              </Button>
            )}
            {currentState >= 1 && (
              <div className="flex flex-col w-full space-y-5">
                <div className="font-semibold text-lg">Customer Details</div>

                <Input
                  id="customerName"
                  placeholder="Customer Name"
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <Input
                  id="customerPhone"
                  placeholder="Customer Phone"
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <Textarea
                  id="customerAddress"
                  placeholder="Customer Address"
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
            )}
            {currentState == 1 && (
              <Button
                onClick={handleContinue}
                disabled={
                  !(
                    carFuel != "" &&
                    carOdometer != "" &&
                    images.length >= 2 &&
                    customerName != "" &&
                    customerPhone != "" &&
                    customerAddress != ""
                  )
                }
              >
                Next
              </Button>
            )}
            {currentState >= 2 && (
              <div className="flex flex-col w-full space-y-5">
                <div className="font-semibold text-lg">Car Diagnostics</div>
                <AddDiagnosis setCarDiagnosis={setCarDiagnosis} />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    onCheckedChange={(value) =>
                      setSendToPartsManager(value === true)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Send To Parts Manager
                  </label>
                </div>
              </div>
            )}
            {currentState == 2 && (
              <Button
                onClick={handleCreateJobCard}
                disabled={
                  !(
                    carFuel != "" &&
                    carOdometer != "" &&
                    images.length >= 2 &&
                    customerName != "" &&
                    customerPhone != "" &&
                    customerAddress != "" &&
                    carDiagnosis.length >= 2
                  )
                }
              >
                {isButtonLoading ? (
                  <Image src={loader} width={50} height={50} alt="Logo" />
                ) : (
                  <div>Create Job Card</div>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
