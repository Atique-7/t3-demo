import AddCarCards from "@/components/AddCarCards";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

type Props = {};

export default function AddCar({}: Props) {
  return (
    <div className="flex flex-col w-[87%] lg:w-[90%] mt-32 lg:mt-10">
      {!true ? (
        <PartsPageSkeleton />
      ) : (
        <div>
          <div>
            <div className="font-semibold text-3xl">Add New Car</div>
            <div className="font-medium">Enter car details.</div>
          </div>
          <div className="flex flex-row space-x-8 mt-10 w-full justify-center">
            <AddCarCards />
          </div>
        </div>
      )}
    </div>
  );
}
