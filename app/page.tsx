"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const APPLY_URL = "https://razorpay.typeform.com/to/Aj64eENJ";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789{}[]<>/\\|+=_-";

type Win = { brand: string; headline: string; image: string; href?: string };

const wins: Win[] = [
  { brand: "// Agentic Platform", headline: "Payment platform to manage your money movement with AI.", href: "https://razorpay.com/blog/razorpay-agentic-platform", image: "/assets/fold4-agentic-platform.webp" },
  { brand: "// Agentic Payments", headline: "AI-powered conversations that take you through discovery to purchase.", href: "https://razorpay.com/agentic-payments/", image: "/assets/fold4-agentic-payments.webp" },
  { brand: "// Agent Studio", headline: "Agents for payments and revenue. One click to deploy.", href: "https://razorpay.com/agent-studio/", image: "/assets/fold4-agent-studio.webp" },
  { brand: "// Slash", headline: "Non-engineers pushed code to production with AI.", image: "/assets/fold4-slash.webp" },
  { brand: "// Call-E", headline: "Helped 1000+ customers with AI calls.", image: "/assets/fold4-calle.webp" },
  { brand: "// AI-Led Marketing Campaigns", headline: "Lights. Camera. Action. All with AI.", image: "/assets/fold4-ai-marketing.webp" },
];

function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

function ScrambleText({ text, active = true, className = "" }: { text: string; active?: boolean; className?: string }) {
  const [shown, setShown] = useState(active ? "" : text);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = Math.max(26, text.length * 1.35);
    const id = window.setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * text.length);
      setShown(text.split("").map((char, index) => {
        if (char === " " || char === "\n") return char;
        return index < settled ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join(""));
      if (frame >= total) {
        window.clearInterval(id);
        setShown(text);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [active, text]);
  return <span className={className}>{shown || text.replace(/\S/g, "·")}</span>;
}

function BootScreen({ done }: { done: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const a = window.setTimeout(() => setPhase(1), 180);
    const b = window.setTimeout(() => setPhase(2), 1050);
    const c = window.setTimeout(done, 2050);
    return () => [a, b, c].forEach(window.clearTimeout);
  }, [done]);
  return (
    <div className={`boot-screen phase-${phase}`} aria-hidden="true">
      <div className="boot-mark"><ScrambleText text="razorpay/ai" active={phase > 0} /><span className="boot-cursor" /></div>
      <div className="boot-lines"><i /><i /><i /></div>
    </div>
  );
}

