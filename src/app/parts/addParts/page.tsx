"use client";

import PrimaryButton from "@/components/PrimaryButton";
import { Input } from "@/components/ui/input";
import { inputSinglePartAppwrite } from "@/lib/appwrite";
import { roundToTwoDecimals } from "@/lib/helper";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {};

function AddParts({}: Props) {
  const [partName, setPartName] = useState<string>();
  const [partNumber, setPartNumber] = useState<string>();
  const [hsn, setHsn] = useState<string>();
  const [gst, setGst] = useState<number>();
  const [mrp, setMrp] = useState<number>();
  const [isAddingParts, setIsAddingParts] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const addPartToInventory = async () => {
    setIsAddingParts((prev) => true);

    if (partName && partNumber && hsn && mrp && gst) {
      setIsValid(true);
      let newPart = {
        partName,
        partNumber,
        hsn,
        gst,
        cgst: gst / 2,
        sgst: gst / 2,
        mrp: roundToTwoDecimals(mrp / (1 + gst / 100)),
      };

      const result = await inputSinglePartAppwrite(newPart);

      if (result) {
        toast("Part Added \u2705");

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
        <div className="font-semibold text-3xl">Add Parts</div>
        <div className="font-medium">Add the details of the part</div>
      </div>
      <div className="flex flex-col mt-8 space-y-8">
        <div>
          <label className="block mb-2 font-medium">Part Name</label>
          <Input
            id="partName"
            placeholder="Part Name"
            onChange={(e) => setPartName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Part Number</label>
          <Input
            id="partNumber"
            placeholder="Part Number"
            onChange={(e) => setPartNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">HSN</label>
          <Input
            id="hsn"
            placeholder="HSN"
            onChange={(e) => setHsn(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST %</label>
          <Input
            id="gst"
            placeholder="GST %"
            type="number"
            onChange={(e) => setGst(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">MRP (With tax)</label>
          <Input
            id="mrp"
            placeholder="MRP (With Tax)"
            onChange={(e) => setMrp(Number(e.target.value))}
          />
        </div>
        <PrimaryButton
          className="w-full"
          title={"Add Part"}
          handleButtonPress={addPartToInventory}
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

export default AddParts;
