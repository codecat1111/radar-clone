import React, { useState, useEffect } from "react";
import { CogIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import { Badge } from "../UI";
import { technologyService } from "../../services/technologyService";

const TechnologyFilter = ({ technologies = [] }) => {
  const { filters, setSelectedTechnologyId, setSelectedTechnology } =
    useAppStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".relative")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const handleTechnologyChange = async (technology) => {
    setSelectedTechnologyId(technology.id);

    try {
      const response = await technologyService.getTechnologyById(
        technology.id,
        true
      );
      if (response.success) {
        setSelectedTechnology(response.data.technology);
      } else {
        setSelectedTechnology(technology);
      }
    } catch (error) {
      console.error("Error fetching technology details:", error);
      setSelectedTechnology(technology);
    }
  };

  //Technology for display
  const selectedTechnology = technologies.find(
    (tech) => tech.id === filters.selectedTechnologyId
  );

  if (!technologies || technologies.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary-blue p-4 rounded-lg border border-blue-900 opacity-0 animate-slide-down">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <CogIcon className="w-4 h-4 mr-2" />
            Technology
          </h3>
          <Badge variant="default" size="sm">
            {technologies.length}
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
              className={selectedTechnology ? "text-gray-700" : "text-gray-400"}
            >
              {selectedTechnology?.name || "Select a technology..."}
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
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-blue-400 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto animate-slide-down">
              {technologies.map((technology, index) => (
                <div
                  key={technology.id}
                  className={`p-3 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${
                    technology.id === filters.selectedTechnologyId
                      ? "bg-blue-50"
                      : ""
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => {
                    handleTechnologyChange(technology);
                    setIsDropdownOpen(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{technology.name}</span>
                    {technology.tags && technology.tags.length > 0 && (
                      <div className="flex gap-1">
                        {technology.tags.slice(0, 2).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" size="xs">
                            {tag}
                          </Badge>
                        ))}
                        {technology.tags.length > 2 && (
                          <Badge variant="secondary" size="xs">
                            +{technology.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  {technology.description && (
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {technology.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnologyFilter;
