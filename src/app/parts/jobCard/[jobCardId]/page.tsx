"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getAllInvoices,
  getAllParts,
  getCarByCarNumber,
  getJobCardById,
  getTempCarById,
  updateJobCardById,
} from "@/lib/appwrite";
import { CarFront, User } from "lucide-react";
import DetailsCard from "@/components/DetailsCard";
import Link from "next/link";
import JobDetailsCard from "@/components/JobDetailsCard";
import { Button } from "@/components/ui/button";
import {
  InsuranceinvoiceTypes,
  invoiceTypes,
  objToStringArr,
  openInNewTab,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";
import { toast } from "sonner";
import {
  JobCard,
  Car,
  Part,
  CurrentPart,
  UserType,
  Invoice,
} from "@/lib/definitions";
import { currentPartsColumns } from "@/lib/column-definitions";
import { CurrentPartsDataTable } from "@/components/data-tables/current-parts-data-table";
import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import { getCookie } from "cookies-next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the structure for the Car object

export default function jobCard({ params }: { params: { jobCardId: any } }) {
  const [jobCard, setJobCard] = useState<JobCard | null>(null); // Properly typed state
  const [car, setCar] = useState<Car | null>(null); // Properly typed state
  const [parts, setParts] = useState<Part[] | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentPart[]>([]);

  const [isDisabled, setIsDisabled] = useState(false);

  const [isInsurance, setIsInsurance] = useState(false);
  const [currentJobCardStatus, setCurrentJobCardStatus] = useState<number>();
  const [jobCardInvoices, setJobCardInvoices] = useState<Invoice[]>();

  const [partsTotal, setPartsTotal] = useState<number>();

  const [isEdited, setIsEdited] = useState(false);

  const [user, setUser] = useState<UserType>();

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      setUser((prev) => parsedToken);
      console.log(parsedToken);
    };
    const getJobCardDetails = async () => {
      const jobCardObj = await getJobCardById(params.jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      // console.log("THESE ARE THE PARTS CURRENTLY - ", jobCardObj.parts);

      if (jobCardObj.jobCardStatus > 5) {
        setIsDisabled(true);
      }

      const prevParts = stringToObj(jobCardObj.parts);
      setCurrentParts(prevParts);

      let carObj = await getTempCarById(jobCardObj.carId);
      if (carObj) {
        const status = carObj.carStatus;
        if (status === 2) setIsDisabled(true);
      } else {
        setIsDisabled(true);
        carObj = await getCarByCarNumber(jobCardObj.carNumber);
        carObj = carObj.documents[0];
      }

      setJobCard((prev) => jobCardObj);
      setCurrentJobCardStatus((prev) => jobCardObj.jobCardStatus);
      setCar((prev) => carObj);
    };

    const getParts = async () => {
      const partsObj = await getAllParts();
      console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    const getJobCardInvoices = async () => {
      const invoices = await getAllInvoices();
      const jobCardInvoicesArr = invoices.documents.filter(
        (invoice: Invoice) => invoice.jobCardId == params.jobCardId
      );

      console.log("INVOICES FOR THIS JC - ", jobCardInvoicesArr);

      setJobCardInvoices(jobCardInvoicesArr);
    };

    getUser();

    getParts();

    getJobCardDetails();

    getJobCardInvoices();
  }, []);

  useEffect(() => {
    let parts = 0;

    currentParts.map((part: CurrentPart) => {
      parts = parts + part.amount;
    });

    parts = roundToTwoDecimals(parts);

    console.log("TOTALS: ", parts);

    setPartsTotal(parts);
  }, [currentParts]);

  const saveCurrentParts = async () => {
    console.log("Current Parts - ", currentParts);
    const parts = objToStringArr(currentParts);

    if (
      jobCard &&
      jobCard.jobCardStatus !== undefined &&
      jobCard.jobCardStatus < 5
    ) {
      const isDone = await updateJobCardById(
        params.jobCardId,
        parts,
        jobCard?.labour,
        1
      );

      if (isDone) {
        // console.log("IT IS DONE");
        toast("Job Card has been updated \u2705");
      }
    } else {
      toast("Job Card has already been processed by the biller");
    }
  };

  useEffect(() => {
    console.log("THERE WAS A CHANGE - ", currentParts);
  }, [currentParts]);

  const handleInvoicePDF = (selectedValue: string) => {
    console.log("SELECTED PDF - ", selectedValue);
    if (selectedValue == "Gate Pass") {
      if (jobCard) {
        console.log("gatePass PDF = ", jobCard.gatePassPDF);
        openInNewTab(jobCard.gatePassPDF);
      }
    } else {
      if (jobCardInvoices) {
        const filteredInvoices: Invoice[] = jobCardInvoices?.filter(
          (invoice: Invoice) => invoice.invoiceType == selectedValue
        );
        filteredInvoices?.sort(
          (a, b) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );
        const selectedInvoice = filteredInvoices[0];
        openInNewTab(selectedInvoice.invoiceUrl);
      }
    }
  };

  const handleInsuranceInvoicePDF = (selectedValue: any) => {
    console.log("SELECTED PDF - ", selectedValue);

    const selectedInvoice = InsuranceinvoiceTypes.find(
      (a) => a.description == selectedValue
    );
    if (selectedInvoice) {
      console.log("SELECTED OBJECT - ", selectedInvoice);

      let currentInvoiceType = selectedInvoice?.name;
      let currentInvoiceFor = selectedInvoice?.type;

      if (jobCardInvoices) {
        const filteredInvoices: Invoice[] = jobCardInvoices?.filter(
          (invoice: Invoice) =>
            invoice.invoiceType == currentInvoiceType &&
            invoice.insuranceInvoiceType == currentInvoiceFor
        );
        filteredInvoices?.sort(
          (a, b) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );
        const selectedInvoice = filteredInvoices[0];

        console.log("FILTE$RED INVOICES", selectedInvoice);
        openInNewTab(selectedInvoice.invoiceUrl);
      }
    }
  };

  return (
    <div className="flex flex-col w-[90%] mt-5 space-y-8">
      {!(parts && jobCard && car && user) ? (
        <JobCardsPageSkeleton />
      ) : (
        <>
          <div className="sticky top-5 flex w-full justify-between items-center shadow-md p-4 rounded-lg border border-gray-300 bg-white">
            <div className="text-red-700">
              <Link href="/parts" className="flex space-x-4">
                <div>
                  <ArrowLeft />
                </div>
                <div>Back to All Job cards</div>
              </Link>
            </div>
            <div className="flex flex-row space-x-5 justify-normal items-center">
              {currentJobCardStatus! > 2 && (
                <div>
                  {isInsurance ? (
                    <>
                      <Select
                        onValueChange={(value) => {
                          handleInsuranceInvoicePDF(value);
                        }}
                      >
                        <SelectTrigger className="w-full p-2 border border-red-500 text-red-500 rounded-lg">
                          <SelectValue placeholder="Download" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {InsuranceinvoiceTypes.map((invoiceType, index) => (
                            <div key={index}>
                              {invoiceType.code <= currentJobCardStatus! && (
                                <SelectItem
                                  key={index}
                                  value={invoiceType.description}
                                >
                                  {invoiceType.description}
                                </SelectItem>
                              )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <>
                      <Select
                        onValueChange={(value) => {
                          handleInvoicePDF(value);
                        }}
                      >
                        <SelectTrigger className="w-full p-2 border border-red-500 text-red-500 rounded-lg">
                          <SelectValue placeholder="Download" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {invoiceTypes.map((invoiceType, index) => (
                            <div key={index}>
                              {invoiceType.code <= currentJobCardStatus! && (
                                <SelectItem
                                  key={index}
                                  value={invoiceType.description}
                                >
                                  {invoiceType.description}
                                </SelectItem>
                              )}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              )}
              {currentJobCardStatus! < 5 && (
                <Button
                  variant="outline"
                  className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                  size="lg"
                  onClick={saveCurrentParts}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
          <div>
            <div>
              <div>
                <span className="font-semibold text-3xl">
                  {jobCard.carNumber}
                </span>
                <span className="font-medium ml-2 text-2xl text-gray-700">{`(${car.carMake} ${car.carModel})`}</span>
              </div>
              <div className="font-medium text-gray-500">
                #JobCardId : {jobCard.jobCardNumber}
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-8">
            <div className="flex flex-col space-y-5">
              <DetailsCard
                title="Customer Details"
                icon={<User />}
                dataHead={jobCard?.customerName}
                data={{ customerPhone: jobCard?.customerPhone }}
              />
              <DetailsCard
                title="Vehicle Details"
                icon={<CarFront />}
                dataHead={jobCard?.carNumber}
                data={{ makeModel: `${car?.carMake} ${car?.carModel}` }}
              />
            </div>
            <div>
              <JobDetailsCard
                data={{ jobCard, car }}
                diagnosis={jobCard?.diagnosis}
              />
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>

          <div className="text-xl">
            <CurrentPartsDataTable
              columns={currentPartsColumns}
              data={currentParts}
              currentParts={currentParts}
              parts={parts}
              setCurrentParts={setCurrentParts}
              setIsEdited={setIsEdited}
              user={user}
              isInsuranceDetails={false}
              partsTotal={partsTotal}
              disable={isDisabled}
            />
          </div>
        </>
      )}
    </div>
  );
}
