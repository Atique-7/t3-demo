"use client";

import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
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
import { JobCard } from "@/lib/definitions";
import { adminReportTimelineDrop, manageTimelineChange } from "@/lib/helper";
import { set } from "react-datepicker/dist/date_utils";

const chartConfig = {
  revenue: {
    label: "Visitors",
  },
  generalvisit: {
    label: "General Visit",
    color: "hsl(var(--chart-2))",
  },
  bodyshop: {
    label: "Bodyshop",
    color: "hsl(var(--chart-1))",
  },
  paidservice: {
    label: "Paid Service",
    color: "hsl(var(--chart-3))",
  },
  runningrepair: {
    label: "Running Repair",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function RevenueSplit({
  jobCards,
  currentSelectedTimeline,
}: any) {
  const [newChartData, setNewChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [selectedTimeline, setSelectedTimeline] = useState<string>();

  let totalRevenue = 0;

  useEffect(() => {
    const refreshData = async () => {
      totalRevenue = 0;
      // Group data by purposeOfVisit and calculate revenue
      jobCards = await jobCards.filter(
        (jobCard: JobCard) => jobCard.jobCardStatus >= 6
      );
      const revenueData = jobCards.reduce((acc: any, curr: any) => {
        if (!acc[curr.purposeOfVisit]) {
          acc[curr.purposeOfVisit] = {
            revenue: 0,
            fill: `var(--color-${curr.purposeOfVisit
              .replace(/\s+/g, "")
              .toLowerCase()})`,
          };
        }
        acc[curr.purposeOfVisit].revenue += curr.amount || 0; // Handle null or missing amounts
        return acc;
      }, {});

      // Create the formatted dataset
      const formattedDataset = Object.entries(revenueData).map(
        ([key, value]) => ({
          pov: key,
          revenue: Number(revenueData[key].revenue.toFixed(2)), // Round off to 2 decimal places
          fill: revenueData[key].fill,
        })
      );

      formattedDataset.map((pov: any) => {
        totalRevenue = totalRevenue + pov.revenue;
      });

      setTotal(totalRevenue);

      setNewChartData(formattedDataset);
    };

    refreshData();

    manageTimelineChange({ currentSelectedTimeline, setSelectedTimeline });
  }, [jobCards]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>{selectedTimeline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={newChartData}
              dataKey="revenue"
              nameKey="pov"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          &#8377;{total.toFixed()}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
