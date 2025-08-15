import React from "react";
import clsx from "clsx";
import Header from "./Header";
import FilterPanel from "../Filters/FilterPanel";
import DetailPanel from "../TechnologyDetail/DetailPanel";
import useAppStore from "../../store/useAppStore";

const MainLayout = ({ children }) => {
  const {
    isFilterPanelExpanded,
    isDetailPanelOpen,
    selectedTechnology,
    filters,
  } = useAppStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Filter Panel */}
      <aside
        className={clsx(
          "bg-filter-bg border-r border-filter-border transition-all duration-300 z-40",
          "lg:relative lg:translate-x-0",
          isFilterPanelExpanded
            ? "w-96 translate-x-0"
            : "w-16 -translate-x-full lg:translate-x-0",
          // Mobile styles
          "fixed lg:static inset-y-0 left-0"
        )}
      >
        <FilterPanel />
      </aside>

      {/* Mobile Overlay */}
      {isFilterPanelExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => useAppStore.getState().toggleFilterPanel()}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="flex-1 flex overflow-hidden bg-blue-50">
          {/* Radar Chart Area */}
          <div className="flex-1 p-6 overflow-auto">{children}</div>

          {/* Right Detail Panel - Enhanced with animations */}
          {isDetailPanelOpen && selectedTechnology && (
            <aside className="w-96 bg-white border-l border-gray-200 overflow-hidden animate-slide-in-right">
              <DetailPanel key={selectedTechnology.id} />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