function AsciiImage({ src, color = "#1b4dff", cols = 92, className = "" }: { src: string; color?: string; cols?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let raf = 0;
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const ratio = image.naturalHeight / image.naturalWidth;
      const rows = Math.max(24, Math.round(cols * ratio * 0.52));
      canvas.width = cols * 7;
      canvas.height = rows * 12;
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sx = sample.getContext("2d", { willReadFrequently: true });
      if (!sx) return;
      sx.drawImage(image, 0, 0, cols, rows);
      const pixels = sx.getImageData(0, 0, cols, rows).data;
      const chars = " .,:;i1tfLCG08@";
      const draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = color;
        context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        context.globalAlpha = 0.88;
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const p = (y * cols + x) * 4;
            const alpha = pixels[p + 3] / 255;
            if (alpha < 0.08) continue;
            const light = (pixels[p] * 0.2126 + pixels[p + 1] * 0.7152 + pixels[p + 2] * 0.0722) / 255;
            if (light < 0.075) continue;
            const jitter = Math.random() < 0.002 ? Math.random() * chars.length : 0;
            const index = Math.min(chars.length - 1, Math.floor((light * 0.86 + alpha * 0.14) * chars.length + jitter));
            context.fillText(chars[index], x * 7, y * 12 + 10);
          }
        }
        raf = window.setTimeout(draw, 180) as unknown as number;
      };
      draw();
    };
    return () => window.clearTimeout(raf);
  }, [src, color, cols]);
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function ScrollStage({ className = "", id, children }: { className?: string; id?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      node.style.setProperty("--progress", String(progress));
      node.dataset.inview = rect.top < vh * 0.78 && rect.bottom > vh * 0.18 ? "true" : "false";
    };
    const request = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => { window.cancelAnimationFrame(raf); window.removeEventListener("scroll", request); window.removeEventListener("resize", request); };
  }, []);
  return <section ref={ref} id={id} className={className}>{children}</section>;
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-shell">
      <a className="brand" href="#hero" aria-label="Razorpay AI Builders home"><img src="/assets/razorpay-logo.svg" alt="Razorpay AI Builders" /></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#eligibility">Eligibility</a><a href="#process">Process</a><a href="#wins">Our AI Wins</a>
        <a className="nav-apply" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a>
      </nav>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}><span /><span /></button>
      {open && <nav className="mobile-menu"><a href="#eligibility" onClick={() => setOpen(false)}>Eligibility</a><a href="#process" onClick={() => setOpen(false)}>Process</a><a href="#wins" onClick={() => setOpen(false)}>Our AI Wins</a><a href={APPLY_URL}>Apply Now</a></nav>}
    </header>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.max(0, Math.min(1, -node.getBoundingClientRect().top / Math.max(1, node.offsetHeight * 0.8)));
      node.style.setProperty("--hero-scroll", String(p));
    };
    const request = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", request, { passive: true }); update();
    return () => { window.removeEventListener("scroll", request); window.cancelAnimationFrame(raf); };
  }, []);
  return (
    <section id="hero" ref={ref} className={`hero ${ready ? "ready" : ""}`}>
      <div className="hero-grid" />
      <h1><span>Hiring The Most </span><em><ScrambleText text="Obsessed AI Builders" active={ready} /></em><br /><span>To Solve The Toughest Problems</span></h1>
      <a className="hero-apply" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a>
      <div className="hero-scene" aria-hidden="true">
        <img className="bg-layer" src="/assets/bg-layer.webp" alt="" />
        <img className="hero-person person-one" src="/assets/person-1.webp" alt="" /><img className="hero-object monitor" src="/assets/monitor.webp" alt="" /><img className="hero-object keyboard" src="/assets/keyboard.webp" alt="" />
        <img className="hero-person person-two" src="/assets/person-2.webp" alt="" /><img className="hero-object tablet" src="/assets/mid-tablet.webp" alt="" /><img className="hero-object pot" src="/assets/pot.webp" alt="" />
        <img className="hero-person person-three" src="/assets/person-3.webp" alt="" /><img className="hero-object right-tablet" src="/assets/right-tablet.webp" alt="" /><img className="hero-object cup" src="/assets/chat-gpt-cup.webp" alt="" /><img className="table" src="/assets/table-surface.webp" alt="" />
        <AsciiImage src="/assets/person-1.webp" cols={60} color="#9aa7b9" className="hero-ascii hero-ascii-one" /><AsciiImage src="/assets/person-2.webp" cols={52} color="#91a5c8" className="hero-ascii hero-ascii-two" />
        <div className="code-card card-a">l9Kq<br />0x11<br />LLM</div><div className="code-card card-b">1011<br />AI_01<br />exec</div>
      </div>
    </section>
  );
}

function Intro() {
  const copy = "The AI era has created a new generation of exceptional builders. We value those who have dedicated the last few years to mastering this craft through relentless learning, experimentation, and execution. If you possess the rare drive to turn the unimaginable into reality, let's craft the future together. Come build with us. Here's what life at Razorpay looks like.";
  const words = copy.split(" ");
  return (
    <ScrollStage className="intro">
      <p>{words.map((word, index) => <span key={`${word}-${index}`} style={{ "--word": index / words.length } as React.CSSProperties}>{word} </span>)}</p>
      <div className="manifesto"><span>/Unlimited Tokens</span><span>/Any Model</span><span>/Any Tool</span><span>/No Hierarchy</span><span>/Ship Fast</span></div>
    </ScrollStage>
  );
}

function Eligibility() {
  const [ref, visible] = useInView<HTMLElement>(0.3);
  return (
    <section ref={ref} id="eligibility" className={`eligibility ${visible ? "visible" : ""}`}>
      <div className="eligibility-art"><img src="/assets/person-2-ascii.svg" alt="" className="eligibility-ascii" /><div className="scanlines" /><span className="target t1" /><span className="target t2" /><span className="target t3" /><span className="pulse-dot">CLICK</span></div>
      <p className="callout callout-left">SPEAKS IN PROMPTS<br />AND GITHUB LINKS</p><p className="callout callout-top">ALWAYS THINKING<br />HOW TO HARNESS AI</p><p className="callout callout-right">SEES EVERY WORKFLOW<br />AS AN AGENT LOOP</p>
      <h2><ScrambleText text="Is this " active={visible} /><em>you?</em></h2>
    </section>
  );
}

function ProcessMonitor() {
  const [channel, setChannel] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const channels = ["SYSTEM READY", "HUMAN / BUILDER", "CAT AGENT", "RAT LOOP", "NIGHT SHIFT"];
  const cycle = () => {
    if (glitch) return;
    setGlitch(true);
    window.setTimeout(() => { setChannel((channel + 1) % channels.length); setGlitch(false); }, 420);
  };
  return <button type="button" className={`screen-channel ${glitch ? "glitching" : ""}`} onClick={cycle} aria-label="Change the channel on the monitor"><span className="screen-hint">CLICK HERE</span><span className="screen-noise" /><span className="screen-subject">{channels[channel]}</span><span className="screen-click">CLICK</span></button>;
}

