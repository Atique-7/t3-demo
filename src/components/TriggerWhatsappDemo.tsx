"use client";

import React from "react";
import { Button } from "./ui/button";
import { Car, JobCard } from "@/lib/definitions";

type Props = {};

const WHATSAPP_WEBHOOK =
  "https://api.chatdaddy.tech/bots/triggers/app-webhook/tgs_do-hP9aIcZmNoY8X6226DQ";

const TriggerWhatsappDemo = ({
  car,
  jobCard,
}: {
  car: Car;
  jobCard: JobCard;
}) => {
  const triggerJobCardCreatedWhatsApp = async () => {
    await fetch(
      "https://api.chatdaddy.tech/bots/triggers/app-webhook/tgs_do-hP9aIcZmNoY8X6226DQ",
      {
        method: "POST",
        body: JSON.stringify({
          phoneNumber: `919470302380`,
          event: "job-card-created",
          fullName: "Omkar Mishra",
          carMake: "HELLO",
          carModel: "TEST",
          carNumber: "JH0544444",
        }),
      }
    ).then((result: any) => {
      console.log("RESULT", result);
      result.json().then((recieved: any) => {
        console.log("JSON", recieved);
      });
    });
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
    </div>
  );
};

export default TriggerWhatsappDemo;
