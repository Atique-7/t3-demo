"use client";

import React, { useState, useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { addCarModel, fetchCarMakeAndModels } from "@/lib/appwrite";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {};

function AddCarModel({}: Props) {
  const [ModelName, setModelName] = useState<string>(""); // Initialized to an empty string
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [makes, setMakes] = useState<
    { id: string; make: string; models: string[] }[]
  >([]);

  const [selectedMake, setSelectedMake] = useState<string | null>(null);
  const [selectedMakeId, setSelectedMakeId] = useState<string | null>(null);

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);

    // Find the ID of the selected make
    const makeObject = makes.find((item) => item.make === make);
    setSelectedMakeId(makeObject ? makeObject.id : null);

    console.log("Selected Make: ", selectedMake);
    console.log("Selected Make ID: ", selectedMakeId);
  };

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await fetchCarMakeAndModels();
        console.log("Makes: ", data);
        const formattedData = data.documents.map((doc: any) => ({
          id: doc.$id,
          make: doc.make,
          models: doc.models || [],
        }));
        setMakes(formattedData);
      } catch (error) {
        toast.error("Failed to fetch makes");
      }
    };
    fetchMakes();
  }, []);

  const addCarModelHandler = async () => {
    if (!ModelName || !selectedMakeId) {
      setIsValid(false);
      return;
    }
    setIsAddingCar(true);
    try {
      const result = await addCarModel(selectedMakeId, ModelName);
      toast.success("Car model added successfully");
      console.log(result);
      setModelName(""); // Clear the input after success
    } catch (error) {
      toast.error("Failed to add car model");
    } finally {
      setIsAddingCar(false);
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-10">
      <div>
        <div className="font-semibold text-3xl">Add Car</div>
        <div className="font-medium">Add the details of the Model</div>
      </div>
      <div className="flex flex-col mt-8 space-y-8">
        {/* Dropdown for selecting car make */}
        <div>
          <label className="block mb-2 font-medium">Select Make</label>
          <Select
            value={selectedMake || ""}
            onValueChange={handleMakeChange} // Updated handler
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Make" />
            </SelectTrigger>
            <SelectContent>
              {makes.map((item) => (
                <SelectItem key={item.id} value={item.make}>
                  {item.make}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input for car model */}
        <div>
          <label className="block mb-2 font-medium">Model Name</label>
          <Input
            id="modelName"
            placeholder="Model Name"
            value={ModelName} // Controlled input
            onChange={(e) => setModelName(e.target.value)}
          />
        </div>

        {/* Add Car Button */}
        <PrimaryButton
          className="w-full"
          title={"Add Car"}
          handleButtonPress={addCarModelHandler}
          isLoading={isAddingCar}
        />

        {!isValid && (
          <div>
            <div className="text-red-600">Please Fill All Fields</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddCarModel;
