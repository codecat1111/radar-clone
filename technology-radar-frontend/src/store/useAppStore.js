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
    selectedDomain: null,
    selectedTechnologyId: null,
  },

  // UI State
  isFilterPanelExpanded: true,
  isDetailPanelOpen: false,
  activeDetailTab: "overview",
  isTransitioning: false,

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

  //Radial actions
  setSelectedDomain: (domain) =>
    set((state) => ({
      filters: {
        ...state.filters,
        selectedDomain: domain,
      },
    })),

  setSelectedTechnologyId: (id) =>
    set((state) => ({
      filters: {
        ...state.filters,
        selectedTechnologyId: id,
      },
    })),

  setIsTransitioning: (status) => set({ isTransitioning: status }),

  resetForViewModeChange: () =>
    set((state) => ({
      filters: {
        ...state.filters,
        domains: [],
        tags: [],
        impactLevels: [],
        effortLevels: [],
        search: "",
        selectedTechnologies: [],
        selectedDomain: null,
        selectedTechnologyId: null,
      },
    })),

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

  //Get Active Filter Count
  getActiveFilterCount: () => {
    return (
      filters.domains.length +
      filters.tags.length +
      filters.impactLevels.length +
      filters.effortLevels.length +
      (filters.search ? 1 : 0)
    );
  },

  // Get tech by domain
  getTechnologiesByDomain: (domain) => {
    const { technologies } = get();
    return technologies.filter((tech) => tech.domain === domain);
  },

  //Get Unique Domains
  getUniqueDomains: () => {
    const { technologies } = get();
    return [...new Set(technologies.map((tech) => tech.domain))];
  },
}));

export default useAppStore;
