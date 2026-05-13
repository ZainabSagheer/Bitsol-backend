"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { AIChatBot } from "@/components/AIChatBot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Global Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Sidebar />
      
      <div className="flex-1 flex flex-col relative z-10 w-full">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
          {children}
        </main>
      </div>
      
      <AIChatBot />
    </div>
  );
}
