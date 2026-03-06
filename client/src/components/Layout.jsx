// client/src/components/Layout.jsx
// Shared layout with sidebar navigation

import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    UtensilsCrossed,
    PackagePlus,
    Trash2,
} from 'lucide-react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pos', icon: ShoppingCart, label: 'POS' },
    { to: '/inventory', icon: Package, label: 'Inventory' },
    { to: '/dishes', icon: UtensilsCrossed, label: 'Dishes' },
    { to: '/restock', icon: PackagePlus, label: 'Restock' },
    { to: '/waste', icon: Trash2, label: 'Waste Log' },
];

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Smart Inventory
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Carinderia Management</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <p className="text-xs text-gray-600 text-center">v1.0.0</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
