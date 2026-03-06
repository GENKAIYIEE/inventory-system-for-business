// client/src/pages/Dashboard.jsx
// Financial Dashboard — Analytics, Trends, and Recent Transactions

import { useState, useEffect, useCallback } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    PieChart,
    RefreshCw,
    AlertTriangle,
    Receipt,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { analyticsService, saleService } from '../services/api';

export default function Dashboard() {
    const [period, setPeriod] = useState('week');
    const [metrics, setMetrics] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch metrics, trend (7 days), and recent sales in parallel
            const [metricsRes, trendRes, salesRes] = await Promise.all([
                analyticsService.getDashboard(period),
                analyticsService.getSalesTrend(7),
                saleService.getAll(),
            ]);

            setMetrics(metricsRes.data);
            setTrendData(trendRes.data.map(d => ({
                ...d,
                // Format date from YYYY-MM-DD to basic format (e.g., "Mon 12") for the chart
                dateLabel: format(new Date(d.date), 'MMM d'),
            })));
            // Take only the 5 most recent sales
            setRecentSales(salesRes.data.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <div className="flex justify-between">
                    <div className="h-8 w-48 skeleton rounded-lg" />
                    <div className="h-10 w-64 skeleton rounded-xl" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-32 skeleton rounded-2xl glass-card" />
                    ))}
                </div>
                <div className="h-80 skeleton rounded-2xl glass-card" />
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
                        onClick={fetchDashboardData}
                        className="mt-4 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors inline-flex items-center gap-2 text-white"
                    >
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            </div>
        );
    }

    const { grossSales, cogs, wasteLoss, netProfit, profitMargin, totalOrders, lowStockCount } = metrics || {};

    // Analytics Cards Data
    const statCards = [
        {
            title: 'Gross Sales',
            value: `₱${(grossSales || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'emerald',
            trend: '+12.5%', // Placeholder trend
            isPositive: true,
        },
        {
            title: 'Net Profit',
            value: `₱${(netProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: 'cyan',
            subtitle: `Margin: ${profitMargin || 0}%`,
        },
        {
            title: 'Cost of Goods',
            value: `₱${((cogs || 0) + (wasteLoss || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            icon: PieChart,
            color: 'amber',
            subtitle: wasteLoss > 0 ? `Includes ₱${wasteLoss} waste` : 'Raw Ingredients',
        },
        {
            title: 'Total Orders',
            value: totalOrders?.toString() || '0',
            icon: ShoppingCart,
            color: 'blue',
            subtitle: lowStockCount > 0 ? (
                <span className="text-rose-400 flex items-center gap-1">
                    <AlertTriangle size={12} /> {lowStockCount} items low ink
                </span>
            ) : 'Stock levels healthy',
        },
    ];

    return (
        <div className="p-8 pb-20 md:pb-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* ── Header & Filters ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Financial Overview</h1>
                    <p className="text-gray-400 text-sm">Monitor your Carinderia's performance closely.</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-800/80 p-1 rounded-xl border border-white/5 backdrop-blur-md">
                    {['today', 'week', 'month'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all tap-scale ${period === p
                                    ? 'bg-emerald-500/15 text-emerald-400 shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button
                        onClick={fetchDashboardData}
                        className="p-2 ml-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* ── Summary Metrics Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statCards.map((stat, idx) => (
                    <div key={idx} className="glass-card rounded-2xl p-5 relative overflow-hidden group">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity bg-${stat.color}-500 blur-2xl`} />
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-white tracking-tight mb-2">
                                    {stat.value}
                                </h3>
                                {stat.trend ? (
                                    <p className={`text-xs font-medium flex items-center gap-1 ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        {stat.trend} vs last {period}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-500 font-medium">{stat.subtitle}</p>
                                )}
                            </div>
                            <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-400`}>
                                <stat.icon size={22} className="opacity-90" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── Sales Trend Chart (Recharts) ── */}
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">7-Day Sales Trend</h2>
                        <div className="flex items-center gap-3 text-xs font-medium">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                Gross Sales
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[300px] w-full">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="dateLabel"
                                        stroke="rgba(255,255,255,0.2)"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.2)"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(val) => `₱${val}`}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            backdropFilter: 'blur(8px)',
                                            color: '#fff',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                                        }}
                                        itemStyle={{ color: '#34d399', fontWeight: 600 }}
                                        formatter={(value) => [`₱${value.toFixed(2)}`, 'Sales']}
                                        labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="totalSales"
                                        stroke="#34d399"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSales)"
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#34d399', style: { filter: 'drop-shadow(0px 0px 5px rgba(52,211,153,0.8))' } }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                                No sales data available for this period.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Recent Transactions Table ── */}
                <div className="glass-card rounded-2xl flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Receipt size={18} className="text-emerald-400" />
                            Recent Sales
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {recentSales.length > 0 ? (
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-surface-800/50 sticky top-0 backdrop-blur-md">
                                    <tr>
                                        <th className="px-5 py-3 font-medium text-gray-400">Time</th>
                                        <th className="px-5 py-3 font-medium text-gray-400">Items</th>
                                        <th className="px-5 py-3 font-medium text-gray-400 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {recentSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="text-white font-medium">
                                                    {format(new Date(sale.createdAt), 'h:mm a')}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {format(new Date(sale.createdAt), 'MMM d, yyyy')}
                                                </p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-gray-300 truncate max-w-[120px]" title={sale.items.map(i => i.dish.name).join(', ')}>
                                                    {sale.items.length === 1
                                                        ? sale.items[0].dish.name
                                                        : `${sale.items.length} items`}
                                                </p>
                                                <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider ${sale.paymentMethod === 'GCASH' ? 'bg-blue-500/15 text-blue-400' : 'bg-emerald-500/15 text-emerald-400'
                                                    }`}>
                                                    {sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <p className="text-white font-semibold">₱{sale.totalAmount.toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-48 flex flex-col items-center justify-center text-gray-500 p-6 text-center">
                                <Receipt size={32} className="mb-2 opacity-30" />
                                <p className="text-sm">No recent transactions</p>
                            </div>
                        )}
                    </div>
                    {recentSales.length > 0 && (
                        <div className="p-3 border-t border-white/5 text-center">
                            <a href="/pos" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                                View All Transactions &rarr;
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
