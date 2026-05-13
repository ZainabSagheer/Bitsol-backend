"use client";

import { motion } from "framer-motion";
import { Bot, Plus, Settings2, Power, BrainCircuit, MessageSquare, Image as ImageIcon, Video } from "lucide-react";

const aiAgents = [
  { name: "Alpha Sales Negotiator", type: "Sales Agent", status: "Active", calls: "1,245", efficiency: "98%", icon: MessageSquare, color: "text-blue-400" },
  { name: "Support Guardian", type: "Customer Service", status: "Active", calls: "8,932", efficiency: "94%", icon: BrainCircuit, color: "text-purple-400" },
  { name: "Content Creator V2", type: "Social Media", status: "Training", calls: "N/A", efficiency: "N/A", icon: ImageIcon, color: "text-pink-400" },
  { name: "DeepFake Video Gen", type: "Marketing", status: "Offline", calls: "0", efficiency: "0%", icon: Video, color: "text-gray-400" },
];

export default function AIBotsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">AI Automation Center</h1>
          <p className="text-muted-foreground mt-1">Manage and train your neural network agents</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center neon-border-blue">
          <Plus size={16} className="mr-2" />
          Train New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {aiAgents.map((agent, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group"
          >
            {agent.status === "Active" && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
            )}
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 border border-white/10 ${agent.color}`}>
                <agent.icon size={24} />
              </div>
              <div className="flex space-x-2">
                <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 transition-colors">
                  <Settings2 size={16} />
                </button>
                <button className={`p-1.5 rounded-lg transition-colors ${agent.status === "Active" ? "text-green-400 hover:bg-green-400/10" : "text-gray-500 hover:bg-white/10"}`}>
                  <Power size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1">{agent.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{agent.type}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${
                  agent.status === 'Active' ? 'text-green-400' : 
                  agent.status === 'Training' ? 'text-yellow-400' : 'text-gray-500'
                }`}>{agent.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Interactions</span>
                <span className="text-white">{agent.calls}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Efficiency</span>
                <span className="text-white">{agent.efficiency}</span>
              </div>
            </div>

            {agent.status === "Active" && (
              <div className="mt-6">
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "98%" }}
                    transition={{ duration: 1.5, delay: 0.2 }}
                    className="h-full bg-primary"
                  />
                </div>
                <p className="text-xs text-right text-primary mt-2">Neural Link Optimal</p>
              </div>
            )}
            {agent.status === "Training" && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
