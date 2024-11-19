"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex flex-col space-y-2", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <div className="flex items-center space-x-2">
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "h-4 w-4 shrink-0 rounded-full border border-gray-200 border-gray-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gray-900 data-[state=checked]:text-gray-50 dark:border-gray-800 dark:border-gray-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 dark:data-[state=checked]:bg-gray-50 dark:data-[state=checked]:text-gray-900",
        className
      )}
      {...props}
    />
    {children && (
      <label
        htmlFor={props.id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
      >
        {children}
      </label>
    )}
  </div>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
