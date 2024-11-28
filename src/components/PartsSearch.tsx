import { CurrentPart, Part } from "@/lib/definitions";
import { createTempPartObj, updateTempPartObjQuantity } from "@/lib/helper";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import loader from "../../public/assets/t3-loader.gif";

const SearchComponent = ({
  items,
  currentParts,
  setCurrentParts,
  setIsEdited,
}: {
  items: Part[] | null;
  currentParts: CurrentPart[] | null;
  setCurrentParts: any;
  setIsEdited: any;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Immediate input value
  const [searchTerm, setSearchTerm] = useState(""); // Debounced search term
  const [searchResults, setSearchResults] = useState<Part[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Custom debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced version of setSearchTerm
  const debouncedSetSearchTerm = useRef(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300) // Adjust debounce delay (in milliseconds) as needed
  ).current;

  // Update search results whenever the searchTerm changes
  useEffect(() => {
    if (items) {
      const results = items.filter((item) => {
        const partNumber = item.partNumber;
        const partName = item.partName;
        return (
          (typeof partNumber === "string" &&
            partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (typeof partName === "string" &&
            partName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        // return false; // Handle non-string values as needed
      });
      setSearchResults(results);
      setIsLoading((prev) => false);
    }
  }, [items, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading((prev) => true);
    const value = event.target.value;
    setInputValue(value); // Update input field immediately
    debouncedSetSearchTerm(value); // Debounced update for searchTerm
    searchInputRef.current?.focus(); // Keep focus on the input field
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
      <input
        type="text"
        ref={searchInputRef}
        value={inputValue} // Controlled value
        onChange={handleSearch}
        placeholder="Search"
        aria-label="Search Input"
        className="focus:border-red-400 focus:border-2 w-[308px]"
      />
      {isLoading ? (
        <>
          <div>
            <Image src={loader} width={50} height={50} alt="Logo" />
          </div>
        </>
      ) : (
        <>
          {searchTerm && (
            <ul className="flex flex-col border border-gray-200 rounded-lg p-3 mt-2 divide-y-2 divide-solid w-[308px] h-fit max-h-[400px] overflow-scroll">
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
        </>
      )}
    </div>
  );
};

export default SearchComponent;
