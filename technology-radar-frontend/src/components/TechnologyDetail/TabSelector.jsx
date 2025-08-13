import React from "react";
import { DocumentTextIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import useAppStore from "../../store/useAppStore";

const TabSelector = () => {
  const { activeDetailTab, setActiveDetailTab } = useAppStore();

  const tabs = [
    { id: "overview", label: "Overview", icon: DocumentTextIcon },
    { id: "workflows", label: "Workflows", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeDetailTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveDetailTab(tab.id)}
            className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              isActive
                ? "border-primary-blue text-primary-blue bg-blue-100"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default TabSelector;
