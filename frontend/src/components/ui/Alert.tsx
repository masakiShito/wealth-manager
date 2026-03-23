import { type ReactNode } from "react";

type AlertVariant = "error" | "warning" | "info" | "success";

interface AlertProps {
  variant: AlertVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, string> = {
  error: "bg-danger-light text-danger-dark border-danger/20",
  warning: "bg-warning-light text-warning border-warning/20",
  info: "bg-info-light text-info border-info/20",
  success: "bg-success-light text-success border-success/20",
};

export default function Alert({ variant, children, className = "" }: AlertProps) {
  return (
    <div
      className={`
        rounded-lg border px-4 py-3 text-caption font-medium
        ${variantStyles[variant]}
        ${className}
      `.trim()}
      role="alert"
    >
      {children}
    </div>
  );
}
