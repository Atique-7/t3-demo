"use client";

import { functions } from "@/lib/appwrite";
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
//   { browser: "carsEntered", visitors: 10, fill: "var(--color-carsEntered)" },
//   { browser: "jobCreated", visitors: 9, fill: "var(--color-jobCreated)" },
//   { browser: "partsAdded", visitors: 5, fill: "var(--color-partsAdded)" },
//   { browser: "labourAdded", visitors: 10, fill: "var(--color-labourAdded)" },
//   {
//     browser: "quoteGenerated",
//     visitors: 5,
//     fill: "var(--color-quoteGenerated)",
//   },
//   {
//     browser: "proFormaGenerated",
//     visitors: 19,
//     fill: "var(--color-proFormaGenerated)",
//   },
//   { browser: "taxGenerated", visitors: 15, fill: "var(--color-taxGenerated)" },
//   {
//     browser: "gatePassGenerated",
//     visitors: 7,
//     fill: "var(--color-gatePassGenerated)",
//   },
// ];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   carsEntered: {
//     label: "Cars Entered",
//     color: "hsl(var(--chart-1))",
//   },
//   jobCreated: {
//     label: "Job Card Created",
//     color: "hsl(var(--chart-2))",
//   },
//   partsAdded: {
//     label: "Parts Added",
//     color: "hsl(var(--chart-3))",
//   },
//   labourAdded: {
//     label: "Labour Added",
//     color: "hsl(var(--chart-4))",
//   },
//   quoteGenerated: {
//     label: "Quote Generated",
//     color: "hsl(var(--chart-5))",
//   },
//   proFormaGenerated: {
//     label: "Pro Forma Generated",
//     color: "hsl(var(--chart-1))",
//   },
//   taxGenerated: {
//     label: "Tax Invoice Generated",
//     color: "hsl(var(--chart-2))",
//   },
//   gatePassGenerated: {
//     label: "Gate Pass Generated",
//     color: "hsl(var(--chart-3))",
//   },
// } satisfies ChartConfig;

// export function CurrentCarsPie() {
//   const totalVisitors = React.useMemo(() => {
//     return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
//   }, []);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Cars Currently being worked on</CardTitle>
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
//               stroke="0"
//             />
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }

export const chartConfig = {
  jobCreated: {
    label: "Job Created",
    color: "hsl(var(--chart-1))",
  },
  partsAdded: {
    label: "Parts Added",
    color: "hsl(var(--chart-2))",
  },
  labourAdded: {
    label: "Labour Added",
    color: "hsl(var(--chart-3))",
  },
  quoteGenerated: {
    label: "Quote Generated",
    color: "hsl(var(--chart-4))",
  },
  proFormaGenerated: {
    label: "Pro Forma Generated",
    color: "hsl(var(--chart-5))",
  },
  gatePassGenerated: {
    label: "Gate Pass Generated",
    color: "hsl(var(--chart-6))",
  },
  taxGenerated: {
    label: "Tax Generated",
    color: "hsl(var(--chart-7))",
  },
};

// Backend title-to-config mapping
export const titleToConfigKey = {
  "Job Created": "jobCreated",
  "Parts Added": "partsAdded",
  "Labour Added": "labourAdded",
  "Quote Generated": "quoteGenerated",
  "Pro Forma Generated": "proFormaGenerated",
  "Gate Pass Generated": "gatePassGenerated",
  "Tax Generated": "taxGenerated",
} as const;

type TitleToConfigKey = typeof titleToConfigKey;

