const db = require("../config/database");
const logger = require("../utils/logger");

class TechnologyService {
  async getTechnologies(filters = {}) {
    try {
      let baseQuery = `
        SELECT 
          t.id,
          t.uuid,
          t.name,
          t.description,
          t.angle,
          t.radius,
          t.impact_level,
          t.effort_level,
          t.time_to_market,
          t.risk_score,
          t.is_active,
          t.is_featured,
          t.created_at,
          t.updated_at,
          d.id as domain_id,
          d.name as domain_name,
          d.color as domain_color,
          d.icon as domain_icon,
          tag.id as tag_id,
          tag.name as tag_name,
          tag.color as tag_color
        FROM technologies t
        LEFT JOIN domains d ON t.domain_id = d.id
        LEFT JOIN tags tag ON t.tag_id = tag.id
        WHERE t.is_active = $1
      `;

      const queryParams = [filters.isActive !== false];
      let paramCount = 1;

      // Apply search filter
      if (filters.search) {
        paramCount++;
        baseQuery += ` AND (
          t.name ILIKE $${paramCount} OR 
          t.description ILIKE $${paramCount} OR
          to_tsvector('english', t.name || ' ' || t.description) @@ plainto_tsquery('english', $${paramCount})
        )`;
        queryParams.push(`%${filters.search}%`);
      }

      // Apply domain filter
      if (filters.domain && filters.domain.length > 0) {
        paramCount++;
        baseQuery += ` AND t.domain_id = ANY($${paramCount})`;
        queryParams.push(filters.domain);
      }

      // Apply tag filter
      if (filters.tag && filters.tag.length > 0) {
        paramCount++;
        baseQuery += ` AND t.tag_id = ANY($${paramCount})`;
        queryParams.push(filters.tag);
      }

      // Apply impact level filter
      if (filters.impact && filters.impact.length > 0) {
        paramCount++;
        baseQuery += ` AND t.impact_level = ANY($${paramCount})`;
        queryParams.push(filters.impact);
      }

      // Apply effort level filter
      if (filters.effort && filters.effort.length > 0) {
        paramCount++;
        baseQuery += ` AND t.effort_level = ANY($${paramCount})`;
        queryParams.push(filters.effort);
      }

      // Apply selected technologies filter
      if (
        filters.selectedTechnologies &&
        filters.selectedTechnologies.length > 0
      ) {
        paramCount++;
        baseQuery += ` AND t.id = ANY($${paramCount})`;
        queryParams.push(filters.selectedTechnologies);
      }

      // Apply time to market filter
      if (filters.timeToMarket) {
        paramCount++;
        baseQuery += ` AND t.time_to_market <= $${paramCount}`;
        queryParams.push(filters.timeToMarket);
      }

      // Get total count before pagination
      const countQuery = baseQuery
        .replace(/SELECT.*?FROM/s, "SELECT COUNT(*) as total FROM")
        .replace(/ORDER BY.*$/s, "");

      const countResult = await db.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].total);

      // Apply sorting and pagination
      baseQuery += ` ORDER BY t.name ASC`;

      if (filters.limit) {
        paramCount++;
        baseQuery += ` LIMIT $${paramCount}`;
        queryParams.push(filters.limit);
      }

      if (filters.offset) {
        paramCount++;
        baseQuery += ` OFFSET $${paramCount}`;
        queryParams.push(filters.offset);
      }

      const result = await db.query(baseQuery, queryParams);

      const technologies = result.rows.map((row) => ({
        id: row.id,
        uuid: row.uuid,
        name: row.name,
        description: row.description,
        domain: {
          id: row.domain_id,
          name: row.domain_name,
          color: row.domain_color,
          icon: row.domain_icon,
        },
        tag: {
          id: row.tag_id,
          name: row.tag_name,
          color: row.tag_color,
        },
        angle: parseFloat(row.angle),
        radius: parseFloat(row.radius),
        impact_level: row.impact_level,
        effort_level: row.effort_level,
        time_to_market: row.time_to_market,
        risk_score: row.risk_score,
        is_featured: row.is_featured,
        created_at: row.created_at,
        updated_at: row.updated_at,
      }));

