const db = require("../config/database");
const logger = require("../utils/logger");

class FilterService {
  async getFilterOptions() {
    try {
      // Get domains with technology counts
      const domainsQuery = `
        SELECT 
          d.*,
          COUNT(t.id) as count
        FROM domains d
        LEFT JOIN technologies t ON d.id = t.domain_id AND t.is_active = true
        GROUP BY d.id
        ORDER BY d.name ASC
      `;

      // Get tags with technology counts
      const tagsQuery = `
        SELECT 
          tag.*,
          COUNT(t.id) as count
        FROM tags tag
        LEFT JOIN technologies t ON tag.id = t.tag_id AND t.is_active = true
        GROUP BY tag.id
        ORDER BY tag.order_index ASC, tag.name ASC
      `;

      // Get impact levels with counts
      const impactQuery = `
        SELECT 
          impact_level as value,
          COUNT(*) as count
        FROM technologies 
        WHERE is_active = true 
        GROUP BY impact_level
        ORDER BY 
          CASE impact_level 
            WHEN 'High Impact' THEN 1 
            WHEN 'Medium Impact' THEN 2 
            WHEN 'Low Impact' THEN 3 
          END
      `;

      // Get effort levels with counts
      const effortQuery = `
        SELECT 
          effort_level as value,
          COUNT(*) as count
        FROM technologies 
        WHERE is_active = true 
        GROUP BY effort_level
        ORDER BY 
          CASE effort_level 
            WHEN 'High Effort' THEN 1 
            WHEN 'Medium Effort' THEN 2 
            WHEN 'Low Effort' THEN 3 
          END
      `;

      // Get time to market ranges
      const timeToMarketQuery = `
        SELECT 
          CASE 
            WHEN time_to_market <= 6 THEN '0-6 months'
            WHEN time_to_market <= 12 THEN '6-12 months'
            WHEN time_to_market <= 24 THEN '1-2 years'
            ELSE '2+ years'
          END as label,
          CASE 
            WHEN time_to_market <= 6 THEN 0
            WHEN time_to_market <= 12 THEN 6
            WHEN time_to_market <= 24 THEN 12
            ELSE 24
          END as min_months,
          CASE 
            WHEN time_to_market <= 6 THEN 6
            WHEN time_to_market <= 12 THEN 12
            WHEN time_to_market <= 24 THEN 24
            ELSE NULL
          END as max_months,
          COUNT(*) as count
        FROM technologies 
        WHERE is_active = true AND time_to_market IS NOT NULL
        GROUP BY 
          CASE 
            WHEN time_to_market <= 6 THEN '0-6 months'
            WHEN time_to_market <= 12 THEN '6-12 months'
            WHEN time_to_market <= 24 THEN '1-2 years'
            ELSE '2+ years'
          END,
          CASE 
            WHEN time_to_market <= 6 THEN 0
            WHEN time_to_market <= 12 THEN 6
            WHEN time_to_market <= 24 THEN 12
            ELSE 24
          END,
          CASE 
            WHEN time_to_market <= 6 THEN 6
            WHEN time_to_market <= 12 THEN 12
            WHEN time_to_market <= 24 THEN 24
            ELSE NULL
          END
        ORDER BY min_months ASC
      `;

      const [
        domainsResult,
        tagsResult,
        impactResult,
        effortResult,
        timeToMarketResult,
      ] = await Promise.all([
        db.query(domainsQuery),
        db.query(tagsQuery),
        db.query(impactQuery),
        db.query(effortQuery),
        db.query(timeToMarketQuery),
      ]);

      // Format results
      const domains = domainsResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        icon: row.icon,
        description: row.description,
        count: parseInt(row.count),
      }));

      const tags = tagsResult.rows.map((row) => ({
        id: row.id,
        name: row.name,
        color: row.color,
        description: row.description,
        count: parseInt(row.count),
      }));

      const impactLevels = impactResult.rows.map((row) => ({
        value: row.value,
        count: parseInt(row.count),
        description: this.getImpactDescription(row.value),
      }));

      const effortLevels = effortResult.rows.map((row) => ({
        value: row.value,
        count: parseInt(row.count),
        description: this.getEffortDescription(row.value),
      }));

      const timeToMarketRanges = timeToMarketResult.rows.map((row) => ({
        label: row.label,
        min: row.min_months,
        max: row.max_months,
        count: parseInt(row.count),
      }));

      return {
        domains,
        tags,
        impact_levels: impactLevels,
        effort_levels: effortLevels,
        time_to_market_ranges: timeToMarketRanges,
      };
    } catch (error) {
      logger.error("Error in getFilterOptions:", error);
      throw new Error("Failed to fetch filter options");
    }
  }

  getImpactDescription(impact) {
    switch (impact) {
      case "High Impact":
        return "Significant transformative potential";
      case "Medium Impact":
        return "Moderate improvement potential";
      case "Low Impact":
        return "Limited or niche improvement potential";
      default:
        return "";
    }
  }

  getEffortDescription(effort) {
    switch (effort) {
      case "High Effort":
        return "Requires significant resources and time";
      case "Medium Effort":
        return "Moderate resource and time investment";
      case "Low Effort":
        return "Minimal resource and time requirements";
      default:
        return "";
    }
  }

  async getSearchSuggestions(query, limit = 10) {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const searchQuery = `
        (
          SELECT 
            'technology' as type,
            id,
            name,
            ts_headline('english', name, plainto_tsquery('english', $1), 'MaxWords=10, MinWords=1') as highlight
          FROM technologies 
          WHERE 
            is_active = true AND
            (name ILIKE $2 OR to_tsvector('english', name) @@ plainto_tsquery('english', $1))
          ORDER BY 
            CASE WHEN name ILIKE $3 THEN 1 ELSE 2 END,
            ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) DESC
          LIMIT $4
        )
        UNION ALL
        (
          SELECT 
            'domain' as type,
            id,
            name,
            ts_headline('english', name, plainto_tsquery('english', $1), 'MaxWords=10, MinWords=1') as highlight
          FROM domains
          WHERE name ILIKE $2
          ORDER BY name
          LIMIT $5
        )
        ORDER BY 
          CASE 
            WHEN type = 'technology' THEN 1 
            WHEN type = 'domain' THEN 2 
          END,
          name
        LIMIT $6
      `;

      const result = await db.query(searchQuery, [
        query,
        `%${query}%`,
        `${query}%`,
        Math.min(limit, 8),
        Math.min(limit - 8, 2),
        limit,
      ]);

      return result.rows.map((row) => ({
        type: row.type,
        id: row.id,
        name: row.name,
        highlight: row.highlight,
      }));
    } catch (error) {
      logger.error("Error in getSearchSuggestions:", error);
      throw new Error("Failed to fetch search suggestions");
    }
  }
}

module.exports = new FilterService();
