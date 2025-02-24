"use client";

import { ChangesHistoryDataTable } from "@/components/data-tables/changes-history-data-table";
import PartsPageSkeleton from "@/components/skeletons/PartsPageSkeleton";
import { getHistory } from "@/lib/appwrite";
import { changesHistoryColumns } from "@/lib/column-definitions";
import React, { use, useEffect, useState } from "react";

type Props = {};

function ViewChanges({}: Props) {
  const [history, setHistory] = useState<any[] | null>(null);
  useEffect(() => {
    const getAllHistory = async () => {
      const history = await getHistory();
      const formattedObj = await Promise.all(
        history.documents.map(async (doc: any) => {
          const historyItemObj: any = {};
          await Promise.all(
            doc.history.map((historyItem: any) => {
              const [key, ...rest] = historyItem.split(":");
              const value = rest.join(":").trim(); // Join rest in case value contains a colon
              const trimmedKey = key.trim();
              if (trimmedKey === "changes") {
                historyItemObj[trimmedKey] = JSON.parse(value);
              } else {
                historyItemObj[trimmedKey] = value;
              }
            })
          );
          return historyItemObj;
        })
      );
      console.log(formattedObj);
      setHistory(formattedObj);
    };
    getAllHistory();
  }, []);
  return (
    <div className="flex flex-col w-[90%] mt-32">
      {!history ? (
        <PartsPageSkeleton />
      ) : (
        <>
          <div>
            <div className="font-semibold text-3xl">View Changes </div>
            <div className="font-medium">List of changes made by the users</div>
          </div>

          <div className="flex flex-col mt-16">
            <div className="font-semibold text-2xl mb-5">Changes History</div>
            {/* <TempCarsDataTable
              columns={tempCarsColumns}
              data={tempCars}
              povCategories={servicePOV}
            /> */}
            <ChangesHistoryDataTable
              columns={changesHistoryColumns}
              data={history}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ViewChanges;
