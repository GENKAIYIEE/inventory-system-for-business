import { useState, useEffect, useCallback } from 'react';
import {
    Plus,
    AlertTriangle,
    PackageSearch,
    RefreshCw,
    Search,
    PackagePlus,
    X
} from 'lucide-react';
import { ingredientService, restockService } from '../services/api';

export default function Inventory() {
    const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    // Form States
    const [addForm, setAddForm] = useState({
        name: '',
        unit: 'kg',
        currentStock: 0,
        lowStockThreshold: 10,
        costPerUnit: 0,
    });

    // For restock, costPerUnit is usually calculated, but we ask for totalCost
    const [restockForm, setRestockForm] = useState({
        quantity: 0,
        totalCost: 0,
        supplier: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchIngredients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await ingredientService.getAll();
            setIngredients(res.data);
        } catch (err) {
            console.error('Failed to fetch ingredients:', err);
            setError('Failed to load raw materials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIngredients();
    }, [fetchIngredients]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await ingredientService.create({
                ...addForm,
                currentStock: parseFloat(addForm.currentStock),
                lowStockThreshold: parseFloat(addForm.lowStockThreshold),
                costPerUnit: parseFloat(addForm.costPerUnit),
            });
            setIsAddModalOpen(false);
            setAddForm({ name: '', unit: 'kg', currentStock: 0, lowStockThreshold: 10, costPerUnit: 0 });
            fetchIngredients();
        } catch (err) {
            console.error('Failed to add ingredient:', err);
            alert('Error adding ingredient. Please check the inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestockSubmit = async (e) => {
        e.preventDefault();
        if (!selectedIngredient) return;
        setIsSubmitting(true);
        try {
            await restockService.create({
                ingredientId: selectedIngredient.id,
                quantity: parseFloat(restockForm.quantity),
                totalCost: parseFloat(restockForm.totalCost),
                supplier: restockForm.supplier,
            });
            setIsRestockModalOpen(false);
            setRestockForm({ quantity: 0, totalCost: 0, supplier: '' });
            setSelectedIngredient(null);
            fetchIngredients();
        } catch (err) {
            console.error('Failed to restock ingredient:', err);
            alert('Error restocking ingredient. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredIngredients = ingredients.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Exclude items with 0 stock if they haven't been set up yet implies checking if currentStock > 0 OR if they are genuinely just out of stock.
    // The requirement says: "excluding items with 0 stock if they haven't been set up yet". We will interpret this as currentStock > 0 to be considered active low stock, or just currentStock < threshold and currentStock !== 0.
    const lowStockItems = ingredients.filter(
        i => i.currentStock < i.lowStockThreshold && i.currentStock > 0
    );

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="h-8 w-48 skeleton rounded-lg" />
                    <div className="h-10 w-32 skeleton rounded-xl" />
                </div>
                <div className="h-64 skeleton rounded-2xl glass-card" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-center bg-rose-500/5 border border-rose-500/10 p-8 rounded-2xl max-w-md">
                    <AlertTriangle size={36} className="text-rose-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{error}</h3>
                    <button
                        onClick={fetchIngredients}
                        className="mt-4 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2 text-white"
                    >
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative">

            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Raw Inventory</h1>
                    <p className="text-gray-400 text-sm">Manage your raw materials and stock levels.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors z-10" size={16} />
                        <input
                            type="text"
                            placeholder="Search ingredients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-surface-800/50 border border-white/5 text-white text-sm rounded-xl focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 block w-full pl-9 pr-4 py-2.5 placeholder-gray-500 transition-all backdrop-blur-md"
                        />
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all tap-scale inline-flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">Add New Ingredient</span>
                    </button>
                </div>
            </div>

            {/* ── Low Stock Alert Banner ── */}
            {lowStockItems.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start gap-3 w-full animate-in slide-in-from-top-4">
                    <AlertTriangle className="text-rose-400 shrink-0 mt-0.5" size={20} />
                    <div>
                        <h4 className="text-rose-400 font-semibold text-sm">Low Stock Alert</h4>
                        <p className="text-rose-400/80 text-xs mt-1">
                            {lowStockItems.length} ingredient{lowStockItems.length > 1 ? 's are' : ' is'} running low. Please consider restocking soon to avoid menu unavailability.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Main Content Area ── */}
            {ingredients.length === 0 ? (
                /* Empty State */
                <div className="glass-card rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-white/5 min-h-[400px]">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                        <PackageSearch className="text-emerald-400" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Ingredients Found</h3>
                    <p className="text-gray-400 max-w-sm mb-8">
                        Your inventory is currently empty. Start by adding your first raw material to track your costs and stock.
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-6 py-3 bg-white hover:bg-gray-100 text-surface-950 rounded-xl font-semibold transition-all tap-scale inline-flex items-center gap-2 shadow-lg"
                    >
                        <Plus size={18} />
                        Add First Ingredient
                    </button>
                </div>
            ) : (
                /* Data Table */
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-surface-800/80 backdrop-blur-md border-b border-white/5">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Target Level</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Cost/Unit</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300">Current Stock</th>
                                    <th className="px-6 py-4 font-semibold text-gray-300 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredIngredients.map((item) => {
                                    const isLow = item.currentStock < item.lowStockThreshold && item.currentStock > 0;
                                    const isOut = item.currentStock <= 0;

                                    return (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isOut ? 'bg-surface-800 text-gray-500' : isLow ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                        <PackageSearch size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="text-white font-medium">{item.name}</p>
                                                        {item.category && <p className="text-xs text-gray-500">{item.category.name}</p>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-gray-400">
                                                    {item.lowStockThreshold} {item.unit}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                ₱{item.costPerUnit.toFixed(2)} <span className="text-gray-500 text-xs">/ {item.unit}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${isOut ? 'text-gray-500' : isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                        {item.currentStock.toFixed(2)} {item.unit}
                                                    </span>
                                                    {isLow && <AlertTriangle size={14} className="text-rose-400" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => {
                                                        setSelectedIngredient(item);
                                                        setIsRestockModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                                                >
                                                    <PackagePlus size={14} />
                                                    Restock
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredIngredients.length === 0 && ingredients.length > 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            No ingredients match your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── Add Ingredient Modal ── */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-surface-800/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Plus size={18} className="text-emerald-400" /> Add Raw Material
                            </h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Ingredient Name</label>
                                <input
                                    required
                                    type="text"
                                    value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="e.g. Rice, Chicken, Garlic"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Unit</label>
                                    <input
                                        required
                                        type="text"
                                        value={addForm.unit}
                                        onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                                        className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="kg, pcs, L"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Cost per Unit (₱)</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addForm.costPerUnit}
                                        onChange={(e) => setAddForm({ ...addForm, costPerUnit: e.target.value })}
                                        className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Initial Stock</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addForm.currentStock}
                                        onChange={(e) => setAddForm({ ...addForm, currentStock: e.target.value })}
                                        className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Low Stock Alert</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={addForm.lowStockThreshold}
                                        onChange={(e) => setAddForm({ ...addForm, lowStockThreshold: e.target.value })}
                                        className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save Ingredient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── Restock Modal ── */}
            {isRestockModalOpen && selectedIngredient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-surface-900 border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="flex items-center justify-between p-5 border-b border-white/5 bg-surface-800/50">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <PackagePlus size={18} className="text-indigo-400" /> Restock Item
                            </h3>
                            <button onClick={() => { setIsRestockModalOpen(false); setSelectedIngredient(null); }} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleRestockSubmit} className="p-5 space-y-4">
                            <div className="bg-surface-800/50 p-3 rounded-xl border border-white/5 mb-2">
                                <p className="text-xs text-gray-500">Restocking</p>
                                <p className="text-sm font-semibold text-white">{selectedIngredient.name}</p>
                                <p className="text-xs text-gray-400 mt-1">Current Stock: <span className="text-emerald-400">{selectedIngredient.currentStock} {selectedIngredient.unit}</span></p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Quantity Added ({selectedIngredient.unit})</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={restockForm.quantity}
                                    onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                                    className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Amount received..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Total Cost (₱)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={restockForm.totalCost}
                                    onChange={(e) => setRestockForm({ ...restockForm, totalCost: e.target.value })}
                                    className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Total price paid..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5">Supplier / Source (Optional)</label>
                                <input
                                    type="text"
                                    value={restockForm.supplier}
                                    onChange={(e) => setRestockForm({ ...restockForm, supplier: e.target.value })}
                                    className="w-full bg-surface-800 border border-white/5 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="Where did you buy it?"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsRestockModalOpen(false); setSelectedIngredient(null); }}
                                    className="flex-1 px-4 py-2.5 bg-surface-800 hover:bg-surface-700 text-white rounded-xl text-sm font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 cursor-pointer"
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Restock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
