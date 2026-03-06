import {
    Search,
    Bell,
    User,
    MoreHorizontal,
    ArrowUpRight,
    Edit3,
    Trash2,
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

// Dummy data to match the image
const areaData = [
    { name: 'Jan', line1: 20, line2: 30 },
    { name: 'Feb', line1: 30, line2: 40 },
    { name: 'Mar', line1: 60, line2: 45 },
    { name: 'Apr', line1: 45, line2: 65 },
    { name: 'May', line1: 80, line2: 55 },
];

const barData = [
    { name: 'Jan', val1: 100, val2: 200 },
    { name: 'Feb', val1: 300, val2: 150 },
    { name: 'Mar', val1: 450, val2: 500 },
    { name: 'Apr', val1: 200, val2: 400 },
    { name: 'May', val1: 350, val2: 450 },
];

const pieData = [
    { name: 'Real item', value: 65, color: '#00f0ff' },
    { name: 'Hereineainq', value: 35, color: '#a855f7' },
];

const masterRecords = [
    { id: '10001', name: 'Team Name', date: '02/09/2022', status: 'Status', statusColor: 'text-emerald-400 bg-emerald-400/10' },
    { id: '10002', name: 'Team Mlwmer', date: '02/06/2022', status: 'Status', statusColor: 'text-emerald-400 bg-emerald-400/10' },
    { id: '10003', name: 'Aunym John', date: '08/16/2022', status: 'Mew', statusColor: 'text-purple-400 bg-purple-400/10' },
    { id: '10004', name: 'Beem Name', date: '12-06-2023', status: 'Status', statusColor: 'text-emerald-400 bg-emerald-400/10' },
];

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
                        <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full border border-[#0f0c29]"></span>
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
                                <button className="glass px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2">
                                    All <span className="text-[10px]">▼</span>
                                </button>
                                <button className="glass px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white border border-white/10 flex items-center gap-2">
                                    Filters <span className="text-[10px]">▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Top Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Total</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">$12.9B</h3>
                                    <span className="flex items-center text-[10px] font-bold text-cyan-400 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 5.57%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Average</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">$24.6K</h3>
                                    <span className="flex items-center text-[10px] font-bold text-cyan-400 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 29.75%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 mb-1">Earnrange analysis</p>
                                <div className="flex items-end gap-3">
                                    <h3 className="text-2xl font-bold text-white">$1.00%</h3>
                                    <span className="flex items-center text-[10px] font-bold text-cyan-400 mb-1">
                                        <ArrowUpRight size={12} className="mr-0.5" /> 4.58%
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Area */}
                        <div className="flex h-[200px] mt-6 w-full gap-4">
                            {/* Line Chart */}
                            <div className="w-[40%] h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={areaData}>
                                        <defs>
                                            <linearGradient id="colorCyan" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ background: '#1b1236', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        <Area type="monotone" dataKey="line1" stroke="#00f0ff" strokeWidth={2} fill="url(#colorCyan)" />
                                        <Area type="monotone" dataKey="line2" stroke="#a855f7" strokeWidth={2} fill="url(#colorPurple)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Bar Chart */}
                            <div className="w-[35%] h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData}>
                                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip contentStyle={{ background: '#1b1236', border: 'none', borderRadius: '8px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                        <Bar dataKey="val1" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="val2" fill="#a855f7" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Pie Chart & Legend */}
                            <div className="w-[25%] h-full flex flex-col justify-center items-center relative">
                                <div className="h-[120px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={55}
                                                paddingAngle={2}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} style={{ filter: `drop-shadow(0 0 8px ${entry.color})` }} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ background: '#1b1236', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-2 w-full pl-4">
                                    {pieData.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-[10px] mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 5px ${item.color}` }}></span>
                                                <span className="text-slate-300">{item.name}</span>
                                            </div>
                                            <span className="font-medium text-white">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Master Record Table */}
                    <div className="glass-card rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white tracking-wide">Master Record</h2>
                            <button className="bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-900 font-semibold text-xs px-5 py-2 rounded-full hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all">
                                Add New
                            </button>
                        </div>

                        {/* Search & Filters */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative glass rounded-xl px-3 py-1.5 flex items-center w-64 border border-white/5 bg-white/5">
                                <Search size={14} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-xs text-white ml-2 w-full placeholder-slate-500"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="glass px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-white/5 flex items-center gap-2 bg-white/5">
                                    All time by <span className="text-[10px]">▼</span>
                                </button>
                                <button className="glass px-3 py-1.5 rounded-xl text-xs text-slate-300 border border-white/5 flex items-center gap-2 bg-white/5">
                                    Filter <span className="text-[10px]">▼</span>
                                </button>
                            </div>
                        </div>

                        {/* Table */}
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
                                <tbody>
                                    {masterRecords.map((record) => (
                                        <tr key={record.id} className="group">
                                            <td className="px-4 py-3 text-slate-300 bg-white/5 rounded-l-xl border-y border-l border-white/5 group-hover:bg-white/10 transition-colors">
                                                {record.id}
                                            </td>
                                            <td className="px-4 py-3 text-white bg-white/5 border-y border-white/5 group-hover:bg-white/10 transition-colors">
                                                {record.name}
                                            </td>
                                            <td className="px-4 py-3 text-slate-400 bg-white/5 border-y border-white/5 group-hover:bg-white/10 transition-colors">
                                                {record.date}
                                            </td>
                                            <td className="px-4 py-3 bg-white/5 border-y border-white/5 group-hover:bg-white/10 transition-colors">
                                                <span className={`px-3 py-1 text-[10px] font-bold tracking-wider rounded-lg border border-transparent ${record.statusColor}`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 bg-white/5 rounded-r-xl border-y border-r border-white/5 group-hover:bg-white/10 transition-colors text-right">
                                                <div className="flex items-center justify-end gap-3 text-slate-400">
                                                    <button className="hover:text-cyan-400 transition-colors"><Edit3 size={15} /></button>
                                                    <button className="hover:text-rose-400 transition-colors"><Trash2 size={15} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Spans 1) */}
                <div className="space-y-6">

                    {/* Recent Activity */}
                    <div className="glass-card rounded-3xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-medium text-white tracking-wide">Recent Activity</h2>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200">Recent decoded</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">15 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-400/30">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200">idlineo calembir activity</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">11 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-8 w-8 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/30">
                                    <User size={14} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-200">Recent propt inecked</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">11 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="glass-card rounded-3xl p-6 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-4">
                            <h2 className="text-lg font-medium text-white tracking-wide">System Status</h2>
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                        <div className="relative w-40 h-24 overflow-hidden mt-2">
                            {/* Gauge placeholder with CSS */}
                            <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-white/5 border-t-cyan-400 border-r-cyan-400 border-l-cyan-400 rotate-[-45deg] shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]"></div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#fff]"></div>
                            <div className="absolute bottom-2 left-1/2 origin-bottom w-1 h-16 bg-white rotate-[30deg] -translate-x-1/2 -translate-y-full shadow-[0_0_5px_#fff]"></div>
                        </div>
                        <p className="text-sm font-medium text-slate-300 mt-4 tracking-wider">Status</p>
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
                            {[
                                { name: 'Alerisan Anner', role: 'Team Member' },
                                { name: 'Jaam Derner', role: 'Team Member' },
                                { name: 'Jeen Smith', role: 'Team Member' }
                            ].map((user, idx) => (
                                <div key={idx} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="h-10 w-10 rounded-full glass border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-400/50 transition-colors">
                                        <User size={16} className="text-slate-300 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                                        <p className="text-[10px] text-slate-500">{user.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
