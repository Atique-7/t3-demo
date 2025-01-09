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
import { useEffect, useState } from "react";
import { JobCard } from "@/lib/definitions";
import { adminReportTimelineDrop, manageTimelineChange } from "@/lib/helper";
const chartData = [
  {
    insuranceCompany: "Acko General Insurance Co. Ltd.",
    cases: 120,
  },
  {
    insuranceCompany: "Bajaj Allianz General Insurance",
    cases: 95,
  },
  {
    insuranceCompany: "Bharti AXA General Insurance Company Ltd.",
    cases: 110,
  },
  {
    insuranceCompany: "CHOLAMANDALAM MS GENERAL INSURANCE COMPANY LTD",
    cases: 75,
  },
  {
    insuranceCompany: "Go Digit General Insurance Ltd.",
    cases: 60,
  },
  {
    insuranceCompany: "Edelweiss General Insurance Co. Ltd.",
    cases: 85,
  },
  {
    insuranceCompany: "Future Generali General Insurance",
    cases: 90,
  },
  {
    insuranceCompany: "Iffco Tokio General Insurance Co. Ltd.",
    cases: 115,
  },
  {
    insuranceCompany: "Kotak Mahindra General Insurance Co. Ltd.",
    cases: 70,
  },
  {
    insuranceCompany: "LIBERTY GENERAL INSURANCE LIMITED",
    cases: 55,
  },
  {
    insuranceCompany: "NATIONAL INSURANCE COMPANY LIMITED",
    cases: 150,
  },
  {
    insuranceCompany: "THE NEW INDIA ASSURANCE CO LTD",
    cases: 200,
  },
  {
    insuranceCompany: "The Oriental Insurance Co. Ltd.",
    cases: 145,
  },
  {
    insuranceCompany: "Raheja QBE General Insurance Co. Ltd.",
    cases: 65,
  },
  {
    insuranceCompany: "Reliance General Insurance Co Ltd",
    cases: 180,
  },
  {
    insuranceCompany: "SBI General Insurance Co. Ltd.",
    cases: 130,
  },
  {
    insuranceCompany: "Shriram General Insurance Co. Ltd.",
    cases: 125,
  },
  {
    insuranceCompany: "Tata AIG General Insurance Co. Ltd.",
    cases: 170,
  },
  {
    insuranceCompany: "United India Insurance Co. Ltd.",
    cases: 155,
  },
  {
    insuranceCompany: "Universal Sompo General Insurance Co. Ltd.",
    cases: 140,
  },
  {
    insuranceCompany: "HDFC ERGO GEN INS CO LTD",
    cases: 135,
  },
  {
    insuranceCompany: "ICICI LOMBARD GENERAL INS CO LTD",
    cases: 160,
  },
  {
    insuranceCompany: "Royal Sundaram General Insurance Co. Ltd.",
    cases: 100,
  },
  {
    insuranceCompany: "OLA FLEET TECHNOLOGIES PVT LTD",
    cases: 50,
  },
  {
    insuranceCompany: "Magma HDI General Insurance Co. Ltd.",
    cases: 45,
  },
  {
    insuranceCompany: "Navi General Insurance Ltd.",
    cases: 40,
  },
  {
    insuranceCompany: "National Insurance Company Ltd",
    cases: 125,
  },
  {
    insuranceCompany: "ZUNO GENERAL INSURANCE LIMITED",
    cases: 95,
  },
  {
    insuranceCompany: "ZURICH KOTAK GENERAL INSURANCE COMPANY (INDIA) LIMITED",
    cases: 85,
  },
];

const chartConfig = {
  cases: {
    label: "Cases",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function InsuranceCasesBar({ jobCards, currentSelectedTimeline }: any) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<string>();

  // let top10Insurers = chartData
  //   .sort((a, b) => b.cases - a.cases) // Sort in descending order by visitors
  //   .slice(0, 10); // Get the top 10 entries

  useEffect(() => {
    let topInsurers: any = [];
    const filteredJobCards = jobCards.filter(
      (jobCard: JobCard) =>
        jobCard.insuranceDetails && jobCard.jobCardStatus > 4
    );

    filteredJobCards.forEach((jobCard: JobCard) => {
      const insuranceDetails = JSON.parse(jobCard.insuranceDetails);
      // console.log(insuranceDetails);
      const insuranceCompany = insuranceDetails.policyProvider;
      const index = topInsurers.findIndex(
        (insurer: any) => insurer.insuranceCompany === insuranceCompany
      );
      if (index === -1) {
        topInsurers.push({
          insuranceCompany,
          cases: 1,
        });
      } else {
        topInsurers[index].cases += 1;
      }
    });

    topInsurers = topInsurers.sort((a: any, b: any) => b.cases - a.cases);
    topInsurers = topInsurers.slice(0, 10);
    setChartData(topInsurers);
    // console.log(top10Insurers);

    manageTimelineChange({ currentSelectedTimeline, setSelectedTimeline });
  }, [jobCards]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top {chartData.length} Insurance Partners</CardTitle>
        <CardDescription>{selectedTimeline}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="insuranceCompany"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="cases" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="cases"
              layout="vertical"
              fill="var(--color-cases)"
              radius={4}
            >
              <LabelList
                dataKey="insuranceCompany"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="cases"
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
