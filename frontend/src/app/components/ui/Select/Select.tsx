import { combinarClasses } from "@/app/utils/cn";
import { forwardRef, type SelectHTMLAttributes } from "react";

type OpcaoSelect = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  erro?: string;
  opcoes: OpcaoSelect[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, erro, opcoes, placeholder, className, id, ...props }, ref) => {
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

        <select
          ref={ref}
          id={id}
          className={combinarClasses(
            "h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20",
            erro && "border-danger focus:border-danger focus:ring-danger/20",
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}

          {opcoes.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>

        {erro && <p className="text-sm text-danger">{erro}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
