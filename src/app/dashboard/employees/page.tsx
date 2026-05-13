"use client";

import { motion } from "framer-motion";
import { Briefcase, Settings2 } from "lucide-react";

export default function EmployeesPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 neon-border-blue">
        <Briefcase size={32} className="text-primary" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Employee HR Module</h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">The advanced HR and payroll system is currently being calibrated for optimal quantum processing. Check back soon.</p>
      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center">
        <Settings2 size={18} className="mr-2" /> System Configuration
      </button>
    </motion.div>
  );
}
