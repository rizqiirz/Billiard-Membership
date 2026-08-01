import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
        secondary:
          "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
        destructive:
          "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
        outline:
          "border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300",
        warning:
          "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        success:
          "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
