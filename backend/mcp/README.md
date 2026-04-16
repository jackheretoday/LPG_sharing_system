# Supabase MCP Server (Local)

## Purpose
This MCP server lets you query Supabase directly from local MCP-compatible clients.

## Setup
1. Ensure backend `.env` has Supabase keys.
2. Install dependencies in backend:
   npm install
3. Start MCP server:
   npm run mcp:supabase

## Tools Exposed
- `supabase_status`:
  - Checks connectivity.
- `supabase_select`:
  - Read rows from a table.
- `supabase_upsert`:
  - Insert/update one row.

## Security Note
Prefer `SUPABASE_SERVICE_ROLE_KEY` for backend-only trusted use.
For client-safe operations, use `SUPABASE_ANON_KEY` with RLS.
