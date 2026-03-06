import {
    Search,
    Bell,
    User,
    MoreHorizontal,
    ArrowUpRight,
    Edit3,
    Trash2,
    DatabaseBackup
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    return (
        <div className="min-h-full font-sans text-slate-200 space-y-6">

            {/* ── Top Navigation ── */}
            <header className="flex justify-end items-center gap-6 mb-2">
                <div className="relative glass rounded-full px-4 py-2 flex items-center w-64 border border-white/10">
                    <Search size={16} className="text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder-slate-500"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
                        <Bell size={20} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                        <span className="absolute top-1 right-2 w-2 h-2 bg-slate-500/50 rounded-full border border-[#0f0c29]"></span>
                    </button>
                    <button className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center p-[2px]">
                        <div className="h-full w-full rounded-full bg-[#1b1236] flex items-center justify-center">
                            <User size={18} className="text-white" />
                        </div>
                    </button>
                </div>
            </header>

            {/* ── Main Grid Layout ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Left Column (Spans 2) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* Data Analytics Card */}
                    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-medium text-white tracking-wide">Data Analytics</h2>
                            <div className="flex items-center gap-3">
                                <button className="glass px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition-colors">
                                    All <span className="text-[10px]">▼</span>
                                </button>
                                <button className="glass px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2 transition-colors">
                                    Filters <span className="text-[10px]">▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Top Stats - Zeroed Out */}
                        <div className="grid grid-cols-3 gap-4 mb-4 opacity-70">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Total Gross</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">₱0.00</h3>
                                    <span className="flex items-center text-[10px] font-bold text-slate-500 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 0.00%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Total Net</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">₱0.00</h3>
                                    <span className="flex items-center text-[10px] font-bold text-slate-500 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 0.00%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Orders Count</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">0</h3>
                                    <span className="flex items-center text-[10px] font-bold text-slate-500 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 0.00%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Empty Charts Area */}
                        <div className="flex h-[200px] mt-6 w-full items-center justify-center border border-white/5 rounded-2xl bg-white/[0.02]">
                            <div className="text-center flex flex-col items-center opacity-60">
                                <DatabaseBackup size={32} className="text-slate-400 mb-3 opacity-50" />
                                <p className="font-medium tracking-wider text-slate-300">No Analytics Data Yet</p>
                                <p className="text-xs text-slate-500 mt-1 max-w-[250px]">Charts and trends will appear here once the first transaction is made.</p>
                            </div>
                        </div>
                    </div>

                    {/* Master Record Table */}
                    <div className="glass-card rounded-3xl p-6 min-h-[350px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white tracking-wide">Master Record</h2>
                            <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-semibold text-xs px-5 py-2 rounded-full hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
                                Add New Record
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative glass rounded-xl px-3 py-1.5 flex items-center w-64 border border-white/5 bg-white/5">
                                <Search size={14} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search records..."
                                    disabled
                                    className="bg-transparent border-none outline-none text-xs text-white ml-2 w-full placeholder-slate-500 opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="glass px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-white/5 flex items-center gap-2 bg-white/5 opacity-50 cursor-not-allowed cursor-not-allowed">
                                    All time by <span className="text-[10px]">▼</span>
                                </button>
                                <button className="glass px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-white/5 flex items-center gap-2 bg-white/5 opacity-50 cursor-not-allowed">
                                    Filter <span className="text-[10px]">▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Table Empty State */}
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
                                <thead>
                                    <tr className="text-slate-400 text-xs font-medium tracking-wide">
                                        <th className="font-normal pb-2 px-4">ID <span className="text-[9px]">▼</span></th>
                                        <th className="font-normal pb-2 px-4">Name</th>
                                        <th className="font-normal pb-2 px-4 whitespace-nowrap">Date <span className="text-[9px]">▼</span></th>
                                        <th className="font-normal pb-2 px-4">Status</th>
                                        <th className="font-normal pb-2 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="w-full h-40 flex items-center justify-center mt-2 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                            <p className="text-sm text-slate-500 font-medium tracking-widest uppercase">No Records Available</p>
                        </div>
                    </div>
                </div>

                {/* Right Column (Spans 1) */}
                <div className="space-y-6">

                    {/* Recent Activity */}
                    <div className="glass-card rounded-3xl p-6 min-h-[250px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white tracking-wide">Recent Activity</h2>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="h-[120px] flex items-center justify-center">
                            <p className="text-xs text-slate-500 italic opacity-80">No recent activity detected.</p>
                        </div>
                    </div>

                    {/* System Status - Cleaned Up */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-4">
                            <h2 className="text-lg font-medium text-white tracking-wide">System Status</h2>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="relative w-40 h-24 overflow-hidden mt-2 opacity-50">
                            {/* Gauge placeholder with CSS (Set to "0" position) */}
                            <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-white/5 border-t-cyan-400 border-r-cyan-400 border-l-cyan-400 rotate-[-45deg] shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]"></div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
                            {/* Needle pointing at start */}
                            <div className="absolute bottom-2 left-1/2 origin-bottom w-1 h-16 bg-white rotate-[-90deg] -translate-x-1/2 -translate-y-full shadow-[0_0_5px_#fff]"></div>
                        </div>
                        <p className="text-sm font-medium text-slate-300 mt-4 tracking-wider">Awaiting Data</p>
                    </div>

                    {/* Team Members */}
                    <div className="glass-card rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white tracking-wide">Team Members</h2>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            {/* Only the current dummy admin is present */}
                            <div className="flex items-center gap-4 group cursor-pointer opacity-80">
                                <div className="h-10 w-10 rounded-full glass border border-white/10 flex items-center justify-center shrink-0 group-hover:border-purple-400/50 transition-colors bg-gradient-to-tr from-purple-500/20 to-cyan-500/20">
                                    <span className="font-bold text-white text-xs">AD</span>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200 group-hover:text-white transition-colors">Admin User</p>
                                    <p className="text-[10px] text-emerald-400">Owner (Online)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
