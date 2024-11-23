import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

type SearchSelectProps = {
  data: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const SearchSelectNEW: React.FC<SearchSelectProps> = ({
  data,
  placeholder,
  value,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        data.filter((item) =>
          item.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="w-full flex justify-between items-center border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-gray-200"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-expanded={open}
      >
        {value || placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-500" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
          />
          {filteredData.length > 0 ? (
            <ul className="py-1">
              {filteredData.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                    value === item ? "bg-gray-100 font-medium" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === item ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-gray-500">
              No options found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
