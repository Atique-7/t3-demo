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
  listAllUsers
} from "@/lib/appwrite";
import Image from "next/image";
import loader from "../../public/assets/t3-loader.gif";
import { toast } from "sonner";

import { MoveRight } from "lucide-react";
import {
  carMakeModels,
  carMakes,
  convertStringsToArray,
  convertToStrings,
  getAllCarMakes,
  purposeOfVisits,
  serviceAdvisors
} from "@/lib/helper";
import { functions } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { SearchSelect } from "./SearchSelect";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {};

export default function AddCarCards({ }: Props) {
  const router = useRouter();

  const [currentState, setCurrentState] = useState(0);

  const [carNumber, setCarNumber] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const purposeOfVisit = "hey";

  // Storing purposeOfVisitCode (number) and advisorEmail (string)
  const [purposeOfVisitSelections, setPurposeOfVisitSelections] = useState<
    { purposeOfVisitCode: number; description: string | undefined; advisorEmail: string, open: boolean }[]
  >([]);

  // Storing purposeOfVisitCode (number) and advisors (array of strings)
  const [currentServiceAdvisors, setCurrentServiceAdvisors] = useState<
  { purposeOfVisitCode: number; advisors: { name: string; email: string }[] }[]
>([]);

  // For controlling visibility of dropdowns for each purposeOfVisitCode
  const [dropdownVisible, setDropdownVisible] = useState<{ [key: number]: boolean }>({});

  const [advisorsByPurpose, setAdvisorsByPurpose] = useState<{ [key: number]: { name: string; email: string }[] }>({});

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const [isCorrectCarNumber, setIsCorrectCarNumber] = useState(false);
  const [isNewCar, setIsNewCar] = useState<string | null>(null);

  const [handleModelDisable, setHandleModelDisable] = useState(true);
  const [selectedCarMakeModels, setSelectedCarMakeModels] = useState<string[]>(
    []
  );

  // Fetch users and set up advisors based on advisorRoleId
  useEffect(() => {
    const fetchAdvisors = async () => {
      const users = await listAllUsers();
      
      const advisorsMap: { [key: number]: { name: string; email: string }[] } = {};

      users.forEach((user: any) => {
        const { advisorRoleId } = user.prefs;
        if(advisorRoleId) {
          if (advisorRoleId in advisorsMap) {
            advisorsMap[advisorRoleId].push({ name: user.name, email: user.email });
          } else {
            advisorsMap[advisorRoleId] = [{ name: user.name, email: user.email }];
          }
        }
      });

      setAdvisorsByPurpose(advisorsMap);
    };

    fetchAdvisors();
  }, []);

  function checkIndianCarNumber(inputText: string) {
    const indianCarNumberRegex =
      /^([A-Z]{2}\d{2}[A-Z]{1,2}\d{4})|(\d{2}BH\d{4}[A-Z]{2})$/;
    setCarNumber(inputText);
    setIsCorrectCarNumber((prev) => indianCarNumberRegex.test(inputText));
  }

  // Handling checkbox change for Purpose of Visit
  const handleCheckboxChange = (code: number) => {
    console.log(advisorsByPurpose);
    setDropdownVisible((prev) => ({
      ...prev,
      [code]: !prev[code],  // Toggle the dropdown for the selected purposeOfVisitCode
    }));

    // Update purposeOfVisitSelections state
    setPurposeOfVisitSelections((prev) => {
      const alreadyExists = prev.find((item) => item.purposeOfVisitCode === code);
      if (alreadyExists) {
        // Remove the purposeOfVisit if it's unchecked
        return prev.filter((item) => item.purposeOfVisitCode !== code);
      } else {
        // Add the purposeOfVisitCode and initialize its service advisor
        const povDescription = purposeOfVisits.find((item) => item.code === code)?.description;
        return [...prev, { purposeOfVisitCode: code, description: povDescription, advisorEmail: "", open: false}];
      }
    });

    // Update the currentServiceAdvisors state
    setCurrentServiceAdvisors((prev) => {
      const selectedAdvisors = serviceAdvisors.find(
        (item) => item.purposeOfVisitCode === code
      );

      const advisorExists = prev.some((item) => item.purposeOfVisitCode === code);

      if (advisorExists) {
        // Replace existing advisors for the given purposeOfVisitCode
        return prev.map((item) =>
          item.purposeOfVisitCode === code
            ? { ...item, advisors: selectedAdvisors?.advisors || [] }
            : item
        );
      } else {
        // Add new advisors for the given purposeOfVisitCode
        return [
          ...prev,
          { purposeOfVisitCode: code, advisors: selectedAdvisors?.advisors || [] },
        ];
      }
    });
  };

  // Handle advisor selection change for a given purposeOfVisitCode
  const handleServiceAdvisorChange = (code: number, advisorEmail: string) => {
    setPurposeOfVisitSelections((prev) =>
      prev.map((item) =>
        item.purposeOfVisitCode === code ? { ...item, advisorEmail: advisorEmail } : item
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

    if (
      searchedTempCar.total > 0
    ) {
      toast("Vehicle Already in the System");
    } else {
      if (prevHistory.total == 0) {
        console.log("THIS IS A NEW CAR");
        setIsNewCar((prev) => null);
        //   console.log("Updated Details -", carDetails);
      } else {
        console.log("THIS IS AN OLD CAR", prevHistory.documents[0]["$id"]);
        setIsNewCar((prev) => prevHistory.documents[0]["$id"]);
        console.log(prevHistory.documents[0].carMake)
        setCarMake(prevHistory.documents[0].carMake);
        setCarModel(prevHistory.documents[0].carModel);

        // let foundMake = carMakes.find(
        //   (make) => make.description == prevHistory.documents[0].carMake
        // );

        // console.log(foundMake);
      }

      setCurrentState((prev) => 1);
    }

    setIsButtonLoading((prev) => false);
  };

  const handleLog = () => {
    console.log("ADVISORS", currentServiceAdvisors);
    console.log("po", purposeOfVisitSelections);
    console.log("po", convertToStrings(purposeOfVisitSelections));
    console.log("po", convertStringsToArray(convertToStrings(purposeOfVisitSelections)));

  }

  const handleContinueEnterVehicle = async () => {
    setIsButtonLoading((prev) => true);

    const purposeOfVisitAndAdvisors = convertToStrings(purposeOfVisitSelections);

    if (carMake != "" && carModel != "" && purposeOfVisitSelections.length > 0) {
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
            isNewCar!,
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
              data={getAllCarMakes()}
              type="Car Makes"
              setDataValue={setCarMake}
              value={carMake}
            />
          </div>
          <div>
            <SearchSelect
              data={selectedCarMakeModels}
              type="Car Models"
              setDataValue={setCarModel}
              disabled={handleModelDisable}
              value={carModel}
            />
          </div>
          <div>
            <div>
              <label className="block mb-2 font-medium">Purpose of Visit</label>
              {purposeOfVisits.map((pov, index) => (
                <div key={index} className="mb-4">
                  {/* Aligning checkbox and label */}
                  <div className="flex items-center mb-2">
                    <Checkbox
                      id={`checkbox-${pov.code}`}
                      className="mr-2 cursor-pointer"
                      checked={dropdownVisible[pov.code] || false}
                      onCheckedChange={() => handleCheckboxChange(pov.code)} // Use code for checkbox change
                    />
                    <label htmlFor={`checkbox-${pov.code}`} className="cursor-pointer">
                      {pov.description} {/* Keep the description for user clarity */}
                    </label>
                  </div>

                  {/* Only show the dropdown if the checkbox is selected */}
                  {dropdownVisible[pov.code] && (
                    <Select
                      onValueChange={(advisorEmail) => handleServiceAdvisorChange(pov.code, advisorEmail)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Service Advisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* {serviceAdvisors
                          .find((item) => item.purposeOfVisitCode === pov.code)
                          ?.advisors.map((advisor, index) => (
                            <SelectItem key={index} value={advisor.email}>
                              {advisor.name}
                            </SelectItem>
                          ))} */}
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

            </div>
          </div>
          <Button
            color="#EF4444"
            // disabled={
            //   !(carMake != "" && carModel != "" && purposeOfVisit != "")
            // }
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
