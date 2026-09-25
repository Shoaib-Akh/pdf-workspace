-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Admin',
  status TEXT DEFAULT 'published',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add new columns to contact_messages (Ignore errors if they already exist or run carefully)
-- We will just provide the ALTER statements. If they fail because table doesn't exist, it's fine, schema.sql has the full definition.
