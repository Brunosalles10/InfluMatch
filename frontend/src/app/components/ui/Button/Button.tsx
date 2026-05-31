import { combinarClasses } from "@/app/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

const variantesBotao = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variante: {
        primary:
          "bg-primary text-white shadow-[0_0_30px_rgba(14,165,233,0.25)] hover:bg-primary-hover",
        secondary: "bg-secondary text-white hover:bg-secondary-hover",
        outline:
          "border border-border-strong bg-transparent text-text-primary hover:bg-surface",
        ghost:
          "bg-transparent text-text-secondary hover:bg-surface hover:text-text-primary",
        danger: "bg-danger text-white hover:brightness-110",
      },
      tamanho: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
      larguraTotal: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variante: "primary",
      tamanho: "md",
      larguraTotal: false,
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof variantesBotao> & {
    carregando?: boolean;
    iconeEsquerda?: ReactNode;
    iconeDireita?: ReactNode;
  };

export function Button({
  children,
  className,
  variante,
  tamanho,
  larguraTotal,
  carregando = false,
  iconeEsquerda,
  iconeDireita,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={combinarClasses(
        variantesBotao({ variante, tamanho, larguraTotal }),
        className,
      )}
      disabled={disabled || carregando}
      {...props}
    >
      {carregando && <LoaderCircle className="h-4 w-4 animate-spin" />}
      {!carregando && iconeEsquerda}
      {children}
      {!carregando && iconeDireita}
    </button>
  );
}
