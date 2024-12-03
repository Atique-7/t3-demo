import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CurrentLabour, CurrentPart, Labour, Part } from "@/lib/definitions";
import {
  createTempLabourObj,
  taxAmtHelper,
  updateTempLabourObjQuantity,
} from "@/lib/helper";

export default function LabourSearch({
  items,
  currentLabours,
  setCurrentLabour,
  setIsEdited,
}: {
  items: Labour[] | null;
  currentLabours: CurrentLabour[] | null;
  setCurrentLabour: any;
  setIsEdited: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Labour[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items) {
      const searchResults = items.filter((item) => {
        const value: any = item.labourCode;
        const labourCode = item.labourCode;
        const labourName = item.labourName;
        if (typeof value === "string") {
          return (
            (typeof labourCode === "string" &&
              labourCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (typeof labourName === "string" &&
              labourName.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
        return false; // Handle non-string values as needed
      });
      setSearchResults(searchResults);
    }
  }, [items, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    searchInputRef.current?.focus(); // Keep focus on the input field
  };

  const handleSelect = (item: any) => {
    console.log("Clicked Part - ", item);
    console.log("CURRENT PARTS - ", currentLabours);

    let currentLabourObj = createTempLabourObj(item);

    if (currentLabours && currentLabourObj) {
      let findIndex = currentLabours?.findIndex(
        (work) => work.labourCode == item.$id
      );
      // console.log(findIndex);

      if (findIndex != -1) {
        let arrayFirstHalf = currentLabours.slice(0, findIndex);
        let arraySecondHalf = currentLabours.slice(findIndex + 1);

        currentLabourObj = updateTempLabourObjQuantity(currentLabourObj, 1);

        setCurrentLabour([
          ...arrayFirstHalf,
          currentLabourObj,
          ...arraySecondHalf,
        ]);
      } else {
        setCurrentLabour([...currentLabours, currentLabourObj]);
      }
    } else {
      setCurrentLabour([currentLabourObj]);
    }
    setIsEdited(true);
  };

  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search"
        ref={searchInputRef}
        className="focus:border-red-400 focus:border-2 w-[308px]"
      />
      {searchTerm && (
        <ul className="flex flex-col border border-gray-200 rounded-lg p-3 mt-2 divide-y-2 divide-solid w-[308px] h-fit max-h-[400px]">
          {searchResults.map((item) => (
            <li
              key={item.labourCode}
              className="p-2 text-wrap cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="font-medium">{item.labourName}</span>
              <span className="mx-2">-</span>
              <span>{item.labourCode}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
