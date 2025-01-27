"use client";

import React, { useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Use a textarea for the address
import { toast } from "sonner";
import { BaseRepository } from "@/lib/BaseRepo"; // Import your BaseRepository
import { ObjectType } from "@/history/history-recorder";
import { config } from "@/lib/appwrite";

type Props = {};

function AddInsurer({}: Props) {
  const [insurerName, setInsurerName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [gstNumber, setGstNumber] = useState<string>("");
  const [isAddingInsurer, setIsAddingInsurer] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const validateForm = () => {
    return (
      insurerName.trim() !== "" &&
      address.trim() !== "" &&
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/.test(
        gstNumber
      ) // Validates GST format
    );
  };

  const saveInsurerDetails = async () => {
    if (!validateForm()) {
      setIsValid(false);
      return;
    }

    setIsAddingInsurer(true);

    try {
      const insurerRepo = new BaseRepository(
        config.insuranceProvidersCollectionId,
        ObjectType.INSURANCE_DETAILS
      );
      const result = await insurerRepo.createDocument({
        insurer: insurerName,
        address: address,
        GST: gstNumber,
      });

      if (result.$createdAt) {
        toast("\u2705 Insurer added successfully!");
      }
      console.log(result);
      // Reset form fields
      setInsurerName("");
      setAddress("");
      setGstNumber("");
      setIsValid(true);
    } catch (error) {
      toast.error("Failed to add insurer details");
      console.error("Error saving insurer details:", error);
    } finally {
      setIsAddingInsurer(false);
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-10">
      <div>
        <div className="font-semibold text-3xl">Add Insurer</div>
        <div className="font-medium">Add the details of the insurer</div>
      </div>
      <div className="flex flex-col mt-8 space-y-8">
        {/* Insurer Name */}
        <div>
          <label className="block mb-2 font-medium">Insurer Name</label>
          <Input
            id="insurerName"
            placeholder="Insurer Name"
            value={insurerName}
            onChange={(e) => setInsurerName(e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="block mb-2 font-medium">Address</label>
          <Textarea
            id="address"
            placeholder="Insurer Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* GST Number */}
        <div>
          <label className="block mb-2 font-medium">GST Number</label>
          <Input
            id="gstNumber"
            placeholder="GST Number (e.g., 22AAAAA0000A1Z5)"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
          />
        </div>

        {/* Add Insurer Button */}
        <PrimaryButton
          className="w-full"
          title={"Add Insurer"}
          handleButtonPress={saveInsurerDetails}
          isLoading={isAddingInsurer}
        />

        {!isValid && (
          <div>
            <div className="text-red-600">Please fill all fields correctly</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddInsurer;
