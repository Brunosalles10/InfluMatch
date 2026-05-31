import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function combinarClasses(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
