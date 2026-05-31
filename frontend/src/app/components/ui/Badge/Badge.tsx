import { combinarClasses } from "@/app/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

const variantesBadge = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variante: {
        neutral: "bg-surface-muted text-text-secondary",
        primary: "bg-primary/15 text-primary",
        secondary: "bg-secondary/15 text-secondary-hover",
        success: "bg-success/15 text-success",
        warning: "bg-warning/15 text-warning",
        danger: "bg-danger/15 text-danger",
      },
    },
    defaultVariants: {
      variante: "neutral",
    },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof variantesBadge>;

export function Badge({ className, variante, ...props }: BadgeProps) {
  return (
    <span
      className={combinarClasses(variantesBadge({ variante }), className)}
      {...props}
    />
  );
}
