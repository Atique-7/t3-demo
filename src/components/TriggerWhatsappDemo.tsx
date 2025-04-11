"use client";

import React from "react";
import { Button } from "./ui/button";
import { Car, Invoice, JobCard } from "@/lib/definitions";

type Props = {};

const WHATSAPP_WEBHOOK =
  "https://api.chatdaddy.tech/bots/triggers/app-webhook/tgs_do-hP9aIcZmNoY8X6226DQ";

const TriggerWhatsappDemo = ({
  car,
  jobCard,
  jobCardInvoices,
}: {
  car: Car;
  jobCard: JobCard;
  jobCardInvoices: Invoice[];
}) => {
  const triggerJobCardCreatedWhatsApp = async () => {
    const bodyObj = JSON.stringify({
      phoneNumber: "91" + jobCard.customerPhone,
      event: "job-card-created",
      fullName: jobCard.customerName,
      carMake: car.carMake,
      carModel: car.carModel,
      carNumber: jobCard.carNumber,
      jobCardPdfUrl: jobCard.jobCardPDF,
    });

    try {
      const response = await fetch(
        "https://api.chatdaddy.tech/bots/triggers/app-webhook/tgs_do-hP9aIcZmNoY8X6226DQ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyObj,
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to send WhatsApp trigger:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
      console.log("Trigger Response:", data);
    } catch (error) {
      console.error("Error triggering WhatsApp message:", error);
    }
  };

  const triggerQuoteGeneratedWhatsApp = async () => {
    let selectedInvoice;
    if (jobCardInvoices) {
      const filteredInvoices: Invoice[] = jobCardInvoices?.filter(
        (invoice: Invoice) => invoice.invoiceType == "Quote"
      );
      filteredInvoices?.sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
      );
      selectedInvoice = filteredInvoices[0];
    }
    const bodyObj = JSON.stringify({
      phoneNumber: "91" + jobCard.customerPhone,
      event: "quote-generated",
      // fullName: jobCard.customerName,
      carMake: car.carMake,
      carModel: car.carModel,
      // carNumber: jobCard.carNumber,
      quotePdf: selectedInvoice?.invoiceUrl,
    });

    try {
      const response = await fetch(
        "https://api.chatdaddy.tech/bots/triggers/app-webhook/tgs_do-hP9aIcZmNoY8X6226DQ",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: bodyObj,
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to send WhatsApp trigger:",
          response.status,
          response.statusText
        );
        return;
      }

      const data = await response.json();
      console.log("Trigger Response:", data);
    } catch (error) {
      console.error("Error triggering WhatsApp message:", error);
    }
  };
  return (
    <div className="flex space-x-8">
      <Button
        variant="outline"
        className="px-8 py-2 border border-red-500 text-red-500"
        size="lg"
        onClick={triggerJobCardCreatedWhatsApp}
      >
        JobCard created
      </Button>
      <Button
        variant="outline"
        className="px-8 py-2 border border-red-500 text-red-500"
        size="lg"
        onClick={triggerQuoteGeneratedWhatsApp}
      >
        Quote Generated
      </Button>
    </div>
  );
};

export default TriggerWhatsappDemo;
