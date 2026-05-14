import { serve } from "bun";
import path from "node:path";
import index from "./index.html";

const installScriptPath = path.join(import.meta.dir, "..", "..", "agent-cli", "install.sh");
const supabaseUrl = process.env.SUPABASE_URL;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const server = serve({
  routes: {
    "/install.sh": {
      async GET() {
        const installScript = Bun.file(installScriptPath);
        return new Response(await installScript.text(), {
          headers: {
            "content-type": "text/x-shellscript; charset=utf-8",
          },
        });
      },
    },

    "/api/waitlist": {
      async POST(req) {
        if (!supabaseUrl || !supabasePublishableKey) {
          return Response.json(
            {
              error: "Supabase env vars are missing. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.",
            },
            { status: 500 },
          );
        }

        let payload: unknown;
        try {
          payload = await req.json();
        } catch {
          return Response.json({ error: "Request body must be JSON." }, { status: 400 });
        }

        const body = payload as { name?: unknown; email?: unknown };
        const name = typeof body.name === "string" ? body.name.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

        if (name.length < 2) {
          return Response.json({ error: "Please enter your name." }, { status: 400 });
        }

        if (!isValidEmail(email)) {
          return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
        }

        const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/waitlist_signups?on_conflict=email`, {
          method: "POST",
          headers: {
            apikey: supabasePublishableKey,
            "content-type": "application/json",
            Prefer: "resolution=ignore-duplicates,return=minimal",
          },
          body: JSON.stringify({
            name,
            email,
            source: "landing-page",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          const status = response.status === 409 ? 200 : response.status;
          if (response.status === 409) {
            return Response.json({ message: "You are already on the waitlist." }, { status });
          }
          return Response.json(
            {
              error: `Supabase insert failed: ${errorText}`,
            },
            { status: response.status },
          );
        }

        return Response.json({ message: "You're on the waitlist." });
      },
    },

    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