import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export function CurrentCarsPie() {
  const [data, setData] = useState<
    { name: string; value: number; fill: string }[]
  >([]);
  const [rangeType, setRangeType] = useState<string>("week");
  const [allData, setAllData] = useState<Record<
    string,
    { name: string; value: number; fill: string }[]
  > | null>(null);

  const [customRange, setCustomRange] = useState<{
    startDate?: Date;
    endDate?: Date;
  }>({});

  const isCustomRangeValid =
    rangeType !== "custom" || (customRange.startDate && customRange.endDate);

  // const fetchAggregatedData = useCallback(async () => {
  //   if (!isCustomRangeValid) return;
  //   const payload =
  //     rangeType === "custom" && customRange.startDate && customRange.endDate
  //       ? {
  //           startDate: customRange.startDate.toISOString(),
  //           endDate: customRange.endDate.toISOString(),
  //         }
  //       : {};

  //   try {
  //     const response = await functions.createExecution(
  //       "673a6f1d0002f1550b08", // Replace with your function ID
  //       JSON.stringify(payload)
  //     );

  //     const result = JSON.parse(response.responseBody);
  //     if (result.data) {
  //       console.log(result);

  //       // Map the result for each range type and store in allData
  //       const aggregatedData: Record<
  //         string,
  //         { name: string; value: number; fill: string }[]
  //       > = {};
  //       for (const [key, items] of Object.entries(result.data)) {
  //         aggregatedData[key] = (
  //           items as { title: string; count: number }[]
  //         ).map((item: { title: string; count: number }) => {
  //           const configKey =
  //             titleToConfigKey[item.title as keyof TitleToConfigKey];
  //           if (!configKey) {
  //             console.error(`No config found for title: ${item.title}`);
  //             return {
  //               name: item.title,
  //               value: item.count,
  //               fill: "#cccccc",
  //             };
  //           }

  //           return {
  //             name: chartConfig[configKey].label,
  //             value: item.count,
  //             fill: chartConfig[configKey].color,
  //           };
  //         });
  //       }

  //       setAllData(aggregatedData);
  //       setData(aggregatedData[rangeType] || []);
  //     } else {
  //       console.error(result.error);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching aggregated data:", error);
  //   }
  // }, [rangeType, customRange, isCustomRangeValid]);

  // // Fetch data initially
  // useEffect(() => {
  //   if (!allData) {
  //     fetchAggregatedData();
  //   }
  // }, [fetchAggregatedData, allData]);

  // // Update chart data when rangeType changes
  // useEffect(() => {
  //   if (allData) {
  //     setData(allData[rangeType] || []);
  //   }
  // }, [rangeType, allData]);

  // Fetch data from API
  const fetchAggregatedData = useCallback(
    async (fetchCustom = false) => {
      const payload =
        fetchCustom && customRange.startDate && customRange.endDate
          ? {
              startDate: customRange.startDate.toISOString(),
              endDate: customRange.endDate.toISOString(),
            }
          : {};

      try {
        const response = await functions.createExecution(
          "673a6f1d0002f1550b08", // Replace with your function ID
          JSON.stringify(payload)
        );

        const result = JSON.parse(response.responseBody);

        console.log("API Response Data:", result.data);

        if (result.data) {
          if (fetchCustom) {
            // Process custom range data only
            if (Array.isArray(result.data.custom)) {
              const chartData = result.data.custom.map(
                (item: { title: string; count: number }) => {
                  const configKey =
                    titleToConfigKey[item.title as keyof TitleToConfigKey];
                  if (!configKey) {
                    console.error(`No config found for title: ${item.title}`);
                    return {
                      name: item.title,
                      value: item.count,
                      fill: "#cccccc",
                    };
                  }

                  return {
                    name: chartConfig[configKey].label,
                    value: item.count,
                    fill: chartConfig[configKey].color,
                  };
                }
              );
              setData(chartData);
            } else {
              console.error(
                "Custom range data is not in the expected format:",
                result.data.custom
              );
            }
          } else {
            // Process predefined ranges and cache them
            if (typeof result.data === "object" && result.data !== null) {
              const aggregatedData: Record<
                string,
                { name: string; value: number; fill: string }[]
              > = {};

              for (const [key, items] of Object.entries(result.data)) {
                if (Array.isArray(items)) {
                  aggregatedData[key] = items.map(
                    (item: { title: string; count: number }) => {
                      const configKey =
                        titleToConfigKey[item.title as keyof TitleToConfigKey];
                      if (!configKey) {
                        console.error(
                          `No config found for title: ${item.title}`
                        );
                        return {
                          name: item.title,
                          value: item.count,
                          fill: "#cccccc",
                        };
                      }

                      return {
                        name: chartConfig[configKey].label,
                        value: item.count,
                        fill: chartConfig[configKey].color,
                      };
                    }
                  );
                } else {
                  console.error(
                    `Unexpected data format for key ${key}:`,
                    items
                  );
                }
              }

              setAllData(aggregatedData);
              setData(aggregatedData[rangeType] || []);
            } else {
              console.error(
                "Predefined range data is not in the expected format:",
                result.data
              );
            }
          }
        } else {
          console.error("No data found in API response:", result);
        }
      } catch (error) {
        console.error("Error fetching aggregated data:", error);
      }
    },
    [rangeType, customRange.startDate, customRange.endDate]
  );

  // Fetch data on initial render
  useEffect(() => {
    if (!allData) {
      fetchAggregatedData();
    }
  }, [allData, fetchAggregatedData]);

  // Update data when rangeType changes
  useEffect(() => {
    if (rangeType === "custom") {
      if (customRange.startDate && customRange.endDate) {
        fetchAggregatedData(true); // Fetch fresh data for custom range
      }
    } else if (allData) {
      setData(allData[rangeType] || []); // Use cached data for predefined ranges
    } else {
      fetchAggregatedData(false); // Fetch predefined ranges if not cached
    }
  }, [
    rangeType,
    customRange.startDate,
    customRange.endDate,
    allData,
    fetchAggregatedData,
  ]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cars Currently being worked on</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="flex flex-col items-center gap-4">
          {/* Dropdown for selecting the range */}
          <select
            value={rangeType}
            onChange={(e) => setRangeType(e.target.value)}
            className="border p-2 rounded-md shadow-sm"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Date Range</option>
          </select>

          {/* Custom Date Range Inputs */}
          {rangeType === "custom" && (
            <div className="flex items-center gap-4" style={{ height: "50px" }}>
              <DatePicker
                selected={customRange.startDate}
                onChange={(date) =>
                  setCustomRange((prev) => ({
                    ...prev,
                    startDate: date || undefined,
                  }))
                }
                selectsStart
                startDate={customRange.startDate}
                endDate={customRange.endDate}
                className="border p-2 rounded-md shadow-sm"
                placeholderText="Start Date"
              />
              <DatePicker
                selected={customRange.endDate}
                onChange={(date) =>
                  setCustomRange((prev) => ({
                    ...prev,
                    endDate: date || undefined,
                  }))
                }
                selectsEnd
                startDate={customRange.startDate}
                endDate={customRange.endDate}
                className="border p-2 rounded-md shadow-sm"
                placeholderText="End Date"
              />
            </div>
          )}
        </div>

        {/* Chart */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] mt-6"
        >
          <PieChart>
            <ChartTooltip cursor={false} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              stroke="0"
              fill="#8884d8"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// export function CurrentCarsPie() {
//   const [data, setData] = useState<
//     { name: string; value: number; fill: string }[]
//   >([]); // Chart data
//   const [rangeType, setRangeType] = useState<string>("week"); // Default range
//   const [allData, setAllData] = useState<
//     Record<string, { name: string; value: number; fill: string }[]>
//   >({});

//   const [customRange, setCustomRange] = useState<{
//     startDate?: Date;
//     endDate?: Date;
//   }>({}); // Custom date range

//   const isCustomRangeValid =
//     rangeType !== "custom" || (customRange.startDate && customRange.endDate);

//   const fetchAggregatedData = useCallback(async () => {
//     if (!isCustomRangeValid) return;
//     const payload =
//       rangeType === "custom" && customRange.startDate && customRange.endDate
//         ? {
//             startDate: customRange.startDate.toISOString(),
//             endDate: customRange.endDate.toISOString(),
//           }
//         : {};

//     try {
//       const response = await functions.createExecution(
//         "673a6f1d0002f1550b08", // Replace with your function ID
//         JSON.stringify(payload)
//       );

//       const result = JSON.parse(response.responseBody);
//       if (result.data) {
//         console.log(result);
//         const chartData = result.data[rangeType]?.map(
//           (item: { title: string; count: number }) => {
//             // Map backend title to chartConfig key
//             const configKey =
//               titleToConfigKey[item.title as keyof TitleToConfigKey];

//             if (!configKey) {
//               console.error(`No config found for title: ${item.title}`);
//               return {
//                 name: item.title, // Fallback to raw title
//                 value: item.count,
//                 fill: "#cccccc", // Fallback color
//               };
//             }

//             return {
//               name: chartConfig[configKey].label,
//               value: item.count,
//               fill: chartConfig[configKey].color,
//             };
//           }
//         );
//         setData(chartData);
//       } else {
//         console.error(result.error);
//       }
//     } catch (error) {
//       console.error("Error fetching aggregated data:", error);
//     }
//   }, [rangeType, customRange, isCustomRangeValid]);

//   // Debounce-like effect for customRange changes
//   useEffect(() => {
//     fetchAggregatedData();
//   }, [fetchAggregatedData]);

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Cars Currently being worked on</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <div className="flex flex-col items-center gap-4">
//           {/* Dropdown for selecting the range */}
//           <select
//             value={rangeType}
//             onChange={(e) => setRangeType(e.target.value)}
//             className="border p-2 rounded-md shadow-sm"
//           >
//             <option value="week">This Week</option>
//             <option value="month">This Month</option>
//             <option value="year">This Year</option>
//             <option value="custom">Custom Date Range</option>
//           </select>

//           {/* Custom Date Range Inputs */}
//           {rangeType === "custom" && (
//             <div className="flex items-center gap-4" style={{ height: "50px" }}>
//               <DatePicker
//                 selected={customRange.startDate}
//                 onChange={(date) =>
//                   setCustomRange((prev) => ({
//                     ...prev,
//                     startDate: date || undefined,
//                   }))
//                 }
//                 selectsStart
//                 startDate={customRange.startDate}
//                 endDate={customRange.endDate}
//                 className="border p-2 rounded-md shadow-sm"
//                 placeholderText="Start Date"
//               />
//               <DatePicker
//                 selected={customRange.endDate}
//                 onChange={(date) =>
//                   setCustomRange((prev) => ({
//                     ...prev,
//                     endDate: date || undefined,
//                   }))
//                 }
//                 selectsEnd
//                 startDate={customRange.startDate}
//                 endDate={customRange.endDate}
//                 className="border p-2 rounded-md shadow-sm"
//                 placeholderText="End Date"
//               />
//             </div>
//           )}
//         </div>

//         {/* Chart */}
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square max-h-[250px] mt-6"
//         >
//           <PieChart>
//             <ChartTooltip
//               cursor={false}
//               //content={<ChartTooltipContent hideLabel />}
//             />
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               stroke="0"
//               fill="#8884d8"
//             />
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }
