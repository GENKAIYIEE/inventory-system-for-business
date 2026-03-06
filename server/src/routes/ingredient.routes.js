// server/src/routes/ingredient.routes.js
const router = require('express').Router();
const controller = require('../controllers/ingredient.controller');

router.get('/', controller.getAll);
router.get('/low-stock', controller.getLowStock);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
