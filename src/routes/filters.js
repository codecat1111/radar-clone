const express = require('express');
const { query } = require('express-validator');
const filterController = require('../controllers/filterController');

const router = express.Router();

router.get('/', filterController.getFilterOptions);

router.get('/search', [
  query('q').isLength({ min: 2, max: 100 }).trim(),
  query('limit').optional().isInt({ min: 1, max: 20 })
], filterController.getSearchSuggestions);

module.exports = router;
