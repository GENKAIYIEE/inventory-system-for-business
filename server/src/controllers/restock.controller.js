// server/src/controllers/restock.controller.js
const prisma = require('../lib/prisma');

// GET /api/restocks
exports.getAll = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        const logs = await prisma.restockLog.findMany({
            where,
            include: { ingredient: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(logs);
    } catch (err) { next(err); }
};

// POST /api/restocks — Add stock + update weighted average cost
exports.create = async (req, res, next) => {
    try {
        const { ingredientId, quantity, totalCost, supplier } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            // Fetch current ingredient
            const ingredient = await tx.ingredient.findUnique({ where: { id: ingredientId } });
            if (!ingredient) throw { status: 404, message: 'Ingredient not found' };

            // Calculate new weighted average cost per unit
            const existingValue = ingredient.currentStock * ingredient.costPerUnit;
            const newTotalStock = ingredient.currentStock + quantity;
            const newCostPerUnit = newTotalStock > 0
                ? (existingValue + totalCost) / newTotalStock
                : 0;

            // Update ingredient stock and cost
            await tx.ingredient.update({
                where: { id: ingredientId },
                data: {
                    currentStock: { increment: quantity },
                    costPerUnit: newCostPerUnit,
                },
            });

            // Create the restock log entry
            const log = await tx.restockLog.create({
                data: { ingredientId, quantity, totalCost, supplier },
                include: { ingredient: true },
            });

            return log;
        });

        res.status(201).json(result);
    } catch (err) {
        if (err.status) return res.status(err.status).json({ error: err.message });
        next(err);
    }
};
