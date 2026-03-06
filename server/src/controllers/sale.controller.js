// server/src/controllers/sale.controller.js
// ═══════════════════════════════════════════════════════════
// THE CORE TRANSACTIONAL ENDPOINT
// When a sale is recorded, this controller:
//   1. Validates all dishes and checks ingredient availability
//   2. Creates Sale + SaleItem records
//   3. Deducts proportional ingredients from inventory
//   4. Rolls back everything if any ingredient is insufficient
// ═══════════════════════════════════════════════════════════

const prisma = require('../lib/prisma');

// GET /api/sales
exports.getAll = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        const where = {};
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        const sales = await prisma.sale.findMany({
            where,
            include: { items: { include: { dish: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(sales);
    } catch (err) { next(err); }
};

// GET /api/sales/:id
exports.getById = async (req, res, next) => {
    try {
        const sale = await prisma.sale.findUnique({
            where: { id: req.params.id },
            include: { items: { include: { dish: true } } },
        });
        if (!sale) return res.status(404).json({ error: 'Sale not found' });
        res.json(sale);
    } catch (err) { next(err); }
};

// POST /api/sales — TRANSACTIONAL SALE + AUTO-DEDUCT
exports.create = async (req, res, next) => {
    try {
        const { items, paymentMethod, remarks } = req.body;
        // items = [{ dishId, quantity }, ...]

        if (!items || !items.length) {
            return res.status(400).json({ error: 'Sale must have at least one item' });
        }

        const result = await prisma.$transaction(async (tx) => {
            // ──────────────────────────────────────────────────
            // 1. Fetch all dishes with their recipes
            // ──────────────────────────────────────────────────
            const dishIds = items.map(i => i.dishId);
            const dishes = await tx.dish.findMany({
                where: { id: { in: dishIds } },
                include: { recipeItems: { include: { ingredient: true } } },
            });

            // Validate all dishes exist
            const dishMap = new Map(dishes.map(d => [d.id, d]));
            for (const item of items) {
                if (!dishMap.has(item.dishId)) {
                    throw new Error(`Dish not found: ${item.dishId}`);
                }
            }

            // ──────────────────────────────────────────────────
            // 2. Calculate total ingredient deductions needed
            // ──────────────────────────────────────────────────
            const deductions = new Map(); // ingredientId -> totalQuantityToDeduct

            for (const item of items) {
                const dish = dishMap.get(item.dishId);
                for (const recipe of dish.recipeItems) {
                    const needed = recipe.quantityNeeded * item.quantity;
                    const current = deductions.get(recipe.ingredientId) || 0;
                    deductions.set(recipe.ingredientId, current + needed);
                }
            }

            // ──────────────────────────────────────────────────
            // 3. Verify sufficient stock for all ingredients
            // ──────────────────────────────────────────────────
            const ingredientIds = Array.from(deductions.keys());
            const ingredients = await tx.ingredient.findMany({
                where: { id: { in: ingredientIds } },
            });
            const ingredientMap = new Map(ingredients.map(i => [i.id, i]));

            const insufficientStock = [];
            for (const [ingredientId, needed] of deductions) {
                const ingredient = ingredientMap.get(ingredientId);
                if (!ingredient) {
                    insufficientStock.push({ ingredientId, reason: 'Ingredient not found' });
                } else if (ingredient.currentStock < needed) {
                    insufficientStock.push({
                        ingredient: ingredient.name,
                        available: ingredient.currentStock,
                        needed,
                        unit: ingredient.unit,
                    });
                }
            }

            if (insufficientStock.length > 0) {
                throw {
                    status: 400,
                    message: 'Insufficient ingredient stock',
                    details: insufficientStock,
                };
            }

            // ──────────────────────────────────────────────────
            // 4. Create the Sale and SaleItems
            // ──────────────────────────────────────────────────
            let totalAmount = 0;
            const saleItemsData = items.map(item => {
                const dish = dishMap.get(item.dishId);
                const subtotal = dish.sellingPrice * item.quantity;
                totalAmount += subtotal;
                return {
                    dishId: item.dishId,
                    quantity: item.quantity,
                    unitPrice: dish.sellingPrice,
                    subtotal,
                };
            });

            const sale = await tx.sale.create({
                data: {
                    totalAmount,
                    paymentMethod: paymentMethod || 'CASH',
                    remarks,
                    items: { create: saleItemsData },
                },
                include: { items: { include: { dish: true } } },
            });

            // ──────────────────────────────────────────────────
            // 5. Deduct ingredients from inventory
            // ──────────────────────────────────────────────────
            for (const [ingredientId, amount] of deductions) {
                await tx.ingredient.update({
                    where: { id: ingredientId },
                    data: { currentStock: { decrement: amount } },
                });
            }

            return sale;
        });

        res.status(201).json(result);
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({ error: err.message, details: err.details });
        }
        next(err);
    }
};
