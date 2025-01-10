"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { JobCard } from "@/lib/definitions";
import { adminReportTimelineDrop, manageTimelineChange } from "@/lib/helper";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Job Cards",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Revenue (10k)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ServiceAdvisorPerformance({
  jobCards,
  currentSelectedTimeline,
}: any) {
  const [newChartData, setNewChartData] = useState<any[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>();

  // let top10Insurers = chartData
  //   .sort((a, b) => b.cases - a.cases) // Sort in descending order by visitors
  //   .slice(0, 10); // Get the top 10 entries

  useEffect(() => {
    let serviceAdvisors: any = [];

    jobCards.forEach((jobCard: JobCard) => {
      const index = serviceAdvisors.findIndex(
        (advisor: any) => advisor.month === jobCard.serviceAdvisorID
      );
      if (index === -1) {
        serviceAdvisors.push({
          month: jobCard.serviceAdvisorID,
          desktop: 1,
          mobile: jobCard.amount,
        });
      } else {
        serviceAdvisors[index].desktop += 1;
        serviceAdvisors[index].mobile += jobCard.amount;
      }
    });

    serviceAdvisors = serviceAdvisors.sort(
      (a: any, b: any) => b.desktop - a.desktop
    );

    serviceAdvisors = serviceAdvisors.map((advisor: any) => ({
      ...advisor,
      mobile: Math.round(advisor.mobile / 10000),
      roundedDown:
        Math.round(advisor.mobile / 10000) > advisor.mobile ? false : true,
    }));

    setNewChartData(serviceAdvisors);

    manageTimelineChange({ currentSelectedTimeline, setSelectedTimeline });
  }, [jobCards]);
  return (
    <Card className="w-[90%]">
      <CardHeader>
        <CardTitle>Service Adv. Performance</CardTitle>
        <CardDescription>{selectedTimeline}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={newChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
