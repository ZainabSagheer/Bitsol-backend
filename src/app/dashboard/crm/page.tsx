"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Mail, Edit, Loader2 } from "lucide-react";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  value: number | null;
  notes: string | null;
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-400/10 text-blue-400",
  CONTACTED: "bg-yellow-400/10 text-yellow-400",
  NEGOTIATION: "bg-orange-400/10 text-orange-400",
  CLOSED: "bg-gray-400/10 text-gray-400",
  ACTIVE: "bg-green-400/10 text-green-400",
};

const STATUS_OPTIONS = ["NEW", "CONTACTED", "NEGOTIATION", "ACTIVE", "CLOSED"];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", company: "", status: "NEW", value: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/leads");
      if (res.ok) setLeads(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        const created = await res.json();
        setLeads([created, ...leads]);
        setIsModalOpen(false);
        setNewLead({ name: "", email: "", phone: "", company: "", status: "NEW", value: "", notes: "" });
      }
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  async function deleteLead(id: string) {
    if (!confirm("Delete this lead permanently?")) return;
    const res = await fetch(`/api/crm/leads/${id}`, { method: "DELETE" });
    if (res.ok) setLeads(prev => prev.filter(l => l.id !== id));
  }

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase()) ||
    (l.company ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">Client Relationship Management</h1>
          <p className="text-muted-foreground mt-1">{leads.length} total leads in pipeline</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center neon-border-blue"
        >
          <Plus size={16} className="mr-2" />
          Add New Lead
        </button>
      </div>

      <div className="glass p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(s => (
              <button key={s} onClick={() => setSearch(s === search ? "" : s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${search === s ? "bg-primary text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading leads...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            {leads.length === 0 ? "No leads yet. Contact form submissions will appear here." : "No results found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map(lead => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-white/5 group hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <div className="font-medium text-white">{lead.name}</div>
                        <div className="flex items-center text-gray-500 text-xs mt-0.5">
                          <Mail size={11} className="mr-1" />{lead.email}
                        </div>
                      </td>
                      <td className="py-4 text-gray-300 text-sm">{lead.company || "—"}</td>
                      <td className="py-4">
                        <select
                          value={lead.status}
                          onChange={e => updateStatus(lead.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] ?? "bg-white/10 text-white"}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-[#0a0514] text-white">{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 text-gray-300 text-sm">{lead.value ? `$${lead.value.toLocaleString()}` : "—"}</td>
                      <td className="py-4 text-gray-500 text-xs">{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => deleteLead(lead.id)} className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-2xl w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">Add New Lead</h2>
              <form onSubmit={handleAddLead} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Full Name *</label>
                    <input required type="text" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Email *</label>
                    <input required type="email" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Company</label>
                    <input type="text" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                    <input type="text" value={newLead.phone} onChange={e => setNewLead({...newLead, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Status</label>
                    <select value={newLead.status} onChange={e => setNewLead({...newLead, status: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s} className="bg-[#0a0514]">{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Value ($)</label>
                    <input type="number" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes</label>
                  <textarea rows={2} value={newLead.notes} onChange={e => setNewLead({...newLead, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-primary resize-none" />
                </div>
                <div className="flex justify-end gap-3 mt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                  <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition-colors neon-border-blue disabled:opacity-60">
                    {saving ? "Saving..." : "Save Lead"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
