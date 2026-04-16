import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), override: true });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase config missing. Set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY)."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const server = new Server(
  {
    name: "lpg-supabase-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "supabase_status",
        description: "Checks connectivity to Supabase using a lightweight table probe.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
      },
      {
        name: "supabase_select",
        description: "Select rows from a table with optional columns and limit.",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string", minLength: 1 },
            columns: { type: "string", default: "*" },
            limit: { type: "number", minimum: 1, maximum: 100, default: 20 },
          },
          required: ["table"],
          additionalProperties: false,
        },
      },
      {
        name: "supabase_upsert",
        description: "Upsert a single row into a table.",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string", minLength: 1 },
            row: { type: "object" },
            onConflict: { type: "string" },
          },
          required: ["table", "row"],
          additionalProperties: false,
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  if (name === "supabase_status") {
    const tablesToProbe = [
      "users",
      "user_verifications",
      "trust_metrics",
      "user_badges",
      "disputes",
    ];

    const tables = {};
    for (const table of tablesToProbe) {
      const { error } = await supabase.from(table).select("*").limit(1);
      tables[table] = error
        ? { exists: false, code: error.code, message: error.message }
        : { exists: true };
    }

    const connected = Object.values(tables).some((entry) => entry.exists);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              connected,
              message: connected
                ? "Supabase reachable"
                : "Supabase reachable, but trust tables are not present yet",
              tables,
            },
            null,
            2
          ),
        },
      ],
      isError: !connected,
    };
  }

  if (name === "supabase_select") {
    const table = String(args.table);
    const columns = args.columns ? String(args.columns) : "*";
    const limit = Number.isFinite(args.limit) ? Number(args.limit) : 20;

    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .limit(Math.min(Math.max(limit, 1), 100));

    if (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, code: error.code }, null, 2),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ rows: data ?? [] }, null, 2),
        },
      ],
    };
  }

  if (name === "supabase_upsert") {
    const table = String(args.table);
    const row = args.row;
    const onConflict = args.onConflict ? String(args.onConflict) : undefined;

    const query = supabase.from(table).upsert([row], onConflict ? { onConflict } : {});
    const { data, error } = await query.select();

    if (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: error.message, code: error.code }, null, 2),
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ rows: data ?? [] }, null, 2),
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

const transport = new StdioServerTransport();
await server.connect(transport);
