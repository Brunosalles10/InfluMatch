import { combinarClasses } from "@/app/utils/cn";
import {
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-border">
      <table
        className={combinarClasses(
          "w-full border-collapse text-left text-sm",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={combinarClasses("bg-surface-muted", className)}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={combinarClasses("divide-y divide-border", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={combinarClasses(
        "transition-colors hover:bg-surface-muted/50",
        className,
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={combinarClasses(
        "px-6 py-4 text-sm font-semibold text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={combinarClasses("px-6 py-4 text-text-primary", className)}
      {...props}
    />
  );
}
