// server/src/controllers/ingredient.controller.js
const prisma = require('../lib/prisma');

// GET /api/ingredients
exports.getAll = async (req, res, next) => {
    try {
        const ingredients = await prisma.ingredient.findMany({
            include: { category: true },
            orderBy: { name: 'asc' },
        });
        res.json(ingredients);
    } catch (err) { next(err); }
};

// GET /api/ingredients/low-stock
exports.getLowStock = async (req, res, next) => {
    try {
        const items = await prisma.ingredient.findMany({
            where: {
                currentStock: { lte: prisma.ingredient.fields?.lowStockThreshold ?? 0 },
            },
            include: { category: true },
            orderBy: { currentStock: 'asc' },
        });
        // Prisma doesn't support field-to-field comparison directly,
        // so we filter in JS
        const allIngredients = await prisma.ingredient.findMany({ include: { category: true } });
        const lowStock = allIngredients.filter(i => i.currentStock <= i.lowStockThreshold);
        res.json(lowStock);
    } catch (err) { next(err); }
};

// GET /api/ingredients/:id
exports.getById = async (req, res, next) => {
    try {
        const ingredient = await prisma.ingredient.findUnique({
            where: { id: req.params.id },
            include: { category: true, recipeItems: { include: { dish: true } } },
        });
        if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
        res.json(ingredient);
    } catch (err) { next(err); }
};

// POST /api/ingredients
exports.create = async (req, res, next) => {
    try {
        const { name, unit, currentStock, lowStockThreshold, costPerUnit, categoryId } = req.body;
        const ingredient = await prisma.ingredient.create({
            data: { name, unit, currentStock: currentStock || 0, lowStockThreshold: lowStockThreshold || 0, costPerUnit: costPerUnit || 0, categoryId },
        });
        res.status(201).json(ingredient);
    } catch (err) { next(err); }
};

// PUT /api/ingredients/:id
exports.update = async (req, res, next) => {
    try {
        const ingredient = await prisma.ingredient.update({
            where: { id: req.params.id },
            data: req.body,
        });
        res.json(ingredient);
    } catch (err) { next(err); }
};

// DELETE /api/ingredients/:id
exports.remove = async (req, res, next) => {
    try {
        await prisma.ingredient.delete({ where: { id: req.params.id } });
        res.json({ message: 'Ingredient deleted' });
    } catch (err) { next(err); }
};
