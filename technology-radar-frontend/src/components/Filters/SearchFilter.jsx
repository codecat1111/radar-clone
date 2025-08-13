import React, { useState, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";

const SearchFilter = () => {
  const {
    filters,
    updateFilters,
    technologies,
    filteredTechnologies: storeTechnologies,
  } = useAppStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownSearchValue, setDropdownSearchValue] = useState("");
  const dropdownRef = useRef(null);

  // Get currently selected technologies for display
  const selectedTechnologies = filters.selectedTechnologies || [];

  // Get filtered technologies for dropdown
  const getFilteredTechnologies = () => {
    // Always use ALL technologies for dropdown, not the filtered ones from backend
    const allTechnologies = technologies;
    if (!allTechnologies || allTechnologies.length === 0) return [];

    const searchTerm = dropdownSearchValue.toLowerCase();
    if (!searchTerm) return allTechnologies.slice(0, 10);

    return allTechnologies
      .filter((tech) => tech.name.toLowerCase().includes(searchTerm))
      .slice(0, 10);
  };

  const handleTechnologySelect = (technology) => {
    const currentSelected = filters.selectedTechnologies || [];
    const isAlreadySelected = currentSelected.includes(technology.id);

    let newSelected;
    if (isAlreadySelected) {
      // Remove if already selected
      newSelected = currentSelected.filter((id) => id !== technology.id);
    } else {
      // Add if not selected
      newSelected = [...currentSelected, technology.id];
    }

    updateFilters({
      selectedTechnologies: newSelected,
    });
  };

  const clearAllSelections = () => {
    updateFilters({
      selectedTechnologies: [],
    });
  };

  // Get display text for button
  const getDisplayText = () => {
    if (selectedTechnologies.length === 0) return "Select technologies...";
    if (selectedTechnologies.length === 1) {
      const allTechs =
        technologies.length > 0 ? technologies : storeTechnologies;
      const selectedTech = allTechs.find(
        (t) => t.id === selectedTechnologies[0]
      );
      return selectedTech ? selectedTech.name : "1 technology selected";
    }
    return `${selectedTechnologies.length} technologies selected`;
  };

  // Rest of your existing code (handleDropdownSearchChange, useEffect, etc.)
  const handleDropdownSearchChange = (e) => {
    setDropdownSearchValue(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setDropdownSearchValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredTechnologies = getFilteredTechnologies();

  return (
    <div>
      {/* Technology Search Label */}
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center space-x-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          <span className="text-gray-700 font-medium">Technology Search</span>
        </div>
        {selectedTechnologies.length > 0 && (
          <button
            onClick={clearAllSelections}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Select Technologies Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-lg text-left text-sm transition-all ${
            isDropdownOpen
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <span
            className={
              selectedTechnologies.length > 0
                ? "text-gray-900"
                : "text-gray-500"
            }
          >
            {getDisplayText()}
          </span>
          {isDropdownOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
            {/* Search within dropdown */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={dropdownSearchValue}
                  onChange={handleDropdownSearchChange}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  autoFocus
                />
              </div>
            </div>

            {/* Technology List */}
            <div className="max-h-48 overflow-y-auto">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map((technology) => {
                  const isSelected = selectedTechnologies.includes(
                    technology.id
                  );
                  return (
                    <button
                      key={technology.id}
                      onClick={() => handleTechnologySelect(technology)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-blue-50 focus:outline-none text-sm border-b border-gray-100 last:border-b-0 transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{technology.name}</span>
                      {isSelected && (
                        <span className="text-blue-600 text-xs">✓</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-6 text-sm text-gray-500 text-center">
                  No technologies found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
