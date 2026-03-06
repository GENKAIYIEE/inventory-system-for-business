// client/src/components/Cart.jsx
// Sidebar cart panel for the POS screen

import { useState } from 'react';
import {
    Minus,
    Plus,
    Trash2,
    ShoppingBag,
    CreditCard,
    Smartphone,
    CheckCircle,
    AlertTriangle,
    X,
    Loader2,
} from 'lucide-react';
import { saleService } from '../services/api';

export default function Cart({ items, onUpdateQty, onRemove, onClear }) {
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [isProcessing, setIsProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const subtotal = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const showToast = (type, message, details = null) => {
        setToast({ type, message, details });
        setTimeout(() => setToast(null), 4000);
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setIsProcessing(true);

        try {
            const payload = {
                items: items.map(item => ({ dishId: item.id, quantity: item.quantity })),
                paymentMethod,
            };

            await saleService.create(payload);
            showToast('success', 'Order placed successfully!');
            onClear();
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData?.details) {
                const shortages = errorData.details.map(
                    d => `${d.ingredient}: need ${d.needed}${d.unit}, only ${d.available}${d.unit}`
                );
                showToast('error', 'Insufficient ingredients', shortages);
            } else {
                showToast('error', errorData?.error || 'Checkout failed');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface-800/50 backdrop-blur-md border-l border-white/5">
            {/* ── Header ── */}
            <div className="p-5 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <ShoppingBag size={18} className="text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Current Order</h3>
                            <p className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={onClear}
                            className="text-xs text-gray-500 hover:text-rose-400 transition-colors px-2 py-1 rounded-md hover:bg-rose-500/10"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* ── Cart Items ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                        <ShoppingBag size={40} strokeWidth={1} className="mb-3 opacity-40" />
                        <p className="text-sm">No items yet</p>
                        <p className="text-xs mt-1">Tap a dish to add it</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div
                            key={item.id}
                            className="glass-card rounded-xl p-3.5 group hover:border-white/12 transition-all duration-200"
                        >
                            <div className="flex items-start justify-between mb-2.5">
                                <div className="flex-1 min-w-0 pr-2">
                                    <p className="text-sm font-medium text-white truncate">{item.name}</p>
                                    <p className="text-xs text-emerald-400 mt-0.5">₱{item.sellingPrice.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => onRemove(item.id)}
                                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-400 transition-all p-1 rounded-md hover:bg-rose-500/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all tap-scale tap-highlight"
                                    >
                                        <Minus size={13} />
                                    </button>
                                    <span className="w-8 text-center text-sm font-semibold text-white tabular-nums">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                                        className="w-7 h-7 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-all tap-scale tap-highlight"
                                    >
                                        <Plus size={13} />
                                    </button>
                                </div>
                                <p className="text-sm font-semibold text-white tabular-nums">
                                    ₱{(item.sellingPrice * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* ── Payment Method ── */}
            <div className="px-4 py-3 border-t border-white/5">
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Payment</p>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: 'CASH', label: 'Cash', Icon: CreditCard },
                        { value: 'GCASH', label: 'GCash', Icon: Smartphone },
                        { value: 'OTHER', label: 'Other', Icon: CreditCard },
                    ].map(({ value, label, Icon }) => (
                        <button
                            key={value}
                            onClick={() => setPaymentMethod(value)}
                            className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 tap-scale tap-highlight ${paymentMethod === value
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 glow-green'
                                    : 'bg-white/3 text-gray-500 hover:bg-white/6 hover:text-gray-300 border border-transparent'
                                }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Totals & Checkout ── */}
            <div className="p-4 border-t border-white/5 space-y-3">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-gray-300 tabular-nums">₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-white">Total</span>
                        <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
                            ₱{subtotal.toFixed(2)}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={items.length === 0 || isProcessing}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 tap-scale tap-highlight flex items-center justify-center gap-2 ${items.length === 0
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : isProcessing
                                ? 'bg-emerald-500/20 text-emerald-400 cursor-wait'
                                : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:from-emerald-400 hover:to-cyan-400 glow-green shadow-lg shadow-emerald-500/20'
                        }`}
                >
                    {isProcessing ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle size={16} />
                            Place Order — ₱{subtotal.toFixed(2)}
                        </>
                    )}
                </button>
            </div>

            {/* ── Toast Notification ── */}
            {toast && (
                <div
                    className={`absolute bottom-24 left-4 right-4 rounded-xl p-4 shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 z-50 ${toast.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        }`}
                >
                    <div className="flex items-start gap-2.5">
                        {toast.type === 'success' ? (
                            <CheckCircle size={18} className="shrink-0 mt-0.5" />
                        ) : (
                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{toast.message}</p>
                            {toast.details && (
                                <ul className="mt-1.5 space-y-0.5">
                                    {toast.details.map((d, i) => (
                                        <li key={i} className="text-xs opacity-80">• {d}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button onClick={() => setToast(null)} className="shrink-0">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
