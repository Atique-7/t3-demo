"use client";

import {
  getAllInvoices,
  getAllLabour,
  getAllParts,
  getCarByCarNumber,
  getInvoicesByJobCardId,
  getJobCardById,
  getTempCarById,
  updateJobCardById,
} from "@/lib/appwrite";
import {
  Car,
  CurrentLabour,
  CurrentPart,
  Invoice,
  JobCard,
  Labour,
  Part,
  UserType,
} from "@/lib/definitions";
import {
  InsuranceinvoiceTypes,
  invoiceTypes,
  jobCardStatusKey,
  openInNewTab,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import Link from "next/link";
import { ArrowLeft, CarFront, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DetailsCard from "@/components/DetailsCard";
import JobDetailsCard from "@/components/JobDetailsCard";
import { SearchSelectNEW } from "@/components/SearchSelectNew";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { viewCurrentPartsColumns } from "@/lib/column-definitions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ViewCurrentPartsDataTable } from "@/components/data-tables/view-parts-data-table";

type Props = {};

const useDev = false;

let apiUrl: string;

if (useDev) {
  apiUrl = "http://localhost:3000";
} else {
  apiUrl = "https://t3-next-dev.vercel.app";
}

const jobCard = ({
  params,
  disable = true,
}: {
  params: { jobCardId: any };
  disable: boolean;
}) => {
  const pathname = usePathname();

  const [jobCard, setJobCard] = useState<JobCard | null>(null); // Properly typed state
  const [car, setCar] = useState<Car | null>(null); // Properly typed state
  const [carsTableId, setCarsTableId] = useState<string>(""); // Properly typed state

  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentPart[]>([]);
  const [currentLabour, setCurrentLabour] = useState<CurrentLabour[]>([]);
  const [currentJobCardStatus, setCurrentJobCardStatus] = useState<number>();
  const [user, setUser] = useState<UserType>();

  const [policyProviders, setPolicyProviders] = useState<any[]>([]);
  const [policyProvider, setPolicyProvider] = useState<string>();
  const [policyNumber, setPolicyNumber] = useState<string>();

  const [customerGST, setCustomerGST] = useState<string>();
  const [observationRemarks, setObservationRemarks] = useState<string>();
  const [customerName, setCustomerName] = useState<string>();
  const [customerAddress, setCustomerAddress] = useState<string>();
  const [customerPhone, setCustomerPhone] = useState<string>();

  const [isInsuranceDetails, setIsInsuranceDetails] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);

  const [isEdited, setIsEdited] = useState(false);

  const [jobCardInvoices, setJobCardInvoices] = useState<Invoice[]>();
  const [invoiceSeries, setInvoiceSeries] = useState("");

  const [partsTotal, setPartsTotal] = useState<number>();
  const [labourTotal, setLabourTotal] = useState<number>();
  const [jobCardTotal, setJobCardTotal] = useState<number>();

  const [buttonLoading, setButtonLoading] = useState(false);

  const [isDisabled, setIsDisabled] = useState<boolean>(disable);

  useEffect(() => {
    // console.log("THERE WAS AN EDIT");

    const updateJobCardStatus = async () => {
      if (jobCard?.jobCardStatus) {
        await updateJobCardById(
          params.jobCardId,
          jobCard?.parts,
          jobCard?.labour,
          2
        );
      }
      setCurrentJobCardStatus(2);
    };

    updateJobCardStatus();
    setIsEdited(false);
  }, [isEdited]);

  useEffect(() => {
    console.log("THERE WAS A CHANGE - ", currentParts, currentLabour);

    let parts = 0;
    let labour = 0;
    let total = 0;

    currentParts.map((part: CurrentPart) => {
      total = total + part.amount;
      parts = parts + part.amount;
    });

    currentLabour.map((work: CurrentLabour) => {
      total = total + work.amount;
      labour = labour + work.amount;
    });

    parts = roundToTwoDecimals(parts);
    labour = roundToTwoDecimals(labour);
    total = roundToTwoDecimals(total);

    setPartsTotal(parts);
    setLabourTotal(labour);
    setJobCardTotal(total);
  }, [currentParts, currentLabour]);

  useEffect(() => {
    const getUser = () => {
      const token = getCookie("user");

      const parsedToken = JSON.parse(String(token));
      setUser((prev) => parsedToken);
      // console.log(parsedToken);
    };

    const getJobCardDetails = async () => {
      const jobCardObj: JobCard = await getJobCardById(params.jobCardId);
      console.log("This is the Job Card - ", jobCardObj);

      setCustomerGST(jobCardObj.gstin);
      setObservationRemarks(jobCardObj.observationRemarks);
      setCustomerName(jobCardObj.customerName);
      setCustomerAddress(jobCardObj.customerAddress);
      setCustomerPhone(jobCardObj.customerPhone);

      if (jobCardObj.jobCardStatus >= 6) {
        setIsDisabled(true);
      }
      const prevParts = stringToObj(jobCardObj.parts);
      console.log("Current Parts - ", prevParts);
      setCurrentParts(prevParts);

      const prevLabour = stringToObj(jobCardObj.labour);
      setCurrentLabour(prevLabour);

      let carObj = await getTempCarById(jobCardObj.carId);
      if (carObj) {
        const status = carObj.carStatus;
        if (status === 2) setIsDisabled(true);
        setCarsTableId(carObj.carsTableId);
      } else {
        carObj = await getCarByCarNumber(jobCardObj.carNumber);
        carObj = carObj.documents[0];
        setCarsTableId(carObj["$id"]);
      }
      console.log("This is the car details - ", carObj);

      if (jobCardObj.insuranceDetails) {
        setIsInsuranceDetails(true);
        const details = JSON.parse(jobCardObj.insuranceDetails);
        setPolicyProvider(details.policyProvider);
        setPolicyNumber(details.policyNumber);
        // console.log("DETAILS", details);
      } else {
        setIsInsuranceDetails(false);
      }

      const foundIndexParts = prevParts.findIndex(
        (part: CurrentPart) =>
          part.insurancePercentage && part.insurancePercentage != 0
      );

      const foundIndexLabour = prevLabour.findIndex(
        (work: CurrentLabour) =>
          work.insurancePercentage && work.insurancePercentage != 0
      );

      const isInsuranceConst = foundIndexParts != -1 || foundIndexLabour != -1;

      setIsInsurance(isInsuranceConst);
      // Fetch only invoices related to this job card
      let jobCardInvoicesArr = [];
      try {
        jobCardInvoicesArr = await getInvoicesByJobCardId(params.jobCardId);
      } catch (error) {
        console.error("Failed to fetch invoices for job card:", error);
        jobCardInvoicesArr = [];
      }

      const series = jobCardObj.purposeOfVisit === "Bodyshop" ? "BDS" : "SER";

      setInvoiceSeries(series);
      setJobCard((prev) => jobCardObj);
      setCurrentJobCardStatus(jobCardObj.jobCardStatus);
      setCar((prev) => carObj);
    };

    const getJobCardInvoices = async () => {
      const invoices = await getAllInvoices();

      const jobCardInvoicesArr = invoices.documents.filter(
        (invoice: Invoice) => invoice.jobCardId == params.jobCardId
      );

      setJobCardInvoices(jobCardInvoicesArr);
    };

    getUser();

    // getParts();

    // getLabour();

    getJobCardDetails();

    getJobCardInvoices();
  }, []);

  const generateJobCardPDF = async ({ jobCard, car }: any) => {
    await fetch(`${apiUrl}${pathname}/jobCardPDF`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice);
        });
      });
    });
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

  const handleInvoicePDF = (selectedValue: string) => {
    // console.log("SELECTED PDF - ", selectedValue);
    if (selectedValue == "Gate Pass") {
      if (jobCard) {
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

  return (
    <div className="flex flex-col w-[90%] mt-5 space-y-8">
      {!(jobCard && car && user) ? (
        <JobCardsPageSkeleton />
      ) : (
        <>
          <div className="sticky top-5 flex w-full justify-between items-center shadow-md p-4 rounded-lg border border-gray-300 bg-white z-50">
            <div className="text-red-700">
              <Link href="/parts" className="flex space-x-4">
                <div>
                  <ArrowLeft />
                </div>
                <div>Back to All Job cards</div>
              </Link>
            </div>
            <div className="flex flex-row space-x-5 justify-normal items-center">
              {/* <CarHistory
                carsTableId={carsTableId}
                currentJobCardId={params.jobCardId}
                currentJobCardStatus={currentJobCardStatus || 0}
              /> */}

              <div>
                <Button
                  variant="outline"
                  className="px-8 py-2 border border-red-500 text-red-500"
                  size="lg"
                  onClick={() => generateJobCardPDF({ jobCard, car })}
                >
                  JobCardPDF
                </Button>
              </div>
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

              {disable && (
                <span className="px-8 py-2 bg-red-500 text-white rounded-md">
                  {jobCardStatusKey.find(
                    (item) => item.code === currentJobCardStatus
                  )?.description || "Status not found"}
                </span>
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
                <div>#JobCardNumber : {jobCard.jobCardNumber}</div>
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
            <div className="flex flex-col space-y-8">
              <JobDetailsCard
                data={{ jobCard, car }}
                jobCardTotal={jobCardTotal}
                diagnosis={jobCard?.diagnosis}
              />
              {isInsuranceDetails && (
                <DetailsCard
                  title="Insurance Details"
                  icon={<Shield />}
                  dataHead={policyProvider}
                  data={{ policyNumber: policyNumber }}
                />
              )}
              <div className="flex justify-start space-x-5 items-center"></div>
              <div className="flex items-center justify-start"></div>
            </div>
          </div>
          <div className="flex justify-start space-x-5 items-center">
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    {isInsuranceDetails
                      ? "Edit Insurance Details"
                      : "Add Insurance Details"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Insurance Details</DialogTitle>
                    <DialogDescription>
                      Enter the details of your vehicle insurance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="policyProvider" className="text-right">
                        Policy Provider
                      </Label>
                      <div className="col-span-3">
                        <SearchSelectNEW
                          data={policyProviders.map(
                            (provider) => provider.insurer
                          )}
                          placeholder="Select a provider"
                          value={policyProvider || ""}
                          onChange={setPolicyProvider}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="policyNumber" className="text-right">
                        Policy Number
                      </Label>
                      <Input
                        id="policyNumber"
                        className="col-span-3"
                        onChange={(event) =>
                          setPolicyNumber(event.target.value)
                        }
                        value={policyNumber}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveInsuranceDetails}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer Name
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer Name</DialogTitle>
                    <DialogDescription>Customer Name Details</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="Customer Name" className="text-right">
                        Customer Name
                      </Label>
                      <Input
                        id="customerName"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                        value={customerName}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveCustomerName}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer Address</DialogTitle>
                    <DialogDescription>
                      Customer Address Details
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="CustomerAddress" className="text-right">
                        Customer Address
                      </Label>
                      <Input
                        id="customerAddress"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerAddress(event.target.value)
                        }
                        value={customerAddress}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveCustomerAddress}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer PhoneNumber
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer PhoneNumber</DialogTitle>
                    <DialogDescription>Customer PhoneNumber</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="CustomerPhoneNumber"
                        className="text-right"
                      >
                        Customer PhoneNumber
                      </Label>
                      <Input
                        id="customerAddress"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerPhone(event.target.value)
                        }
                        value={customerPhone}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveCustomerPhone}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Edit Customer GST No.
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer GST</DialogTitle>
                    <DialogDescription>Customer GST Details</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="GSTIN" className="text-right">
                        GSTIN
                      </Label>
                      <Input
                        id="GSTIN"
                        className="col-span-3"
                        onChange={(event) => setCustomerGST(event.target.value)}
                        value={customerGST}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveCustomerGST}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border bordre-red-500 text-red-500"
                    disabled={isDisabled}
                  >
                    Observation and Remarks
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Observation and Remarks</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="observationAndRemarks"
                        className="col-span-3"
                        onChange={(event) =>
                          setObservationRemarks(event.target.value)
                        }
                        value={observationRemarks}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      // onClick={saveObservationRemarks}
                      disabled={isDisabled}
                    >
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>
          <div className="flex flex-col space-y-8 mb-10">
            {/* <ViewCurrentPartsDataTable
              data={currentParts}
              columns={viewCurrentPartsColumns}
              partsTotal={partsTotal}
            /> */}
            {/* <ViewCurrentLabourDataTable
              data={currentLabour}
              columns={currentLabourColumns}
              currentLabours={currentLabour}
              labourTotal={labourTotal}
            /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default jobCard;
