// client/src/components/Layout.jsx
// Shared layout with glassmorphism sidebar navigation

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
        <div className="flex h-screen overflow-hidden text-slate-200">
            {/* Glassmorphism Floating Sidebar */}
            <aside className="w-64 m-4 mr-0 glass-panel flex flex-col z-10 transition-all duration-300">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                        Smart Inventory
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Carinderia Management</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ease-out group ${isActive
                                    ? 'bg-white/10 text-cyan-300 border border-cyan-400/30 glow-cyan'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            <Icon
                                size={20}
                                className="transition-transform duration-300 group-hover:scale-110"
                            />
                            <span className="font-medium tracking-wide">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="p-5 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                            <span className="font-bold text-white">AD</span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white">Admin User</p>
                            <p className="text-xs text-cyan-400 mt-0.5">Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-4 h-full overflow-hidden relative z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen"></div>
                <div className="h-full w-full rounded-3xl overflow-y-auto custom-scrollbar relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
