import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, ExternalLink, TerminalSquare } from "lucide-react";
import { getInstallCommand, getInstallScriptUrl } from "./install";

const SectionLabel = ({ text }: { text: string }) => (
  <div className="text-xs uppercase tracking-widest text-green-400 font-mono mb-6">
    {text}
  </div>
);

const CommandBlock = ({ lines }: { lines: string[] }) => {
  const [copied, setCopied] = useState(false);
  const commandText = lines.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
          <TerminalSquare className="h-4 w-4 text-green-400" />
          shell
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-white"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 text-sm leading-7 text-zinc-200">
        <code>{commandText}</code>
      </pre>
    </div>
  );
};

const FlowCard = ({ step, title, body }: { step: string; title: string; body: string }) => (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded border border-green-500/30 bg-green-500/10 font-mono text-xs text-green-400">
        {step}
      </div>
      <h3 className="font-mono text-lg font-bold text-white">{title}</h3>
    </div>
    <p className="font-mono text-sm leading-7 text-zinc-400">{body}</p>
  </div>
);

const MiniCode = ({ children }: { children: string }) => (
  <code className="rounded bg-zinc-900 px-1.5 py-0.5 font-mono text-sm text-green-300">{children}</code>
);

export default function DocsPage() {
  const installScriptUrl = getInstallScriptUrl();
  const installCommand = getInstallCommand();

  useEffect(() => {
    document.title = "agentmux docs";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 selection:bg-green-400/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(74,222,128,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.08),transparent_28%)] pointer-events-none" />

      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-zinc-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="font-mono font-bold text-green-400">
            &gt;_ agentmux
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded border border-zinc-700 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              home
            </a>
            <a
              href={installScriptUrl}
              className="rounded bg-green-400 px-3 py-2 font-mono text-xs font-bold text-zinc-950 transition-colors hover:bg-green-300"
            >
              download install.sh
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-24 pt-16">
        <section className="pb-16">
          <SectionLabel text="// docs" />
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <h1 className="max-w-3xl font-mono text-4xl font-bold leading-tight text-white md:text-6xl">
                basic commands and the real user flow.
              </h1>
              <p className="mt-6 max-w-2xl font-mono text-sm leading-7 text-zinc-400 md:text-base">
                agentmux isolates each agent account into its own config directory, then launches those accounts one at a time or together in tmux. The normal path is install, add accounts, authenticate each once, create a workspace, then boot it.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://github.com/reviate0/agentmux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded border border-zinc-700 px-4 py-2 font-mono text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                >
                  source
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#commands"
                  className="inline-flex items-center gap-2 rounded border border-green-500/40 bg-green-500/10 px-4 py-2 font-mono text-sm text-green-300 transition-colors hover:bg-green-500/15"
                >
                  jump to commands
                </a>
              </div>
            </div>

            <CommandBlock lines={[`$ ${installCommand}`]} />
          </div>
        </section>

        <section className="border-t border-zinc-800/60 py-16">
          <SectionLabel text="// user flow" />
          <div className="grid gap-6 md:grid-cols-2">
            <FlowCard
              step="1"
              title="install the cli"
              body="The landing site hosts install.sh at /install.sh. The script installs agentmux into /usr/local/bin and then you can run the CLI directly."
            />
            <FlowCard
              step="2"
              title="register accounts"
              body="Each account is a named isolated profile for claude, codex, or opencode. agentmux creates a dedicated directory under ~/.agentmux/accounts/<id>/ for each one."
            />
            <FlowCard
              step="3"
              title="authenticate once"
              body="After adding an account, launch it one time so the underlying CLI can complete its auth flow. Credentials are then stored in that account's isolated directory."
            />
            <FlowCard
              step="4"
              title="save a workspace"
              body="A workspace is just a named tmux layout containing multiple saved accounts. This is how you define the set of panes that boot together."
            />
            <FlowCard
              step="5"
              title="boot into tmux"
              body="Boot launches the workspace in a tmux session, sets the right environment variables for each pane, starts every account, applies the selected layout, and attaches to the session."
            />
            <FlowCard
              step="6"
              title="reuse or clean up"
              body="Use list and status to inspect accounts, launch a single account when needed, and remove old accounts or workspaces when they are no longer useful."
            />
          </div>
        </section>

        <section id="commands" className="border-t border-zinc-800/60 py-16">
          <SectionLabel text="// quick start" />
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <CommandBlock
              lines={[
                "$ curl -fsSL https://agentmux.reviate0.com/install.sh | bash",
                "",
                "$ agentmux account add claude personal",
                "$ agentmux account add codex work",
                "$ agentmux account add opencode side",
                "",
                "$ agentmux launch personal",
                "$ agentmux launch work",
                "$ agentmux launch side",
                "",
                "$ agentmux workspace create dev personal work side --layout tiled",
                "$ agentmux boot dev",
              ]}
            />
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <h3 className="font-mono text-lg font-bold text-white">what happens here</h3>
              <div className="mt-5 space-y-4 font-mono text-sm leading-7 text-zinc-400">
                <p><MiniCode>account add</MiniCode> creates the named profile and its private config directory.</p>
                <p><MiniCode>launch &lt;name&gt;</MiniCode> runs that profile in the current terminal so the tool can sign in and cache credentials.</p>
                <p><MiniCode>workspace create</MiniCode> stores a reusable multi-pane layout using your saved account names.</p>
                <p><MiniCode>boot</MiniCode> starts a tmux session, launches every slot, applies the layout, and attaches.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/60 py-16">
          <SectionLabel text="// basic commands" />
          <div className="grid gap-6 lg:grid-cols-2">
            <CommandBlock
              lines={[
                "$ agentmux",
                "$ agentmux help",
                "$ agentmux version",
              ]}
            />
            <CommandBlock
              lines={[
                "$ agentmux account add claude personal",
                '$ agentmux account add codex work "company account"',
                '$ agentmux account add opencode side "side project"',
                "$ agentmux account list",
                "$ agentmux status",
              ]}
            />
            <CommandBlock
              lines={[
                "$ agentmux launch personal",
                "$ agentmux launch work -- --help",
                "$ agentmux launch personal --tmux",
              ]}
            />
            <CommandBlock
              lines={[
                "$ agentmux workspace create dev personal work side --layout tiled",
                "$ agentmux workspace list",
                "$ agentmux boot dev",
                "$ agentmux boot dev --session client-a",
              ]}
            />
          </div>
        </section>

        <section className="border-t border-zinc-800/60 py-16">
          <SectionLabel text="// notes" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Check className="h-4 w-4 text-green-400" />
                supported tools
              </div>
              <p className="font-mono text-sm leading-7 text-zinc-400">
                <MiniCode>claude</MiniCode>, <MiniCode>codex</MiniCode>, and <MiniCode>opencode</MiniCode>.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Check className="h-4 w-4 text-green-400" />
                where config lives
              </div>
              <p className="font-mono text-sm leading-7 text-zinc-400">
                Main config is stored in <MiniCode>~/.agentmux/config.json</MiniCode>. Account data lives under <MiniCode>~/.agentmux/accounts/&lt;id&gt;/</MiniCode>.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
              <div className="mb-3 flex items-center gap-2 font-mono text-sm font-bold text-white">
                <Check className="h-4 w-4 text-green-400" />
                first-run requirement
              </div>
              <p className="font-mono text-sm leading-7 text-zinc-400">
                A workspace only helps after each underlying tool has authenticated at least once. Do one manual <MiniCode>launch</MiniCode> per account first.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800/60 py-16">
          <SectionLabel text="// cleanup" />
          <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <CommandBlock
              lines={[
                "$ agentmux workspace remove dev",
                "$ agentmux account remove side",
                "$ agentmux account remove work --purge",
              ]}
            />
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 font-mono text-sm leading-7 text-zinc-400">
              <p>
                <MiniCode>account remove</MiniCode> deletes the saved account entry. Add <MiniCode>--purge</MiniCode> if you also want to delete the isolated auth/config directory on disk.
              </p>
              <p className="mt-4">
                <MiniCode>workspace remove</MiniCode> only removes the saved layout. It does not delete the accounts used by that workspace.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
