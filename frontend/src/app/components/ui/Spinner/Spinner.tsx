import { combinarClasses } from "@/app/utils/cn";
import { LoaderCircle } from "lucide-react";

type SpinnerProps = {
  className?: string;
  texto?: string;
};

export function Spinner({ className, texto }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center gap-3 text-text-secondary">
      <LoaderCircle
        className={combinarClasses("h-5 w-5 animate-spin", className)}
      />
      {texto && <span className="text-sm">{texto}</span>}
    </div>
  );
}
