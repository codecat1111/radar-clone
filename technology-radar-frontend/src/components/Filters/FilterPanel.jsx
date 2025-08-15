import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { useFilters } from "../../hooks/useFilters";
import SearchFilter from "./SearchFilter";
import TagFilter from "./TagFilter";
import DomainFilter from "./DomainFilter";
import TechnologyFilter from "./TechnologyFilter";
import ImpactFilter from "./ImpactFilter";
import EffortFilter from "./EffortFilter";
import FilterActions from "./FilterActions";
import ViewModeToggle from "./ViewModeToggle";
import { LoadingSpinner } from "../UI";

const FilterPanel = () => {
  const {
    isFilterPanelExpanded,
    toggleFilterPanel,
    filteredTechnologies,
    filters,
    getTechnologiesByDomain,
    technologies,
  } = useAppStore();

  const { filterOptions, loading } = useFilters();

  // Get technologies for selected domain
  const selectedDomainTechnologies = React.useMemo(() => {
    if (!filters.selectedDomain) return [];
    return getTechnologiesByDomain(filters.selectedDomain);
  }, [filters.selectedDomain, getTechnologiesByDomain]);
  console.log("=== FilterPanel Debug ===");
  console.log("viewMode:", filters.viewMode);
  console.log("selectedDomain:", filters.selectedDomain);
  console.log("selectedDomainTechnologies:", selectedDomainTechnologies);
  console.log(
    "selectedDomainTechnologies.length:",
    selectedDomainTechnologies.length
  );
  console.log(
    "Condition result:",
    filters.selectedDomain && selectedDomainTechnologies.length > 0
  );
  console.log("========================");

  if (!isFilterPanelExpanded) {
    return (
      <div className="h-full w-16 flex flex-col items-center justify-start pt-4">
        <button
          onClick={toggleFilterPanel}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          title="Expand Filters"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div>
        <div className="bg-blue-50 px-4 py-3 space-y-4 w-full">
          {/* Filters Header Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center space-x-2">
              <div className="bg-primary-blue px-3 py-1 rounded-full">
                <span className="text-secondary-blue text-sm font-medium">
                  {filteredTechnologies?.length || 0} Technologies
                </span>
              </div>
              <button
                onClick={toggleFilterPanel}
                className="lg:hidden p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Bar - Only show in radar mode */}
          {filters.viewMode === "radar" && <SearchFilter />}
        </div>
      </div>

      {/* Scrollable Filter Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-blue-50">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-6">
            <ViewModeToggle />
            {filters.viewMode === "radar" && (
              <div
                key={filters.viewMode}
                className="space-y-6 opacity-0 animate-fade-in"
              >
                <FilterActions />
                <TagFilter tags={filterOptions?.tags || []} />
                <DomainFilter domains={filterOptions?.domains || []} />
                <ImpactFilter
                  impactLevels={filterOptions?.impact_levels || []}
                />
                <EffortFilter
                  effortLevels={filterOptions?.effort_levels || []}
                />
              </div>
            )}

            {/* Radial mode filters */}
            {filters.viewMode === "radial" && (
              <div className="space-y-6">
                <DomainFilter
                  domains={filterOptions?.domains || []}
                  radialMode={true}
                />

                {/* Technology filter - only show when domain is selected */}
                {filters.selectedDomain &&
                  selectedDomainTechnologies.length > 0 && (
                    <div
                      className="opacity-0 animate-slide-down"
                      style={{
                        animationDelay: "300ms",
                        animationFillMode: "forwards",
                      }}
                    >
                      <TechnologyFilter
                        technologies={selectedDomainTechnologies}
                      />
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;
