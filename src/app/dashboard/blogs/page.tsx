"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Globe, FileText, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  author: { name: string };
  createdAt: string;
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ 
    title: "", 
    slug: "",
    content: "", 
    excerpt: "",
    metaDescription: "",
    coverImage: "",
    tags: "",
    published: false 
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blogs");
    if (res.ok) {
      setBlogs(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : []
    };

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setFormData({ 
        title: "", slug: "", content: "", excerpt: "", metaDescription: "", coverImage: "", tags: "", published: false 
      });
      setIsCreating(false);
      fetchBlogs();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) fetchBlogs();
  };

  const togglePublish = async (blog: Blog) => {
    const res = await fetch(`/api/blogs/${blog.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    if (res.ok) fetchBlogs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Blog Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your website articles</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          {isCreating ? "Cancel" : <><Plus className="h-4 w-4" /> New Post</>}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
            onSubmit={handleSubmit} 
          >
            <div className="space-y-4 rounded-xl border bg-card p-6 shadow-sm mb-6">
              <h2 className="text-xl font-semibold">Create New Post</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter a catchy title..."
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Slug (optional)</label>
                  <input
                    type="text"
                    placeholder="custom-url-slug"
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="AI, Marketing, SEO"
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Excerpt</label>
                  <textarea
                    rows={3}
                    placeholder="Short summary..."
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-foreground/80">Meta Description</label>
                  <textarea
                    rows={3}
                    placeholder="SEO description..."
                    className="w-full rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground/80">Content * (HTML supported)</label>
                <textarea
                  required
                  rows={8}
                  placeholder="<p>Write your amazing content here...</p>"
                  className="w-full font-mono rounded-lg border bg-background/50 p-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-y"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.published ? 'bg-primary' : 'bg-muted'}`}
                  onClick={() => setFormData({ ...formData, published: !formData.published })}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${formData.published ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
                <label className="text-sm font-medium cursor-pointer" onClick={() => setFormData({ ...formData, published: !formData.published })}>
                  Publish immediately
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsCreating(false)} className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-md hover:shadow-lg transition-all">
                  Save Post
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-foreground/70">Article</th>
              <th className="px-6 py-4 font-semibold text-foreground/70">Author</th>
              <th className="px-6 py-4 font-semibold text-foreground/70">Status</th>
              <th className="px-6 py-4 font-semibold text-foreground/70">Date</th>
              <th className="px-6 py-4 font-semibold text-foreground/70 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {blogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <FileText className="h-10 w-10 text-muted-foreground/30" />
                    <p>No blog posts found. Create your first post!</p>
                  </div>
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{blog.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate max-w-[200px]">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                        {blog.author?.name?.charAt(0) || "U"}
                      </div>
                      <span className="text-foreground/80">{blog.author?.name || "Unknown"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => togglePublish(blog)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                        blog.published 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
                      }`}
                    >
                      {blog.published ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                      {blog.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleDelete(blog.id)} className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors" title="Delete Post">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
