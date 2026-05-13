"use client";

import { motion } from "framer-motion";
import { HeadphonesIcon, Settings2 } from "lucide-react";

export default function SupportPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)] border border-red-500/20">
        <HeadphonesIcon size={32} className="text-red-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Support & Tickets</h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">Internal ticketing system and live client-support portal mapping is underway.</p>
      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center">
        <Settings2 size={18} className="mr-2" /> System Configuration
      </button>
    </motion.div>
  );
}
