"use client";

import * as React from "react";
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

const chartData = [
  { browser: "carsEntered", visitors: 10, fill: "var(--color-carsEntered)" },
  { browser: "jobCreated", visitors: 9, fill: "var(--color-jobCreated)" },
  { browser: "partsAdded", visitors: 5, fill: "var(--color-partsAdded)" },
  { browser: "labourAdded", visitors: 10, fill: "var(--color-labourAdded)" },
  {
    browser: "quoteGenerated",
    visitors: 5,
    fill: "var(--color-quoteGenerated)",
  },
  {
    browser: "proFormaGenerated",
    visitors: 19,
    fill: "var(--color-proFormaGenerated)",
  },
  { browser: "taxGenerated", visitors: 15, fill: "var(--color-taxGenerated)" },
  {
    browser: "gatePassGenerated",
    visitors: 7,
    fill: "var(--color-gatePassGenerated)",
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  carsEntered: {
    label: "Cars Entered",
    color: "hsl(var(--chart-1))",
  },
  jobCreated: {
    label: "Job Card Created",
    color: "hsl(var(--chart-2))",
  },
  partsAdded: {
    label: "Parts Added",
    color: "hsl(var(--chart-3))",
  },
  labourAdded: {
    label: "Labour Added",
    color: "hsl(var(--chart-4))",
  },
  quoteGenerated: {
    label: "Quote Generated",
    color: "hsl(var(--chart-5))",
  },
  proFormaGenerated: {
    label: "Pro Forma Generated",
    color: "hsl(var(--chart-1))",
  },
  taxGenerated: {
    label: "Tax Invoice Generated",
    color: "hsl(var(--chart-2))",
  },
  gatePassGenerated: {
    label: "Gate Pass Generated",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function CurrentCarsPie() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cars Currently being worked on</CardTitle>
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
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
