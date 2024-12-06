"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import {
  getAllInvoices,
  getAllLabour,
  getAllParts,
  getCarByCarNumber,
  getInvoicesByJobCardId,
  getJobCardById,
  getLatestInvoiceBySeries,
  getTempCarById,
  updateJobCardById,
  updateJobCardInsuranceDetails,
} from "@/lib/appwrite";
import { CarFront, User } from "lucide-react";
import DetailsCard from "@/components/DetailsCard";
import Link from "next/link";
import JobDetailsCard from "@/components/JobDetailsCard";
import { Button } from "@/components/ui/button";
import {
  amtHelperWithoutTax,
  calcAllAmts,
  createTaxObj,
  InsuranceinvoiceTypes,
  invoiceTypes,
  jobCardStatusKey,
  objToStringArr,
  openInNewTab,
  policyProviders,
  policyProvidersDict,
  purposeOfVisits,
  stringToObj,
} from "@/lib/helper";
import { toast } from "sonner";
import {
  JobCard,
  Car,
  Part,
  CurrentPart,
  Labour,
  CurrentLabour,
  UserType,
  Invoice,
  TaxObj,
} from "@/lib/definitions";
import {
  currentPartsColumns,
  currentLabourColumns,
} from "@/lib/column-definitions";
import { CurrentPartsDataTable } from "@/components/data-tables/current-parts-data-table";
import JobCardsPageSkeleton from "@/components/skeletons/JobCardPageSkeleton";
import { CurrentLabourDataTable } from "@/components/data-tables/current-labour-data-table";
import { getCookie } from "cookies-next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchSelect } from "@/components/SearchSelect";
import { SearchSelectNEW } from "@/components/SearchSelectNew";
import { usePathname } from "next/navigation";
import Image from "next/image";
import loader from "../../../../../public/assets/t3-loader.gif";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the structure for the Car object

const useDev = false;

let apiUrl: string;

if (useDev) {
  apiUrl = "http://localhost:3000";
} else {
  apiUrl = "https://t3-next-dev.vercel.app";
}

