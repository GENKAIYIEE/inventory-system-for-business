// server/src/routes/analytics.routes.js
const router = require('express').Router();
const controller = require('../controllers/analytics.controller');

router.get('/dashboard', controller.getDashboard);
router.get('/sales-trend', controller.getSalesTrend);

module.exports = router;
