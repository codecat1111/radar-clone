import React from "react";
import clsx from "clsx";

const LoadingSpinner = ({ size = "md", className }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <div className={clsx("loading-spinner", sizes[size])} />
    </div>
  );
};

export default LoadingSpinner;
