import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Checkbox, Badge } from "../UI";

const EffortFilter = ({ effortLevels }) => {
  const { filters, updateFilters } = useAppStore();

  const handleEffortToggle = (effortLevel) => {
    const currentEfforts = filters.effortLevels || [];
    const newEfforts = currentEfforts.includes(effortLevel)
      ? currentEfforts.filter((level) => level !== effortLevel)
      : [...currentEfforts, effortLevel];

    updateFilters({ effortLevels: newEfforts });
  };

  if (!effortLevels || effortLevels.length === 0) {
    return null;
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case "High Effort":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium Effort":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low Effort":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <ClockIcon className="w-4 h-4 mr-2" />
            Effort Level
          </h3>
        </div>

        <div className="space-y-2">
          {effortLevels.map((effort) => {
            const isSelected = filters.effortLevels?.includes(effort.value);
            const colorClasses = getEffortColor(effort.value);

            return (
              <label
                key={effort.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${colorClasses} ${
                  isSelected
                    ? "ring-2 ring-primary-blue ring-opacity-50"
                    : "hover:bg-opacity-80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleEffortToggle(effort.value)}
                  className="w-4 h-4 text-primary-blue bg-white border-gray-300 rounded focus:ring-primary-blue focus:ring-2"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{effort.value}</span>
                    <Badge variant="default" size="sm">
                      {effort.count}
                    </Badge>
                  </div>
                  {effort.description && (
                    <p className="text-xs opacity-75 mt-1">
                      {effort.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EffortFilter;
