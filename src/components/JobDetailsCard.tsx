"use client";

import React, { useState } from "react";

import { ChevronsUpDown, Wrench, ChevronUp, ChevronDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "./ui/button";
import { convertStringsToArray } from "@/lib/helper";

export default function JobDetailsCard({ data, jobCardTotal, diagnosis }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const purposeOfVisitAndAdvisors = convertStringsToArray(
    data.car.purposeOfVisitAndAdvisors
  );

  return (
    <div className="flex flex-col min-h-[175px] h-fit min-w-[420px] w-max border-2 border-gray-200 rounded-lg shadow-sm p-4">
      <div className="mb-5">Job Details</div>
      <div className="flex flex-row">
        <div className="border-2 rounded-full p-4 w-fit mb-6 bg-gray-200 shadow-sm mr-8">
          <Wrench />
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-2xl">
            {data.jobCard.purposeOfVisit}
          </div>
          <div className="font-semibold text-gray-500">
            {new Date(data.jobCard.$createdAt).toLocaleString()}
          </div>
          <div className="text-2xl font-bold text-black mb-4">
            &#8377;{jobCardTotal}
          </div>
        </div>
      </div>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-fit space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="text-sm font-semibold">Diagnosis</h4>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              {/* <ChevronDown className="h-4 w-4" /> */}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-2">
          {diagnosis.map((point: string, index: number) => (
            <div
              className="rounded-md border px-4 py-3 text-sm text-balance"
              key={index}
            >
              {point}
            </div>
          ))}
          {/* <div className="rounded-md border px-4 py-3 text-sm">
            @radix-ui/primitives
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            @radix-ui/colors
          </div>
          <div className="rounded-md border px-4 py-3 text-sm">
            @stitches/react
          </div> */}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
