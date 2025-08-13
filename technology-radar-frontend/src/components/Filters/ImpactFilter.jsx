import React from "react";
import { BoltIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Checkbox, Badge } from "../UI";

const ImpactFilter = ({ impactLevels }) => {
  const { filters, updateFilters } = useAppStore();

  const handleImpactToggle = (impactLevel) => {
    const currentImpacts = filters.impactLevels || [];
    const newImpacts = currentImpacts.includes(impactLevel)
      ? currentImpacts.filter((level) => level !== impactLevel)
      : [...currentImpacts, impactLevel];

    updateFilters({ impactLevels: newImpacts });
  };

  if (!impactLevels || impactLevels.length === 0) {
    return null;
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High Impact":
        return "text-red-600 bg-red-50 border-red-200";
      case "Medium Impact":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low Impact":
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
            <BoltIcon className="w-4 h-4 mr-2" />
            Impact Level
          </h3>
        </div>

        <div className="space-y-2">
          {impactLevels.map((impact) => {
            const isSelected = filters.impactLevels?.includes(impact.value);
            const colorClasses = getImpactColor(impact.value);

            return (
              <label
                key={impact.value}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${colorClasses} ${
                  isSelected
                    ? "ring-2 ring-primary-blue ring-opacity-50"
                    : "hover:bg-opacity-80"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleImpactToggle(impact.value)}
                  className="w-4 h-4 text-primary-blue bg-white border-gray-300 rounded focus:ring-primary-blue focus:ring-2"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{impact.value}</span>
                    <Badge variant="default" size="sm">
                      {impact.count}
                    </Badge>
                  </div>
                  {impact.description && (
                    <p className="text-xs opacity-75 mt-1">
                      {impact.description}
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

export default ImpactFilter;
