import React, { useState, useEffect } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Checkbox, Badge } from "../UI";
import { technologyService } from "../../services/technologyService";

const DomainFilter = ({ domains, radialMode = false }) => {
  const {
    filters,
    updateFilters,
    setSelectedDomain,
    setSelectedTechnologyId,
    setSelectedTechnology,
    getTechnologiesByDomain,
  } = useAppStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Also add the useEffect here:
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleDomainToggle = (domainId) => {
    const currentDomains = filters.domains || [];
    const newDomains = currentDomains.includes(domainId)
      ? currentDomains.filter((id) => id !== domainId)
      : [...currentDomains, domainId];

    updateFilters({ domains: newDomains });
  };
  const handleRadialDomainChange = async (domainName) => {
    setSelectedDomain(domainName);

    // Also select first technology of that domain
    const technologies = getTechnologiesByDomain(domainName);
    if (technologies.length > 0) {
      setSelectedTechnologyId(technologies[0].id);

      // Update the detail panel with the new technology's information
      try {
        const response = await technologyService.getTechnologyById(
          technologies[0].id,
          true
        );
        if (response.success) {
          setSelectedTechnology(response.data.technology);
        } else {
          setSelectedTechnology(technologies[0]);
        }
      } catch (error) {
        console.error("Error fetching technology details:", error);
        setSelectedTechnology(technologies[0]);
      }
    }
  };

  if (!domains || domains.length === 0) {
    return null;
  }

  if (radialMode) {
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

          {/* Custom dropdown */}
          <div className="relative">
            {/* Dropdown trigger */}
            <div
              className="w-full p-4 bg-white border-2 border-blue-400 rounded-xl cursor-pointer text-gray-600 font-normal flex items-center justify-between transition-all duration-200 hover:border-blue-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span
                className={
                  filters.selectedDomain ? "text-gray-700" : "text-gray-400"
                }
              >
                {filters.selectedDomain || "Select a domain..."}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-400 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                {domains.map((domain) => (
                  <div
                    key={domain.id}
                    className="p-3 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      handleRadialDomainChange(domain.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {domain.name} ({domain.count})
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
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
