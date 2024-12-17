"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Divide } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  convertStringsToArray,
  convertToStrings,
  getButtonText,
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
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCookie } from "cookies-next";

const MISCELLANEOUS_LABOUR_CODE = "L2024-04-998800";

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
    cell: ({ row }) => {
      const statusObj = jobCardStatusKey.find(
        (status: any) => status.code === row.getValue("jobCardStatus")
      );
      const statusString = statusObj ? statusObj.description : "Unknown Status";

      return <div>{statusString}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      return row.getValue(columnId) == filterValue;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const pathname = usePathname();

      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));

      const userAccess = parsedToken.labels[0];

      const jobCard = row.original;

      switch (userAccess) {
        case "admin":
        // return (
        //   <div className="p-2">
        //     <Dialog open={open} onOpenChange={setOpen}>
        //       <DialogTrigger asChild>
        //         <Button
        //           variant="outline"
        //           className="border border-red-500 text-red-500"
        //         >
        //           Change Advisor
        //         </Button>
        //       </DialogTrigger>
        //       <DialogContent className="sm:max-w-[425px]">
        //         <DialogHeader>
        //           <DialogTitle>Change Advisor</DialogTitle>
        //           <DialogDescription>
        //             Select a new advisor from the list below
        //           </DialogDescription>
        //         </DialogHeader>
        //         <div className="grid gap-4 py-4">
        //           <Select
        //             value={selectedAdvisor}
        //             onValueChange={(value) => setSelectedAdvisor(value)}
        //           >
        //             <SelectTrigger id="advisorSelect" className="col-span-3">
        //               <SelectValue placeholder="Select an advisor" />
        //             </SelectTrigger>
        //             <SelectContent>
        //               {allAdvisors.map((advisor) => (
        //                 <SelectItem key={advisor.email} value={advisor.email}>
        //                   {advisor.name}
        //                 </SelectItem>
        //               ))}
        //             </SelectContent>
        //           </Select>
        //         </div>
        //         <DialogFooter>
        //           <Button
        //             className="bg-red-500 text-white"
        //             onClick={handleSave}
        //           >
        //             Save
        //           </Button>
        //           <DialogClose asChild>
        //             <Button onClick={handleCloseDialog}>Close</Button>
        //           </DialogClose>
        //         </DialogFooter>
        //       </DialogContent>
        //     </Dialog>
        //   </div>
        // );
        case "parts":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/jobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {jobCard.jobCardStatus == 0 && jobCard.sendToPartsManager
                  ? "Add"
                  : "Edit"}
              </Link>
            </div>
          );

        case "biller":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/jobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 ${
                  jobCard.jobCardStatus == 1
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {jobCard.jobCardStatus == 1 ? "Add" : "Edit"}
              </Link>
            </div>
          );

        case "security":
          return <></>;
        case "service":
          return (
            <div className="flex justify-center items-center">
              <Link
                href={`${pathname}/createJobCard/${jobCard.$id}`}
                className={`flex justify-center items-center rounded-md w-fit px-3 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-200`}
              >
                {"View"}
              </Link>
            </div>
          );

        default:
          break;
      }
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

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchSelect } from "@/components/SearchSelect";
import {
  config,
  databases,
  deleteTempCar,
  getTempCarById,
  listAllUsers,
  searchTempCar,
} from "./appwrite";
import { toast } from "sonner";

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

      const purposeOfVisitAndAdvisors = convertStringsToArray(
        tempCar.purposeOfVisitAndAdvisors
      );

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

              {selectedPovCode && (
                <Dialog
                  open={!!selectedPovCode}
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
            </div>
          );
        // return (
        //   advisorInfo.open === false && (
        //     <div className="p-2">
        //       <Dialog open={open} onOpenChange={setOpen}>
        //         <DialogTrigger asChild>
        //           <Button
        //             variant="outline"
        //             className="border border-red-500 text-red-500"
        //           >
        //             Change Advisor
        //           </Button>
        //         </DialogTrigger>
        //         <DialogContent className="sm:max-w-[425px]">
        //           <DialogHeader>
        //             <DialogTitle>Change Advisor</DialogTitle>
        //             <DialogDescription>
        //               Select a new advisor from the list below
        //             </DialogDescription>
        //           </DialogHeader>
        //           <div className="grid gap-4 py-4">
        //             <Select
        //               value={selectedAdvisor}
        //               onValueChange={(value) => setSelectedAdvisor(value)}
        //             >
        //               <SelectTrigger
        //                 id="advisorSelect"
        //                 className="col-span-3"
        //               >
        //                 <SelectValue placeholder="Select an advisor" />
        //               </SelectTrigger>
        //               <SelectContent>
        //                 {allAdvisors.map((advisor) => (
        //                   <SelectItem
        //                     key={advisor.email}
        //                     value={advisor.email}
        //                   >
        //                     {advisor.name}
        //                   </SelectItem>
        //                 ))}
        //               </SelectContent>
        //             </Select>
        //           </div>
        //           <DialogFooter>
        //             <Button
        //               className="bg-red-500 text-white"
        //               onClick={handleSave}
        //             >
        //               Save
        //             </Button>
        //             <DialogClose asChild>
        //               <Button onClick={handleCloseDialog}>Close</Button>
        //             </DialogClose>
        //           </DialogFooter>
        //         </DialogContent>
        //       </Dialog>
        //     </div>
        //   )
        // );
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
