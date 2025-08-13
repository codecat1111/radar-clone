import React from "react";
import clsx from "clsx";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  color,
  className,
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";

  const variants = {
    default: "bg-gray-100 text-gray-800",
    leading: "bg-green-100 text-green-800",
    nascent: "bg-pink-100 text-pink-800",
    watchlist: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const style = color
    ? {
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
      }
    : {};

  return (
    <span
      className={clsx(
        baseClasses,
        !color && variants[variant],
        sizes[size],
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
