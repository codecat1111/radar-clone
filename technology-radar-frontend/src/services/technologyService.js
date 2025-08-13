import api from "./api";

export const technologyService = {
  // Get all technologies with filtering
  async getTechnologies(filters = {}) {
    const params = new URLSearchParams();

    if (filters.search) params.append("search", filters.search);
    if (filters.domains?.length)
      params.append("domain", filters.domains.join(","));
    if (filters.tags?.length) params.append("tag", filters.tags.join(","));
    if (filters.impactLevels?.length)
      params.append("impact", filters.impactLevels.join(","));
    if (filters.effortLevels?.length)
      params.append("effort", filters.effortLevels.join(","));
    if (filters.timeToMarket)
      params.append("timeToMarket", filters.timeToMarket);
    if (filters.selectedTechnologies?.length)
      params.append(
        "selectedTechnologies",
        filters.selectedTechnologies.join(",")
      );
    if (filters.limit) params.append("limit", filters.limit);
    if (filters.offset) params.append("offset", filters.offset);

    const queryString = params.toString();
    const url = queryString ? `/technologies?${queryString}` : "/technologies";

    return await api.get(url);
  },

  // Get single technology by ID
  async getTechnologyById(id, includeDetails = true) {
    const params = includeDetails ? "?details=true" : "?details=false";
    return await api.get(`/technologies/${id}${params}`);
  },

  // Get filter options
  async getFilterOptions() {
    return await api.get("/filters");
  },

  // Get search suggestions
  async getSearchSuggestions(query, limit = 10) {
    const params = new URLSearchParams({ q: query, limit });
    return await api.get(`/filters/search?${params}`);
  },
};
