"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import {
  createCar,
  createTempCar,
  searchCarHistory,
  searchTempCar,
  client,
  listAllUsers,
  fetchCarMakeAndModels,
} from "@/lib/appwrite";
import Image from "next/image";
import loader from "../../public/assets/t3-loader.gif";
import { toast } from "sonner";

import {
  convertStringsToArray,
  convertToStrings,
  purposeOfVisits,
  serviceAdvisors,
} from "@/lib/helper";

import { useRouter } from "next/navigation";
import { SearchSelect } from "./SearchSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";

type Props = {};

export default function AddCarCards({}: Props) {
  const router = useRouter();

  const [currentState, setCurrentState] = useState(0);

  const [carNumber, setCarNumber] = useState("");

  const [carMake, setCarMake] = useState<string>("");
  const [carModel, setCarModel] = useState<string>("");
  const [handleModelDisable, setHandleModelDisable] = useState(true);
  const [selectedCarMakeModels, setSelectedCarMakeModels] = useState<string[]>(
    []
  );
  const [carMakeModels, setCarMakeModels] = useState<
    { company: string; models: string[] }[]
  >([]);

  useEffect(() => {
    // Fetch car makes and models from the backend
    const fetchData = async () => {
      try {
        const data = await fetchCarMakeAndModels();
        const formattedData = data.documents.map((doc: any) => ({
          company: doc.make,
          models: doc.models || [],
        }));
        setCarMakeModels(formattedData);
      } catch (error) {
        console.error("Failed to fetch car makes and models:", error);
      }
    };

    fetchData();
  }, []);

  const handleCarMakeChange = (value: string) => {
    setHandleModelDisable(true); // Disable model selection temporarily
    setCarMake(value);

    const foundObj = carMakeModels.find((make) => make.company === value);

    if (foundObj) {
      setSelectedCarMakeModels(foundObj.models);
      setHandleModelDisable(false); // Enable model selection
    }
  };

  // Storing purposeOfVisitCode (number) and advisorEmail (string)
  const [purposeOfVisitSelections, setPurposeOfVisitSelections] = useState<
    {
      purposeOfVisitCode: number;
      description: string | undefined;
      advisorEmail: string;
      open: boolean;
    }[]
  >([]);

  // Storing purposeOfVisitCode (number) and advisors (array of strings)
  const [currentServiceAdvisors, setCurrentServiceAdvisors] = useState<
    {
      purposeOfVisitCode: number;
      advisors: { name: string; email: string }[];
    }[]
  >([]);

  // For controlling visibility of dropdowns for each purposeOfVisitCode
  const [dropdownVisible, setDropdownVisible] = useState<{
    [key: number]: boolean;
  }>({});

  const [checkboxStates, setCheckboxStates] = useState<{
    [key: number]: boolean;
  }>({});

  const [selectedPurposeCode, setSelectedPurposeCode] = useState<number>();

  const [advisorsByPurpose, setAdvisorsByPurpose] = useState<{
    [key: number]: { name: string; email: string }[];
  }>({});

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [isCorrectCarNumber, setIsCorrectCarNumber] = useState(false);
  const [isNewCar, setIsNewCar] = useState<string | null>(null);

  // Fetch users and set up advisors based on advisorRoleId
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
            console.log(roleId);
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

  function checkIndianCarNumber(inputText: string) {
    const indianCarNumberRegex =
      /^([A-Z]{2}\d{2}[A-Z]{1,2}\d{4})|(\d{2}BH\d{4}[A-Z]{1,2})$/;
    setCarNumber(inputText);
    setIsCorrectCarNumber((prev) => indianCarNumberRegex.test(inputText));
  }

  const handleCheckboxToggle = (code: number, checked: boolean) => {
    // Toggle dropdown visibility for the checkbox

    setCheckboxStates((prev) => ({
      ...prev,
      [code]: checked, // Set the checked state for this checkbox
    }));

    // Update purposeOfVisitSelections for checkbox
    setPurposeOfVisitSelections((prev) => {
      if (checked) {
        // Add the checkbox selection
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
        // Remove the checkbox selection
        return prev.filter((item) => item.purposeOfVisitCode !== code);
      }
    });

    setCurrentServiceAdvisors((prev) => {
      if (checked) {
        const selectedAdvisors = serviceAdvisors.find(
          (item) => item.purposeOfVisitCode === code
        );

        return [
          ...prev,
          {
            purposeOfVisitCode: code,
            advisors: selectedAdvisors?.advisors || [],
          },
        ];
      } else {
        return prev.filter((item) => item.purposeOfVisitCode !== code);
      }
    });
  };

  const handleRadioChange = (code: number) => {
    setDropdownVisible({ [code]: true }); // Clear all others and only show the selected one

    setSelectedPurposeCode(code); // Update the selected code state

    setPurposeOfVisitSelections((prev) => {
      const retainedSelections = prev.filter(
        (item) => item.purposeOfVisitCode === 1
      );

      const povDescription = purposeOfVisits.find(
        (item) => item.code === code
      )?.description;

      // Add the new radio selection to the retained values
      return [
        ...retainedSelections,
        {
          purposeOfVisitCode: code,
          description: povDescription,
          advisorEmail: "",
          open: false,
        },
      ];
    });

    setCurrentServiceAdvisors(() => {
      const selectedAdvisors = serviceAdvisors.find(
        (item) => item.purposeOfVisitCode === code
      );

      return [
        {
          purposeOfVisitCode: code,
          advisors: selectedAdvisors?.advisors || [],
        },
      ];
    });
  };

  // Handle advisor selection change for a given purposeOfVisitCode
  const handleServiceAdvisorChange = (code: number, advisorEmail: string) => {
    setPurposeOfVisitSelections((prev) =>
      prev.map((item) =>
        item.purposeOfVisitCode === code
          ? { ...item, advisorEmail: advisorEmail }
          : item
      )
    );
  };

  const handleContinueCarNumber = async () => {
    //
    setIsButtonLoading((prev) => true);

    let prevHistory = await searchCarHistory(carNumber);
    console.log("CAR HISTORY - ", prevHistory);

    let searchedTempCar = await searchTempCar(carNumber);
    console.log("CAR TEMP - ", searchedTempCar);

    if (searchedTempCar.total > 0) {
      toast("Vehicle Already in the System");
    } else {
      if (prevHistory.total == 0) {
        console.log("THIS IS A NEW CAR");
        setIsNewCar((prev) => null);
        //   console.log("Updated Details -", carDetails);
      } else {
        console.log("THIS IS AN OLD CAR", prevHistory.documents[0]["$id"]);
        setIsNewCar((prev) => prevHistory.documents[0]["$id"]);
        console.log(prevHistory.documents[0].carMake);
        setCarMake(prevHistory.documents[0].carMake);
        setCarModel(prevHistory.documents[0].carModel);
      }

      setCurrentState((prev) => 1);
    }

    setIsButtonLoading((prev) => false);
  };

  const handleLog = () => {
    console.log("ADVISORS", currentServiceAdvisors);
    console.log("po", purposeOfVisitSelections);
    console.log("po", convertToStrings(purposeOfVisitSelections));
    console.log(
      "po",
      convertStringsToArray(convertToStrings(purposeOfVisitSelections))
    );
  };

  const handleContinueEnterVehicle = async () => {
    setIsButtonLoading((prev) => true);

    const purposeOfVisitAndAdvisors = convertToStrings(
      purposeOfVisitSelections
    );

    if (
      carMake != "" &&
      carModel != "" &&
      purposeOfVisitSelections.length > 0
    ) {
      if (isNewCar == null) {
        console.log("THIS IS A NEW CAR");
        try {
          const newCar = await createCar(
            carNumber,
            carMake,
            carModel,

            purposeOfVisitAndAdvisors
          );
          console.log(newCar);

          await createTempCar(
            carNumber,
            carMake,
            carModel,
            purposeOfVisitAndAdvisors,
            newCar.$id
          );

          toast("New Vehicle Entered \u2705");
          setTimeout(() => {
            router.push("/security");
          }, 1000);
        } catch {
          console.log("THERE WAS AN ERROR");
        }
      } else {
        console.log("THIS IS NOT A NEW CAR");
        try {
          await createTempCar(
            carNumber,
            carMake,
            carModel,
            purposeOfVisitAndAdvisors,
            isNewCar!
          );
          toast("New Vehicle Entered \u2705");
          setTimeout(() => {
            router.push("/security");
          }, 2000);
        } catch {
          console.log("THERE WAS AN ERROR");
        }
      }
    } else {
      toast("Please enter all details");
    }

    setIsButtonLoading((prev) => false);
  };

  useEffect(() => {
    const handleCarMakeChange = (value: string) => {
      setHandleModelDisable((prev) => true);
      setCarMake((prev) => value);

      let foundObj = carMakeModels.find(
        (make: { company: string; models: string[] }) => make.company == value
      );

      if (foundObj) {
        setSelectedCarMakeModels(foundObj!.models);
        setHandleModelDisable((prev) => false);
      }
    };

    handleCarMakeChange(carMake);
  }, [carMake]);

  return (
    <div className="flex flex-col w-full space-y-5">
      {/* Overlay to disable page */}
      {isButtonLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={100} height={100} alt="Loading" />
        </div>
      )}
      <div className="flex w-full flex-col space-y-5">
        <Input
          id="carNumber"
          placeholder="Car Number"
          onChange={(e) => checkIndianCarNumber(e.target.value)}
          disabled={currentState != 0}
        />
        {currentState == 0 && (
          <Button
            color="#EF4444"
            disabled={!isCorrectCarNumber}
            onClick={handleContinueCarNumber}
          >
            {isButtonLoading ? (
              <Image src={loader} width={50} height={50} alt="Logo" />
            ) : (
              <div>Next</div>
            )}
          </Button>
        )}
      </div>
      {currentState == 1 && (
        <div className="flex w-full flex-col space-y-5">
          <div className="w-full">
            <SearchSelect
              data={carMakeModels.map((make) => make.company)} // Provide car makes as options
              type="Car Makes"
              setDataValue={handleCarMakeChange} // Handle car make selection
              value={carMake}
            />
          </div>
          <div>
            <SearchSelect
              data={selectedCarMakeModels} // Provide models of the selected make
              type="Car Models"
              setDataValue={setCarModel} // Handle model selection
              disabled={handleModelDisable} // Disable if no make is selected
              value={carModel}
            />
          </div>
          <div>
            <div>
              <label className="block mb-2 font-medium">Purpose of Visit</label>

              {purposeOfVisits.map((pov, index) => (
                <div key={index} className="mb-4">
                  {/* Aligning radio buttons and labels */}
                  <div className="flex flex-col mb-2">
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
                        onValueChange={(value) =>
                          handleRadioChange(Number(value))
                        }
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

                  {/* Only show the dropdown if the radio button is selected */}
                  {(checkboxStates[pov.code] || dropdownVisible[pov.code]) && (
                    <Select
                      onValueChange={(advisorEmail) =>
                        handleServiceAdvisorChange(pov.code, advisorEmail)
                      }
                    >
                      <SelectTrigger className="w-full mb-10">
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
            </div>
          </div>
          <Button
            color="#EF4444"
            disabled={
              isButtonLoading ||
              carMake === "" ||
              carModel === "" ||
              purposeOfVisitSelections.length === 0 ||
              purposeOfVisitSelections.some(
                (selection) => selection.advisorEmail === ""
              )
            }
            onClick={handleContinueEnterVehicle}
          >
            {isButtonLoading ? (
              <Image src={loader} width={50} height={50} alt="Logo" />
            ) : (
              <div>Enter Vehicle</div>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
