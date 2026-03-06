// server/src/controllers/analytics.controller.js
const prisma = require('../lib/prisma');

// GET /api/analytics/dashboard?period=today|week|month
exports.getDashboard = async (req, res, next) => {
    try {
        const { period = 'today' } = req.query;
        const now = new Date();
        let startDate;

        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'today':
            default:
                startDate = new Date(now);
                startDate.setHours(0, 0, 0, 0);
                break;
        }

        const dateFilter = { createdAt: { gte: startDate, lte: now } };

        // ── Gross Sales ──
        const sales = await prisma.sale.findMany({
            where: dateFilter,
            include: { items: { include: { dish: { include: { recipeItems: true } } } } },
        });
        const grossSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
        const totalOrders = sales.length;

        // ── COGS (Cost of Goods Sold) ──
        // For each sale item, calculate ingredient cost
        let cogs = 0;
        for (const sale of sales) {
            for (const item of sale.items) {
                for (const recipe of item.dish.recipeItems) {
                    const ingredient = await prisma.ingredient.findUnique({
                        where: { id: recipe.ingredientId },
                    });
                    if (ingredient) {
                        cogs += recipe.quantityNeeded * item.quantity * ingredient.costPerUnit;
                    }
                }
            }
        }

        // ── Expenses (Restocking) ──
        const restocks = await prisma.restockLog.findMany({ where: dateFilter });
        const totalExpenses = restocks.reduce((sum, r) => sum + r.totalCost, 0);

        // ── Waste Loss ──
        const wasteLogs = await prisma.wasteLog.findMany({
            where: dateFilter,
            include: { ingredient: true },
        });
        const wasteLoss = wasteLogs.reduce((sum, w) => sum + (w.quantity * w.ingredient.costPerUnit), 0);

        // ── Net Profit ──
        const netProfit = grossSales - cogs - wasteLoss;

        // ── Low Stock Count ──
        const allIngredients = await prisma.ingredient.findMany();
        const lowStockCount = allIngredients.filter(i => i.currentStock <= i.lowStockThreshold).length;

        res.json({
            period,
            grossSales,
            cogs,
            totalExpenses,
            wasteLoss,
            netProfit,
            totalOrders,
            lowStockCount,
            profitMargin: grossSales > 0 ? ((netProfit / grossSales) * 100).toFixed(2) : 0,
        });
    } catch (err) { next(err); }
};

// GET /api/analytics/sales-trend?days=7
exports.getSalesTrend = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const trend = [];

        for (let i = days - 1; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const sales = await prisma.sale.findMany({
                where: { createdAt: { gte: dayStart, lte: dayEnd } },
            });

            trend.push({
                date: dayStart.toISOString().split('T')[0],
                totalSales: sales.reduce((sum, s) => sum + s.totalAmount, 0),
                orderCount: sales.length,
            });
        }

        res.json(trend);
    } catch (err) { next(err); }
};
