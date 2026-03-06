// server/src/controllers/waste.controller.js
const prisma = require('../lib/prisma');

// GET /api/waste
exports.getAll = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        const logs = await prisma.wasteLog.findMany({
            where,
            include: { ingredient: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(logs);
    } catch (err) { next(err); }
};

// POST /api/waste — Log waste and deduct from inventory
exports.create = async (req, res, next) => {
    try {
        const { ingredientId, quantity, reason } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const ingredient = await tx.ingredient.findUnique({ where: { id: ingredientId } });
            if (!ingredient) throw { status: 404, message: 'Ingredient not found' };

            if (ingredient.currentStock < quantity) {
                throw {
                    status: 400,
                    message: `Cannot waste ${quantity}${ingredient.unit} — only ${ingredient.currentStock}${ingredient.unit} in stock`,
                };
            }

            // Deduct from stock
            await tx.ingredient.update({
                where: { id: ingredientId },
                data: { currentStock: { decrement: quantity } },
            });

            // Create waste log
            const log = await tx.wasteLog.create({
                data: { ingredientId, quantity, reason },
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
