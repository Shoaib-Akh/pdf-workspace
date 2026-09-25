import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [stats, setStats] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [waitlist, setWaitlist] = useState<any[]>([]);
  
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
      } else {
        setLoginError(data.error || 'Invalid login');
      }
    } catch (err) {
      setLoginError('Error logging in');
    }
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
  };

  const fetchData = async () => {
    const headers = { 'Authorization': `Bearer ${token}` };
    
    // Fetch stats
    fetch('/api/admin/stats', { headers }).then(r => r.json()).then(d => setStats(d.stats));
    
    // Fetch messages
    fetch('/api/admin/messages', { headers }).then(r => r.json()).then(d => setMessages(d.messages || []));
    
    // Fetch blogs
    fetch('/api/admin/blogs', { headers }).then(r => r.json()).then(d => setBlogs(d.blogs || []));
    
    // Fetch waitlist
    fetch('/api/admin/waitlist', { headers }).then(r => r.json()).then(d => setWaitlist(d.waitlist || []));
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}/reply`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reply: replyText })
      });
      if (res.ok) {
        setReplyText('');
        setReplyingTo(null);
        fetchData(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <Input 
              type="password" 
              placeholder="Admin Secret Password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="py-6"
            />
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <Button type="submit" className="w-full h-12">Login</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b bg-gray-900 text-white">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="secondary" onClick={logout}>Logout</Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="messages">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">User Queries</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="waitlist">Waitlist</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="text-blue-800 text-lg font-medium">Total Messages</h3>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{stats?.messages || 0}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="text-green-800 text-lg font-medium">Published Blogs</h3>
                  <p className="text-4xl font-bold text-green-900 mt-2">{stats?.blogs || 0}</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <h3 className="text-purple-800 text-lg font-medium">Waitlist Users</h3>
                  <p className="text-4xl font-bold text-purple-900 mt-2">{stats?.waitlist || 0}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="messages">
              <div className="space-y-4">
                {messages.length === 0 ? <p>No messages yet.</p> : null}
                {messages.map(msg => (
                  <div key={msg.id} className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{msg.name || 'Anonymous'} <span className="text-sm font-normal text-gray-500">({msg.email})</span></h4>
                        <span className="text-xs text-gray-500">Tracking ID: {msg.tracking_id} | Date: {new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${msg.status === 'replied' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {msg.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-3 whitespace-pre-wrap">{msg.message}</p>
                    
                    {msg.status === 'replied' ? (
                      <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-100">
                        <p className="text-sm font-semibold text-blue-800">Your Reply:</p>
                        <p className="text-sm text-blue-900 mt-1">{msg.admin_reply}</p>
                      </div>
                    ) : (
                      <div className="mt-4">
                        {replyingTo === msg.id ? (
                          <div className="space-y-3">
                            <textarea 
                              className="w-full w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-blue-500 focus:border-blue-500" 
                              rows={4}
                              placeholder="Write your reply here..."
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button onClick={() => submitReply(msg.id)}>Send Reply</Button>
                              <Button variant="outline" onClick={() => { setReplyingTo(null); setReplyText(''); }}>Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={() => setReplyingTo(msg.id)}>Reply to Message</Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="blogs">
              {/* Simple placeholder for Blogs - Can be expanded later */}
              <div className="p-8 text-center border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Blog editor UI will be integrated here.</p>
                <p className="text-sm text-gray-400 mt-2">Currently {blogs.length} blogs in database.</p>
              </div>
            </TabsContent>

            <TabsContent value="waitlist">
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tool</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {waitlist.map(w => (
                      <tr key={w.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{w.tool_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(w.created_at).toLocaleDateString()}</td>
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
