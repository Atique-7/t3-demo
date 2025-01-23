"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";
import { useRouter, useSearchParams } from "next/navigation";
import { listAllUsers } from "@/lib/appwrite";
import {
  convertStringsToArray,
  convertToStrings,
  purposeOfVisits,
} from "@/lib/helper";
import { toast } from "sonner";
import Image from "next/image";
import loader from "../../../../../public/assets/t3-loader.gif";
import { config } from "@/lib/appwrite";
import { BaseRepository } from "@/lib/BaseRepo";
import { ObjectType } from "@/history/history-recorder";

type Props = {};

export default function AddPurposeOfVisitAndAdvisors({}: Props) {
  //   const searchParams = useSearchParams();
  //   const tempCarId = searchParams.get("tempcarId");
  //   const type = searchParams.get("type"); // Extract type (e.g., service/bodyshop)

  const router = useRouter();
  const [tempCarId, setTempCarId] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      setTempCarId(queryParams.get("tempcarId"));
      setType(queryParams.get("type"));
    }
  }, []);

  const [purposeOfVisitSelections, setPurposeOfVisitSelections] = useState<
    {
      purposeOfVisitCode: number;
      description: string | undefined;
      advisorEmail: string;
      open: boolean;
    }[]
  >([]);

  const [advisorsByPurpose, setAdvisorsByPurpose] = useState<{
    [key: number]: { name: string; email: string }[];
  }>({});

  const [checkboxStates, setCheckboxStates] = useState<{
    [key: number]: boolean;
  }>({});

  const [selectedPurposeCode, setSelectedPurposeCode] = useState<number>();
  const [dropdownVisible, setDropdownVisible] = useState<{
    [key: number]: boolean;
  }>({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  useEffect(() => {
    const fetchAdvisors = async () => {
      const users = await listAllUsers();

      const advisorsMap: { [key: number]: { name: string; email: string }[] } =
        {};

      users.forEach((user: any) => {
        const { advisorRoleId } = user.prefs;

        if (advisorRoleId) {
          const roleIds = JSON.parse(advisorRoleId);
          for (let i = 0; i < roleIds.length; i++) {
            const roleId = roleIds[i];
            if (roleId in advisorsMap) {
              advisorsMap[roleId].push({
                name: user.name,
                email: user.email,
              });
            } else {
              advisorsMap[roleId] = [{ name: user.name, email: user.email }];
            }
          }
        }
      });

      setAdvisorsByPurpose(advisorsMap);
    };

    fetchAdvisors();
  }, []);

  const handleCheckboxToggle = (code: number, checked: boolean) => {
    setCheckboxStates((prev) => ({
      ...prev,
      [code]: checked,
    }));

    setPurposeOfVisitSelections((prev) => {
      if (checked) {
        const povDescription = purposeOfVisits.find(
          (item) => item.code === code
        )?.description;

        return [
          ...prev,
          {
            purposeOfVisitCode: code,
            description: povDescription,
            advisorEmail: "",
            open: false,
          },
        ];
      } else {
        return prev.filter((item) => item.purposeOfVisitCode !== code);
      }
    });
  };

  const handleRadioChange = (code: number) => {
    setDropdownVisible({ [code]: true });

    setSelectedPurposeCode(code);

    const povDescription = purposeOfVisits.find(
      (item) => item.code === code
    )?.description;

    setPurposeOfVisitSelections((prev) => [
      ...prev.filter((item) => item.purposeOfVisitCode === 1),
      {
        purposeOfVisitCode: code,
        description: povDescription,
        advisorEmail: "",
        open: false,
      },
    ]);
  };

  const handleServiceAdvisorChange = (code: number, advisorEmail: string) => {
    setPurposeOfVisitSelections((prev) =>
      prev.map((item) =>
        item.purposeOfVisitCode === code
          ? { ...item, advisorEmail: advisorEmail }
          : item
      )
    );
  };

  const handleSave = async () => {
    setIsButtonLoading(true);

    if (purposeOfVisitSelections.length === 0) {
      toast.error("Please select advisors for all purposes of visit");
      setIsButtonLoading(false);
      return;
    }

    try {
      // Initialize the BaseRepository for temp cars
      const tempCarsBaseRepo: BaseRepository = new BaseRepository(
        config.tempCarsCollectionId,
        ObjectType.TEMP_CARS
      );

      // Fetch the current document for the given tempCarId
      const tempCar = await tempCarsBaseRepo.getDocumentById(tempCarId!);

      // Parse the existing purposeOfVisitAndAdvisors
      const existingPurposeOfVisitAndAdvisors = convertStringsToArray(
        tempCar.purposeOfVisitAndAdvisors || "[]"
      );

      // Append the new selections
      const mergedPurposeOfVisitAndAdvisors = [
        ...existingPurposeOfVisitAndAdvisors,
        ...purposeOfVisitSelections,
      ];

      // Update the document with the merged purposeOfVisitAndAdvisors
      await tempCarsBaseRepo.updateDocumentById(tempCarId!, {
        purposeOfVisitAndAdvisors: convertToStrings(
          mergedPurposeOfVisitAndAdvisors
        ),
      });

      setTimeout(() => {
        router.push("/admin/manage-jobcards");
      }, 1000);

      console.log(mergedPurposeOfVisitAndAdvisors);

      toast.success("Purpose of Visit and Advisors updated successfully!");
    } catch (error) {
      console.error("Failed to update purpose of visit and advisors:", error);
      toast.error("Failed to save updates");
    }

    setIsButtonLoading(false);
  };

  return (
    <div className="flex flex-col w-full space-y-5 m-10">
      {/* Overlay to disable page */}
      {isButtonLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={100} height={100} alt="Loading" />
        </div>
      )}
      <div className="flex flex-col w-full">
        <h2 className="text-xl font-semibold mb-4">
          Select Purpose of Visit and Advisor:
        </h2>

        {purposeOfVisits
          .filter((pov) =>
            type === "bodyshop" ? pov.code === 1 : pov.code !== 1
          )
          .map((pov, index) => (
            <div key={index} className="mb-4">
              {/* Aligning radio buttons and labels */}
              <div className="flex flex-col mb-4">
                {pov.code === 1 ? (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`checkbox-${pov.code}`}
                      className="mr-2 cursor-pointer"
                      checked={checkboxStates[pov.code] || false}
                      onCheckedChange={(checked) =>
                        handleCheckboxToggle(pov.code, Boolean(checked))
                      }
                    />
                    <label
                      htmlFor={`checkbox-${pov.code}`}
                      className="cursor-pointer"
                    >
                      {pov.description}
                    </label>
                  </div>
                ) : (
                  <RadioGroup
                    value={String(selectedPurposeCode)}
                    onValueChange={(value) => handleRadioChange(Number(value))}
                    className="space-y-2"
                  >
                    <RadioGroupItem
                      key={pov.code}
                      id={`radio-${pov.code}`}
                      value={String(pov.code)}
                    >
                      {pov.description}
                    </RadioGroupItem>
                  </RadioGroup>
                )}
              </div>

              {/* Only show the dropdown if the radio button or checkbox is selected */}
              {(checkboxStates[pov.code] || dropdownVisible[pov.code]) && (
                <Select
                  onValueChange={(advisorEmail) =>
                    handleServiceAdvisorChange(pov.code, advisorEmail)
                  }
                >
                  <SelectTrigger className="w-full mb-2">
                    <SelectValue placeholder="Select Service Advisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {advisorsByPurpose[pov.code]?.map((advisor, index) => (
                      <SelectItem key={index} value={advisor.email}>
                        {advisor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedPurposeCode(undefined); // Clear the selected radio
              setDropdownVisible({}); // Hide all dropdowns
              setPurposeOfVisitSelections([]); // Clear all selections
              setCheckboxStates({});
            }}
          >
            Clear All
          </Button>
          <Button
            color="#EF4444"
            disabled={
              isButtonLoading ||
              purposeOfVisitSelections.some((pov) => pov.advisorEmail === "")
            }
            onClick={handleSave}
          >
            {isButtonLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
