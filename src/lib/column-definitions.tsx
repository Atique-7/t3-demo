"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  convertStringsToArray,
  convertToStrings,
  createDateExpandedObj,
  jobCardStatusKey,
} from "../lib/helper";

import {
  JobCard,
  Part,
  CurrentPart,
  CurrentLabour,
  Labour,
  TempCar,
} from "@/lib/definitions";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  checkIfAnotherJobCardCanBeOpened,
  config,
  databases,
  deletePartItem,
  deleteTempCar,
  listAllUsers,
} from "./appwrite";
import { toast } from "sonner";

export const jobCardColumns: ColumnDef<JobCard>[] = [
  {
    accessorKey: "carNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Car Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "jobCardNumber",
    header: "Job Card No.",
  },
  {
    accessorKey: "$createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("$createdAt"));
      return <div>{date.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "jobCardStatus",
    header: "Status",
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) == filterValue;
    },
  },
];

export const partColumns: ColumnDef<Part>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const part = row.original;
      const token = getCookie("user");
      const parsedToken = JSON.parse(String(token));
      const userAccess = parsedToken.labels[0];

      const deletePart = async (part: any) => {
        console.log("Deleting Part", part);
        const deletedPart = await deletePartItem(part.$id);
        if (deletedPart) {
          toast("Part deleted successfully! \u2705");
          setTimeout(() => {
            window.location.reload(); // Refresh the page
          }, 2000);
        } else {
          console.error("Error deleting part");
        }
      };

      switch (userAccess) {
        case "parts":
          return (
            <div>
              <Button className="bg-red-500" onClick={() => deletePart(part)}>
                Delete
              </Button>
            </div>
          );
        default:
          return null;
      }
    },
  },
];

export const currentPartsColumns: ColumnDef<CurrentPart>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },

  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discountPercentage",
  },
  {
    accessorKey: "insurancePercentage",
  },
  {
    accessorKey: "amount",
  },
];

export const currentLabourColumns: ColumnDef<CurrentLabour>[] = [
  {
    accessorKey: "labourName",
    header: "Labour Name",
    // cell: ({ row }) => {
    //   const labourCode = row.getValue("labourCode");
    //   if(labourCode == MISCELLANEOUS_LABOUR_CODE){
    //     return
    //   }
    // }
  },
  {
    accessorKey: "labourCode",
    header: "Labour Code",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "quantity",
  },
  {
    accessorKey: "discountPercentage",
  },
  {
    accessorKey: "insurancePercentage",
  },
  {
    accessorKey: "amount",
  },
];

