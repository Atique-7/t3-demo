"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { getAllLabour, inputSingleLabourAppwrite } from "@/lib/appwrite";
import { roundToTwoDecimals } from "@/lib/helper";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {};

function AddLabour({}: Props) {
  const [labourName, setLabourName] = useState<string>();
  const [labourCode, setLabourCode] = useState<string>();
  const [hsn, setHsn] = useState<string>();
  const [gst, setGst] = useState<number>();
  const [mrp, setMrp] = useState<number>();
  const [isAddingParts, setIsAddingParts] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const addLabourToInventory = async () => {
    const laboursObj = await getAllLabour();
    const labours = laboursObj.documents;

    console.log("THESE ARE THE LABOURS - ", labours);

    let selectedLabour = labours[0];

    if (selectedLabour.labourCode == "998800") {
      selectedLabour = selectedLabour[1];
    }

    let calculatedLabourCode = `L2024-04-${
      Number(selectedLabour.labourCode.slice(9)) + 1
    }`;

    console.log(calculatedLabourCode);

    setIsAddingParts((prev) => true);

    if (labourName) {
      setIsValid(true);
      let newPart = {
        labourName: labourName.toUpperCase(),
        labourCode: calculatedLabourCode,
        hsn: "998729",
        gst: 18,
        cgst: 9,
        sgst: 9,
        mrp: 100,
      };

      const result = await inputSingleLabourAppwrite(newPart);

      if (result) {
        toast("Labour Added \u2705");

        setTimeout(() => {
          window.location.reload(); // Refreshes the page to get the latest data
        }, 1000);
      } else {
        toast("Something Went Wrong \u274C");
        setIsAddingParts((prev) => false);
      }
    } else {
      setIsValid(false);
      setIsAddingParts((prev) => false);
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-10">
      <div>
        <div className="font-semibold text-3xl">Add Labour</div>
        <div className="font-medium">Add the details of the labour</div>
      </div>
      <div className="flex flex-col mt-8 space-y-8">
        <div>
          <label className="block mb-2 font-medium">Labour Name</label>
          <Input
            id="partName"
            placeholder="Labour Name"
            onChange={(e) => setLabourName(e.target.value)}
          />
        </div>
        <PrimaryButton
          className="w-full"
          title={"Add Labour"}
          handleButtonPress={addLabourToInventory}
          isLoading={isAddingParts}
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

export default AddLabour;
