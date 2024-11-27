import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { CurrentPart, Part } from "@/lib/definitions";
import {
  createTempPartObj,
  taxAmtHelper,
  updateTempPartObjQuantity,
} from "@/lib/helper";

export default function PartsSearch({
  items,
  currentParts,
  setCurrentParts,
  setIsEdited,
}: {
  items: Part[] | null;
  currentParts: CurrentPart[] | null;
  setCurrentParts: any;
  setIsEdited: any;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    if (items) {
      const searchResults = items.filter((item) => {
        const value: any = item.partNumber;
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false; // Handle non-string values as needed
      });
      setSearchResults(searchResults);
    }
  }, [items, searchTerm]);

  const debouncedSetSearchTerm = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300) // Adjust debounce delay (in milliseconds) as needed
  ).current;

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(event.target.value); // Use the debounced function
    searchInputRef.current?.focus(); // Keep focus on the input field; // Keep focus on the input field
  };

  const handleSelect = (item: any) => {
    console.log("Clicked Part - ", item);
    console.log("CURRENT PARTS - ", currentParts);

    let currentPartObj = createTempPartObj(item);

    if (currentParts && currentPartObj) {
      let findIndex = currentParts?.findIndex(
        (part) => part.partId == item.$id
      );
      // console.log(findIndex);

      if (findIndex != -1) {
        let arrayFirstHalf = currentParts.slice(0, findIndex);
        let arraySecondHalf = currentParts.slice(findIndex + 1);

        currentPartObj = updateTempPartObjQuantity(currentPartObj, 1);

        setCurrentParts([
          ...arrayFirstHalf,
          currentPartObj,
          ...arraySecondHalf,
        ]);
      } else {
        setCurrentParts([...currentParts, currentPartObj]);
      }
    } else {
      setCurrentParts([currentPartObj]);
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
              key={item.partNumber}
              className="p-2 text-wrap cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <span className="font-medium">{item.partName}</span>
              <span className="mx-2">-</span>
              <span>{item.partNumber}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
