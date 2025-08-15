import React from "react";
import { MainLayout } from "./components/Layout";
import { RadarChart, RadialChart } from "./components/RadarChart";
import { useRadarData } from "./hooks/useRadarData";
import { useTechnologyDetail } from "./hooks/useTechnologyDetail";
import { technologyService } from "./services/technologyService";
import useAppStore from "./store/useAppStore";
import { LoadingSpinner } from "./components/UI";
import { useState } from "react";
function App() {
  const { technologies, loading, error } = useRadarData();
  const { setSelectedTechnology } = useAppStore();
  const { filters } = useAppStore();

  // Derive domains from technologies
  const domains = React.useMemo(() => {
    if (!technologies.length) return [];

    const domainMap = new Map();
    technologies.forEach((tech) => {
      const domainName =
        typeof tech.domain === "string" ? tech.domain : tech.domain?.name;
      if (domainName) {
        if (!domainMap.has(domainName)) {
          domainMap.set(domainName, {
            id: domainName,
            name: domainName,
            color: tech.domain?.color || "#4A90E2",
            count: 0,
          });
        }
        domainMap.get(domainName).count++;
      }
    });

    return Array.from(domainMap.values());
  }, [technologies]);

  //Add state for zoom level
  const [zoomLevel, setZoomLevel] = useState(1);

  //Add zoom handlers
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => setZoomLevel(1);

  const handleTechnologyClick = async (technology) => {
    // Add a small transition delay for smoother UX
    setSelectedTechnology(null); // Clear current selection first

    setTimeout(async () => {
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
    }, 150); // Small delay for smooth transition
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
          <div className="text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="transition-all duration-300 ease-in-out">
          {loading && technologies.length === 0 ? (
            <div className="animate-fadeIn">
              <LoadingSpinner size="xl" />
            </div>
          ) : error ? (
            <div className="text-center animate-fadeIn">
              <div className="text-red-600 text-xl font-semibold mb-2">
                Error
              </div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {filters.viewMode === "radar" ? (
                  <RadarChart
                    technologies={technologies}
                    onTechnologyClick={handleTechnologyClick}
                  />
                ) : (
                  <RadialChart
                    technologies={technologies}
                    domains={domains}
                    onTechnologyClick={handleTechnologyClick}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Glassmorphism Zoom Controls - moved outside conditional */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/30 shadow-lg">
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            −
          </button>
          <button
            onClick={handleZoomReset}
            className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            ⌂
          </button>
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 backdrop-blur-sm border border-white/40 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all duration-200"
          >
            +
          </button>
        </div>

        {!loading && technologies.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fadeIn">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg border">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No technologies found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export default App;
