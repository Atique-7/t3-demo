import React, { useState, useMemo } from "react";
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

export default function RevenueSplit({ jobCards }: any) {
  let totalRevenue = 0;

  jobCards.filter((jobCard: JobCard) => jobCard.jobCardStatus >= 5);
  // Group data by purposeOfVisit and calculate revenue
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
  const formattedDataset = Object.entries(revenueData).map(([key, value]) => ({
    pov: key,
    revenue: Number(revenueData[key].revenue.toFixed(2)), // Round off to 2 decimal places
    fill: revenueData[key].fill,
  }));

  formattedDataset.map((pov: any) => {
    totalRevenue = totalRevenue + pov.revenue;
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>This Month</CardDescription>
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
              data={formattedDataset}
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
                          &#8377;{totalRevenue.toFixed()}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 9% this month <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
