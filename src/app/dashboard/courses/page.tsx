"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, GraduationCap, PlayCircle, Trash2, RefreshCw, Loader2 } from "lucide-react";

type Enrollment = {
  id: string;
  progress: number;
  enrolledAt: string;
  user: { id: string; name: string; email: string; phone: string | null };
  course: { id: string; title: string; price: number; category: string };
};

export default function CoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    courseName: "Digital Marketing Mastery",
  });

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments");
      if (res.ok) {
        const data = await res.json();
        setEnrollments(data);
      }
    } catch (err) {
      console.error("Failed to fetch enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to enroll student");
        return;
      }
      setEnrollments([data, ...enrollments]);
      setIsModalOpen(false);
      setNewStudent({ name: "", email: "", phone: "", courseName: "Digital Marketing Mastery" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const activeCount = enrollments.filter((e) => e.progress < 100).length;
  const graduatedCount = enrollments.filter((e) => e.progress >= 100).length;
  const uniqueCourses = new Set(enrollments.map((e) => e.course.id)).size;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">LMS Student Management</h1>
          <p className="text-muted-foreground mt-1">Live sync with courses.bitsolmarketing.com</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchEnrollments}
            className="px-3 py-2 rounded-xl glass text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center neon-border-purple"
          >
            <GraduationCap size={16} className="mr-2" />
            Enroll New Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 mr-4">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Courses</p>
            <p className="text-2xl font-bold text-white">{uniqueCourses || 0}</p>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 mr-4">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Students</p>
            <p className="text-2xl font-bold text-white">{activeCount}</p>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400 mr-4">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Graduated</p>
            <p className="text-2xl font-bold text-white">{graduatedCount}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4">Student Enrollments</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Loading enrollments...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <GraduationCap size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No enrollments yet. They will appear here when students sign up from the courses website.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-sm">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {enrollments.map((enrollment) => (
                    <motion.tr
                      key={enrollment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4">
                        <div className="text-white font-medium">{enrollment.user.name}</div>
                        <div className="text-gray-500 text-xs">{enrollment.user.email}</div>
                        {enrollment.user.phone && (
                          <div className="text-gray-600 text-xs">{enrollment.user.phone}</div>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="text-gray-300 text-sm">{enrollment.course.title}</div>
                        <div className="text-gray-600 text-xs">{enrollment.course.category}</div>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden mr-2">
                            <div className="h-full bg-accent" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          enrollment.progress >= 100
                            ? "bg-green-400/10 text-green-400"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {enrollment.progress >= 100 ? "Graduated" : "Enrolled"}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 text-xs">
                        {new Date(enrollment.enrolledAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enroll Student Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 rounded-2xl w-full max-w-md border-accent/30"
            >
              <h2 className="text-xl font-bold text-white mb-4">Enroll New Student</h2>
              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded-lg mb-4">{error}</p>
              )}
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                  <input
                    required
                    type="text"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email Address</label>
                  <input
                    required
                    type="email"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Phone (optional)</label>
                  <input
                    type="tel"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent"
                    placeholder="+92 300 1234567"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Course</label>
                  <input
                    required
                    type="text"
                    value={newStudent.courseName}
                    onChange={(e) => setNewStudent({ ...newStudent, courseName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent"
                    placeholder="e.g. Digital Marketing Mastery"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setError(""); }}
                    className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent/90 transition-colors neon-border-purple disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Grant Access
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