      return {
        technologies,
        pagination: {
          total,
          filtered: technologies.length,
          limit: filters.limit || null,
          offset: filters.offset || 0,
          hasMore: filters.limit
            ? (filters.offset || 0) + technologies.length < total
            : false,
        },
        filters_applied: {
          search: filters.search || null,
          domain: filters.domain || [],
          tag: filters.tag || [],
          impact: filters.impact || [],
          effort: filters.effort || [],
        },
      };
    } catch (error) {
      logger.error("Error in getTechnologies:", error);
      throw new Error("Failed to fetch technologies");
    }
  }

  async getTechnologyById(id, includeDetails = true) {
    try {
      const technologyQuery = `
        SELECT 
          t.*,
          d.id as domain_id,
          d.name as domain_name,
          d.color as domain_color,
          d.icon as domain_icon,
          d.description as domain_description,
          tag.id as tag_id,
          tag.name as tag_name,
          tag.color as tag_color,
          tag.description as tag_description
        FROM technologies t
        LEFT JOIN domains d ON t.domain_id = d.id
        LEFT JOIN tags tag ON t.tag_id = tag.id
        WHERE t.id = $1 AND t.is_active = true
      `;

      const result = await db.query(technologyQuery, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      const technology = {
        id: row.id,
        uuid: row.uuid,
        name: row.name,
        description: row.description,
        domain: {
          id: row.domain_id,
          name: row.domain_name,
          color: row.domain_color,
          icon: row.domain_icon,
          description: row.domain_description,
        },
        tag: {
          id: row.tag_id,
          name: row.tag_name,
          color: row.tag_color,
          description: row.tag_description,
        },
        angle: parseFloat(row.angle),
        radius: parseFloat(row.radius),
        impact_level: row.impact_level,
        effort_level: row.effort_level,
        time_to_market: row.time_to_market,
        risk_score: row.risk_score,
        impact_description: row.impact_description,
        effort_description: row.effort_description,
        use_case: {
          title: row.use_case_title,
          description: row.use_case_description,
        },
        source_url: row.source_url,
        documentation_url: row.documentation_url,
        is_active: row.is_active,
        is_featured: row.is_featured,
        version: row.version,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };

      if (includeDetails) {
        // Get benefits
        const benefitsQuery = `
          SELECT id, benefit, category, order_index
          FROM technology_benefits 
          WHERE technology_id = $1 
          ORDER BY order_index ASC, id ASC
        `;
        const benefitsResult = await db.query(benefitsQuery, [id]);
        technology.benefits = benefitsResult.rows;

        // Get risks
        const risksQuery = `
          SELECT id, risk, severity, category, order_index
          FROM technology_risks 
          WHERE technology_id = $1 
          ORDER BY order_index ASC, id ASC
        `;
        const risksResult = await db.query(risksQuery, [id]);
        technology.risks = risksResult.rows;

        // Get workflows
        const workflowsQuery = `
          SELECT id, workflow_name, workflow_description, steps, estimated_duration, complexity_level, order_index
          FROM technology_workflows 
          WHERE technology_id = $1 
          ORDER BY order_index ASC, id ASC
        `;
        const workflowsResult = await db.query(workflowsQuery, [id]);
        technology.workflows = workflowsResult.rows;

        // Get metrics
        const metricsQuery = `
          SELECT id, metric_name, metric_value, metric_unit, metric_type, display_order
          FROM technology_metrics 
          WHERE technology_id = $1 
          ORDER BY display_order ASC, id ASC
        `;
        const metricsResult = await db.query(metricsQuery, [id]);
        technology.metrics = metricsResult.rows;
      }

      return technology;
    } catch (error) {
      logger.error("Error in getTechnologyById:", error);
      throw new Error("Failed to fetch technology details");
    }
  }
}

module.exports = new TechnologyService();
