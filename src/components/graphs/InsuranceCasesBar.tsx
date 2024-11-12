"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
    browser: "Acko General Insurance Co. Ltd.",
    visitors: 120,
  },
  {
    browser: "Bajaj Allianz General Insurance",
    visitors: 95,
  },
  {
    browser: "Bharti AXA General Insurance Company Ltd.",
    visitors: 110,
  },
  {
    browser: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
    visitors: 75,
  },
  {
    browser: "Go Digit General Insurance Ltd.",
    visitors: 60,
  },
  {
    browser: "Edelweiss General Insurance Co. Ltd.",
    visitors: 85,
  },
  {
    browser: "Future Generali General Insurance",
    visitors: 90,
  },
  {
    browser: "Iffco Tokio General Insurance Co. Ltd.",
    visitors: 115,
  },
  {
    browser: "Kotak Mahindra General Insurance Co. Ltd.",
    visitors: 70,
  },
  {
    browser: "LIBERTY GENERAL INSURANCE LIMITED",
    visitors: 55,
  },
  {
    browser: "NATIONAL INSURANCE COMPANY LIMITED",
    visitors: 150,
  },
  {
    browser: "THE NEW INDIA ASSURANCE CO LTD",
    visitors: 200,
  },
  {
    browser: "The Oriental Insurance Co. Ltd.",
    visitors: 145,
  },
  {
    browser: "Raheja QBE General Insurance Co. Ltd.",
    visitors: 65,
  },
  {
    browser: "Reliance General Insurance Co Ltd",
    visitors: 180,
  },
  {
    browser: "SBI General Insurance Co. Ltd.",
    visitors: 130,
  },
  {
    browser: "Shriram General Insurance Co. Ltd.",
    visitors: 125,
  },
  {
    browser: "Tata AIG General Insurance Co. Ltd.",
    visitors: 170,
  },
  {
    browser: "United India Insurance Co. Ltd.",
    visitors: 155,
  },
  {
    browser: "Universal Sompo General Insurance Co. Ltd.",
    visitors: 140,
  },
  {
    browser: "HDFC ERGO GEN INS CO LTD",
    visitors: 135,
  },
  {
    browser: "ICICI LOMBARD GENERAL INS CO LTD",
    visitors: 160,
  },
  {
    browser: "Royal Sundaram General Insurance Co. Ltd.",
    visitors: 100,
  },
  {
    browser: "OLA FLEET TECHNOLOGIES PVT LTD",
    visitors: 50,
  },
  {
    browser: "Magma HDI General Insurance Co. Ltd.",
    visitors: 45,
  },
  {
    browser: "Navi General Insurance Ltd.",
    visitors: 40,
  },
  {
    browser: "National Insurance Company Ltd",
    visitors: 125,
  },
  {
    browser: "ZUNO GENERAL INSURANCE LIMITED",
    visitors: 95,
  },
  {
    browser: "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
    visitors: 85,
  },
];

const chartConfig = {
  visitors: {
    label: "Cases",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function InsuranceCasesBar() {
  const top10Visitors = chartData
    .sort((a, b) => b.visitors - a.visitors) // Sort in descending order by visitors
    .slice(0, 10); // Get the top 10 entries
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 Insurance Partners</CardTitle>
        <CardDescription>April 2024 - Present</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={top10Visitors}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="visitors"
              layout="vertical"
              fill="var(--color-visitors)"
              radius={4}
            >
              <LabelList
                dataKey="browser"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="visitors"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
