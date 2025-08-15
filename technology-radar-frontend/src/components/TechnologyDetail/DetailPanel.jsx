import React, { useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";
import TechnologyHeader from "./TechnologyHeader";
import TabSelector from "./TabSelector";
import OverviewTab from "./OverviewTab";
import { LoadingSpinner } from "../UI";

const DetailPanel = () => {
  const { selectedTechnology, closeDetailPanel, activeDetailTab, loading } =
    useAppStore();
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Trigger content animation when component mounts or technology changes
  useEffect(() => {
    setIsContentVisible(false);
    const timer = setTimeout(() => {
      setIsContentVisible(true);
    }, 100); // Small delay for smooth transition

    return () => clearTimeout(timer);
  }, [selectedTechnology?.id]);

  if (!selectedTechnology) {
    return null;
  }

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header - with staggered animation */}
      <div
        className={`p-6 border-b bg-blue-50 animate-stagger ${
          isContentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <TechnologyHeader technology={selectedTechnology} />
          </div>
          <button
            onClick={closeDetailPanel}
            className="p-1 text-gray-800 hover:text-black ml-4 transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation - with staggered animation */}
      <div
        className={`animate-stagger ${
          isContentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: "0.2s" }}
      >
        <TabSelector />
      </div>

      {/* Content Area - with staggered animation */}
      <div
        className={`flex-1 overflow-y-auto custom-scrollbar animate-stagger ${
          isContentVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ animationDelay: "0.3s" }}
      >
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="animate-content-change">
            {activeDetailTab === "overview" && (
              <OverviewTab technology={selectedTechnology} />
            )}
            {activeDetailTab === "workflows" && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Workflows
                </h3>
                <p className="text-gray-600">
                  Workflow information will be displayed here.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailPanel;
