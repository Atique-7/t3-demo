import { CarFront, IndianRupee } from "lucide-react";
import React from "react";

export default function DisplayCard({ icon, desc, value }: any) {
  return (
    <div className="flex flex-col w-full lg:h-[188px] lg:min-w-[280px] lg:w-[416px] border-2 border-gray-200 rounded-lg shadow-sm p-4">
      <div className="border-2 rounded-lg p-3 w-fit mb-6">{icon}</div>
      <div className="text-sm text-gray-500">{desc}</div>
      <div className="text-3xl font-semibold mt-4">
        {desc == "Revenue So far" ? (
          <div className="flex space-x-2 items-center">
            <IndianRupee />
            {value.toLocaleString("en-IN")}
          </div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export function DisplayAdvisorJobCards({
  completedCars,
  totalCars,
  advisorEmail,
}: any) {
  return (
    <div className="flex flex-col w-full lg:h-[188px] lg:min-w-[280px] lg:w-[416px] border-2 border-gray-200 rounded-lg shadow-sm p-4">
      <div className="border-2 rounded-lg p-3 w-fit mb-6">
        <CarFront />
      </div>
      <div className="text-sm text-gray-500">
        <div>{advisorEmail}</div>
      </div>
      <div className="font-semibold mt-4 text-gray-500">
        <span className="text-3xl font-semibold text-red-500 mr-2">
          {completedCars}
        </span>{" "}
        Cars completed of{" "}
        <span className="text-3xl font-semibold text-black ml-2">
          {totalCars}
        </span>
      </div>
    </div>
  );
}
