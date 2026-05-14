"use client";
import React, { useState, useEffect } from 'react';
import { Users, LayoutPanelLeft, Rocket, Check, Folder, Code2, Terminal, Bot, Cpu, Boxes, X } from 'lucide-react';
import { SiClaude, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { motion } from 'motion/react';

const InstallCommand = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('curl -fsSL https://agentmux.reviate0.com/install.sh | bash');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-5 py-3 flex items-center justify-between font-mono text-sm max-w-xl mx-auto w-full">
      <div className="flex items-center gap-3 overflow-x-auto text-zinc-200 whitespace-nowrap scrollbar-hide">
        <span className="text-green-400 select-none">$</span>
        <span>curl -fsSL https://agentmux.reviate0.com/install.sh | bash</span>
      </div>
      <button
        onClick={handleCopy}
        className="ml-4 flex-shrink-0 text-zinc-400 hover:text-white transition-colors uppercase text-xs tracking-wider"
      >
        {copied ? 'copied!' : 'copy'}
      </button>
    </div>
  );
};

const WaitlistModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const openModal = () => {
    setIsOpen(true);
    setStatus("idle");
    setMessage("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setName("");
    setEmail("");
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Could not join the waitlist.");
      }

      setStatus("success");
      setMessage(data?.message || "You're on the waitlist.");
      setName("");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not join the waitlist.");
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-green-400 text-zinc-950 font-mono font-bold px-6 py-3 rounded hover:bg-green-300 transition-colors"
      >
        join waitlist
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 sm:p-8 w-full max-w-md shadow-2xl"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-white font-mono font-bold text-lg mb-1">join the waitlist</h3>
            <p className="text-zinc-400 text-sm font-mono mb-6">
              Get early access to cloud sync and priority support.
            </p>

            {status === "success" ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-green-300 font-mono text-sm">{message}</p>
                <button
                  onClick={closeModal}
                  className="mt-4 text-zinc-400 hover:text-white text-xs font-mono transition-colors"
                >
                  close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    minLength={2}
                    placeholder="Your name"
                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono text-sm rounded px-3 py-2.5 outline-none focus:border-green-400/70 placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="Email address"
                    className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono text-sm rounded px-3 py-2.5 outline-none focus:border-green-400/70 placeholder:text-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-green-400 text-zinc-950 font-mono font-bold px-6 py-3 rounded hover:bg-green-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "submitting..." : "submit"}
                </button>

                {status === "error" && (
                  <p className="text-red-300 text-xs font-mono">{message}</p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="text-xs uppercase tracking-widest text-green-400 font-mono mb-8">
    {text}
  </div>
);

const cursorLogoUrl = "https://cursor.com/marketing-static/icon-512x512.png";
const deepSeekLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Deepseek-logo-icon.svg/3840px-Deepseek-logo-icon.svg.png";
const copilotLogoUrl = "https://upload.wikimedia.org/wikipedia/en/thumb/a/aa/Microsoft_Copilot_Icon.svg/250px-Microsoft_Copilot_Icon.svg.png";
const openCodeLogoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCXTQ2dik4q2yKXpjl_1PlNO76VEPUNFlnTw&s";

const LogoImage = ({ src, className = "w-8 h-8 object-contain" }: { src: string; className?: string }) => (
  <img src={src} alt="" aria-hidden="true" draggable="false" className={className} />
);

const OrbitingAgents = () => {
  // Inner ring: 3 agents, evenly spaced at 120° apart
  const ring1 = [
    { name: 'Codex', icon: <SiOpenai className="w-8 h-8" />, color: 'text-white', bg: 'bg-teal-500/10', border: 'border-teal-500/30', glow: 'rgba(45,212,191,0.25)' },
    { name: 'Gemini', icon: <SiGooglegemini className="w-8 h-8" />, color: 'text-white', bg: 'bg-sky-500/10', border: 'border-sky-500/30', glow: 'rgba(56,189,248,0.25)' },
    { name: 'OpenCode', icon: <LogoImage src={openCodeLogoUrl} />, color: 'text-white', bg: 'bg-amber-500/10', border: 'border-amber-500/30', glow: 'rgba(251,191,36,0.25)' },
  ];

  // Outer ring: 4 agents, evenly spaced at 90° apart
  const ring2 = [
    { name: 'Claude', icon: <SiClaude className="w-8 h-8" />, color: 'text-white', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'rgba(251,146,60,0.25)' },
    { name: 'DeepSeek', icon: <LogoImage src={deepSeekLogoUrl} />, color: 'text-white', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'rgba(96,165,250,0.25)' },
    { name: 'Cursor', icon: <LogoImage src={cursorLogoUrl} />, color: 'text-white', bg: 'bg-violet-500/10', border: 'border-violet-500/30', glow: 'rgba(167,139,250,0.25)' },
    { name: 'Copilot', icon: <LogoImage src={copilotLogoUrl} />, color: 'text-white', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', glow: 'rgba(52,211,153,0.25)' },
  ];

  const INNER_RADIUS = 110;
  const OUTER_RADIUS = 185;
  const CONTAINER = 420;
  const CENTER = CONTAINER / 2;

  return (
    <div className="relative mx-auto" style={{ width: CONTAINER, height: CONTAINER }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.08)_0,transparent_55%)] pointer-events-none" />

      {/* SVG orbit rings — visible, clean, no overlap with icons */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${CONTAINER} ${CONTAINER}`}>
        <defs>
          <linearGradient id="orbit-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(74,222,128,0.25)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(74,222,128,0.25)" />
          </linearGradient>
          <linearGradient id="orbit-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.2)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="100%" stopColor="rgba(56,189,248,0.2)" />
          </linearGradient>
        </defs>
        {/* Inner orbit */}
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="none" stroke="url(#orbit-grad-1)" strokeWidth="1" strokeDasharray="6 4" opacity="0.7" />
        {/* Outer orbit */}
        <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} fill="none" stroke="url(#orbit-grad-2)" strokeWidth="1" strokeDasharray="8 5" opacity="0.5" />
      </svg>

      {/* Center Hub */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-zinc-900/90 border border-zinc-600/60 flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.2),0_0_80px_rgba(74,222,128,0.06)] backdrop-blur-sm">
          <Bot className="w-7 h-7 text-green-400" />
        </div>
      </div>

      {/* Inner Ring Icons — rotating container */}
      <div className="absolute inset-0 animate-orbit-inner" style={{ transformOrigin: 'center center' }}>
        {ring1.map((agent, i) => {
          const angleDeg = (i * 360) / ring1.length - 90;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = CENTER + INNER_RADIUS * Math.cos(angleRad);
          const y = CENTER + INNER_RADIUS * Math.sin(angleRad);
          return (
            <div
              key={agent.name}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="animate-orbit-inner-reverse">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="cursor-default" title={agent.name}>
                    {agent.icon}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 whitespace-nowrap select-none">
                    {agent.name}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outer Ring Icons — rotating container (opposite direction) */}
      <div className="absolute inset-0 animate-orbit-outer" style={{ transformOrigin: 'center center' }}>
        {ring2.map((agent, i) => {
          const angleDeg = (i * 360) / ring2.length - 45; // Offset by 45° so no icon starts at pure top
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = CENTER + OUTER_RADIUS * Math.cos(angleRad);
          const y = CENTER + OUTER_RADIUS * Math.sin(angleRad);
          return (
            <div
              key={agent.name}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="animate-orbit-outer-reverse">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="cursor-default" title={agent.name}>
                    {agent.icon}
                  </div>
                  <span className="text-[9px] font-mono text-zinc-500 whitespace-nowrap select-none">
                    {agent.name}
                  </span>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  const [demoStep, setDemoStep] = useState(0);

  const howSteps = [
    {
      n: '1',
      title: 'add your accounts',
      desc: 'one command per account. claude, codex, opencode all supported.'
    },
    {
      n: '2',
      title: 'authenticate once',
      desc: 'first launch opens browser oauth. credentials cached in an isolated dir.'
    },
    {
      n: '3',
      title: 'create a workspace',
      desc: 'group accounts into a named layout — tiled, horizontal, or vertical.'
    },
    {
      n: '4',
      title: 'boot and go',
      desc: <> <code className="text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">agentmux boot dev</code> — all panes running, all accounts live.</>
    }
  ] as const;

  const marqueeItems = [
    { label: 'Claude Code', icon: <SiClaude className="w-4 h-4" />, color: 'text-purple-300' },
    { label: 'OpenAI Codex', icon: <SiOpenai className="w-4 h-4" />, color: 'text-teal-300' },
    { label: 'OpenCode', icon: <Code2 className="w-4 h-4" />, color: 'text-amber-300' },
    { label: 'CLI', icon: <Terminal className="w-4 h-4" />, color: 'text-zinc-200' },
    { label: 'Agents', icon: <Bot className="w-4 h-4" />, color: 'text-green-300' },
    { label: 'Runtime', icon: <Cpu className="w-4 h-4" />, color: 'text-cyan-200' },
    { label: 'Workspaces', icon: <Boxes className="w-4 h-4" />, color: 'text-indigo-200' }
  ] as const;

  useEffect(() => {
    const timers = [
      setTimeout(() => setDemoStep(1), 500),
      setTimeout(() => setDemoStep(2), 1200),
      setTimeout(() => setDemoStep(3), 2000),
      setTimeout(() => setDemoStep(4), 2800),
      setTimeout(() => setDemoStep(5), 3600),
      setTimeout(() => setDemoStep(6), 4400),
      setTimeout(() => setDemoStep(7), 5200)
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-green-400/30">
      {/* 1. Navbar */}
      <nav aria-label="Main navigation" className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl border-b border-zinc-800/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" aria-label="agentmux home" className="text-green-400 font-mono font-bold">
            &gt;_ agentmux
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-mono">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-zinc-400 hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a>
          </div>
          <div>
            <a href="#install" aria-label="Get started with agentmux" className="inline-block border border-green-500 text-green-400 hover:bg-green-400/10 transition-colors font-mono text-sm px-4 py-1.5 rounded">
              get started
            </a>
          </div>
        </div>
      </nav>

      <main className="w-full">
        {/* 2. Hero */}
        <section id="install" aria-label="Hero section" className="relative min-h-[90vh] flex flex-col justify-start items-center text-center pt-32 pb-0 overflow-hidden w-full">
          {/* Background Gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[70%] rounded-full bg-orange-500/20 blur-[120px] pointer-events-none mix-blend-screen"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
            <div className="border border-zinc-700 text-zinc-400 font-mono text-xs px-3 py-1 rounded-full mb-8 inline-block">
              v0.1.0 · open source · MIT
            </div>

            <h1 className="font-mono font-bold text-4xl md:text-7xl text-white tracking-tight leading-tight drop-shadow-2xl">
              run every AI agent<br />
              account. <span className="text-green-400">at once.</span>
            </h1>

            <p className="text-zinc-400 font-mono text-sm md:text-base max-w-xl mx-auto mt-6 leading-relaxed">
              claude code, codex, opencode — each with their own auth, running in parallel tmux panes. no more logging out.
            </p>

            <div className="mt-8 gap-4 flex flex-col sm:flex-row justify-center items-center">
              <a href="#install" aria-label="Install agentmux" className="w-full sm:w-auto bg-green-400 text-zinc-950 font-mono font-bold px-6 py-2.5 rounded hover:bg-green-300 transition-colors shadow-[0_0_20px_rgba(74,222,128,0.2)] inline-block text-center">
                install now
              </a>
              <a href="https://github.com/reviate0/agentmux" target="_blank" rel="noopener noreferrer" aria-label="View agentmux on GitHub" className="w-full sm:w-auto border border-zinc-700 text-zinc-300 font-mono px-6 py-2.5 rounded hover:border-zinc-500 transition-colors bg-zinc-950/50 backdrop-blur-sm inline-block text-center">
                view on github
              </a>
            </div>

            <div className="mt-12 w-full max-w-lg mx-auto">
              <InstallCommand />
              <div className="text-zinc-600 font-mono text-xs mt-3 text-center">
                linux · macos · 2.1mb · zero deps
              </div>
            </div>
          </div>

          {/* Hero Terminal Fade */}
          <div className="relative mt-20 w-full max-w-5xl mx-auto px-6 h-[400px]">
            {/* Fade Out Mask */}
            <div className="absolute bottom-0 inset-x-0 h-[80%] z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none"></div>
            
            <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-t-2xl overflow-hidden shadow-2xl h-full relative z-0 flex flex-col">
              <div className="bg-zinc-900/50 border-b border-zinc-800 px-4 py-3 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                  <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                </div>
                <div className="text-zinc-500 font-mono text-xs mx-auto pr-8">
                  agentmux — zsh
                </div>
              </div>
              <div className="p-8 font-mono text-sm md:text-base space-y-4 text-left flex-grow overflow-hidden">
                <div className={`transition-opacity duration-300 ${demoStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-green-400">$</span> <span className="text-zinc-100">agentmux account add claude personal</span>
                </div>
                <div className={`transition-opacity duration-300 ${demoStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-zinc-500">  ✓ Account added → ~/.agentmux/accounts/claude-a1f2/</span>
                </div>
                <div className={`transition-opacity duration-300 mt-6 ${demoStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-green-400">$</span> <span className="text-zinc-100">agentmux account add codex work "company"</span>
                </div>
                <div className={`transition-opacity duration-300 ${demoStep >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-zinc-500">  ✓ Account added → ~/.agentmux/accounts/codex-9e3b/</span>
                </div>
                <div className={`transition-opacity duration-300 mt-6 ${demoStep >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-green-400">$</span> <span className="text-zinc-100">agentmux workspace create dev personal work side</span>
                </div>
                <div className={`transition-opacity duration-300 ${demoStep >= 6 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-zinc-500">  ✓ Workspace 'dev' created · 3 slots · tiled layout</span>
                </div>
                <div className={`transition-opacity duration-300 mt-6 ${demoStep >= 7 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-green-400">$</span> <span className="text-zinc-100">agentmux boot dev</span>
                </div>
                <div className={`transition-opacity duration-300 ${demoStep >= 7 ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="text-green-300">  ↗ Booting 3 accounts in tmux session agentmux-dev...</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Wrapper for Sections below Hero */}
        <div className="max-w-6xl mx-auto px-6">

        {/* 4. Features */}
        <section id="features" aria-label="Features" className="py-24 border-t border-zinc-800/50">
          <SectionLabel text="// what it does" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              whileHover="hover"
              className="bg-transparent backdrop-blur-md border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col group transition-colors hover:border-green-500/40 shadow-lg"
            >
              <div className="h-48 bg-gradient-to-b from-zinc-900/50 to-transparent relative flex items-center justify-center p-6 border-b border-zinc-800/50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.05)_0,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Mockup 1: Account Manager */}
                <div className="flex flex-col gap-2 w-full max-w-[180px] font-mono text-xs text-zinc-500 relative z-10">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Folder className="w-3.5 h-3.5" /> .agentmux/
                  </div>
                  <div className="pl-4 border-l border-zinc-800 ml-1.5 space-y-2">
                    <motion.div variants={{ hover: { x: 5, color: '#4ade80' } }} transition={{ type: "spring", stiffness: 300 }} className="flex items-center gap-2 text-zinc-500">
                      <Folder className="w-3.5 h-3.5" /> claude-personal/
                    </motion.div>
                    <motion.div variants={{ hover: { x: 5, color: '#4ade80' } }} transition={{ type: "spring", stiffness: 300, delay: 0.05 }} className="flex items-center gap-2 text-zinc-500">
                      <Folder className="w-3.5 h-3.5" /> codex-work/
                    </motion.div>
                    <motion.div variants={{ hover: { x: 5, color: '#4ade80' } }} transition={{ type: "spring", stiffness: 300, delay: 0.1 }} className="flex items-center gap-2 text-zinc-500">
                      <Folder className="w-3.5 h-3.5" /> opencode/
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-white font-mono font-bold text-base mb-3 flex items-center gap-2">
                  <Users className="text-green-400 w-4 h-4" /> account manager
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  add, remove, and list accounts per tool. each gets a fully isolated config dir.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover="hover"
              className="bg-transparent backdrop-blur-md border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col group transition-colors hover:border-green-500/40 shadow-lg"
            >
              <div className="h-48 bg-gradient-to-b from-zinc-900/50 to-transparent relative flex items-center justify-center p-6 border-b border-zinc-800/50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.05)_0,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Mockup 2: Parallel Instances */}
                <div className="w-full h-full max-w-[220px] max-h-[120px] flex gap-2 p-2 bg-zinc-950 rounded-lg border border-zinc-800 relative z-10 shadow-xl">
                  <motion.div 
                    variants={{ hover: { scale: 0.96, borderColor: 'rgba(74,222,128,0.5)', backgroundColor: 'rgba(74,222,128,0.05)' } }} 
                    className="flex-[2] bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center transition-colors duration-300"
                  >
                    <span className="font-mono text-[10px] text-zinc-600">pane 1</span>
                  </motion.div>
                  <div className="flex-1 flex flex-col gap-2">
                    <motion.div 
                      variants={{ hover: { scale: 0.94, borderColor: 'rgba(74,222,128,0.5)', backgroundColor: 'rgba(74,222,128,0.05)' } }} 
                      transition={{ delay: 0.05 }}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center transition-colors duration-300"
                    >
                      <span className="font-mono text-[10px] text-zinc-600">pane 2</span>
                    </motion.div>
                    <motion.div 
                      variants={{ hover: { scale: 0.94, borderColor: 'rgba(74,222,128,0.5)', backgroundColor: 'rgba(74,222,128,0.05)' } }} 
                      transition={{ delay: 0.1 }}
                      className="flex-1 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center transition-colors duration-300"
                    >
                      <span className="font-mono text-[10px] text-zinc-600">pane 3</span>
                    </motion.div>
                  </div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-white font-mono font-bold text-base mb-3 flex items-center gap-2">
                  <LayoutPanelLeft className="text-green-400 w-4 h-4" /> parallel instances
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  each tmux pane runs a completely separate authenticated session simultaneously.
                </p>
              </div>
            </motion.div>

            <motion.div 
              whileHover="hover"
              className="bg-transparent backdrop-blur-md border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col group transition-colors hover:border-green-500/40 shadow-lg"
            >
              <div className="h-48 bg-gradient-to-b from-zinc-900/50 to-transparent relative flex flex-col items-center justify-center p-6 border-b border-zinc-800/50 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,222,128,0.05)_0,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Mockup 3: One-command Boot */}
                <div className="w-full max-w-[220px] bg-zinc-950 border border-zinc-800 rounded-lg p-4 font-mono text-[10px] shadow-xl relative z-10">
                  <div className="flex gap-1.5 mb-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                  </div>
                  <div className="text-zinc-300 flex items-center gap-2">
                    <span className="text-green-400">$</span> agentmux boot
                  </div>
                  <motion.div 
                    variants={{ hover: { opacity: 1, y: 0 } }}
                    initial={{ opacity: 0, y: 10 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="mt-3 text-zinc-500 space-y-2 pl-1"
                  >
                    <div className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> workspace loaded</div>
                    <motion.div variants={{ hover: { opacity: 1, y: 0 } }} initial={{ opacity: 0, y: 5 }} transition={{ delay: 0.25 }} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" /> panes ready</motion.div>
                  </motion.div>
                </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-white font-mono font-bold text-base mb-3 flex items-center gap-2">
                  <Rocket className="text-green-400 w-4 h-4" /> one-command boot
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  save workspace layouts. boot your full multi-account setup in one shot.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 5. How it works */}
        <section id="how-it-works" aria-label="How it works" className="py-24 border-t border-zinc-800/50">
          <SectionLabel text="// how it works" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="mb-10">
                <h2 className="text-white font-mono font-bold text-2xl md:text-3xl tracking-tight">
                  a clean workflow for messy auth.
                </h2>
                <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-mono mt-4 max-w-xl">
                  isolate configs per tool, keep sessions alive, and run everything side-by-side — without fighting env vars.
                </p>
              </div>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.12 } }
                }}
                className="relative"
              >
                <div className="absolute left-[14px] top-2 bottom-2 w-px bg-gradient-to-b from-zinc-700/0 via-zinc-700/70 to-zinc-700/0" />

                <div className="space-y-6">
                  {howSteps.map((s) => (
                    <motion.div
                      key={s.n}
                      variants={{
                        hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
                        show: { opacity: 1, y: 0, filter: 'blur(0px)' }
                      }}
                      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                      className="flex gap-4"
                    >
                      <div className="w-7 h-7 rounded border border-zinc-700/80 bg-zinc-950/30 backdrop-blur-sm flex items-center justify-center text-xs font-mono text-green-400 flex-shrink-0 shadow-[0_0_0_1px_rgba(74,222,128,0.06)]">
                        {s.n}
                      </div>
                      <div className="pt-0.5">
                        <h3 className="text-white font-mono font-bold text-sm mb-1.5">
                          {s.title}
                        </h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="flex items-center justify-center min-h-[500px] overflow-visible">
              <OrbitingAgents />
            </div>
          </div>
        </section>

        {/* 5.5 Marquee Section */}
        <section className="py-12 border-t border-zinc-800/50">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between gap-4">
            <div className="text-xs font-mono text-white tracking-widest uppercase opacity-60 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> agents in motion
            </div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              infinite marquee
            </div>
          </div>

          <div className="agentmux-mask-fade-x overflow-hidden px-6 pb-6">
            <div className="relative">
              <div className="flex w-[200%] agentmux-marquee">
                {[...marqueeItems, ...marqueeItems].map((it, idx) => (
                  <div
                    key={`${it.label}-${idx}`}
                    className="flex items-center gap-2 mr-8 whitespace-nowrap"
                  >
                    <span className={`opacity-90 ${it.color}`}>{it.icon}</span>
                    <span className={`font-mono text-[11px] tracking-wide ${it.color}`}>{it.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 6. Pricing */}
        <section id="pricing" aria-label="Pricing" className="py-24 border-t border-zinc-800/50">
          <SectionLabel text="// pricing" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col">
              <h3 className="text-white font-mono font-bold text-lg mb-1">core</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-mono font-bold text-white">free</span>
                <span className="text-zinc-500 text-sm font-mono">forever · self-hosted</span>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Unlimited accounts</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Unlimited workspaces</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Local isolation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Community support</span>
                </div>
              </div>

              <button className="w-full border border-zinc-700 text-zinc-300 font-mono px-6 py-3 rounded hover:border-zinc-500 transition-colors">
                get started
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 flex flex-col overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/40 to-transparent" />

              <div className="flex items-center justify-between mb-1">
                <h3 className="text-white font-mono font-bold text-lg">cloud</h3>
                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-mono px-2.5 py-1 rounded">coming soon</span>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-mono font-bold text-white">$9</span>
                <span className="text-zinc-400 font-mono">/mo</span>
              </div>

              <div className="space-y-4 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Everything in Core</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Sync across devices</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Cloud secret management</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="text-green-400 w-4 h-4 flex-shrink-0" />
                  <span>Priority support</span>
                </div>
              </div>

              <WaitlistModal />
            </div>
          </div>
        </section>

        {/* 7. Final CTA */}
        <section aria-label="Get started" className="py-32 text-center border-t border-zinc-800/50">
          <h2 className="font-mono font-bold text-4xl text-white tracking-tight leading-tight">
            stop logging out.<br />
            <span className="text-green-400">start shipping.</span>
          </h2>

          <p className="text-zinc-400 font-mono text-sm mt-6 mb-12">
            join developers building faster with parallel ai instances.
          </p>

          <div className="max-w-lg mx-auto w-full">
            <InstallCommand />
          </div>
        </section>
        </div>
      </main>

      {/* 8. Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-zinc-600 font-mono text-xs">
            &gt;_ agentmux · © 2025 · MIT license
          </div>

          <nav aria-label="Footer" className="flex items-center gap-6 text-zinc-500 font-mono text-xs">
            <a href="https://github.com/reviate0/agentmux" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="hover:text-white transition-colors">GitHub</a>
            <a href="#features" aria-label="Features documentation" className="hover:text-white transition-colors">Docs</a>
            <a href="https://x.com/reviate0" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X profile" className="hover:text-white transition-colors">Twitter</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
