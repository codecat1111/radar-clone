import React from "react";
import clsx from "clsx";

const Checkbox = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  description,
  className,
}) => {
  return (
    <div className={clsx("flex items-start", className)}>
      <div className="flex items-center h-5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="w-4 h-4 text-primary-blue bg-white border-gray-300 rounded focus:ring-primary-blue focus:ring-2 disabled:opacity-50"
        />
      </div>
      <div className="ml-3">
        <label
          htmlFor={id}
          className={clsx(
            "text-sm font-medium",
            disabled
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-900 cursor-pointer"
          )}
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
