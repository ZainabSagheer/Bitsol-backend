"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, BookOpen, GraduationCap, PlayCircle, Trash2, Edit } from "lucide-react";

// Mock Data representing data from the Courses DB
const initialStudents = [
  { id: 1, name: "Sarah Connor", email: "sarah@example.com", course: "Digital Marketing Mastery", progress: 85, status: "Enrolled" },
  { id: 2, name: "John Doe", email: "john@example.com", course: "AI Prompt Engineering", progress: 32, status: "Enrolled" },
  { id: 3, name: "Jane Smith", email: "jane@example.com", course: "Trading Fundamentals", progress: 100, status: "Graduated" },
];

export default function CoursesPage() {
  const [students, setStudents] = useState(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", email: "", course: "Digital Marketing Mastery", progress: 0, status: "Enrolled" });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setStudents([{ id: Date.now(), ...newStudent }, ...students]);
    setIsModalOpen(false);
    setNewStudent({ name: "", email: "", course: "Digital Marketing Mastery", progress: 0, status: "Enrolled" });
  };

  const handleRemoveStudent = (id: number) => {
    setStudents(students.filter(s => s.id !== id));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-poppins">LMS Student Management</h1>
          <p className="text-muted-foreground mt-1">Cross-domain sync with courses.bitsolmarketing.com</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center neon-border-purple"
        >
          <GraduationCap size={16} className="mr-2" />
          Enroll New Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 mr-4">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Courses</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400 mr-4">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Active Students</p>
            <p className="text-2xl font-bold text-white">{students.length + 423}</p>
          </div>
        </div>
        <div className="glass p-5 rounded-2xl flex items-center">
          <div className="p-3 bg-green-500/10 rounded-xl text-green-400 mr-4">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Completion Rate</p>
            <p className="text-2xl font-bold text-white">68%</p>
          </div>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl">
        <h2 className="text-lg font-bold text-white mb-4">Student Enrollments</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm">
                <th className="pb-3 font-medium">Student Name</th>
                <th className="pb-3 font-medium">Enrolled Course</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {students.map(student => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="border-b border-white/5 group hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4">
                      <div className="text-white font-medium">{student.name}</div>
                      <div className="text-gray-500 text-xs">{student.email}</div>
                    </td>
                    <td className="py-4 text-gray-300 text-sm">{student.course}</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden mr-2">
                          <div className="h-full bg-accent" style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-400">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === 'Graduated' ? 'bg-green-400/10 text-green-400' : 'bg-primary/10 text-primary'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-md hover:bg-white/10 text-gray-400"><Edit size={16} /></button>
                        <button onClick={() => handleRemoveStudent(student.id)} className="p-1.5 rounded-md hover:bg-destructive/20 text-destructive"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
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
              <form onSubmit={handleAddStudent} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Full Name</label>
                  <input required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email Address (Login ID)</label>
                  <input required type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Select Course</label>
                  <select value={newStudent.course} onChange={e => setNewStudent({...newStudent, course: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-sm outline-none focus:border-accent">
                    <option>Digital Marketing Mastery</option>
                    <option>AI Prompt Engineering</option>
                    <option>Trading Fundamentals</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent/90 transition-colors neon-border-purple">Grant Access</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
