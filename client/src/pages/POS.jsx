// client/src/pages/POS.jsx
// Point of Sale screen — touch-friendly dish grid + cart sidebar

import { useState, useEffect, useCallback } from 'react';
import {
    Search,
    UtensilsCrossed,
    Loader2,
    WifiOff,
    RefreshCw,
} from 'lucide-react';
import { dishService } from '../services/api';
import Cart from '../components/Cart';

export default function POS() {
    const [dishes, setDishes] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch dishes ──
    const fetchDishes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await dishService.getAll();
            setDishes(data);
        } catch (err) {
            setError('Unable to load menu. Please check your connection.');
            console.error('Failed to fetch dishes:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchDishes(); }, [fetchDishes]);

    // ── Cart operations ──
    const addToCart = useCallback((dish) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === dish.id);
            if (existing) {
                return prev.map(item =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { id: dish.id, name: dish.name, sellingPrice: dish.sellingPrice, quantity: 1 }];
        });
    }, []);

    const updateQty = useCallback((id, newQty) => {
        if (newQty <= 0) {
            setCartItems(prev => prev.filter(item => item.id !== id));
        } else {
            setCartItems(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: newQty } : item
            ));
        }
    }, []);

    const removeFromCart = useCallback((id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    // ── Derived data ──
    const categories = ['all', ...new Set(dishes.map(d => d.category?.name).filter(Boolean))];

    const filteredDishes = dishes.filter(dish => {
        if (!dish.isAvailable) return false;
        const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'all' || dish.category?.name === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const getItemQtyInCart = (dishId) => {
        const item = cartItems.find(i => i.id === dishId);
        return item ? item.quantity : 0;
    };

    // ── Loading skeleton ──
    if (isLoading) {
        return (
            <div className="flex h-full">
                <div className="flex-1 p-6">
                    <div className="h-10 w-64 skeleton rounded-xl mb-6" />
                    <div className="h-10 w-full skeleton rounded-xl mb-6" />
                    <div className="pos-grid">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="h-40 skeleton rounded-2xl" />
                        ))}
                    </div>
                </div>
                <div className="w-96 skeleton" />
            </div>
        );
    }

    // ── Error state ──
    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                        <WifiOff size={28} className="text-rose-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs">{error}</p>
                    <button
                        onClick={fetchDishes}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-all tap-scale"
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full">
            {/* ════════════════════════════════════════════════════ */}
            {/* LEFT PANEL — Menu Grid                              */}
            {/* ════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* ── Header ── */}
                <div className="p-5 pb-0">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-xl font-bold text-white">Point of Sale</h2>
                            <p className="text-xs text-gray-500 mt-0.5">{dishes.length} dishes available</p>
                        </div>
                        <button
                            onClick={fetchDishes}
                            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all tap-scale"
                            title="Refresh menu"
                        >
                            <RefreshCw size={15} />
                        </button>
                    </div>

                    {/* ── Search Bar ── */}
                    <div className="relative mb-4">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search dishes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder-gray-600 outline-none focus:border-emerald-500/30 focus:bg-white/6 transition-all duration-200"
                        />
                    </div>

                    {/* ── Category Tabs ── */}
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 tap-scale tap-highlight ${activeCategory === cat
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-white/4 text-gray-500 hover:bg-white/8 hover:text-gray-300 border border-transparent'
                                    }`}
                            >
                                {cat === 'all' ? 'All Dishes' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Dish Grid ── */}
                <div className="flex-1 overflow-y-auto px-5 pb-5">
                    {filteredDishes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                            <UtensilsCrossed size={36} strokeWidth={1} className="mb-3 opacity-40" />
                            <p className="text-sm">No dishes found</p>
                            {searchQuery && (
                                <p className="text-xs mt-1">Try a different search term</p>
                            )}
                        </div>
                    ) : (
                        <div className="pos-grid">
                            {filteredDishes.map(dish => {
                                const qtyInCart = getItemQtyInCart(dish.id);
                                return (
                                    <button
                                        key={dish.id}
                                        onClick={() => addToCart(dish)}
                                        className={`relative group rounded-2xl p-4 text-left transition-all duration-200 tap-scale tap-highlight ${qtyInCart > 0
                                                ? 'glass-card border-emerald-500/25 glow-green'
                                                : 'glass-card hover:border-white/12 hover:bg-white/6'
                                            }`}
                                    >
                                        {/* Dish Icon / Placeholder */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-200 ${qtyInCart > 0
                                                ? 'bg-emerald-500/15'
                                                : 'bg-white/5 group-hover:bg-white/8'
                                            }`}>
                                            <UtensilsCrossed
                                                size={20}
                                                className={`transition-colors duration-200 ${qtyInCart > 0 ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'
                                                    }`}
                                            />
                                        </div>

                                        {/* Name */}
                                        <p className="text-sm font-medium text-white mb-1 leading-tight">
                                            {dish.name}
                                        </p>

                                        {/* Category */}
                                        {dish.category && (
                                            <p className="text-[10px] text-gray-600 mb-2.5 uppercase tracking-wider">
                                                {dish.category.name}
                                            </p>
                                        )}

                                        {/* Price */}
                                        <p className={`text-base font-bold tabular-nums ${qtyInCart > 0
                                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'
                                                : 'text-gray-300'
                                            }`}>
                                            ₱{dish.sellingPrice.toFixed(2)}
                                        </p>

                                        {/* Quantity Badge */}
                                        {qtyInCart > 0 && (
                                            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                                <span className="text-[10px] font-bold text-white">{qtyInCart}</span>
                                            </div>
                                        )}

                                        {/* Hover Add Indicator */}
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                                                <span className="text-emerald-400 text-lg leading-none">+</span>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════════════ */}
            {/* RIGHT PANEL — Cart Sidebar                          */}
            {/* ════════════════════════════════════════════════════ */}
            <div className="w-96 shrink-0 relative">
                <Cart
                    items={cartItems}
                    onUpdateQty={updateQty}
                    onRemove={removeFromCart}
                    onClear={clearCart}
                />
            </div>
        </div>
    );
}
