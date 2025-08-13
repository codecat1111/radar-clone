const filterService = require("../services/filterService");
const { validationResult } = require("express-validator");

class FilterController {
  async getFilterOptions(req, res, next) {
    try {
      const filterOptions = await filterService.getFilterOptions();

      res.json({
        success: true,
        data: filterOptions,
      });
    } catch (error) {
      next(error);
    }
  }

  async getSearchSuggestions(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors.array(),
        });
      }

      const { q: query, limit = 10 } = req.query;
      const suggestions = await filterService.getSearchSuggestions(
        query,
        parseInt(limit)
      );

      res.json({
        success: true,
        data: { suggestions },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FilterController();
