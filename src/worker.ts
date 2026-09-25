export interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  exec: (query: string) => Promise<{ count: number; duration: number }>;
}

export interface D1PreparedStatement {
  bind: (...values: unknown[]) => D1PreparedStatement;
  first: <T = unknown>(colName?: string) => Promise<T | null>;
  run: () => Promise<{ success: boolean }>;
  all: <T = unknown>() => Promise<{ results: T[]; success: boolean }>;
}

export interface Env {
  ASSETS: {
    fetch: (request: Request) => Promise<Response>;
  };
  DB?: D1Database;
  ADMIN_SECRET?: string; // Add your secret in wrangler.toml or Cloudflare Dashboard
}

// Generate random tracking ID
const generateTrackingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TK-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API Routes for Cloudflare D1
    if (url.pathname.startsWith('/api/')) {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Update this in production
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
      }

      // Check Admin Auth
      const checkAdminAuth = () => {
        const authHeader = request.headers.get('Authorization');
        const expected = env.ADMIN_SECRET || 'secret123'; // fallback for local dev
        if (authHeader !== `Bearer ${expected}`) {
          return false;
        }
        return true;
      };

      // 1. Health Check
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ status: 'ok', databaseConnected: !!env.DB }), { headers });
      }

      // 2. Waitlist API
      if (url.pathname === '/api/waitlist') {
        if (request.method === 'POST') {
          try {
            const body = await request.json() as { email?: string; toolName?: string };
            if (!body.email) return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers });
            if (env.DB) {
              await env.DB.prepare('INSERT INTO waitlist (email, tool_name) VALUES (?, ?)')
                .bind(body.email, body.toolName || 'general').run();
            }
            return new Response(JSON.stringify({ success: true }), { headers });
          } catch (err: unknown) {
            return new Response(JSON.stringify({ error: 'Failed to save waitlist' }), { status: 500, headers });
          }
        }
      }

      // 3. User Contact Form (Generate Tracking ID)
      if (url.pathname === '/api/contact' && request.method === 'POST') {
        try {
          const body = await request.json() as { name: string; email: string; message: string };
          if (!body.email || !body.message) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers });
          
          const trackingId = generateTrackingId();
          if (env.DB) {
            await env.DB.prepare(
              'INSERT INTO contact_messages (name, email, message, tracking_id) VALUES (?, ?, ?, ?)'
            ).bind(body.name || '', body.email, body.message, trackingId).run();
          }
          return new Response(JSON.stringify({ success: true, trackingId }), { headers });
        } catch {
          return new Response(JSON.stringify({ error: 'Failed to send message' }), { status: 500, headers });
        }
      }

      // 4. User Check Query Status (by Tracking ID)
      if (url.pathname.startsWith('/api/status/') && request.method === 'GET') {
        const trackingId = url.pathname.split('/').pop();
        if (!env.DB || !trackingId) return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });
        
        const result = await env.DB.prepare('SELECT * FROM contact_messages WHERE tracking_id = ?').bind(trackingId).first();
        if (!result) return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers });
        
        return new Response(JSON.stringify({ ticket: result }), { headers });
      }

      // --- ADMIN ROUTES BELOW ---
      
      // Admin Login Check
      if (url.pathname === '/api/admin/login' && request.method === 'POST') {
        const body = await request.json() as { password?: string };
        const expected = env.ADMIN_SECRET || 'secret123';
        if (body.password === expected) {
          return new Response(JSON.stringify({ success: true, token: expected }), { headers });
        }
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401, headers });
      }

      if (url.pathname.startsWith('/api/admin/')) {
        if (!checkAdminAuth()) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
        }

        // Admin: Get Dashboard Stats
        if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
          if (!env.DB) return new Response(JSON.stringify({}), { headers });
          const messages = (await env.DB.prepare('SELECT count(*) as count FROM contact_messages').first() as any)?.count || 0;
          const waitlist = (await env.DB.prepare('SELECT count(*) as count FROM waitlist').first() as any)?.count || 0;
          const blogs = (await env.DB.prepare('SELECT count(*) as count FROM blogs').first() as any)?.count || 0;
          return new Response(JSON.stringify({ stats: { messages, waitlist, blogs } }), { headers });
        }

        // Admin: Manage Messages
        if (url.pathname === '/api/admin/messages') {
          if (request.method === 'GET' && env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
            return new Response(JSON.stringify({ messages: results }), { headers });
          }
        }

        // Admin: Reply to Message
        if (url.pathname.match(/^\/api\/admin\/messages\/\d+\/reply$/) && request.method === 'POST') {
          const id = url.pathname.split('/')[4];
          const body = await request.json() as { reply: string };
          if (env.DB && body.reply) {
            await env.DB.prepare(
              'UPDATE contact_messages SET admin_reply = ?, status = ? WHERE id = ?'
            ).bind(body.reply, 'replied', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }

        // Admin: Manage Waitlist
        if (url.pathname === '/api/admin/waitlist' && request.method === 'GET' && env.DB) {
          const { results } = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC').all();
          return new Response(JSON.stringify({ waitlist: results }), { headers });
        }

        // Admin: Manage Blogs
        if (url.pathname === '/api/admin/blogs') {
          if (request.method === 'GET' && env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
            return new Response(JSON.stringify({ blogs: results }), { headers });
          }
          
          if (request.method === 'POST' && env.DB) {
            const body = await request.json() as { title: string, content: string, slug: string };
            await env.DB.prepare(
              'INSERT INTO blogs (title, content, slug) VALUES (?, ?, ?)'
            ).bind(body.title, body.content, body.slug).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }

      // Public API: Get published blogs
      if (url.pathname === '/api/blogs' && request.method === 'GET') {
        if (!env.DB) return new Response(JSON.stringify({ blogs: [] }), { headers });
        const { results } = await env.DB.prepare("SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC").all();
        return new Response(JSON.stringify({ blogs: results }), { headers });
      }

      // Return 404 for unknown APIs
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    }

    // Static Assets & SPA Routing
    try {
      const response = await env.ASSETS.fetch(request);
      if (response.status === 404 && request.method === 'GET') {
        const rootUrl = new URL('/', request.url);
        return await env.ASSETS.fetch(new Request(rootUrl.toString(), {
          method: 'GET',
          headers: request.headers,
        }));
      }
      return response;
    } catch {
      const rootUrl = new URL('/', request.url);
      return env.ASSETS.fetch(new Request(rootUrl.toString(), { method: 'GET' }));
    }
  },
};
