import { create } from "zustand";

const useAppStore = create((set, get) => ({
  // Data State
  technologies: [],
  filteredTechnologies: [],
  selectedTechnology: null,
  filterOptions: null,
  loading: false,
  error: null,

  // Filter State
  filters: {
    search: "",
    selectedTechnologies: [],
    viewMode: "radar", // 'radar' | 'radial'
    domains: [],
    tags: [],
    impactLevels: [],
    effortLevels: [],
    timeToMarket: null,
  },

  // UI State
  isFilterPanelExpanded: true,
  isDetailPanelOpen: false,
  activeDetailTab: "overview",

  // Actions
  setTechnologies: (technologies) =>
    set({
      technologies,
      filteredTechnologies: technologies,
    }),

  setFilteredTechnologies: (filteredTechnologies) =>
    set({ filteredTechnologies }),

  setSelectedTechnology: (technology) =>
    set({
      selectedTechnology: technology,
      isDetailPanelOpen: !!technology,
    }),

  setFilterOptions: (filterOptions) => set({ filterOptions }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  updateFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  clearAllFilters: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        domains: [],
        tags: [],
        impactLevels: [],
        effortLevels: [],
        search: "",
        selectedTechnologies: [],
      },
    })),

  toggleFilterPanel: () =>
    set((state) => ({
      isFilterPanelExpanded: !state.isFilterPanelExpanded,
    })),

  closeDetailPanel: () =>
    set({
      selectedTechnology: null,
      isDetailPanelOpen: false,
    }),

  setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

  // Filter count helper
  getActiveFilterCount: () => {
    const { filters } = get();
    return (
      filters.domains.length +
      filters.tags.length +
      filters.impactLevels.length +
      filters.effortLevels.length +
      (filters.search ? 1 : 0)
    );
  },
}));

export default useAppStore;
