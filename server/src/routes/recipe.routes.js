// server/src/routes/recipe.routes.js
const router = require('express').Router();
const controller = require('../controllers/recipe.controller');

router.get('/dish/:dishId', controller.getByDish);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
