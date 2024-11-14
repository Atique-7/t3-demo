// "use client";

// import * as React from "react";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";
// const chartData = [
//   { browser: "chrome", visitors: 1275345, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 2000000, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 827000, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 1024000, fill: "var(--color-edge)" },
// ];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "General Visit ₹",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Bodyshop ₹",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Paid Service ₹",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Running Repairs ₹",
//     color: "hsl(var(--chart-4))",
//   },
// } satisfies ChartConfig;

// export default function RevenueSplit() {
//   const totalVisitors = React.useMemo(() => {
//     return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
//   }, []);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Total Revenue</CardTitle>
//         <CardDescription>April 2024 - Present</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="visitors"
//               nameKey="browser"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-xl font-bold"
//                         >
//                           &#8377;{totalVisitors.toLocaleString()}
//                         </tspan>
//                       </text>
//                     );
//                   }
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 9% this month <TrendingUp className="h-4 w-4" />
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

// import React, { useState, useMemo } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { TrendingUp } from "lucide-react";
// import { Label, Pie, PieChart } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart";

// type DataPeriod = "week" | "month" | "year" | "custom";

// const chartData = {
//   week: [
//     {
//       browser: "chrome",
//       visitors: 20000,
//       fill: "var(--color-chrome)",
//       date: new Date("2024-11-01"),
//     },
//     {
//       browser: "safari",
//       visitors: 30000,
//       fill: "var(--color-safari)",
//       date: new Date("2024-11-02"),
//     },
//     {
//       browser: "firefox",
//       visitors: 24000,
//       fill: "var(--color-firefox)",
//       date: new Date("2024-11-03"),
//     },
//     {
//       browser: "edge",
//       visitors: 32000,
//       fill: "var(--color-edge)",
//       date: new Date("2024-11-04"),
//     },
//   ],
//   month: [
//     {
//       browser: "chrome",
//       visitors: 100000,
//       fill: "var(--color-chrome)",
//       date: new Date("2024-10-05"),
//     },
//     {
//       browser: "safari",
//       visitors: 150000,
//       fill: "var(--color-safari)",
//       date: new Date("2024-10-15"),
//     },
//     {
//       browser: "firefox",
//       visitors: 240000,
//       fill: "var(--color-firefox)",
//       date: new Date("2024-10-20"),
//     },
//     {
//       browser: "edge",
//       visitors: 320000,
//       fill: "var(--color-edge)",
//       date: new Date("2024-10-25"),
//     },
//   ],
//   year: [
//     {
//       browser: "chrome",
//       visitors: 1200000,
//       fill: "var(--color-chrome)",
//       date: new Date("2024-02-01"),
//     },
//     {
//       browser: "safari",
//       visitors: 2000000,
//       fill: "var(--color-safari)",
//       date: new Date("2024-05-01"),
//     },
//     {
//       browser: "firefox",
//       visitors: 2400000,
//       fill: "var(--color-firefox)",
//       date: new Date("2024-08-01"),
//     },
//     {
//       browser: "edge",
//       visitors: 3000000,
//       fill: "var(--color-edge)",
//       date: new Date("2024-11-01"),
//     },
//   ],
//   custom: { browser: string, visitors: number, fill: string, date: Date },
// };

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "General Visit ₹",
//     color: "hsl(var(--chart-1))",
//   },
//   safari: {
//     label: "Bodyshop ₹",
//     color: "hsl(var(--chart-2))",
//   },
//   firefox: {
//     label: "Paid Service ₹",
//     color: "hsl(var(--chart-3))",
//   },
//   edge: {
//     label: "Running Repairs ₹",
//     color: "hsl(var(--chart-4))",
//   },
// } satisfies ChartConfig;

// export default function RevenueSplit() {
//   const [selectedPeriod, setSelectedPeriod] = useState<DataPeriod>("week");
//   const [startDate, setStartDate] = useState<Date | undefined>();
//   const [endDate, setEndDate] = useState<Date | undefined>();

//   // // Filter data based on date range
//   // const dataToDisplay = useMemo(() => {
//   //   if (selectedPeriod === "custom" && startDate && endDate) {
//   //     // Filter the data in each category for entries within the startDate and endDate
//   //     return Object.values(chartData)
//   //       .flat()
//   //       .filter((entry) => entry.date >= startDate && entry.date <= endDate);
//   //   }
//   //   return chartData[selectedPeriod];
//   // }, [selectedPeriod, startDate, endDate]);

//   // const totalVisitors = dataToDisplay.reduce(
//   //   (acc, curr) => acc + curr.visitors,
//   //   0
//   // );
//   const dataToDisplay = useMemo(() => {
//     if (selectedPeriod === "custom" && startDate && endDate) {
//       // Filter data within each category for the custom range and assign to chartData.custom
//       chartData.custom = ["chrome", "safari", "firefox", "edge"]
//         .map((browser) =>
//           chartData[browser]?.find(
//             (entry) => entry.date >= startDate && entry.date <= endDate
//           )
//         )
//         .filter(Boolean); // filter out undefined entries

//       return chartData.custom;
//     }
//     return chartData[selectedPeriod];
//   }, [selectedPeriod, startDate, endDate]);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Total Revenue</CardTitle>
//         <CardDescription>April 2024 - Present</CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <select
//           onChange={(e) => setSelectedPeriod(e.target.value as DataPeriod)}
//           value={selectedPeriod}
//         >
//           <option value="week">This Week</option>
//           <option value="month">This Month</option>
//           <option value="year">This Year</option>
//           <option value="custom">Custom</option>
//         </select>

