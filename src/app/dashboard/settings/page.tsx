"use client";

import { motion } from "framer-motion";
import { Settings, ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-gray-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(156,163,175,0.2)] border border-gray-500/20">
        <Settings size={32} className="text-gray-400 animate-spin-slow" style={{ animationDuration: '4s' }} />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">System Preferences</h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">Master configurations, API keys, and global security protocols are heavily restricted during active development.</p>
      <button className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors flex items-center neon-border-blue">
        <ShieldCheck size={18} className="mr-2" /> Authenticate Access
      </button>
    </motion.div>
  );
}
