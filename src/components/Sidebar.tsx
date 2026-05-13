"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Bot,
  LineChart,
  GraduationCap,
  Wallet,
  Share2,
  PieChart,
  HeadphonesIcon,
  Settings,
  Menu,
  ChevronLeft,
  LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "CRM", href: "/dashboard/crm" },
  { icon: Briefcase, label: "Employees", href: "/dashboard/employees" },
  { icon: Bot, label: "AI Bots", href: "/dashboard/ai" },
  { icon: LineChart, label: "Trading", href: "/dashboard/trading" },
  { icon: GraduationCap, label: "Courses", href: "/dashboard/courses" },
  { icon: Wallet, label: "Finance", href: "/dashboard/finance" },
  { icon: Share2, label: "Marketing", href: "/dashboard/marketing" },
  { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
  { icon: HeadphonesIcon, label: "Support", href: "/dashboard/support" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? "80px" : "280px" }}
      className="h-screen sticky top-0 flex flex-col glass-panel border-r border-white/10 z-20"
    >
      <div className="flex items-center justify-between p-4 h-20 border-b border-white/10">
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center neon-border-blue">
              <span className="text-primary font-bold text-xl">B</span>
            </div>
            <span className="font-poppins font-bold text-white text-lg tracking-wider">BITSOL</span>
          </motion.div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center space-x-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-primary/20 text-primary neon-border-blue" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-primary" : "group-hover:text-primary transition-colors"} />
                {!collapsed && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} p-2 rounded-xl bg-white/5 border border-white/10`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold shrink-0">
            AD
          </div>
          {!collapsed && (
            <div className="flex-col min-w-0">
              <p className="text-sm font-medium text-white">Super Admin</p>
              <p className="text-xs text-green-400 flex items-center">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
                Online
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={`flex items-center ${collapsed ? "justify-center" : "space-x-3"} w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
}
