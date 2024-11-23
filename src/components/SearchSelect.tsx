"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

const convertedData = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
];

export function SearchSelect({
  data,
  type,
  setDataValue,
  disabled,
  value,
}: any) {
  const [open, setOpen] = React.useState(false);
  //const [value, setValue] = React.useState("");

  const [internalValue, setInternalValue] = React.useState(value || ""); // Use prop value as initial state

  // Update the internal value when the external value changes
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);

  let convertedData: any = [];

  data.map((itemName: string) =>
    convertedData.push({ value: itemName, label: itemName })
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value
            ? convertedData.find((dataItem: any) => dataItem.value === value)
                ?.label
            : `Search ${type}...`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${type}...`} />
          <CommandList>
            <CommandEmpty>No dataItem found.</CommandEmpty>
            <CommandGroup>
              {convertedData.map((dataItem: any) => (
                <CommandItem
                  onClick={(event) => event.stopPropagation()}
                  key={dataItem.value}
                  value={dataItem.value}
                  onSelect={(currentValue) => {
                    const newValue =
                      currentValue === internalValue ? "" : currentValue;
                    setInternalValue(newValue);
                    //setValue(currentValue === value ? "" : currentValue);
                    setDataValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 ",
                      value === dataItem.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {dataItem.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
