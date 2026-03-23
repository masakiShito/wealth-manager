import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        bg-background-card rounded-xl shadow-card
        ${paddingStyles[padding]}
        ${hover ? "transition-base hover:shadow-card-hover" : ""}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
