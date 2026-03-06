// server/src/routes/waste.routes.js
const router = require('express').Router();
const controller = require('../controllers/waste.controller');

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
