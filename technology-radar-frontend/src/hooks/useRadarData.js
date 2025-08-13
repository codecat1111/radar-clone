import { useEffect, useCallback } from "react";
import { technologyService } from "../services/technologyService";
import useAppStore from "../store/useAppStore";

export const useRadarData = () => {
  const {
    technologies,
    filteredTechnologies,
    filters,
    loading,
    error,
    setTechnologies,
    setFilteredTechnologies,
    setLoading,
    setError,
  } = useAppStore();

  // Fetch technologies based on current filters
  const fetchTechnologies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filterParams = {
        search: filters.search || undefined,
        domains: filters.domains.length > 0 ? filters.domains : undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        impactLevels:
          filters.impactLevels.length > 0 ? filters.impactLevels : undefined,
        effortLevels:
          filters.effortLevels.length > 0 ? filters.effortLevels : undefined,
        timeToMarket: filters.timeToMarket || undefined,
        selectedTechnologies:
          filters.selectedTechnologies.length > 0
            ? filters.selectedTechnologies
            : undefined,
      };

      const response = await technologyService.getTechnologies(filterParams);

      if (response.success) {
        setFilteredTechnologies(response.data.technologies);
      } else {
        setError("Failed to fetch technologies");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch technologies");
    } finally {
      setLoading(false);
    }
  }, [filters, setFilteredTechnologies, setLoading, setError]);

  // Add this new code here:
  const fetchAllTechnologies = useCallback(async () => {
    try {
      const response = await technologyService.getTechnologies({});
      if (response.success) {
        setTechnologies(response.data.technologies);
      }
    } catch (err) {
      console.error("Failed to fetch all technologies:", err);
    }
  }, [setTechnologies]);

  useEffect(() => {
    fetchAllTechnologies();
    fetchTechnologies();
  }, [fetchAllTechnologies, fetchTechnologies]);

  return {
    technologies: filteredTechnologies,
    loading,
    error,
    refetch: fetchTechnologies,
  };
};