function Process() {
  const [ref, visible] = useInView<HTMLElement>(0.3);
  return (
    <section ref={ref} id="process" className={`process ${visible ? "visible" : ""}`}>
      <div className="process-visual">
        <img className="process-desk" src="/assets/fold3-desk-clean.webp" alt="" /><img src="/assets/fold3-person.webp" alt="" className="process-person-ascii" /><img className="process-chair" src="/assets/fold3-chair.webp" alt="" /><ProcessMonitor />
      </div>
      <div className="process-copy"><h2><ScrambleText text="No resume theatre. Just" active={visible} /><br /><ScrambleText text="show us what you’ve built." active={visible} /></h2><p>Three steps. No nonsense.</p><ol><li><span>1/</span> Fill the form</li><li><span>2/</span> Submit your project or GitHub</li><li><span>3/</span> If it has signal, we’ll call in 48 hrs</li></ol><a className="outline-button" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a></div>
    </section>
  );
}

function Wins() {
  const [active, setActive] = useState(2);
  const [ref, visible] = useInView<HTMLElement>(0.18);
  const move = (delta: number) => setActive((active + delta + wins.length) % wins.length);
  return (
    <section ref={ref} id="wins" className={`wins ${visible ? "visible" : ""}`}>
      <h2><ScrambleText text="We’re doing a lot with AI." active={visible} /><br /><ScrambleText text="We still don’t think it’s enough." active={visible} /></h2>
      <div className="carousel-viewport"><div className="carousel-track" style={{ transform: `translateX(calc(50% - ${(active + 0.5) * 52}vw))` }}>{wins.map((win, index) => <article className={`win-slide ${index === active ? "active" : ""}`} key={win.brand}><img src={win.image} alt="" /><div className="win-copy"><p>{win.brand}</p><h3>{win.headline}</h3>{win.href && <a href={win.href} target="_blank" rel="noreferrer">Know More</a>}</div></article>)}</div><button className="arrow left" type="button" onClick={() => move(-1)} aria-label="Previous AI win">‹</button><button className="arrow right" type="button" onClick={() => move(1)} aria-label="Next AI win">›</button></div>
    </section>
  );
}

