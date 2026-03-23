import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-light active:bg-primary-dark shadow-card hover:shadow-card-hover",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark shadow-card hover:shadow-card-hover",
  danger:
    "bg-danger text-white hover:bg-danger-dark active:bg-danger-dark shadow-card hover:shadow-card-hover",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-200/50 active:bg-gray-200/70",
  outline:
    "border border-primary text-primary hover:bg-primary hover:text-white active:bg-primary-dark",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-caption",
  md: "px-5 py-2.5 text-body",
  lg: "px-6 py-3 text-body font-medium",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium
        rounded-lg transition-base
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
