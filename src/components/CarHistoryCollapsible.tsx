"use client";

import * as React from "react";
import { ChevronDown, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { CurrentLabour, CurrentPart, JobCard } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { createDateExpandedObj, stringToObj } from "@/lib/helper";
import { get } from "http";
import { set } from "date-fns";

type CarHistoryCollapsibleProps = {
  jobCard: JobCard;
  current: boolean;
};

export function CarHistoryCollapsible({
  jobCard,
  current,
}: CarHistoryCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [parts, setParts] = useState<CurrentPart[]>([]);
  const [labour, setLabour] = useState<CurrentLabour[]>([]);

  useEffect(() => {
    const getFormattedDate = async () => {
      const createdDate = new Date(jobCard.$createdAt);
      const dateExpandedObj = await createDateExpandedObj(createdDate);
      setFormattedDate(dateExpandedObj.formattedDate);
    };

    getFormattedDate();

    setParts(stringToObj(jobCard.parts));
    setLabour(stringToObj(jobCard.labour));
  }, []);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div
        className={`flex flex-col p-3 rounded-xl ${
          current ? "border border-red-400" : ""
        }`}
      >
        {current && (
          <div className="text-white font-semibold text-sm py-2 px-4 bg-red-500 rounded-full w-fit">
            Current
          </div>
        )}
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={current}
            className={`flex justify-between`}
          >
            <h4 className="text-sm font-semibold">
              {formattedDate} - {jobCard.$id}
            </h4>
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-2 border border-gray-400 p-5 rounded-xl">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="font-bold">Parts</div>
            <div className="flex flex-col space-y-2 pl-2 divide-y-2">
              <div className="flex justify-between font-semibold ">
                <div>Name</div>
                <div>Qty</div>
              </div>
              {parts.map((part, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>{part.partName}</div>
                  <div>{part.quantity}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="font-bold">Labour</div>
            <div className="flex flex-col space-y-2 pl-2 divide-y-2">
              <div className="flex justify-between font-semibold">
                <div>Name</div>
                <div>Qty</div>
              </div>
              {labour.map((labour, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div>{labour.labourName}</div>
                  <div className="ml-5">{labour.quantity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
