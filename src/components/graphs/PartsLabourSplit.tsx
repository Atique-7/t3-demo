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
  createJobCardObjReport,
  manageTimelineChange,
  roundToTwoDecimals,
  stringToObj,
} from "@/lib/helper";
import Decimal from "decimal.js";
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

  useEffect(() => {
    const refreshData = async () => {
      jobCards = await jobCards.filter(
        (jobCard: JobCard) => jobCard.jobCardStatus >= 6
      );

      let totalPartsWithoutTax = new Decimal(0);
      let totalLabourWithoutTax = new Decimal(0);
      let totalRevenue = new Decimal(0);

      await Promise.all(
        jobCards.map(async (jobCard: JobCard) => {
          let jobCardParts = new Decimal(0);
          let jobCardLabour = new Decimal(0);
          let jobCardRevenue = new Decimal(0);

          const jobCardTotals = await createJobCardObjReport(jobCard);

          jobCardParts = jobCardParts.add(
            new Decimal(Number(jobCardTotals.partsSubtotal))
          );

          jobCardLabour = jobCardLabour.add(
            new Decimal(Number(jobCardTotals.labourSubtotal))
          );

          jobCardParts = jobCardParts.minus(
            new Decimal(Number(jobCardTotals.partsDiscount))
          );

          jobCardLabour = jobCardLabour.minus(
            new Decimal(Number(jobCardTotals.labourDiscount))
          );

          jobCardRevenue = jobCardRevenue.add(jobCardParts);
          jobCardRevenue = jobCardRevenue.add(jobCardLabour);

          totalPartsWithoutTax = totalPartsWithoutTax.add(jobCardParts);
          totalLabourWithoutTax = totalLabourWithoutTax.add(jobCardLabour);
          totalRevenue = totalRevenue.add(jobCardRevenue);
        })
      );

      // totalPartsWithoutTax = new Decimal(0);
      // totalLabourWithoutTax = new Decimal(0);

      // await Promise.all(
      //   jobCards.map(async (jobCard: JobCard) => {
      //     let jobCardParts = new Decimal(0);
      //     let jobCardLabour = new Decimal(0);

      //     const jobCardTotals = await createJobCardObjReport(jobCard);

      //     jobCardParts = jobCardParts.add(
      //       new Decimal(Number(jobCardTotals.partsSubtotal))
      //     );

      //     jobCardLabour = jobCardLabour.add(
      //       new Decimal(Number(jobCardTotals.labourSubtotal))
      //     );

      //     jobCardParts = jobCardParts.minus(
      //       new Decimal(Number(jobCardTotals.partsDiscount))
      //     );

      //     jobCardLabour = jobCardLabour.minus(
      //       new Decimal(Number(jobCardTotals.labourDiscount))
      //     );

      //     totalPartsWithoutTax = totalPartsWithoutTax.add(jobCardParts);
      //     totalLabourWithoutTax = totalLabourWithoutTax.add(jobCardLabour);
      //   })
      // );

      // totalPartsWithoutTax = roundToTwoDecimals(totalParts);
      // totalLabour = roundToTwoDecimals(totalLabour);

      setNewChartData([
        {
          itemType: "parts",
          totalRevenue: Number(totalPartsWithoutTax),
          fill: "var(--color-parts)",
        },
        {
          itemType: "labour",
          totalRevenue: Number(totalLabourWithoutTax),
          fill: "var(--color-labour)",
        },
      ]);
    };

    refreshData();

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
                className="fill-background font-bold"
                stroke="none"
                fontSize={16}
                formatter={(value: keyof typeof chartConfig) => value}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