//         {selectedPeriod === "custom" && (
//           <div className="flex gap-2 mt-2">
//             <DatePicker
//               selected={startDate}
//               onChange={(date) => setStartDate(date ?? undefined)}
//               selectsStart
//               startDate={startDate}
//               endDate={endDate}
//               placeholderText="Start Date"
//             />
//             <DatePicker
//               selected={endDate}
//               onChange={(date) => setEndDate(date ?? undefined)}
//               selectsEnd
//               startDate={startDate}
//               endDate={endDate}
//               minDate={startDate}
//               placeholderText="End Date"
//             />
//           </div>
//         )}

//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px]"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={dataToDisplay}
//               dataKey="visitors"
//               nameKey="browser"
//               innerRadius={60}
//               strokeWidth={5}
//             >
//               <Label
//                 content={({ viewBox }) => {
//                   if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                     return (
//                       <text
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         textAnchor="middle"
//                         dominantBaseline="middle"
//                       >
//                         <tspan
//                           x={viewBox.cx}
//                           y={viewBox.cy}
//                           className="fill-foreground text-xl font-bold"
//                         >
//                           &#8377;{totalVisitors.toLocaleString()}
//                         </tspan>
//                       </text>
//                     );
//                   }
//                   return null;
//                 }}
//               />
//             </Pie>
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//       <CardFooter className="flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2 font-medium leading-none">
//           Trending up by 9% this month <TrendingUp className="h-4 w-4" />
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }
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

type DataPeriod = "week" | "month" | "year" | "custom";
type ChartEntry = {
  browser: string;
  visitors: number;
  fill: string;
  date: Date;
};

type ChartData = {
  week: ChartEntry[];
  month: ChartEntry[];
  year: ChartEntry[];
  custom: ChartEntry[]; // Correct type here for custom data
};

// Updated chartData with `custom` as an array
const chartData: ChartData = {
  week: [
    {
      browser: "chrome",
      visitors: 20000,
      fill: "var(--color-chrome)",
      date: new Date("2024-11-01"),
    },
    {
      browser: "safari",
      visitors: 30000,
      fill: "var(--color-safari)",
      date: new Date("2024-11-02"),
    },
    {
      browser: "firefox",
      visitors: 24000,
      fill: "var(--color-firefox)",
      date: new Date("2024-11-03"),
    },
    {
      browser: "edge",
      visitors: 32000,
      fill: "var(--color-edge)",
      date: new Date("2024-11-04"),
    },
  ],
  month: [
    {
      browser: "chrome",
      visitors: 100000,
      fill: "var(--color-chrome)",
      date: new Date("2024-10-05"),
    },
    {
      browser: "safari",
      visitors: 150000,
      fill: "var(--color-safari)",
      date: new Date("2024-10-15"),
    },
    {
      browser: "firefox",
      visitors: 240000,
      fill: "var(--color-firefox)",
      date: new Date("2024-10-20"),
    },
    {
      browser: "edge",
      visitors: 320000,
      fill: "var(--color-edge)",
      date: new Date("2024-10-25"),
    },
  ],
  year: [
    {
      browser: "chrome",
      visitors: 1200000,
      fill: "var(--color-chrome)",
      date: new Date("2024-02-01"),
    },
    {
      browser: "safari",
      visitors: 2000000,
      fill: "var(--color-safari)",
      date: new Date("2024-05-01"),
    },
    {
      browser: "firefox",
      visitors: 2400000,
      fill: "var(--color-firefox)",
      date: new Date("2024-08-01"),
    },
    {
      browser: "edge",
      visitors: 3000000,
      fill: "var(--color-edge)",
      date: new Date("2024-11-01"),
    },
  ],
  custom: [
    // Initially empty array; will be populated by the filter logic below.
  ],
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "General Visit ₹",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Bodyshop ₹",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Paid Service ₹",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Running Repairs ₹",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export default function RevenueSplit() {
  const [selectedPeriod, setSelectedPeriod] = useState<DataPeriod>("week");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Filter data based on date range
  const dataToDisplay = useMemo(() => {
    if (selectedPeriod === "custom" && startDate && endDate) {
      // Filter and aggregate chartData by the custom date range
      const filteredData = chartData.week
        .concat(chartData.month, chartData.year)
        .filter((entry) => entry.date >= startDate && entry.date <= endDate);

      // Aggregate visitors count by browser
      const aggregatedData = filteredData.reduce<ChartEntry[]>((acc, curr) => {
        const existingEntry = acc.find((item) => item.browser === curr.browser);
        if (existingEntry) {
          existingEntry.visitors += curr.visitors;
        } else {
          acc.push({ ...curr });
        }
        return acc;
      }, []);

      return aggregatedData;
    }
    return chartData[selectedPeriod as DataPeriod];
  }, [selectedPeriod, startDate, endDate]);

  // Calculate total visitors for the displayed data
  const totalVisitors = useMemo(() => {
    return dataToDisplay.reduce(
      (acc: any, curr: any) => acc + curr.visitors,
      0
    );
  }, [dataToDisplay]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>April 2024 - Present</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <select
          onChange={(e) => setSelectedPeriod(e.target.value as DataPeriod)}
          value={selectedPeriod}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="custom">Custom</option>
        </select>

        {selectedPeriod === "custom" && (
          <div className="flex gap-2 mt-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date ?? undefined)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date ?? undefined)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
            />
          </div>
        )}

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
              data={dataToDisplay}
              dataKey="visitors"
              nameKey="browser"
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
                          &#8377;{totalVisitors.toLocaleString()}
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
