import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, Eye, Edit2, X, CheckCircle } from 'lucide-react';

// ─── Blog Form (Create / Edit) ────────────────────────────────────────────────
function BlogForm({ token, existing, onDone }: { token: string; existing?: any; onDone: () => void }) {
  const [form, setForm] = useState({
    title: existing?.title || '',
    slug: existing?.slug || '',
    excerpt: existing?.excerpt || '',
    meta_description: existing?.meta_description || '',
    author: existing?.author || 'Admin',
    status: existing?.status || 'published',
    content: existing?.content || '',
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleTitleChange = (v: string) => {
    setForm(f => ({ ...f, title: v, slug: f.slug || autoSlug(v) }));
  };

  const save = async () => {
    if (!form.title || !form.content) return alert('Title and Content are required.');
    setSaving(true);
    const url = existing ? `/api/admin/blogs/${existing.id}` : '/api/admin/blogs';
    const method = existing ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onDone(); }, 1200);
    }
  };

  const fieldClass = "w-full px-3.5 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-white";

  return (
    <div className="space-y-5 bg-white border rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">{existing ? '✏️ Edit Blog' : '✍️ Write New Blog'}</h2>

      {/* SEO Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700 space-y-1">
        <p className="font-semibold">📌 SEO Checklist — Fill all fields for best ranking</p>
        <ul className="list-disc ml-4 space-y-0.5 text-xs text-blue-600">
          <li>Title — use your main keyword (50-60 chars)</li>
          <li>Slug — short, lowercase, hyphenated URL</li>
          <li>Excerpt — short summary shown in Google results (120-160 chars)</li>
          <li>Meta Description — what Google shows under the title (150-160 chars)</li>
          <li>Content — use &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; HTML tags</li>
        </ul>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Title *</label>
          <input className={fieldClass} value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="How to Convert PDF to Excel in Seconds" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">URL Slug *</label>
          <input className={fieldClass} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="how-to-convert-pdf-to-excel" />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600">Excerpt (shown in blog list) *</label>
        <textarea className={fieldClass} rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="A short summary that appears on the blog listing page and in social shares (120-160 chars)" />
        <p className="text-xs text-gray-400">{form.excerpt.length}/160 chars</p>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600">Meta Description (for Google) *</label>
        <textarea className={fieldClass} rows={2} value={form.meta_description} onChange={e => setForm(f => ({ ...f, meta_description: e.target.value }))} placeholder="Describe this page for Google Search results. Include your main keyword. (150-160 chars)" />
        <p className="text-xs text-gray-400">{form.meta_description.length}/160 chars</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Author</label>
          <input className={fieldClass} value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} placeholder="Admin" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-600">Status</label>
          <select className={fieldClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="published">Published (Visible to all)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-600">Content (HTML) *</label>
        <p className="text-xs text-gray-400">Write full HTML. Use &lt;h2&gt; for headings, &lt;p&gt; for paragraphs, &lt;ul&gt;&lt;li&gt; for lists, &lt;strong&gt; for bold, &lt;a href=""&gt; for links.</p>
        <textarea
          className={`${fieldClass} font-mono text-xs`}
          rows={18}
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder={`<h2>Why Convert PDF to Excel?</h2>\n<p>Converting PDF files to Excel helps you...</p>\n<h2>Step-by-Step Guide</h2>\n<ol>\n  <li><strong>Step 1:</strong> Upload your PDF...</li>\n</ol>`}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button onClick={save} disabled={saving} className="h-11 px-6">
          {saving ? 'Saving...' : existing ? 'Update Blog' : 'Publish Blog'}
        </Button>
        <Button variant="outline" onClick={onDone} className="h-11">
          <X className="w-4 h-4 mr-1" /> Cancel
        </Button>
        {success && (
          <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <CheckCircle className="w-4 h-4" /> Saved!
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);

  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => { if (token) fetchData(); }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { setToken(data.token); localStorage.setItem('adminToken', data.token); }
      else setLoginError(data.error || 'Invalid login');
    } catch { setLoginError('Error logging in'); }
  };

  const logout = () => { setToken(''); localStorage.removeItem('adminToken'); };

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch('/api/admin/stats', { headers }).then(r => r.json()).then(d => setStats(d.stats));
    fetch('/api/admin/messages', { headers }).then(r => r.json()).then(d => setMessages(d.messages || []));
    fetch('/api/admin/blogs', { headers }).then(r => r.json()).then(d => setBlogs(d.blogs || []));
    fetch('/api/admin/waitlist', { headers }).then(r => r.json()).then(d => setWaitlist(d.waitlist || []));
  };

  const submitReply = async (id: string, replyMsg: string) => {
    await fetch(`/api/admin/messages/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reply: replyMsg }),
    });
    fetchData();
  };

  const deleteBlog = async (id: number) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    fetchData();
  };

  // ── Login Screen ──
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <Input type="password" placeholder="Admin Secret Password" value={password} onChange={e => setPassword(e.target.value)} className="py-6" />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className="w-full h-12">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-gray-900 text-white">
          <h1 className="text-2xl font-bold">🛠 Admin Dashboard</h1>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => window.open('/blog', '_blank')} className="h-9 text-sm">View Blog</Button>
            <Button variant="destructive" onClick={logout} className="h-9 text-sm">Logout</Button>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">📊 Overview</TabsTrigger>
              <TabsTrigger value="messages">📨 User Queries</TabsTrigger>
              <TabsTrigger value="blogs">✍️ Blogs</TabsTrigger>
              <TabsTrigger value="waitlist">📋 Waitlist</TabsTrigger>
            </TabsList>

            {/* ── OVERVIEW TAB ── */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="text-blue-800 font-medium">Total Messages</h3>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{stats?.messages ?? '—'}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                  <h3 className="text-green-800 font-medium">Published Blogs</h3>
                  <p className="text-4xl font-bold text-green-900 mt-2">{stats?.blogs ?? '—'}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                  <h3 className="text-purple-800 font-medium">Waitlist Users</h3>
                  <p className="text-4xl font-bold text-purple-900 mt-2">{stats?.waitlist ?? '—'}</p>
                </div>
              </div>
            </TabsContent>

            {/* ── MESSAGES TAB ── */}
            <TabsContent value="messages">
              <div className="space-y-4">
                {messages.length === 0 && <p className="text-gray-400 text-center py-10">No messages yet.</p>}
                {messages.map(msg => (
                  <div key={msg.id} className="border p-4 rounded-xl bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{msg.name || 'Anonymous'} <span className="text-sm font-normal text-gray-500">({msg.email})</span></h4>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${msg.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {msg.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-3 whitespace-pre-wrap text-sm">{msg.message}</p>
                    {msg.status === 'replied' ? (
                      <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs font-semibold text-blue-700">Replied via email.</p>
                      </div>
                    ) : (
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button asChild>
                          <a href={`mailto:${msg.email}?subject=${encodeURIComponent('Re: Your Message on PDF Guru')}&body=${encodeURIComponent(`\n\n\n---\nOn ${new Date(msg.created_at).toLocaleDateString()}, you wrote:\n${msg.message}`)}`} target="_blank" rel="noopener noreferrer">
                            Reply via Email App
                          </a>
                        </Button>
                        <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(msg.email); alert('Email copied!'); }}>
                          Copy Email
                        </Button>
                        <Button variant="outline" onClick={() => submitReply(msg.id, 'Replied via email')}>
                          Mark as Replied
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* ── BLOGS TAB ── */}
            <TabsContent value="blogs">
              {(showBlogForm || editingBlog) ? (
                <BlogForm
                  token={token}
                  existing={editingBlog}
                  onDone={() => { setShowBlogForm(false); setEditingBlog(null); fetchData(); }}
                />
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-700">{blogs.length} Blog Post{blogs.length !== 1 ? 's' : ''}</h3>
                    <Button onClick={() => setShowBlogForm(true)} className="gap-2">
                      <PlusCircle className="w-4 h-4" /> Write New Blog
                    </Button>
                  </div>

                  {blogs.length === 0 && (
                    <div className="border-2 border-dashed rounded-xl p-12 text-center text-gray-400">
                      <p className="mb-4">No blogs yet.</p>
                      <Button onClick={() => setShowBlogForm(true)}>Write Your First Blog</Button>
                    </div>
                  )}

                  {blogs.map(blog => (
                    <div key={blog.id} className="border rounded-xl p-4 bg-gray-50 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">{blog.title}</h4>
                          <span className={`px-2 py-0.5 text-xs rounded-full font-medium flex-shrink-0 ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                            {blog.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">/{blog.slug}</p>
                        {blog.excerpt && <p className="text-sm text-gray-500 line-clamp-1">{blog.excerpt}</p>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button variant="outline" size="sm" onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}>
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingBlog(blog)}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteBlog(blog.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── WAITLIST TAB ── */}
            <TabsContent value="waitlist">
              <div className="border rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tool</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {waitlist.length === 0 && (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No waitlist entries.</td></tr>
                    )}
                    {waitlist.map(w => (
                      <tr key={w.id}>
                        <td className="px-6 py-4 text-sm text-gray-900">{w.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{w.tool_name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </div>
  );
}
