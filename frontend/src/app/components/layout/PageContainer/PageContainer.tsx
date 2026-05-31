import { combinarClasses } from "@/app/utils/cn";
import { type HTMLAttributes } from "react";

export function PageContainer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <main
      className={combinarClasses(
        "mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8",
        className,
      )}
      {...props}
    />
  );
}
