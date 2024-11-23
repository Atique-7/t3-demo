import React from "react";
import JobCard from "@/app/biller/jobCard/[jobCardId]/page";

type Props = {};

export default function ViewJobCard({
  params,
}: {
  params: { jobCardId: any };
}) {
  return (
    <div>
      <JobCard params={{ jobCardId: params.jobCardId }} disable={true} />
    </div>
  );
}
