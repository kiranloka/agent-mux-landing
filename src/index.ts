import { serve } from "bun";
import path from "node:path";
import index from "./index.html";

const installScriptPath = path.join(import.meta.dir, "..", "..", "agent-cli", "install.sh");

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
