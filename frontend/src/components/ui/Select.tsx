import { type SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, className = "", children, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={`
            w-full border border-gray-200 rounded-lg px-3 py-2.5
            text-body text-gray-900
            transition-base
            focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
            disabled:bg-gray-50 disabled:text-gray-500
            ${className}
          `.trim()}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
