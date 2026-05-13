"use client";

import { Bell, Search, Mic, Command } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="h-20 glass-panel border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center w-full max-w-2xl relative">
        <Search className="absolute left-3 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Ask AI or search anything... (Cmd + K)"
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/10 transition-all"
        />
        <div className="absolute right-3 flex items-center space-x-2">
          <Command size={16} className="text-gray-500" />
          <Mic size={16} className="text-gray-500 hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex items-center space-x-6 ml-4">
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium neon-text-blue">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-1"></span>
          AI Agents Active (4)
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 transition-colors border border-white/5"
        >
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0a0514]"></span>
        </motion.button>
      </div>
    </header>
  );
}