export default function jobCard({
  params,
  disable = false,
}: {
  params: { jobCardId: any };
  disable: boolean;
}) {
  const pathname = usePathname();

  console.log("THIS IS THE PATHNAME - ", pathname);

  const [jobCard, setJobCard] = useState<JobCard | null>(null); // Properly typed state
  const [car, setCar] = useState<Car | null>(null); // Properly typed state
  const [parts, setParts] = useState<Part[] | null>(null);
  const [labours, setLabours] = useState<Labour[] | null>(null);
  const [currentParts, setCurrentParts] = useState<CurrentPart[]>([]);
  const [currentLabour, setCurrentLabour] = useState<CurrentLabour[]>([]);
  const [currentJobCardStatus, setCurrentJobCardStatus] = useState<number>();
  const [user, setUser] = useState<UserType>();

  const [policyProvider, setPolicyProvider] = useState<string>();
  const [policyNumber, setPolicyNumber] = useState<string>();

  const [isInsuranceDetails, setIsInsuranceDetails] = useState(false);
  const [isInsurance, setIsInsurance] = useState(false);

  const [isEdited, setIsEdited] = useState(false);

  const [jobCardInvoices, setJobCardInvoices] = useState<Invoice[]>();

  const [invoiceCounter, setInvoiceCounter] = useState(0);

  const [invoiceSeries, setInvoiceSeries] = useState("");

  const [invoiceCode, setInvoiceCode] = useState("");

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
  }, [currentParts, currentLabour]);

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
      } else {
        carObj = await getCarByCarNumber(jobCardObj.carNumber);
      }
      // console.log("This is the car details - ", carObj);

      if (jobCardObj.insuranceDetails) {
        setIsInsuranceDetails(true);
        const details = JSON.parse(jobCardObj.insuranceDetails);
        setPolicyProvider(details.policyProvider);
        setPolicyNumber(details.policyNumber);
        console.log("DETAILS", details);
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

      console.log("IS INSURANCE - ", foundIndexParts, foundIndexLabour);

      setIsInsurance(isInsuranceConst);

      console.log("THIS IS THE PURPOSE OF VISIT - ", jobCardObj.purposeOfVisit);
      const series = jobCardObj.purposeOfVisit === "Bodyshop" ? "BDS" : "SER";
      console.log("This is the SERIES - ", series);
      setInvoiceSeries(series);

      // Fetch the latest invoice in the selected series
      const invoice = await getLatestInvoiceBySeries(series);
      console.log("THESE ARE THE INVOICES BY SERIES ", series, " - ", invoice);
      const newInvoiceCounter = invoice ? invoice.invoiceNumber + 1 : 1; // If no previous invoice, start with 1

      setInvoiceCounter(newInvoiceCounter);

      // Compute invoice code directly here, using the 'series' and 'newInvoiceCounter'
      const newInvoiceCode = `${series}/${newInvoiceCounter}`;
      setInvoiceCode(newInvoiceCode);

      console.log("Generated Invoice Code:", newInvoiceCode);

      setJobCard((prev) => jobCardObj);
      setCurrentJobCardStatus(jobCardObj.jobCardStatus);
      setCar((prev) => carObj);
    };

    const getJobCardInvoices = async () => {
      const invoices = await getAllInvoices();
      const jobCardInvoicesArr = invoices.documents.filter(
        (invoice: Invoice) => invoice.jobCardId == params.jobCardId
      );

      console.log("INVOICES FOR THIS JC - ", jobCardInvoicesArr);

      setJobCardInvoices(jobCardInvoicesArr);
    };

    const getParts = async () => {
      const partsObj = await getAllParts();
      // console.log("THESE ARE THE PARTS - ", partsObj);
      setParts((prev) => partsObj.documents);
    };

    const getLabour = async () => {
      const labourObj = await getAllLabour();
      // console.log("THESE ARE THE Labours - ", labourObj);
      setLabours((prev) => labourObj.documents);
    };

    getUser();

    getParts();

    getLabour();

    getJobCardDetails();

    getJobCardInvoices();
  }, []);

  const saveCurrentPartsAndLbour = async (statusUpdate?: number) => {
    console.log("Current Parts - ", currentParts);
    console.log("CURRENT LABOUR - ", currentLabour);

    let status = 2;

    if (statusUpdate) {
      status = statusUpdate;
    }

    const parts = objToStringArr(currentParts);
    const labour = objToStringArr(currentLabour);

    const amounts = calcAllAmts(currentParts, currentLabour);
    const taxes: TaxObj[] = createTaxObj(currentParts, currentLabour);

    console.log("TAXES ON THE FRONT - ", taxes);

    const strTaxes = objToStringArr(taxes);

    console.log("THESE ARE THE AMOUNTS - ", amounts);

    let tempJobCard = jobCard;
    if (tempJobCard) {
      tempJobCard.subTotal = amounts.subTotal;
      tempJobCard.totalDiscountAmt = amounts.discountAmt;
      tempJobCard.amount = amounts.amount;

      setJobCard((prev) => tempJobCard);
    }

    const isDone = await updateJobCardById(
      params.jobCardId,
      parts,
      labour,
      status,
      amounts.subTotal,
      amounts.discountAmt,
      amounts.amount,
      strTaxes
    );

    console.log(isDone);

    setCurrentJobCardStatus(2);

    if (isDone) {
      toast("Job Card has been updated \u2705");
    }
  };

  const generateQuote = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(3);

    console.log("JOB CARD OBJ = ", jobCard);

    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
        invoiceSeries,
        invoiceCode,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 1000);

      result.json().then((invoices: any) => {
        console.log(invoices);
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(3);

      toast("Quote Generated \u2705");
    });
  };

  const generateProFormaInvoice = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(4);

    // await fetch(`http://localhost:3000${pathname}/invoice`, {
    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
        invoiceSeries,
        invoiceCode,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 1000);

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(4);

      toast("Pro-Forma Invoice Generated \u2705");
    });
  };

  const generateTaxInvoice = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(5);

    // await fetch(`http://localhost:3000${pathname}/invoice`, {
    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
        invoiceSeries,
        invoiceCode,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 1000);

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(5);

      toast("Tax Invoice Generated \u2705");
    });
  };

  const generateGatePass = async () => {
    setButtonLoading((prev) => true);
    await saveCurrentPartsAndLbour(6);

    // await fetch(`http://localhost:3000${pathname}/gatePass`, {
    await fetch(`${apiUrl}${pathname}/gatePass`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceCounter,
      }),
    }).then((result: any) => {
      // Disable the page, this happens automatically at refresh but its a precaution.
      setIsDisabled(true);
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      result.json().then((invoice: any) => {
        console.log("HVVGUUYFUYFYUFFUYYFUYFOUYFOU", invoice);
        openInNewTab(invoice);
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(6);

      toast("Tax Invoice Generated \u2705");
    });
  };

  const loggg = () => {
    console.log(invoiceCode);
    console.log(invoiceSeries);
    console.log(invoiceCounter);
  };

  const saveInsuranceDetails = async () => {
    const foundObj = policyProvidersDict.find(
      (a) => a.insurer == policyProvider
    );

    const insuranceDetails = JSON.stringify({
      policyProvider: policyProvider,
      policyProviderAddress: foundObj?.address,
      policyProviderGST: foundObj?.GST,
      policyNumber: policyNumber,
    });

    console.log(insuranceDetails);

    const isDone = await updateJobCardInsuranceDetails(
      params.jobCardId,
      insuranceDetails
    );

    console.log(isDone);
    if (isDone) {
      // console.log("IT IS DONE");
      toast("Insurance Details have been Updated \u2705");
      setIsInsuranceDetails(true);
    }
  };
  const generateJobCardPDF = async ({ jobCard, car }: any) => {
    // await fetch(`http://localhost:3000${pathname}/jobCardPDF`, {
    await fetch(`${apiUrl}${pathname}/jobCardPDF`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 1000);

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice);
        });
      });
    });
  };

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
      {/* Overlay to disable page */}
      {buttonLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Image src={loader} width={100} height={100} alt="Loading" />
        </div>
      )}
      {!(parts && jobCard && car && user) ? (
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
              {currentJobCardStatus! > 2 && !disable && (
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

              {!disable && (
                <>
                  {currentJobCardStatus == 1 && (
                    <Button
                      variant="outline"
                      className="px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white"
                      size="lg"
                      onClick={() => saveCurrentPartsAndLbour()}
                    >
                      Save
                    </Button>
                  )}
                  {currentJobCardStatus == 2 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateQuote}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Quote</>
                      )}
                    </Button>
                  )}
                  {currentJobCardStatus == 3 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateProFormaInvoice}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Pro-Forma Invoice</>
                      )}
                    </Button>
                  )}
                  {currentJobCardStatus == 4 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateTaxInvoice}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Tax Invoice</>
                      )}
                    </Button>
                  )}
                  {currentJobCardStatus == 5 && (
                    <Button
                      variant="outline"
                      className={`px-8 py-2 bg-red-500 text-white hover:bg-red-400 hover:text-white ${
                        buttonLoading ? "opacity-50" : ""
                      }`}
                      size="lg"
                      onClick={generateGatePass}
                      disabled={buttonLoading}
                    >
                      {buttonLoading ? (
                        <>
                          <Image
                            src={loader}
                            width={50}
                            height={50}
                            alt="Logo"
                          />
                        </>
                      ) : (
                        <>Generate Gate Pass</>
                      )}
                    </Button>
                  )}
                </>
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
                            data={policyProviders}
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
                        onClick={saveInsuranceDetails}
                      >
                        Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="font-semibold text-3xl">Invoice Details</div>

          <div className="flex flex-col space-y-8">
            <CurrentPartsDataTable
              columns={currentPartsColumns}
              data={currentParts}
              currentParts={currentParts}
              parts={parts}
              setCurrentParts={setCurrentParts}
              setIsEdited={setIsEdited}
              user={user}
              currentJobCardStatus={currentJobCardStatus}
              isInsuranceDetails={isInsuranceDetails}
              disable={isDisabled}
            />
            <CurrentLabourDataTable
              columns={currentLabourColumns}
              data={currentLabour}
              labour={labours}
              currentLabours={currentLabour}
              setCurrentLabour={setCurrentLabour}
              setIsEdited={setIsEdited}
              user={user}
              currentJobCardStatus={currentJobCardStatus}
              isInsuranceDetails={isInsuranceDetails}
              disable={isDisabled}
            />
          </div>
        </>
      )}
    </div>
  );
}
