"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
  {
    jobCardCreation: 6,
    partsAddition: 10,
    labourAddition: 7,
    quoteGeneration: 15,
    proFormaGeneration: 9,
    taxGeneration: 96,
    gatePassCreation: 42,
    carExit: 21,
  },
];

const chartConfig = {
  jobCardCreation: {
    label: "Job Card Creation",
    color: "hsl(var(--chart-1))",
  },
  partsAddition: {
    label: "Parts Addition",
    color: "hsl(var(--chart-2))",
  },
  labourAddition: {
    label: "Labour Addition",
    color: "hsl(var(--chart-3))",
  },
  quoteGeneration: {
    label: "Quote Generation",
    color: "hsl(var(--chart-4))",
  },
  proFormaGeneration: {
    label: "Pro-Forma Generation",
    color: "hsl(var(--chart-5))",
  },
  taxGeneration: {
    label: "Tax Generation",
    color: "hsl(var(--chart-3))",
  },
  gatePassCreation: {
    label: "Gatepass Generation",
    color: "hsl(var(--chart-4))",
  },
  carExit: {
    label: "Car Exit",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TimeAverage() {
  const totalVisitors =
    chartData[0].jobCardCreation +
    chartData[0].partsAddition +
    chartData[0].labourAddition +
    chartData[0].quoteGeneration +
    chartData[0].proFormaGeneration +
    chartData[0].taxGeneration +
    chartData[0].gatePassCreation +
    chartData[0].carExit;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Average Job Completion Time</CardTitle>
        <CardDescription>April 2024 - Present</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Hours
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="jobCardCreation"
              stackId="a"
              cornerRadius={1}
              fill="var(--color-jobCardCreation)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="partsAddition"
              fill="var(--color-partsAddition)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="labourAddition"
              fill="var(--color-labourAddition)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="quoteGeneration"
              fill="var(--color-quoteGeneration)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="proFormaGeneration"
              fill="var(--color-proFormaGeneration)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="taxGeneration"
              fill="var(--color-taxGeneration)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="gatePassCreation"
              fill="var(--color-gatePassCreation)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="carExit"
              fill="var(--color-carExit)"
              stackId="a"
              cornerRadius={1}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending down by 1.7% this month <TrendingDown className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
