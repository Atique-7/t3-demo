"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import {
  fetchPolicyProviders,
  getAllInvoices,
  getAllLabour,
  getAllParts,
  getCarByCarNumber,
  getInvoiceNumber,
  getInvoicesByJobCardId,
  getJobCardById,
  getLatestInvoiceBySeries,
  getTempCarById,
  updateCarField,
  updateJobCardById,
  updateJobCardField,
  updateJobCardGSTDetails,
  updateJobCardInsuranceDetails,
  updateJobCardObservationRemarks,
} from "@/lib/appwrite";
import { CarFront, User } from "lucide-react";
import DetailsCard from "@/components/DetailsCard";
import Link from "next/link";
import JobDetailsCard from "@/components/JobDetailsCard";
import { Button } from "@/components/ui/button";
import {
  amtHelperWithoutTax,
  calcAllAmts,
  calculateJobCardAmt,
  createTaxObj,
  InsuranceinvoiceTypes,
  invoiceTypes,
  jobCardStatusKey,
  objToStringArr,
  openInNewTab,
  purposeOfVisits,
  roundToTwoDecimals,
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
import CarHistory from "@/components/CarHistory";
import { set } from "date-fns";
import TriggerWhatsappDemo from "@/components/TriggerWhatsappDemo";

// Define the structure for the Car object

const useDev = true;

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
  const [customerEmail, setCustomerEmail] = useState<string>();

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
      setCustomerEmail(jobCardObj.customerEmail || "");

      if (jobCardObj.jobCardStatus >= 6) {
        setIsDisabled(true);
      }
      const prevParts = stringToObj(jobCardObj.parts);
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

    const getParts = async () => {
      const partsObj = await getAllParts();
      setParts((prev) => partsObj.documents);
    };

    const getLabour = async () => {
      const labourObj = await getAllLabour();
      setLabours((prev) => labourObj.documents);
    };

    getUser();

    getParts();

    getLabour();

    getJobCardDetails();

    getJobCardInvoices();
  }, []);

  const saveCustomerName = async () => {
    try {
      await updateJobCardField(jobCard!.$id, "customerName", customerName);
      const carId = (await getCarByCarNumber(jobCard!.carNumber)).documents[0]
        .$id;
      await updateCarField(carId, "customerName", customerName);
      toast("Custoemr Name Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerAddress = async () => {
    try {
      await updateJobCardField(
        jobCard!.$id,
        "customerAddress",
        customerAddress
      );
      const carId = (await getCarByCarNumber(jobCard!.carNumber)).documents[0]
        .$id;
      await updateCarField(carId, "customerAddress", customerAddress);
      toast("Custoemr Address Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerPhone = async () => {
    try {
      await updateJobCardField(jobCard!.$id, "customerPhone", customerPhone);
      const carId = (await getCarByCarNumber(jobCard!.carNumber)).documents[0]
        .$id;
      await updateCarField(carId, "customerPhone", customerPhone);
      toast("Customer Phone Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCustomerEmail = async () => {
    try {
      await updateJobCardField(jobCard!.$id, "customerEmail", customerEmail);
      const carId = (await getCarByCarNumber(jobCard!.carNumber)).documents[0]
        .$id;
      await updateCarField(carId, "customerEmail", customerEmail);
      toast("Customer Email Changed \u2705");
      setTimeout(() => {
        window.location.reload(); // Refreshes the page to get the latest data
      }, 100);
      return true;
    } catch (error: any) {
      console.error(`Failed to update field: ${error.message}`);
      return null;
    }
  };

  const saveCurrentPartsAndLbour = async (statusUpdate?: number) => {
    let status = 2;

    if (statusUpdate) {
      status = statusUpdate;
    }

    const parts = objToStringArr(currentParts);
    const labour = objToStringArr(currentLabour);

    const amounts = calcAllAmts(currentParts, currentLabour);
    const taxes: TaxObj[] = createTaxObj(currentParts, currentLabour);
    const strTaxes = objToStringArr(taxes);

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

    console.log("JOB CARD OBJ = ", jobCard);

    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceSeries,
      }),
    }).then((result: any) => {
      result.json().then(async (invoices: any) => {
        console.log(invoices);
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
        setTimeout(async () => {
          await saveCurrentPartsAndLbour(3);
          window.location.reload();
        }, 1000);
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(3);

      toast("Quote Generated \u2705");
    });
  };

  const generateProFormaInvoice = async () => {
    setButtonLoading((prev) => true);

    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceSeries,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
        setTimeout(async () => {
          await saveCurrentPartsAndLbour(4);
          window.location.reload();
        }, 1000);
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(4);

      toast("Pro-Forma Invoice Generated \u2705");
    });
  };

  const generateTaxInvoice = async () => {
    setButtonLoading((prev) => true);

    await fetch(`${apiUrl}${pathname}/invoice`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
        invoiceSeries,
      }),
    }).then((result: any) => {
      // Set a short timeout before refreshing the page

      result.json().then((invoices: any) => {
        invoices.map((invoice: any) => {
          openInNewTab(invoice.invoiceUrl);
        });
        setTimeout(async () => {
          await saveCurrentPartsAndLbour(5);
          window.location.reload();
        }, 1000);
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(5);

      toast("Tax Invoice Generated \u2705");
    });
  };

  const generateGatePass = async () => {
    setButtonLoading((prev) => true);

    await fetch(`${apiUrl}${pathname}/gatePass`, {
      method: "POST",
      body: JSON.stringify({
        jobCard,
        car,
        currentParts,
        currentLabour,
        currentJobCardStatus,
      }),
    }).then((result: any) => {
      // Disable the page, this happens automatically at refresh but its a precaution.
      setIsDisabled(true);

      result.json().then((invoice: any) => {
        openInNewTab(invoice);
        setTimeout(async () => {
          await saveCurrentPartsAndLbour(6);
          window.location.reload();
        }, 1000);
      });

      setButtonLoading((prev) => false);
      setCurrentJobCardStatus(6);

      toast("Tax Invoice Generated \u2705");
    });
  };

  useEffect(() => {
    const loadPolicyProviders = async () => {
      try {
        const data = await fetchPolicyProviders();
        setPolicyProviders(data);
      } catch (error) {
        console.error("Error fetching policy providers:", error);
      }
    };

    loadPolicyProviders();
  }, []);

  const saveInsuranceDetails = async () => {
    const foundObj = policyProviders.find((a) => a.insurer === policyProvider);

    const insuranceDetails = JSON.stringify({
      policyProvider,
      policyProviderAddress: foundObj?.address,
      policyProviderGST: foundObj?.GST,
      policyNumber,
    });

    console.log("Saving Insurance Details: ", insuranceDetails);

    const isDone = await updateJobCardInsuranceDetails(
      params.jobCardId,
      insuranceDetails
    );

    console.log("Update Result: ", isDone);
    if (isDone) {
      toast("Insurance Details have been Updated \u2705");
      setIsInsuranceDetails(true);
    }
  };

  const saveCustomerGST = async () => {
    const isDone = await updateJobCardGSTDetails(params.jobCardId, customerGST);

    console.log(isDone);
    if (isDone) {
      toast("GST Details have been Updated \u2705");
    }
  };

  const saveObservationRemarks = async () => {
    const isDone = await updateJobCardObservationRemarks(
      params.jobCardId,
      observationRemarks
    );

    console.log(isDone);
    if (isDone) {
      toast("Observation and Remarks have been Updated \u2705");
    }
  };

  const generateJobCardPDF = async ({ jobCard, car }: any) => {
    console.log("Generating Jobcard");
    try {
      const response = await fetch(`${apiUrl}${pathname}/jobCardPDF`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobCard,
          car,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Convert response to blob (PDF file)
      const blob = await response.blob();

      console.log("blob", blob);
      const url = URL.createObjectURL(blob);

      console.log("PDF URL", url);

      // Open in new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleInvoicePDF = (selectedValue: string) => {
    console.log("SELECTED PDF - ", selectedValue);
    if (selectedValue == "Gate Pass") {
      console.log("GATE PASS PDF - ", jobCard?.gatePassPDF);
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

  const handleInsuranceInvoicePDF = (selectedValue: any) => {
    if (selectedValue == "Gate Pass") {
      console.log("GATE PASS PDF - ", jobCard?.gatePassPDF);
      if (jobCard) {
        openInNewTab(jobCard.gatePassPDF);
      }
    } else {
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
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime()
          );
          const selectedInvoice = filteredInvoices[0];

          console.log("FILTE$RED INVOICES", selectedInvoice);
          openInNewTab(selectedInvoice.invoiceUrl);
        }
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
              <CarHistory
                carsTableId={carsTableId}
                currentJobCardId={params.jobCardId}
                currentJobCardStatus={currentJobCardStatus || 0}
              />

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
                  {currentJobCardStatus == 4 &&
                    user.email != "billermiraroad@t3cars.in" && (
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
                  {currentJobCardStatus == 5 &&
                    user.email != "billermiraroad@t3cars.in" && (
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
              <span className="font-semibold text-3xl">
                {jobCard.carNumber}
              </span>
              <span className="font-medium ml-2 text-2xl text-gray-700">{`(${car.carMake} ${car.carModel})`}</span>
            </div>
            <div className="font-medium text-gray-500">
              <div>#JobCardNumber : {jobCard.jobCardNumber}</div>
            </div>
          </div>
          <TriggerWhatsappDemo car={car} jobCard={jobCard} />
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
                      onClick={saveInsuranceDetails}
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
                      onClick={saveCustomerName}
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
                      onClick={saveCustomerAddress}
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
                      onClick={saveCustomerPhone}
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
                    Edit Customer Email
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] overflow-visible max-h-screen focus:outline-none">
                  <DialogHeader>
                    <DialogTitle>Customer Email</DialogTitle>
                    <DialogDescription>Customer Email</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label
                        htmlFor="CustomerPhoneNumber"
                        className="text-right"
                      >
                        Customer Email
                      </Label>
                      <Input
                        id="customerEmail"
                        className="col-span-3"
                        onChange={(event) =>
                          setCustomerEmail(event.target.value)
                        }
                        value={customerEmail}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-red-500"
                      onClick={saveCustomerEmail}
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
                      onClick={saveCustomerGST}
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
                      onClick={saveObservationRemarks}
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
              partsTotal={partsTotal}
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
              labourTotal={labourTotal}
              disable={isDisabled}
            />
          </div>
        </>
      )}
    </div>
  );
}