function DraggableChair({ className }: { className: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const drag = useRef({ x: 0, y: 0, px: 0, py: 0, active: false });
  const move = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!drag.current.active || !ref.current) return;
    drag.current.x += event.clientX - drag.current.px; drag.current.y += event.clientY - drag.current.py; drag.current.px = event.clientX; drag.current.py = event.clientY;
    ref.current.style.transform = `translate3d(${drag.current.x}px,${drag.current.y}px,0) rotate(${drag.current.x / 18}deg)`;
  };
  return <img ref={ref} className={`roles-chair ${className}`} src="/assets/fold5-chair.webp" alt="" draggable={false} onPointerDown={(event) => { drag.current.active = true; drag.current.px = event.clientX; drag.current.py = event.clientY; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={move} onPointerUp={() => { drag.current.active = false; }} />;
}

function OtherRoles() {
  return <section className="other-roles"><div className="roles-bg" /><DraggableChair className="chair-one" /><DraggableChair className="chair-two" /><h2>Looking for Other Roles?</h2><a href="https://razorpay.com/careers/" target="_blank" rel="noreferrer">check out our careers page. ↗</a><span className="drag-note">DRAG TO EXPLORE</span></section>;
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
function ArcadeGame({ running, setRunning }: { running: boolean; setRunning: (value: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef(0.5);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0, last = performance.now(), score = 0, fever = false;
    let ball = { x: canvas.clientWidth * 0.5, y: canvas.clientHeight * 0.45, vx: 260, vy: 310 };
    let paddleX = canvas.clientWidth * 0.5;
    const particles: Particle[] = [];
    let bricks: { x: number; w: number; alive: boolean; color: string }[] = [];
    const colors = ["#ff4260", "#ff9838", "#e1dc43", "#6fe36f", "#42d8c6", "#6c89ff", "#c850e8"];
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1); const w = canvas.clientWidth; const h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bricks = Array.from({ length: 17 }, (_, i) => ({ x: i * (w / 17) + 1, w: w / 17 - 2, alive: true, color: colors[i % colors.length] }));
      ball = { x: w * 0.5, y: h * 0.36, vx: 260, vy: 320 }; paddleX = w * 0.5;
    };
    const burst = (x: number, y: number, color: string) => { for (let i = 0; i < 20; i += 1) particles.push({ x, y, vx: (Math.random() - 0.5) * 280, vy: (Math.random() - 0.5) * 260, life: 1, color }); };
    const draw = (now: number) => {
      const dt = Math.min(0.025, (now - last) / 1000); last = now; const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = fever ? "rgba(10,18,15,.18)" : "rgba(12,12,12,.34)"; ctx.fillRect(0, 0, w, h);
      if (running) {
        paddleX += (pointer.current * w - paddleX) * 0.18; ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        if (ball.x < 8 || ball.x > w - 8) ball.vx *= -1; if (ball.y < 8) ball.vy = Math.abs(ball.vy);
        const paddleY = h * 0.32; if (ball.y > paddleY - 12 && ball.y < paddleY + 12 && Math.abs(ball.x - paddleX) < 72 && ball.vy > 0) { ball.vy *= -1.025; ball.vx += (ball.x - paddleX) * 2.5; score += 1; burst(ball.x, ball.y, colors[score % colors.length]); }
        if (ball.y > h - 38) { const hit = bricks.find((b) => b.alive && ball.x > b.x && ball.x < b.x + b.w); if (hit) { hit.alive = false; ball.vy = -Math.abs(ball.vy); score += 1; burst(ball.x, h - 34, hit.color); } else if (ball.y > h + 20) ball = { x: w * 0.5, y: h * 0.4, vx: 240, vy: 310 }; }
        if (score >= 9) fever = true;
      }
      ctx.strokeStyle = fever ? colors[score % colors.length] : "#ececec"; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(paddleX - 70, h * 0.32); ctx.lineTo(paddleX + 70, h * 0.32); ctx.stroke();
      bricks.forEach((brick) => { if (!brick.alive) return; ctx.fillStyle = fever ? brick.color : "#d9dde3"; ctx.fillRect(brick.x, h - 32, brick.w, 30); ctx.strokeStyle = "rgba(0,0,0,.38)"; ctx.strokeRect(brick.x, h - 32, brick.w, 30); });
      const trail = 7; for (let i = trail; i > 0; i -= 1) { ctx.beginPath(); ctx.fillStyle = `rgba(255,255,255,${0.08 + (trail - i) * 0.035})`; ctx.arc(ball.x - ball.vx * dt * i * 0.65, ball.y - ball.vy * dt * i * 0.65, 3 + (trail - i) * 0.32, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.shadowBlur = fever ? 28 : 10; ctx.shadowColor = fever ? colors[score % colors.length] : "white"; ctx.fillStyle = fever ? colors[score % colors.length] : "white"; ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.85; ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 3, 3); }); ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i -= 1) if (particles[i].life <= 0) particles.splice(i, 1);
      ctx.font = "11px ui-monospace, monospace"; ctx.fillStyle = fever ? colors[(score + 2) % colors.length] : "#ff3a4d"; ctx.fillText(`LASER ${Math.max(0, 8.4 - score * 0.28).toFixed(1)}s`, Math.max(8, paddleX - 70), h * 0.32 - 13); ctx.fillStyle = "rgba(255,255,255,.45)"; ctx.fillText(`x${Math.max(1, score)}`, 20, 45);
      if (fever) { ctx.font = "700 58px Inter, sans-serif"; ctx.fillStyle = "rgba(206,255,92,.72)"; ctx.textAlign = "center"; ctx.fillText("FEVER MODE", w / 2, h * 0.52); ctx.textAlign = "left"; }
      raf = requestAnimationFrame(draw);
    };
    resize(); const onMove = (event: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.current = Math.max(0, Math.min(1, (event.clientX - r.left) / r.width)); };
    canvas.addEventListener("pointermove", onMove); window.addEventListener("resize", resize); raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("pointermove", onMove); window.removeEventListener("resize", resize); };
  }, [running]);
  return <canvas ref={canvasRef} className="game-canvas" onClick={() => !running && setRunning(true)} aria-label="Interactive arcade game" />;
}

function Footer() {
  const [running, setRunning] = useState(false);
  return <footer className={`footer ${running ? "game-running" : ""}`}><ArcadeGame running={running} setRunning={setRunning} /><div className="footer-title">Razorpay<br />/ai builders<sup>×{running ? 17 : 0}</sup></div><button className="game-toggle" type="button" onClick={() => setRunning(!running)}><u>{running ? "STOP" : "PLAY"}</u> this game.<br />Bet you can win.</button><p className="copyright">Copyright © Razorpay</p><div className="socials"><a href="https://www.instagram.com/razorpay/">Instagram</a><span>|</span><a href="https://x.com/razorpay">X</a><span>|</span><a href="https://www.linkedin.com/company/razorpay/">LinkedIn</a><span>|</span><a href="https://razorpay.com/">www.razorpay.com</a></div></footer>;
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return <div className="site-shell">{!ready && <BootScreen done={done} />}<Navbar /><main><Hero ready={ready} /><Intro /><Eligibility /><Process /><Wins /><OtherRoles /></main><Footer /></div>;
}
