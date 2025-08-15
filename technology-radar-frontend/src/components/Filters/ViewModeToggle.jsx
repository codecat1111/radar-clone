import React from "react";
import useAppStore from "../../store/useAppStore";
import { ChartBarIcon, RadioIcon } from "@heroicons/react/24/outline";

const ViewModeToggle = () => {
  const { filters, updateFilters, resetForViewModeChange } = useAppStore();

  const handleViewModeChange = (mode) => {
    if (mode !== filters.viewMode) {
      //Reset all filters  when switching view modes
      resetForViewModeChange();

      //Set the new view mode
      updateFilters({ viewMode: mode });
    }
  };

  return (
    <div className="mb-6">
      {/* Header with blue dot indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <h3 className="text-sm font-medium text-gray-900">View Mode</h3>
      </div>

      {/* Toggle buttons */}
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          onClick={() => handleViewModeChange("radar")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${
            filters.viewMode === "radar"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ChartBarIcon className="w-4 h-4" />
          Radar
        </button>

        <button
          onClick={() => handleViewModeChange("radial")}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 ${
            filters.viewMode === "radial"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <RadioIcon className="w-4 h-4" />
          Radial
        </button>
      </div>
    </div>
  );
};

export default ViewModeToggle;
