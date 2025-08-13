import { useEffect } from "react";
import { technologyService } from "../services/technologyService";
import useAppStore from "../store/useAppStore";

export const useFilters = () => {
  const { filterOptions, setFilterOptions, setError } = useAppStore();

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await technologyService.getFilterOptions();

        if (response.success) {
          setFilterOptions(response.data);
        } else {
          setError("Failed to fetch filter options");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch filter options");
      }
    };

    if (!filterOptions) {
      fetchFilterOptions();
    }
  }, [filterOptions, setFilterOptions, setError]);

  return {
    filterOptions,
    loading: !filterOptions,
  };
};
