import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Checkbox, Badge } from "../UI";

const DomainFilter = ({ domains }) => {
  const { filters, updateFilters } = useAppStore();

  const handleDomainToggle = (domainId) => {
    const currentDomains = filters.domains || [];
    const newDomains = currentDomains.includes(domainId)
      ? currentDomains.filter((id) => id !== domainId)
      : [...currentDomains, domainId];

    updateFilters({ domains: newDomains });
  };

  if (!domains || domains.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <FunnelIcon className="w-4 h-4 mr-2" />
            Domain
          </h3>
          <Badge variant="default" size="sm">
            {domains.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {domains.map((domain) => {
            const isSelected = filters.domains?.includes(domain.id);

            return (
              <div
                key={domain.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-primary-blue ring-2 ring-primary-blue ring-opacity-20"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => handleDomainToggle(domain.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`domain-${domain.id}`}
                      checked={isSelected}
                      onChange={() => handleDomainToggle(domain.id)}
                      className="w-4 h-4"
                    />
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: domain.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {domain.name}
                    </span>
                  </div>
                  <Badge variant="default" size="sm">
                    {domain.count}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DomainFilter;
