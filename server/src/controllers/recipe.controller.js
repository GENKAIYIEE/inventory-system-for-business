// server/src/controllers/recipe.controller.js
const prisma = require('../lib/prisma');

// GET /api/recipes/dish/:dishId
exports.getByDish = async (req, res, next) => {
    try {
        const items = await prisma.recipeItem.findMany({
            where: { dishId: req.params.dishId },
            include: { ingredient: true },
        });
        res.json(items);
    } catch (err) { next(err); }
};

// POST /api/recipes
exports.create = async (req, res, next) => {
    try {
        const { dishId, ingredientId, quantityNeeded } = req.body;
        const item = await prisma.recipeItem.create({
            data: { dishId, ingredientId, quantityNeeded },
            include: { ingredient: true, dish: true },
        });
        res.status(201).json(item);
    } catch (err) { next(err); }
};

// PUT /api/recipes/:id
exports.update = async (req, res, next) => {
    try {
        const item = await prisma.recipeItem.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(item);
    } catch (err) { next(err); }
};

// DELETE /api/recipes/:id
exports.remove = async (req, res, next) => {
    try {
        await prisma.recipeItem.delete({ where: { id: req.params.id } });
        res.json({ message: 'Recipe item deleted' });
    } catch (err) { next(err); }
};
