"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

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
    fill: "var(--color-acko)",
  },
  {
    browser: "Bajaj Allianz General Insurance",
    visitors: 95,
    fill: "var(--color-bajaj)",
  },
  {
    browser: "Bharti AXA General Insurance Company Ltd.",
    visitors: 110,
    fill: "var(--color-bhartiAxa)",
  },
  {
    browser: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
    visitors: 75,
    fill: "var(--color-cholamandalam)",
  },
  {
    browser: "Go Digit General Insurance Ltd.",
    visitors: 60,
    fill: "var(--color-goDigit)",
  },
  {
    browser: "Edelweiss General Insurance Co. Ltd.",
    visitors: 85,
    fill: "var(--color-edelweiss)",
  },
  {
    browser: "Future Generali General Insurance",
    visitors: 90,
    fill: "var(--color-futureGenerali)",
  },
  {
    browser: "Iffco Tokio General Insurance Co. Ltd.",
    visitors: 115,
    fill: "var(--color-iffcoTokio)",
  },
  {
    browser: "Kotak Mahindra General Insurance Co. Ltd.",
    visitors: 70,
    fill: "var(--color-kotakMahindra)",
  },
  {
    browser: "LIBERTY GENERAL INSURANCE LIMITED",
    visitors: 55,
    fill: "var(--color-liberty)",
  },
  {
    browser: "NATIONAL INSURANCE COMPANY LIMITED",
    visitors: 150,
    fill: "var(--color-nationalInsurance)",
  },
  {
    browser: "THE NEW INDIA ASSURANCE CO LTD",
    visitors: 200,
    fill: "var(--color-newIndia)",
  },
  {
    browser: "The Oriental Insurance Co. Ltd.",
    visitors: 145,
    fill: "var(--color-oriental)",
  },
  {
    browser: "Raheja QBE General Insurance Co. Ltd.",
    visitors: 65,
    fill: "var(--color-rahejaQBE)",
  },
  {
    browser: "Reliance General Insurance Co Ltd",
    visitors: 180,
    fill: "var(--color-reliance)",
  },
  {
    browser: "SBI General Insurance Co. Ltd.",
    visitors: 130,
    fill: "var(--color-sbi)",
  },
  {
    browser: "Shriram General Insurance Co. Ltd.",
    visitors: 125,
    fill: "var(--color-shriram)",
  },
  {
    browser: "Tata AIG General Insurance Co. Ltd.",
    visitors: 170,
    fill: "var(--color-tataAIG)",
  },
  {
    browser: "United India Insurance Co. Ltd.",
    visitors: 155,
    fill: "var(--color-unitedIndia)",
  },
  {
    browser: "Universal Sompo General Insurance Co. Ltd.",
    visitors: 140,
    fill: "var(--color-universalSompo)",
  },
  {
    browser: "HDFC ERGO GEN INS CO LTD",
    visitors: 135,
    fill: "var(--color-hdfcErgo)",
  },
  {
    browser: "ICICI LOMBARD GENERAL INS CO LTD",
    visitors: 160,
    fill: "var(--color-iciciLombard)",
  },
  {
    browser: "Royal Sundaram General Insurance Co. Ltd.",
    visitors: 100,
    fill: "var(--color-royalSundaram)",
  },
  {
    browser: "OLA FLEET TECHNOLOGIES PVT LTD",
    visitors: 50,
    fill: "var(--color-olaFleet)",
  },
  {
    browser: "Magma HDI General Insurance Co. Ltd.",
    visitors: 45,
    fill: "var(--color-magmaHDI)",
  },
  {
    browser: "Navi General Insurance Ltd.",
    visitors: 40,
    fill: "var(--color-navi)",
  },
  {
    browser: "National Insurance Company Ltd",
    visitors: 125,
    fill: "var(--color-nationalInsuranceLtd)",
  },
  {
    browser: "ZUNO GENERAL INSURANCE LIMITED",
    visitors: 95,
    fill: "var(--color-zuno)",
  },
  {
    browser: "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
    visitors: 85,
    fill: "var(--color-zurichKotak)",
  },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  acko: {
    label: "Acko General Insurance Co. Ltd.",
    color: "hsl(var(--chart-1))",
  },
  bajaj: {
    label: "Bajaj Allianz General Insurance",
    color: "hsl(var(--chart-2))",
  },
  bhartiAxa: {
    label: "Bharti AXA General Insurance Company Ltd.",
    color: "hsl(var(--chart-3))",
  },
  cholamandalam: {
    label: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
    color: "hsl(var(--chart-4))",
  },
  goDigit: {
    label: "Go Digit General Insurance Ltd.",
    color: "hsl(var(--chart-5))",
  },
  edelweiss: {
    label: "Edelweiss General Insurance Co. Ltd.",
    color: "hsl(var(--chart-1))",
  },
  futureGenerali: {
    label: "Future Generali General Insurance",
    color: "hsl(var(--chart-2))",
  },
  iffcoTokio: {
    label: "Iffco Tokio General Insurance Co. Ltd.",
    color: "hsl(var(--chart-3))",
  },
  kotakMahindra: {
    label: "Kotak Mahindra General Insurance Co. Ltd.",
    color: "hsl(var(--chart-4))",
  },
  liberty: {
    label: "LIBERTY GENERAL INSURANCE LIMITED",
    color: "hsl(var(--chart-5))",
  },
  nationalInsurance: {
    label: "NATIONAL INSURANCE COMPANY LIMITED",
    color: "hsl(var(--chart-1))",
  },
  newIndia: {
    label: "THE NEW INDIA ASSURANCE CO LTD",
    color: "hsl(var(--chart-2))",
  },
  oriental: {
    label: "The Oriental Insurance Co. Ltd.",
    color: "hsl(var(--chart-3))",
  },
  rahejaQBE: {
    label: "Raheja QBE General Insurance Co. Ltd.",
    color: "hsl(var(--chart-4))",
  },
  reliance: {
    label: "Reliance General Insurance Co Ltd",
    color: "hsl(var(--chart-5))",
  },
  sbi: {
    label: "SBI General Insurance Co. Ltd.",
    color: "hsl(var(--chart-1))",
  },
  shriram: {
    label: "Shriram General Insurance Co. Ltd.",
    color: "hsl(var(--chart-2))",
  },
  tataAIG: {
    label: "Tata AIG General Insurance Co. Ltd.",
    color: "hsl(var(--chart-3))",
  },
  unitedIndia: {
    label: "United India Insurance Co. Ltd.",
    color: "hsl(var(--chart-4))",
  },
  universalSompo: {
    label: "Universal Sompo General Insurance Co. Ltd.",
    color: "hsl(var(--chart-5))",
  },
  hdfcErgo: {
    label: "HDFC ERGO GEN INS CO LTD",
    color: "hsl(var(--chart-1))",
  },
  iciciLombard: {
    label: "ICICI LOMBARD GENERAL INS CO LTD",
    color: "hsl(var(--chart-2))",
  },
  royalSundaram: {
    label: "Royal Sundaram General Insurance Co. Ltd.",
    color: "hsl(var(--chart-3))",
  },
  olaFleet: {
    label: "OLA FLEET TECHNOLOGIES PVT LTD",
    color: "hsl(var(--chart-4))",
  },
  magmaHDI: {
    label: "Magma HDI General Insurance Co. Ltd.",
    color: "hsl(var(--chart-5))",
  },
  navi: {
    label: "Navi General Insurance Ltd.",
    color: "hsl(var(--chart-1))",
  },
  nationalInsuranceLtd: {
    label: "National Insurance Company Ltd",
    color: "hsl(var(--chart-2))",
  },
  zuno: {
    label: "ZUNO GENERAL INSURANCE LIMITED",
    color: "hsl(var(--chart-3))",
  },
  zurichKotak: {
    label: "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function InsuranceCases() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Insurance Distribution</CardTitle>
        <CardDescription>April 2024 - Present</CardDescription>
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
            <Pie data={chartData} dataKey="visitors" nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
