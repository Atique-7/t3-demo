"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import Decimal from "decimal.js";
import { createJobCardObjReport, manageTimelineChange } from "@/lib/helper";
const chartData = [{ date: "2024-04-01", parts: 222, labour: 150 }];

const chartConfig = {
  views: {
    label: "Revenue",
  },
  parts: {
    label: "Parts",
    color: "hsl(var(--chart-1))",
  },
  labour: {
    label: "Labour",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
  numberOfJobCards: { label: "Closed JobCards", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

export function RevenueHistory({ jobCards, currentSelectedTimeline }: any) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("parts");

  const [newChartData, setNewChartData] = useState<any[]>(chartData);
  const [chartTotals, setChartTotals] = useState({
    parts: 0,
    labour: 0,
    total: 0,
    numberOfJobCards: 0,
  });
  const [selectedTimeline, setSelectedTimeline] = useState<string>();

  useEffect(() => {
    const refreshData = async () => {
      let numberOfJobCards = 0;

      let chartTotal = {
        parts: new Decimal(0),
        labour: new Decimal(0),
        total: new Decimal(0),
        numberOfJobCards: 0,
      };

      jobCards = await jobCards.filter(
        (jobCard: JobCard) => jobCard.jobCardStatus >= 6
      );

      console.log("HISTORY JOB CARDS BEGINNING", jobCards.length);

      const groupedJobCards = jobCards.reduce((acc: any, card: any) => {
        const formattedDate = new Date(card.$updatedAt).toLocaleDateString(
          "en-GB"
        );
        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }

        acc[formattedDate].push(card);

        return acc;
      }, {});

      let newChartData: {
        date: string;
        parts: Number;
        labour: Number;
        total: Number;
        numberOfJobCards: Number;
      }[] = [];

      await Promise.all(
        Object.entries(groupedJobCards).map(async ([date, jobCards]: any) => {
          let totalPartsWithoutTax = new Decimal(0);
          let totalLabourWithoutTax = new Decimal(0);
          let totalRevenue = new Decimal(0);

          await Promise.all(
            jobCards.map(async (jobCard: JobCard) => {
              chartTotal.numberOfJobCards += 1;

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

          const [day, month, year] = date.split("/");
          date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

          newChartData.push({
            date: date,
            parts: Number(totalPartsWithoutTax),
            labour: Number(totalLabourWithoutTax),
            total: Number(totalRevenue),
            numberOfJobCards: jobCards.length,
          });

          chartTotal.parts = chartTotal.parts.add(totalPartsWithoutTax);
          chartTotal.labour = chartTotal.labour.add(totalLabourWithoutTax);
          chartTotal.total = chartTotal.total.add(totalRevenue);
        })
      );

      const sortedChartData = newChartData.sort((a, b) => {
        const dateA = new Date(a.date.split("/").reverse().join("-"));
        const dateB = new Date(b.date.split("/").reverse().join("-"));
        return dateA.getTime() - dateB.getTime();
      });

      console.log("HISTORY JOB CARDS END", numberOfJobCards);
      setNewChartData(sortedChartData);
      setChartTotals({
        parts: Number(chartTotal.parts),
        labour: Number(chartTotal.labour),
        total: Number(chartTotal.total),
        numberOfJobCards: chartTotal.numberOfJobCards,
      });
    };

    refreshData();
    manageTimelineChange({ currentSelectedTimeline, setSelectedTimeline });
  }, [jobCards]);

  const total = React.useMemo(
    () => ({
      parts: newChartData.reduce((acc, curr) => acc + curr.desktop, 0),
      labour: newChartData.reduce((acc, curr) => acc + curr.mobile, 0),
      total: newChartData.reduce((acc, curr) => acc + curr.total, 0),
    }),
    []
  );

  return (
    <Card className="w-[90%]">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Revenue History</CardTitle>
          <CardDescription>{selectedTimeline}</CardDescription>
        </div>
        <div className="flex">
          {["parts", "labour", "total", "numberOfJobCards"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-red-100 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {key != "numberOfJobCards" && <>&#8377;</>}
                  {Math.round(
                    chartTotals[key as keyof typeof total]
                  ).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={newChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-GB", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
