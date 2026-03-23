import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="block text-caption font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`
            w-full border border-gray-200 rounded-lg px-3 py-2.5
            text-body text-gray-900 placeholder:text-gray-400
            transition-base
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? "border-danger focus:ring-danger/30 focus:border-danger" : ""}
            ${className}
          `.trim()}
          {...props}
        />
        {error && (
          <p className="mt-1 text-caption text-danger">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
