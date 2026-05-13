"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Bot, TrendingUp, Activity, ArrowUpRight, Cpu, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const revenueData = [
  { name: "Jan", value: 4000 }, { name: "Feb", value: 3000 }, { name: "Mar", value: 5000 },
  { name: "Apr", value: 4500 }, { name: "May", value: 6000 }, { name: "Jun", value: 8000 },
  { name: "Jul", value: 7500 },
];

const aiPerformanceData = [
  { name: "Mon", value: 85 }, { name: "Tue", value: 88 }, { name: "Wed", value: 92 },
  { name: "Thu", value: 90 }, { name: "Fri", value: 96 }, { name: "Sat", value: 98 }, { name: "Sun", value: 99 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
};

type Stats = {
  totalLeads: number;
  newLeads: number;
  activeClients: number;
  totalUsers: number;
  recentLeads: Array<{ id: string; name: string; email: string; status: string; createdAt: string }>;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: "Total Leads", value: loading ? "..." : String(stats?.totalLeads ?? 0), change: `${stats?.newLeads ?? 0} new`, icon: TrendingUp, trend: "up" },
    { title: "Active Clients", value: loading ? "..." : String(stats?.activeClients ?? 0), change: "In pipeline", icon: Users, trend: "up" },
    { title: "Registered Users", value: loading ? "..." : String(stats?.totalUsers ?? 0), change: "Total accounts", icon: Bot, trend: "up" },
    { title: "New Leads", value: loading ? "..." : String(stats?.newLeads ?? 0), change: "Awaiting contact", icon: DollarSign, trend: "up" },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">Command Center</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Super Admin. All systems are operating normally.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
            Generate Report
          </button>
          <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center neon-border-blue">
            <Cpu size={16} className="mr-2" />
            Deploy New Bot
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="glass p-6 rounded-2xl relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-primary">
                <stat.icon size={24} />
              </div>
              <div className="flex items-center text-sm font-medium text-green-400">
                <ArrowUpRight size={16} className="mr-1" />
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="text-3xl font-bold text-white tracking-tight">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Growth</h2>
              <p className="text-sm text-gray-400">Monthly AI-driven revenue metrics</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.5 0.25 260)" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="oklch(0.5 0.25 260)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(10,5,20,0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }} itemStyle={{ color: "#fff" }} />
                <Area type="monotone" dataKey="value" stroke="oklch(0.5 0.25 260)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* AI Performance */}
        <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-white flex items-center mb-6">
            <Activity size={18} className="mr-2 text-accent" />
            AI Agent Accuracy
          </h2>
          <div className="h-[200px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aiPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(10,5,20,0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar dataKey="value" fill="oklch(0.6 0.2 300)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 border-t border-white/5 pt-4">
            {[["Sales Agent Bot", "98.5%"], ["Support Bot", "94.2%"], ["Trading Signal Bot", "89.7%"]].map(([label, val]) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm font-medium text-white bg-white/10 px-2 py-1 rounded">{val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Leads */}
      <motion.div variants={itemVariants} className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-6">Recent Leads</h2>
        {loading ? (
          <div className="flex items-center text-gray-400 text-sm"><Loader2 className="w-4 h-4 animate-spin mr-2" />Loading...</div>
        ) : !stats?.recentLeads?.length ? (
          <p className="text-sm text-gray-500">No leads yet. They will appear here once contact forms are submitted.</p>
        ) : (
          <div className="space-y-4">
            {stats.recentLeads.map(lead => (
              <div key={lead.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-white">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded-full">{lead.status}</span>
                  <span className="text-xs text-gray-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
