const express = require('express');
const { param, query } = require('express-validator');
const technologyController = require('../controllers/technologyController');

const router = express.Router();

router.get('/', [
  query('search').optional().isLength({ min: 1, max: 100 }).trim(),
  query('domain').optional().matches(/^\d+(,\d+)*$/),
  query('tag').optional().matches(/^\d+(,\d+)*$/),
  query('limit').optional().isInt({ min: 1, max: 200 }),
  query('offset').optional().isInt({ min: 0 })
], technologyController.getTechnologies);

router.get('/:id', [
  param('id').isInt({ min: 1 }),
  query('details').optional().isBoolean()
], technologyController.getTechnologyById);

module.exports = router;
