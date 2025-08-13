import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Button } from "../UI";

const FilterActions = () => {
  const { clearAllFilters, getActiveFilterCount } = useAppStore();
  const activeFilters = getActiveFilterCount();

  if (activeFilters === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-blue-900">
          {activeFilters} Active Filter{activeFilters > 1 ? "s" : ""}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
      >
        <XMarkIcon className="w-4 h-4 mr-1" />
        Clear All
      </Button>
    </div>
  );
};

export default FilterActions;