export const labourColumns: ColumnDef<Labour>[] = [
  {
    accessorKey: "labourName",
    header: "Labour Name",
  },
  {
    accessorKey: "labourCode",
    header: "Labour Code",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
];

export const tempCarsColumns: ColumnDef<TempCar>[] = [
  {
    accessorKey: "carNumber",
    header: "Car Number",
  },
  {
    accessorKey: "carMake",
    header: "Car Make",
    cell: ({ row }) => {
      const tempCar = row.original;

      return (
        <div className="flex flex-col items-start">
          <div>{tempCar.carMake}</div>
          <div>{tempCar.carModel}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "purposeOfVisitAndAdvisors",
    header: "POV",
    cell: ({ row }) => {
      const povs = convertStringsToArray(
        row.original.purposeOfVisitAndAdvisors
      );
      return povs.map((pov: any) => pov.description).join(", ") || "No POV";
    },
    filterFn: (row, columnId, filterValue) => {
      const povs = convertStringsToArray(row.getValue(columnId));
      if (!Array.isArray(povs) || povs.length === 0) return false;
      return povs.some((pov: any) => pov.description === filterValue);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pathname = usePathname();
      const tempCar = row.original;
      const token = getCookie("user");
      const parsedToken = JSON.parse(String(token));
      const userAccess = parsedToken.labels[0];

      const [tempCarStatus, setTempCarStatus] = useState<{
        isValid: boolean;
        type: string;
      } | null>(null);

      const purposeOfVisitAndAdvisors = convertStringsToArray(
        tempCar.purposeOfVisitAndAdvisors
      );

      useEffect(() => {
        const result = checkIfAnotherJobCardCanBeOpened(tempCar);
        if (result) {
          setTempCarStatus({
            isValid: result[0],
            type: result[1], // "service" or "bodyshop"
          });
        }
      }, [tempCar]);

      // For Case: Service;
      const advisorEmail = parsedToken.email;
      const advisorInfo = purposeOfVisitAndAdvisors.find(
        (pov: any) => pov.advisorEmail === advisorEmail
      );

      const [selectedPovCode, setSelectedPovCode] = useState<number | null>(
        null
      );
      const [selectedAdvisor, setSelectedAdvisor] = useState<string>("");
      const [allAdvisors, setAllAdvisors] = useState<Record<number, any[]>>({});

      useEffect(() => {
        const fetchUsers = async () => {
          const users = await listAllUsers();
          console.log("USERS", users);

          // Map advisors for each purposeOfVisitCode
          const advisorsMap = purposeOfVisitAndAdvisors.reduce(
            (map: any, pov: any) => {
              const matchingAdvisors = users.filter((user: any) => {
                const roleIds = JSON.parse(user.prefs.advisorRoleId || "[]");
                return roleIds.includes(pov.purposeOfVisitCode);
              });
              map[pov.purposeOfVisitCode] = matchingAdvisors.map(
                (user: any) => ({
                  email: user.email,
                  name: user.name,
                })
              );
              return map;
            },
            {}
          );

          setAllAdvisors(advisorsMap);
        };

        fetchUsers();
      }, []);

      const handleAdvisorChange = async () => {
        if (!selectedPovCode) return;

        // Update the specific entry in purposeOfVisitAndAdvisors
        const updatedPurposeOfVisitAndAdvisors = purposeOfVisitAndAdvisors.map(
          (pov: any) =>
            pov.purposeOfVisitCode === selectedPovCode
              ? { ...pov, advisorEmail: selectedAdvisor }
              : pov
        );

        try {
          await databases.updateDocument(
            config.databaseId,
            config.tempCarsCollectionId,
            tempCar.$id,
            {
              purposeOfVisitAndAdvisors: convertToStrings(
                updatedPurposeOfVisitAndAdvisors
              ), // Updated array
            }
          );
          // Close the dialog after saving
          setTimeout(() => {
            window.location.reload(); // Refresh the page
          }, 2000);
          toast("Advisor updated successfully! \u2705");
          console.log("Advisor updated successfully");
          setSelectedPovCode(null);
        } catch (error) {
          console.error("Error updating advisor:", error);
        }
      };

      const handleCarExit = async () => {
        let tempCarId = tempCar.$id;

        const result = await deleteTempCar(tempCarId);
        if (result) {
          setTimeout(() => {
            window.location.reload(); // Refreshes the page to get the latest data
          }, 700);

          toast("Car removed from Garage \u2705");
        }
      };

      const router = useRouter();

      const handleOpenJobCard = async () => {
        const type = tempCarStatus?.type;
        const url = `${pathname}/open-jobcard/?tempcarId=${tempCar.$id}&type=${type}`;
        console.log("Navigating to:", url);
        router.push(url);
        window.location.href = url; // Navigate to the URL
      };

      switch (userAccess) {
        case "admin":
          return (
            <div>
              {purposeOfVisitAndAdvisors.map((pov: any) => (
                <div key={pov.purposeOfVisitCode} className="mb-4">
                  <h3 className="text-lg font-semibold">{pov.description}</h3>
                  {pov.open === false ? (
                    <button
                      onClick={() => {
                        console.log(
                          "Clicked Purpose of Visit Code:",
                          pov.purposeOfVisitCode
                        );
                        console.log("Current Advisor Email:", pov.advisorEmail);
                        setSelectedPovCode(pov.purposeOfVisitCode);
                        setSelectedAdvisor(pov.advisorEmail);
                      }}
                      className="text-blue-500 underline"
                    >
                      Change Advisor
                    </button>
                  ) : (
                    <p className="text-red-500">
                      Cannot change advisor for open Job Card.
                    </p>
                  )}
                </div>
              ))}

              {selectedPovCode !== null && (
                <Dialog
                  open={selectedPovCode !== null} // Explicitly check for null
                  onOpenChange={() => setSelectedPovCode(null)}
                >
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Change Advisor</DialogTitle>
                      <DialogDescription>
                        Select a new advisor for this purpose of visit.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Select
                        value={selectedAdvisor}
                        onValueChange={(value) => setSelectedAdvisor(value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select an advisor" />
                        </SelectTrigger>
                        <SelectContent>
                          {allAdvisors[selectedPovCode]?.map((advisor) => (
                            <SelectItem
                              key={advisor.email}
                              value={advisor.email}
                            >
                              {advisor.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-red-500"
                        onClick={handleAdvisorChange}
                      >
                        Save
                      </Button>
                      <Button
                        type="submit"
                        className="bg-red-500"
                        onClick={() => setSelectedPovCode(null)}
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Add "Open Job Card" button */}
              {tempCarStatus?.isValid && (
                <div>
                  <button
                    onClick={handleOpenJobCard}
                    className="text-blue-500 underline"
                  >
                    Open Job Card
                  </button>
                </div>
              )}
            </div>
          );
        case "security":
          return (
            <div className="p-2">
              <Button className="bg-red-500 text-white" onClick={handleCarExit}>
                CheckOut
              </Button>
            </div>
          );
        case "service":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${
                  advisorInfo.open === false
                    ? `${pathname}/createJobCard/${tempCar.$id}`
                    : `${pathname}/viewJobCard/${tempCar.jobCardId}`
                }`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  advisorInfo.open === false
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {advisorInfo.open === false ? "Create" : "View"}
              </Link>
            </div>
          );

        default:
          break;
      }
    },
  },
];

export const viewCurrentPartsColumns: ColumnDef<CurrentPart>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
  },
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },

  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "mrp",
    header: "Basic Price",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "discountPercentage",
    header: "Discount %",
  },
  {
    accessorKey: "insurancePercentage",
    header: "Insurance %",
  },
  {
    accessorKey: "amount",
  },
];

export const viewCurrentLabourColumns: ColumnDef<CurrentLabour>[] = [
  {
    accessorKey: "labourName",
    header: "Labour Name",
  },
  {
    accessorKey: "labourCode",
    header: "Labour Code",
  },
  {
    accessorKey: "hsn",
    header: "HSN",
  },
  {
    accessorKey: "mrp",
    header: "MRP",
    cell: ({ row }) => {
      const price: number = row.getValue("mrp");
      return <div>&#8377;{price}</div>;
    },
  },
  {
    accessorKey: "gst",
    header: "GST",
    cell: ({ row }) => {
      const gst: number = row.getValue("gst");
      return <div>{gst}%</div>;
    },
  },
  {
    accessorKey: "quantity",
  },
  {
    accessorKey: "discountPercentage",
  },
  {
    accessorKey: "insurancePercentage",
  },
  {
    accessorKey: "amount",
  },
];

export const changesHistoryColumns: ColumnDef<any>[] = [
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));

      const day = Number(String(date.getDate()).padStart(2, "0")); // Ensures 2 digits
      const month = Number(String(date.getMonth() + 1).padStart(2, "0")); // Months are 0-indexed
      const year = Number(date.getFullYear());

      const time = date.toLocaleTimeString();

      // Combine into the desired format
      const formattedDate = `${day}-${month}-${year}`;
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "timestamp",
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));

      const time = date.toLocaleTimeString();

      // Combine into the desired format
      return <div>{time}</div>;
    },
  },
  {
    accessorKey: "userEmail",
    header: "User Email",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "objectType",
    header: "Collection",
    cell: ({ row }) => {
      const helperArr = [
        { key: "job_cards", value: "Job Cards" },
        { key: "parts", value: "Parts" },
        { key: "labour", value: "Labour" },
        { key: "temp-cars", value: "Temp Cars" },
        { key: "cars", value: "Cars" },
      ];

      const objectType = row.getValue("objectType");

      const object = helperArr.find((item) => item.key === objectType)?.value;

      return <div>{object}</div>;
    },
  },
  {
    accessorKey: "operationType",
    header: "Operation Type",
  },
];
