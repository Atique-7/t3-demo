"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

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
import { CurrentLabour, CurrentPart, JobCard } from "@/lib/definitions";
import {
  manageTimelineChange,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";
const chartData = [
  { itemType: "parts", totalRevenue: 275, fill: "var(--color-parts)" },
  { itemType: "labour", totalRevenue: 200, fill: "var(--color-labour)" },
];

const chartConfig = {
  totalRevenue: {
    label: "",
  },
  parts: {
    label: "Parts",
    color: "hsl(var(--chart-1))",
  },
  labour: {
    label: "Labour",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PartsLabourSplit({ jobCards, currentSelectedTimeline }: any) {
  const [newChartData, setNewChartData] = useState<any[]>(chartData);
  const [selectedTimeline, setSelectedTimeline] = useState<string>();

  let totalParts = 0;
  let totalLabour = 0;

  useEffect(() => {
    totalParts = 0;
    totalLabour = 0;
    jobCards.map((jobCard: JobCard) => {
      let parts = 0;
      let labour = 0;
      let total = 0;

      let partsArray = stringToObj(jobCard.parts);
      let labourArray = stringToObj(jobCard.labour);

      partsArray.map((part: CurrentPart) => {
        total = total + part.amount;
        parts = parts + part.amount;
      });

      labourArray.map((work: CurrentLabour) => {
        total = total + work.amount;
        labour = labour + work.amount;
      });

      parts = roundToTwoDecimals(parts);
      labour = roundToTwoDecimals(labour);
      total = roundToTwoDecimals(total);

      totalParts = totalParts + parts;
      totalLabour = totalLabour + labour;
    });

    totalParts = roundToTwoDecimals(totalParts);
    totalLabour = roundToTwoDecimals(totalLabour);

    setNewChartData([
      {
        itemType: "parts",
        totalRevenue: totalParts,
        fill: "var(--color-parts)",
      },
      {
        itemType: "labour",
        totalRevenue: totalLabour,
        fill: "var(--color-labour)",
      },
    ]);

    manageTimelineChange({ currentSelectedTimeline, setSelectedTimeline });
  }, [jobCards]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Parts / Labour</CardTitle>
        <CardDescription>{selectedTimeline}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="itemType" hideLabel />}
            />
            <Pie data={newChartData} dataKey="totalRevenue">
              <LabelList
                dataKey="totalRevenue"
                className="fill-background"
                stroke="none"
                fontSize={14}
                formatter={(value: keyof typeof chartConfig) => value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
