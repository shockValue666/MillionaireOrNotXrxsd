import * as React from "react";

import { cn } from "@/lib/utils";

export interface CustomInputForAmountProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  min: number;
  max: number;
  step: number;
}

const CustomInputForAmount = React.forwardRef<HTMLSelectElement, CustomInputForAmountProps>(
  ({ className, min, max, step, onChange, value, ...props }, ref) => {
    const numbers = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + (i * step));

    return (
      <select
        value={value}
        onChange={onChange} // Ensure onChange is properly connected
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}>
        {numbers.map((number, index) => (
          <option key={index} value={number}>
            {number}
          </option>
        ))}
      </select>
    );
  }
);

CustomInputForAmount.displayName = "CustomInputForAmount";

export { CustomInputForAmount };