// server/src/routes/sale.routes.js
const router = require('express').Router();
const controller = require('../controllers/sale.controller');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create); // The core transactional endpoint

module.exports = router;
