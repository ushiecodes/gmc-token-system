import React from "react";

const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizeClasses = { sm: "w-6 h-6", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div
      className={`${sizeClasses[size]} border-4 border-t-gmc border-gray-200 rounded-full animate-spin`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;