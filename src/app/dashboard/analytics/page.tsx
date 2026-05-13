"use client";

import { motion } from "framer-motion";
import { PieChart, Settings2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] border border-cyan-500/20">
        <PieChart size={32} className="text-cyan-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Global Analytics</h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">Deep neural-network data processing is active. Advanced reporting dashboards will be available shortly.</p>
      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center">
        <Settings2 size={18} className="mr-2" /> System Configuration
      </button>
    </motion.div>
  );
}
