import { combinarClasses } from "@/app/utils/cn";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  erro?: string;
  iconeEsquerda?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, erro, iconeEsquerda, className, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {iconeEsquerda && (
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {iconeEsquerda}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            className={combinarClasses(
              "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
              iconeEsquerda && "pl-11",
              erro && "border-danger focus:border-danger focus:ring-danger/20",
              className,
            )}
            {...props}
          />
        </div>

        {erro && <p className="text-sm text-danger">{erro}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
