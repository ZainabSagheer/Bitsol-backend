"use client";

import { motion } from "framer-motion";
import { Wallet, Settings2 } from "lucide-react";

export default function FinancePage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(234,179,8,0.2)] border border-yellow-500/20">
        <Wallet size={32} className="text-yellow-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">Finance & Billing Hub</h1>
      <p className="text-gray-400 mb-8 max-w-md text-center">Secure payment gateways (Stripe, JazzCash, Easypaisa) are being integrated into the master ledger.</p>
      <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex items-center">
        <Settings2 size={18} className="mr-2" /> System Configuration
      </button>
    </motion.div>
  );
}
