// server/src/controllers/dish.controller.js
const prisma = require('../lib/prisma');

// GET /api/dishes
exports.getAll = async (req, res, next) => {
    try {
        const dishes = await prisma.dish.findMany({
            include: { category: true, recipeItems: { include: { ingredient: true } } },
            orderBy: { name: 'asc' },
        });
        res.json(dishes);
    } catch (err) { next(err); }
};

// GET /api/dishes/:id
exports.getById = async (req, res, next) => {
    try {
        const dish = await prisma.dish.findUnique({
            where: { id: req.params.id },
            include: { category: true, recipeItems: { include: { ingredient: true } } },
        });
        if (!dish) return res.status(404).json({ error: 'Dish not found' });
        res.json(dish);
    } catch (err) { next(err); }
};

// POST /api/dishes
exports.create = async (req, res, next) => {
    try {
        const { name, sellingPrice, imageUrl, isAvailable, categoryId } = req.body;
        const dish = await prisma.dish.create({
            data: { name, sellingPrice, imageUrl, isAvailable, categoryId },
        });
        res.status(201).json(dish);
    } catch (err) { next(err); }
};

// PUT /api/dishes/:id
exports.update = async (req, res, next) => {
    try {
        const dish = await prisma.dish.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(dish);
    } catch (err) { next(err); }
};

// DELETE /api/dishes/:id
exports.remove = async (req, res, next) => {
    try {
        await prisma.dish.delete({ where: { id: req.params.id } });
        res.json({ message: 'Dish deleted' });
    } catch (err) { next(err); }
};
