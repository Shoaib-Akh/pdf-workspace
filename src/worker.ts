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
  ADMIN_SECRET?: string; // Required — set in Cloudflare Dashboard or wrangler.toml secrets
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

// ─── HMAC-based session token (signs the admin secret so the raw secret is never exposed) ───
async function generateSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const payload = `session:${Date.now()}`;
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${payload}.${b64}`;
}

async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  try {
    const [payloadPart, sigPart] = token.split('.');
    if (!payloadPart || !sigPart || !payloadPart.startsWith('session:')) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode base64 signature
    const sigBytes = Uint8Array.from(atob(sigPart), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payloadPart));
    if (!valid) return false;

    // Token expiry: 8 hours
    const ts = parseInt(payloadPart.split(':')[1], 10);
    return Date.now() - ts < 8 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

// Allowed origins — public read-only routes use '*'; admin/contact uses restricted origin
const ALLOWED_ORIGIN = 'https://pdfguru.site';

function corsHeaders(origin: string | null, publicRoute = false): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': publicRoute ? '*' : (origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : ALLOWED_ORIGIN),
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Vary': 'Origin',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    // API Routes for Cloudflare D1
    if (url.pathname.startsWith('/api/')) {
      const publicRoute = (
        url.pathname === '/api/health' ||
        url.pathname === '/api/blogs' ||
        url.pathname.startsWith('/api/blogs/')
      );
      const headers = corsHeaders(origin, publicRoute);

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
      }

      // ── Admin Auth Guard ────────────────────────────────────────────────────────
      const checkAdminAuth = async (): Promise<boolean> => {
        // Fail closed: if ADMIN_SECRET is not configured, deny all admin access
        if (!env.ADMIN_SECRET) return false;

        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return false;
        const token = authHeader.slice(7);
        return verifySessionToken(token, env.ADMIN_SECRET);
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
          } catch {
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
      // Returns only status and reply — no personal data exposed
      if (url.pathname.startsWith('/api/status/') && request.method === 'GET') {
        const trackingId = url.pathname.split('/').pop();
        if (!env.DB || !trackingId) return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400, headers });

        const result = await env.DB.prepare(
          'SELECT status, admin_reply FROM contact_messages WHERE tracking_id = ?'
        ).bind(trackingId).first<{ status: string; admin_reply: string | null }>();

        if (!result) return new Response(JSON.stringify({ error: 'Ticket not found' }), { status: 404, headers });

        return new Response(JSON.stringify({ status: result.status, reply: result.admin_reply ?? null }), { headers });
      }

      // ─── ADMIN ROUTES ────────────────────────────────────────────────────────────

      // Admin Login — returns a signed session token, NOT the raw secret
      if (url.pathname === '/api/admin/login' && request.method === 'POST') {
        // Fail closed: if secret is not configured, refuse login entirely
        if (!env.ADMIN_SECRET) {
          return new Response(
            JSON.stringify({ error: 'Admin access is not configured on this deployment.' }),
            { status: 503, headers }
          );
        }
        const body = await request.json() as { password?: string };
        if (body.password === env.ADMIN_SECRET) {
          const sessionToken = await generateSessionToken(env.ADMIN_SECRET);
          return new Response(JSON.stringify({ success: true, token: sessionToken }), { headers });
        }
        return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401, headers });
      }

      if (url.pathname.startsWith('/api/admin/')) {
        if (!(await checkAdminAuth())) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers });
        }

        // Admin: Get Dashboard Stats
        if (url.pathname === '/api/admin/stats' && request.method === 'GET') {
          if (!env.DB) return new Response(JSON.stringify({}), { headers });
          const messages = ((await env.DB.prepare('SELECT count(*) as count FROM contact_messages').first()) as any)?.count || 0;
          const waitlist = ((await env.DB.prepare('SELECT count(*) as count FROM waitlist').first()) as any)?.count || 0;
          const blogs = ((await env.DB.prepare('SELECT count(*) as count FROM blogs').first()) as any)?.count || 0;
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

        // Admin: Manage Blogs (list & create)
        if (url.pathname === '/api/admin/blogs') {
          if (request.method === 'GET' && env.DB) {
            const { results } = await env.DB.prepare('SELECT * FROM blogs ORDER BY created_at DESC').all();
            return new Response(JSON.stringify({ blogs: results }), { headers });
          }
          if (request.method === 'POST' && env.DB) {
            const body = await request.json() as { title: string; content: string; slug: string; excerpt?: string; meta_description?: string; author?: string; status?: string };
            const slug = body.slug || body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            await env.DB.prepare(
              'INSERT INTO blogs (title, content, slug, excerpt, meta_description, author, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
            ).bind(body.title, body.content, slug, body.excerpt || '', body.meta_description || '', body.author || 'Admin', body.status || 'published').run();
            return new Response(JSON.stringify({ success: true, slug }), { headers });
          }
        }

        // Admin: Update or Delete a single blog
        if (url.pathname.match(/^\/api\/admin\/blogs\/\d+$/)) {
          const id = url.pathname.split('/').pop();
          if (request.method === 'PUT' && env.DB) {
            const body = await request.json() as { title: string; content: string; slug: string; excerpt?: string; meta_description?: string; author?: string; status?: string };
            await env.DB.prepare(
              'UPDATE blogs SET title=?, content=?, slug=?, excerpt=?, meta_description=?, author=?, status=? WHERE id=?'
            ).bind(body.title, body.content, body.slug, body.excerpt || '', body.meta_description || '', body.author || 'Admin', body.status || 'published', id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (request.method === 'DELETE' && env.DB) {
            await env.DB.prepare('DELETE FROM blogs WHERE id=?').bind(id).run();
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }

      // Public API: Get all published blogs
      if (url.pathname === '/api/blogs' && request.method === 'GET') {
        if (!env.DB) return new Response(JSON.stringify({ blogs: [] }), { headers });
        const { results } = await env.DB.prepare("SELECT id, title, slug, excerpt, author, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC").all();
        return new Response(JSON.stringify({ blogs: results }), { headers });
      }

      // Public API: Get single blog by slug
      if (url.pathname.startsWith('/api/blogs/') && request.method === 'GET') {
        const slug = url.pathname.split('/').pop();
        if (!env.DB || !slug) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
        const blog = await env.DB.prepare("SELECT * FROM blogs WHERE slug = ? AND status = 'published'").bind(slug).first();
        if (!blog) return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404, headers });
        return new Response(JSON.stringify({ blog }), { headers });
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
