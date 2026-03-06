// prisma/seed.js
// Seeds the database with sample Carinderia data for development

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // ── Categories ──
    const meatsCat = await prisma.category.create({ data: { name: 'Meats', type: 'INGREDIENT' } });
    const veggiesCat = await prisma.category.create({ data: { name: 'Vegetables', type: 'INGREDIENT' } });
    const condimentsCat = await prisma.category.create({ data: { name: 'Condiments & Spices', type: 'INGREDIENT' } });
    const staplesCat = await prisma.category.create({ data: { name: 'Staples', type: 'INGREDIENT' } });
    const riceMealsCat = await prisma.category.create({ data: { name: 'Rice Meals', type: 'DISH' } });
    const soupsCat = await prisma.category.create({ data: { name: 'Soups & Stews', type: 'DISH' } });

    // ── Ingredients ──
    const pork = await prisma.ingredient.create({
        data: { name: 'Pork Belly', unit: 'g', currentStock: 5000, lowStockThreshold: 1000, costPerUnit: 0.35, categoryId: meatsCat.id },
    });
    const chicken = await prisma.ingredient.create({
        data: { name: 'Chicken', unit: 'g', currentStock: 4000, lowStockThreshold: 800, costPerUnit: 0.25, categoryId: meatsCat.id },
    });
    const rice = await prisma.ingredient.create({
        data: { name: 'Rice', unit: 'g', currentStock: 10000, lowStockThreshold: 2000, costPerUnit: 0.05, categoryId: staplesCat.id },
    });
    const soySauce = await prisma.ingredient.create({
        data: { name: 'Soy Sauce', unit: 'ml', currentStock: 2000, lowStockThreshold: 500, costPerUnit: 0.08, categoryId: condimentsCat.id },
    });
    const vinegar = await prisma.ingredient.create({
        data: { name: 'Vinegar', unit: 'ml', currentStock: 2000, lowStockThreshold: 500, costPerUnit: 0.05, categoryId: condimentsCat.id },
    });
    const garlic = await prisma.ingredient.create({
        data: { name: 'Garlic', unit: 'g', currentStock: 500, lowStockThreshold: 100, costPerUnit: 0.15, categoryId: veggiesCat.id },
    });
    const onion = await prisma.ingredient.create({
        data: { name: 'Onion', unit: 'g', currentStock: 1000, lowStockThreshold: 200, costPerUnit: 0.10, categoryId: veggiesCat.id },
    });
    const tomato = await prisma.ingredient.create({
        data: { name: 'Tomato', unit: 'g', currentStock: 800, lowStockThreshold: 200, costPerUnit: 0.12, categoryId: veggiesCat.id },
    });
    const oil = await prisma.ingredient.create({
        data: { name: 'Cooking Oil', unit: 'ml', currentStock: 3000, lowStockThreshold: 500, costPerUnit: 0.06, categoryId: condimentsCat.id },
    });

    // ── Dishes ──
    const adobo = await prisma.dish.create({
        data: { name: 'Pork Adobo', sellingPrice: 75, categoryId: riceMealsCat.id },
    });
    const sinigang = await prisma.dish.create({
        data: { name: 'Sinigang na Baboy', sellingPrice: 85, categoryId: soupsCat.id },
    });
    const tinola = await prisma.dish.create({
        data: { name: 'Chicken Tinola', sellingPrice: 70, categoryId: soupsCat.id },
    });

    // ── Recipe Mappings ──
    // Pork Adobo: 200g pork, 30ml soy sauce, 20ml vinegar, 10g garlic, 15ml oil
    await prisma.recipeItem.createMany({
        data: [
            { dishId: adobo.id, ingredientId: pork.id, quantityNeeded: 200 },
            { dishId: adobo.id, ingredientId: soySauce.id, quantityNeeded: 30 },
            { dishId: adobo.id, ingredientId: vinegar.id, quantityNeeded: 20 },
            { dishId: adobo.id, ingredientId: garlic.id, quantityNeeded: 10 },
            { dishId: adobo.id, ingredientId: oil.id, quantityNeeded: 15 },
        ],
    });

    // Sinigang na Baboy: 250g pork, 50g tomato, 30g onion, 20ml oil
    await prisma.recipeItem.createMany({
        data: [
            { dishId: sinigang.id, ingredientId: pork.id, quantityNeeded: 250 },
            { dishId: sinigang.id, ingredientId: tomato.id, quantityNeeded: 50 },
            { dishId: sinigang.id, ingredientId: onion.id, quantityNeeded: 30 },
            { dishId: sinigang.id, ingredientId: oil.id, quantityNeeded: 20 },
        ],
    });

    // Chicken Tinola: 250g chicken, 20g garlic, 30g onion, 15ml oil
    await prisma.recipeItem.createMany({
        data: [
            { dishId: tinola.id, ingredientId: chicken.id, quantityNeeded: 250 },
            { dishId: tinola.id, ingredientId: garlic.id, quantityNeeded: 20 },
            { dishId: tinola.id, ingredientId: onion.id, quantityNeeded: 30 },
            { dishId: tinola.id, ingredientId: oil.id, quantityNeeded: 15 },
        ],
    });

    console.log('✅ Seed completed!');
    console.log(`   ${3} categories (ingredients), ${2} categories (dishes)`);
    console.log(`   ${9} ingredients, ${3} dishes, ${13} recipe items`);
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
