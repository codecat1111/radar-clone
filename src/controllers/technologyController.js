const technologyService = require("../services/technologyService");
const { validationResult } = require("express-validator");

class TechnologyController {
  // GET /api/technologies
  async getTechnologies(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const filters = {
        search: req.query.search,
        domain: req.query.domain ? req.query.domain.split(",").map(Number) : [],
        tag: req.query.tag ? req.query.tag.split(",").map(Number) : [],
        impact: req.query.impact ? req.query.impact.split(",") : [],
        effort: req.query.effort ? req.query.effort.split(",") : [],
        selectedTechnologies: req.query.selectedTechnologies
          ? req.query.selectedTechnologies.split(",").map(Number)
          : [],
        timeToMarket: req.query.timeToMarket
          ? Number(req.query.timeToMarket)
          : null,
        riskScoreMin: req.query.riskScoreMin
          ? Number(req.query.riskScoreMin)
          : null,
        riskScoreMax: req.query.riskScoreMax
          ? Number(req.query.riskScoreMax)
          : null,
        isActive: req.query.isActive !== "false",
        limit: Math.min(Number(req.query.limit) || 100, 200),
        offset: Number(req.query.offset) || 0,
      };

      const result = await technologyService.getTechnologies(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/technologies/:id
  async getTechnologyById(req, res, next) {
    try {
      const { id } = req.params;
      const includeDetails = req.query.details !== "false";

      const technology = await technologyService.getTechnologyById(
        id,
        includeDetails
      );

      if (!technology) {
        return res.status(404).json({
          success: false,
          error: "Technology not found",
        });
      }

      res.json({
        success: true,
        data: { technology },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TechnologyController();
