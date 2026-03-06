// server/src/routes/restock.routes.js
const router = require('express').Router();
const controller = require('../controllers/restock.controller');

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
