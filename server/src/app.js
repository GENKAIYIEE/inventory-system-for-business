// server/src/app.js
// Express application setup — middleware, routes, error handling

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ─── Global Middleware ────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ───────────────────────────────────────────
const ingredientRoutes = require('./routes/ingredient.routes');
const dishRoutes = require('./routes/dish.routes');
const recipeRoutes = require('./routes/recipe.routes');
const saleRoutes = require('./routes/sale.routes');
const restockRoutes = require('./routes/restock.routes');
const wasteRoutes = require('./routes/waste.routes');
const analyticsRoutes = require('./routes/analytics.routes');

app.use('/api/ingredients', ingredientRoutes);
app.use('/api/dishes', dishRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/restocks', restockRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/analytics', analyticsRoutes);

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
});

module.exports = app;
