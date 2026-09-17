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
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // API Routes for Cloudflare D1
    if (url.pathname.startsWith('/api/')) {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers });
      }

      // Health / DB status check
      if (url.pathname === '/api/health') {
        return new Response(
          JSON.stringify({
            status: 'ok',
            databaseConnected: !!env.DB,
            timestamp: new Date().toISOString(),
          }),
          { headers }
        );
      }

      // Waitlist API
      if (url.pathname === '/api/waitlist') {
        if (request.method === 'POST') {
          try {
            const body = await request.json() as { email?: string; toolName?: string };
            if (!body.email) {
              return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400, headers });
            }

            if (env.DB) {
              await env.DB.prepare(
                'INSERT INTO waitlist (email, tool_name) VALUES (?, ?)'
              ).bind(body.email, body.toolName || 'general').run();
            }

            return new Response(JSON.stringify({ success: true }), { headers });
          } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save waitlist';
            return new Response(JSON.stringify({ error: errorMsg }), { status: 500, headers });
          }
        }

        if (request.method === 'GET') {
          if (!env.DB) {
            return new Response(JSON.stringify({ waitlist: [] }), { headers });
          }
          const { results } = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 100').all();
          return new Response(JSON.stringify({ waitlist: results }), { headers });
        }
      }

      // Tool usage / analytics API
      if (url.pathname === '/api/events' && request.method === 'POST') {
        try {
          const body = await request.json() as { toolSlug?: string; eventType?: string };
          if (env.DB && body.toolSlug) {
            await env.DB.prepare(
              'INSERT INTO tool_events (tool_slug, event_type) VALUES (?, ?)'
            ).bind(body.toolSlug, body.eventType || 'use').run();
          }
          return new Response(JSON.stringify({ success: true }), { headers });
        } catch {
          return new Response(JSON.stringify({ success: false }), { headers });
        }
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    }

    // Static Assets & SPA Routing
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      url.pathname = '/index.html';
      return env.ASSETS.fetch(new Request(url.toString(), request));
    }
    return response;
  },
};
