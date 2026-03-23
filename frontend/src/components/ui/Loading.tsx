interface LoadingProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
}

export default function Loading({
  size = "md",
  message = "読み込み中...",
  fullPage = false,
}: LoadingProps) {
  const spinnerSize = {
    sm: "spinner",
    md: "spinner",
    lg: "spinner spinner-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${
        fullPage ? "min-h-[60vh]" : "py-12"
      }`}
    >
      <div className={spinnerSize[size]} />
      {message && (
        <p className="text-caption text-gray-500">{message}</p>
      )}
    </div>
  );
}
