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

function useMotionStage<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold });
    observer.observe(node);

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const enter = Math.max(0, Math.min(1, (progress - 0.05) / 0.35));
      const exit = Math.max(0, Math.min(1, (progress - 0.78) / 0.2));
      node.style.setProperty("--motion", String(progress));
      node.style.setProperty("--enter", String(enter));
      node.style.setProperty("--exit", String(exit));
      node.style.setProperty("--presence", String(enter * (1 - exit)));
      node.dataset.phase = exit > 0.02 ? "exit" : enter < 0.98 ? "enter" : "hold";
    };
    const request = () => { if (!raf) raf = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [threshold]);
  return [ref, visible] as const;
}

function ScrambleText({ text, active = true, className = "" }: { text: string; active?: boolean; className?: string }) {
  const [shown, setShown] = useState(active ? "" : text);
  useEffect(() => {
    if (!active) {
      setShown(text);
      return;
    }
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

function HoverScramble({ text, className = "" }: { text: string; className?: string }) {
  const [run, setRun] = useState(0);
  return <span className={className} onPointerEnter={() => setRun((value) => value + 1)}><ScrambleText key={run} text={text} active={run > 0} /></span>;
}

function ScrambleLink({ href, children, className = "" }: { href: string; children: string; className?: string }) {
  const [run, setRun] = useState(0);
  return <a className={className} href={href} onPointerEnter={() => setRun((value) => value + 1)}><ScrambleText key={run} text={children} active={run > 0} /></a>;
}

function DraggableTile({ className, children }: { className: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, y: 0, px: 0, py: 0, active: false });
  return <div ref={ref} className={`code-card ${className}`} onPointerDown={(event) => {
    drag.current.active = true;
    drag.current.px = event.clientX;
    drag.current.py = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }} onPointerMove={(event) => {
    if (!drag.current.active || !ref.current) return;
    drag.current.x += event.clientX - drag.current.px;
    drag.current.y += event.clientY - drag.current.py;
    drag.current.px = event.clientX;
    drag.current.py = event.clientY;
    ref.current.style.translate = `${drag.current.x}px ${drag.current.y}px`;
  }} onPointerUp={() => { drag.current.active = false; }}><span className="tile-dot" />{children}<small>DRAG</small></div>;
}

function BootScreen({ done }: { done: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const a = window.setTimeout(() => setPhase(1), 620);
    const b = window.setTimeout(() => setPhase(2), 1820);
    const c = window.setTimeout(done, 2280);
    return () => [a, b, c].forEach(window.clearTimeout);
  }, [done]);
  return (
    <div className={`boot-screen phase-${phase}`} aria-hidden="true">
      <div className="boot-mark"><ScrambleText key={phase} text={phase === 0 ? "razorpol@~$" : "razorpay/ai"} active={phase > 0} /><span className="boot-cursor" /></div>
    </div>
  );
}

function AsciiImage({ src, color = "#1b4dff", cols = 92, className = "", inverse = false }: { src: string; color?: string; cols?: number; className?: string; inverse?: boolean }) {
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
            const density = inverse ? 1 - light : light * 0.86 + alpha * 0.14;
            if (density < 0.075) continue;
            const jitter = Math.random() < 0.002 ? Math.random() * chars.length : 0;
            const index = Math.min(chars.length - 1, Math.floor(density * chars.length + jitter));
            context.fillText(chars[index], x * 7, y * 12 + 10);
          }
        }
        raf = window.setTimeout(draw, 180) as unknown as number;
      };
      draw();
    };
    return () => window.clearTimeout(raf);
  }, [src, color, cols, inverse]);
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function PixelDissolveImage({ src, className = "", cols = 132 }: { src: string; className?: string; cols?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const image = new Image();
    let timer = 0;
    image.src = src;
    image.onload = () => {
      const rows = Math.max(48, Math.round(cols * image.naturalHeight / image.naturalWidth));
      canvas.width = cols;
      canvas.height = rows;
      const render = () => {
        context.clearRect(0, 0, cols, rows);
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, cols, rows);
        for (let y = 0; y < rows; y += 1) {
          for (let x = 0; x < cols; x += 1) {
            const edge = Math.abs(x / cols - .5) + Math.abs(y / rows - .52);
            const probability = .17 + edge * .19 + (Math.sin(x * 2.1 + y * 1.7) + 1) * .045;
            if (Math.random() < probability) context.clearRect(x, y, 1, 1);
          }
        }
        timer = window.setTimeout(render, 110);
      };
      render();
    };
    return () => window.clearTimeout(timer);
  }, [cols, src]);
  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

function CustomCursor() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!ref.current || event.pointerType === "touch") return;
      ref.current.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
      ref.current.classList.add("active");
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return <span ref={ref} className="custom-cursor" aria-hidden="true" />;
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
        <ScrambleLink href="#eligibility">Eligibility</ScrambleLink><ScrambleLink href="#process">Process</ScrambleLink><ScrambleLink href="#wins">Our AI Wins</ScrambleLink>
        <a className="nav-apply" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a>
      </nav>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-label="Toggle menu" onClick={() => setOpen(!open)}><span /><span /></button>
      {open && <nav className="mobile-menu"><a href="#eligibility" onClick={() => setOpen(false)}>Eligibility</a><a href="#process" onClick={() => setOpen(false)}>Process</a><a href="#wins" onClick={() => setOpen(false)}>Our AI Wins</a><a href={APPLY_URL}>Apply Now</a></nav>}
    </header>
  );
}

function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [hoveredPerson, setHoveredPerson] = useState(0);
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
      <div className={`hero-scene hover-person-${hoveredPerson}`}>
        <img className="bg-layer" src="/assets/bg-layer.webp" alt="" />
        <img className="hero-person person-one" src="/assets/person-1.webp" alt="" /><img className="hero-object monitor" src="/assets/monitor.webp" alt="" /><img className="hero-object keyboard" src="/assets/keyboard.webp" alt="" />
        <img className="hero-person person-two" src="/assets/person-2.webp" alt="" /><img className="hero-object tablet" src="/assets/mid-tablet.webp" alt="" /><img className="hero-object pot" src="/assets/pot.webp" alt="" />
        <img className="hero-person person-three" src="/assets/person-3.webp" alt="" /><img className="hero-object right-tablet" src="/assets/right-tablet.webp" alt="" /><img className="table" src="/assets/table-surface.webp" alt="" />
        <img className="hero-object book book-bottom" src="/assets/book-bottom.webp" alt="" /><img className="hero-object book book-middle" src="/assets/book-middle.webp" alt="" /><img className="hero-object book book-top" src="/assets/book-top.webp" alt="" /><img className="hero-object books-shadow" src="/assets/books-shadow.webp" alt="" />
        <img className="hero-object coffee-shadow" src="/assets/coffee-shadow.webp" alt="" /><img className="hero-object desk-coffee" src="/assets/coffee.webp" alt="" /><img className="hero-object desk-ipad" src="/assets/right-tablet.webp" alt="" />
        <img className="hero-object chat-cup-shadow" src="/assets/chat-gpt-cup-shadow.webp" alt="" /><img className="hero-object cup" src="/assets/chat-gpt-cup.webp" alt="" /><img className="hero-object mug-shadow" src="/assets/coffee-mug-shadow.webp" alt="" /><img className="hero-object coffee-mug" src="/assets/coffee-mug.webp" alt="" />
        <PixelDissolveImage src="/assets/person-1.webp" className="hero-pixel pixel-one" /><PixelDissolveImage src="/assets/person-2.webp" className="hero-pixel pixel-two" /><PixelDissolveImage src="/assets/person-3.webp" className="hero-pixel pixel-three" />
        <AsciiImage src="/assets/person-1.webp" cols={92} color="#9aa7b9" className="hero-ascii hero-ascii-one" /><AsciiImage src="/assets/person-2.webp" cols={82} color="#91a5c8" className="hero-ascii hero-ascii-two" /><AsciiImage src="/assets/person-3.webp" cols={74} color="#8aa2c9" className="hero-ascii hero-ascii-three" />
        <button className="person-hover-zone zone-one" type="button" aria-label="Inspect builder one" onPointerEnter={() => setHoveredPerson(1)} onPointerLeave={() => setHoveredPerson(0)} />
        <button className="person-hover-zone zone-two" type="button" aria-label="Inspect builder two" onPointerEnter={() => setHoveredPerson(2)} onPointerLeave={() => setHoveredPerson(0)} />
        <button className="person-hover-zone zone-three" type="button" aria-label="Inspect builder three" onPointerEnter={() => setHoveredPerson(3)} onPointerLeave={() => setHoveredPerson(0)} />
        <DraggableTile className="card-a">J<br />iC+<br />kqa.<br />Cp=</DraggableTile><DraggableTile className="card-b">{`':ttl;\n-asapv\n1tshd\n+fxop`}</DraggableTile><DraggableTile className="card-c">exec<br />0x90<br />vUw0<br />LLM</DraggableTile>
        <span className="hero-flower" aria-hidden="true">✳</span>
      </div>
    </section>
  );
}

function Intro() {
  const copy = "The AI era has created a new generation of exceptional builders. We value those who have dedicated the last few years to mastering this craft through relentless learning, experimentation, and execution. If you possess the rare drive to turn the unimaginable into reality, let's craft the future together. Come build with us. Here's what life at Razorpay looks like.";
  const words = copy.split(" ");
  return (
    <ScrollStage className="intro">
      <p>{words.map((word, index) => <span key={`${word}-${index}`} style={{ "--word": index / words.length } as React.CSSProperties}><HoverScramble text={`${word} `} /></span>)}</p>
      <div className="manifesto"><HoverScramble text="/Unlimited Tokens" /><HoverScramble text="/Any Model" /><HoverScramble text="/Any Tool" /><HoverScramble text="/No Hierarchy" /><HoverScramble text="/Ship Fast" /></div>
    </ScrollStage>
  );
}

function ModalClose({ close }: { close: () => void }) {
  return <button type="button" className="modal-close" onClick={close}><span>×</span> CLOSE</button>;
}

function BrainModal({ close }: { close: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angle = useRef(-0.18);
  const drag = useRef({ active: false, x: 0 });
  const [shift, setShift] = useState(0);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setPulse((value) => value + 1), 900);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let raf = 0;
    const points: { x: number; y: number; z: number; glow: number }[] = [];
    for (let y = -1; y <= 1; y += .035) {
      for (let x = -1.16; x <= 1.16; x += .035) {
        const dome = (x / 1.12) ** 2 + ((y + .08) / .93) ** 2;
        const lowerCut = y > .54 && Math.abs(x) < .16 + (y - .54) * .9;
        const lobeNoise = Math.sin(x * 26) * .025 + Math.sin(y * 31) * .03;
        if (dome < 1 + lobeNoise && !lowerCut && Math.random() > .22) {
          const z = Math.sqrt(Math.max(0, 1 - Math.min(1, dome))) * (Math.random() > .5 ? 1 : -1);
          points.push({ x, y, z, glow: Math.random() });
        }
      }
    }
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time: number) => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      const c = Math.cos(angle.current), s = Math.sin(angle.current);
      points.forEach((point, index) => {
        const rx = point.x * c - point.z * s;
        const rz = point.x * s + point.z * c;
        const scale = 1 + rz * .14;
        const px = width * .49 + rx * width * .285 * scale;
        const py = height * .47 + point.y * height * .37 * scale;
        const twinkle = .42 + .38 * Math.sin(time * .0017 + index * .19) + point.glow * .2;
        context.fillStyle = `rgba(235,235,235,${Math.max(.08, twinkle)})`;
        context.fillRect(px, py, 1.5 + scale, 1.5 + scale);
      });
      raf = window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    raf = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  const cardShift = (amount: number) => ({ transform: `translate3d(${shift * amount}px,${Math.sin(shift / 70) * amount * .18}px,0)` });
  return <div className={`mind-modal mind-head ${shift ? "brain-interacted" : ""}`} role="dialog" aria-modal="true" aria-label="Inside an AI builder's brain">
    <ModalClose close={close} />
    <img className="brain-modal-reference" src="/assets/brain-modal-desktop.png" alt="" aria-hidden="true" />
    <canvas ref={canvasRef} className="brain-cloud" onPointerDown={(event) => { drag.current.active = true; drag.current.x = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => {
      if (!drag.current.active) return;
      const delta = event.clientX - drag.current.x;
      drag.current.x = event.clientX;
      angle.current += delta * .006;
      setShift((value) => Math.max(-90, Math.min(90, value + delta * .28)));
    }} onPointerUp={() => { drag.current.active = false; }} />
    <svg className="brain-links" viewBox="0 0 1470 956" preserveAspectRatio="none" aria-hidden="true"><path d="M302 316 L700 495 L1123 294" /><path d="M387 673 L710 498 L1200 652" /></svg>
    <div className="brain-card card-token" style={cardShift(-.35)}><small>TOKENS</small><span>SPENT: ${(1490 + pulse * 3).toLocaleString()} &nbsp; LIMIT: $5,000</span><b>────────────</b><span>You&apos;re getting close to your limit</span></div>
    <div className="brain-card card-ideas" style={cardShift(-.22)}>Ideas At<br />2 AM</div>
    <div className="brain-card card-audio" style={cardShift(.2)}><small>● Now Playing</small><b>The Future Of<br />Everything In AI</b><span>▂▅▇▃▆▅▂</span></div>
    <div className="brain-card card-rank" style={cardShift(-.16)}><small>● AI Leaderboard</small><span>#1 Claude&nbsp;&nbsp;&nbsp;94.2</span><span>#2 Gemini&nbsp;&nbsp;&nbsp;92.7</span><span>#3 ChatGPT&nbsp;&nbsp;90.1</span><span>#4 Grok&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;88.4</span></div>
    <div className="brain-card card-future" style={cardShift(.31)}>Things That<br />Could Be AI</div>
    <div className="brain-card card-products" style={cardShift(.42)}>Products<br />To Build</div>
    <div className="brain-card card-terminal" style={cardShift(-.44)}><i /><i /><i /><pre>opening a startup idea{`\n`}training 10 models{`\n`}deploy successful - humans involved</pre></div>
    <div className="mind-stats"><b>IN MY BRAIN</b><span>LEFT HEMISPHERE&nbsp;&nbsp;&nbsp;RIGHT HEMISPHERE</span><span>TASKS RUNNING&nbsp; {38 + pulse % 9}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{641 + pulse * 2}</span><span>TO BE STARTED {5410 + pulse * 7}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{909 + pulse}</span></div>
    <div className="modal-gesture"><b>♧</b>DRAG</div>
  </div>;
}

const eyeCards = [
  "eye-goldfish.webp", "eye-forest2.webp", "eye-raj-harold.webp", "frame-2147240429.webp",
  "frame-2147240438.webp", "frame-2147240439.webp", "frame-2147240442.webp", "frame-2147240441.webp",
];

function EyeModal({ close }: { close: () => void }) {
  const [stage, setStage] = useState(0);
  const swipe = useRef({ active: false, y: 0 });
  const lastStep = useRef(0);
  const depth = stage * .7;
  const moveStage = (direction: number) => setStage((value) => Math.max(0, Math.min(3, value + direction)));
  const step = (direction: number) => {
    const now = performance.now();
    if (now - lastStep.current < 420) return;
    lastStep.current = now;
    moveStage(direction);
  };
  return <div className={`mind-modal mind-eyes eye-stage-${stage}`} role="dialog" aria-modal="true" aria-label="Through an AI builder's eyes" onWheel={(event) => step(Math.sign(event.deltaY))} onPointerDown={(event) => {
    if ((event.target as HTMLElement).closest("button")) return;
    swipe.current = { active: true, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  }} onPointerMove={(event) => {
    if (!swipe.current.active) return;
    const delta = swipe.current.y - event.clientY;
    if (Math.abs(delta) < 28) return;
    swipe.current.y = event.clientY;
    step(Math.sign(delta));
  }} onPointerUp={() => { swipe.current.active = false; }}>
    <ModalClose close={close} />
    <img className="eye-modal-reference" src={`/assets/eye-modal-stage${stage}.png`} alt="" aria-hidden="true" />
    <div className="eye-stars" aria-hidden="true" />
    <div className="eye-card-field">{eyeCards.map((file, index) => {
      const lane = ((index * 1.35 - depth) % 8 + 8) % 8;
      const scale = .25 + lane * .105;
      const x = Math.sin(index * 2.19) * 31;
      const y = Math.cos(index * 1.47) * 24;
      return <img key={file} src={`/assets/${file}`} alt="" style={{ left: `${50 + x}%`, top: `${48 + y}%`, opacity: Math.max(.16, 1 - Math.abs(4.8 - lane) * .16), transform: `translate(-50%,-50%) scale(${scale})`, zIndex: Math.round(lane * 10) }} />;
    })}</div>
    <div className="eye-stats"><b>THROUGH MY EYES</b><span>PIXELS TO PROCESS&nbsp;&nbsp;&nbsp; 40M</span><span>ANOMALIES DETECTED&nbsp;&nbsp;&nbsp; 14</span><span>IMAGINED INTERFACES&nbsp;&nbsp;&nbsp; 1,500</span><span>IDEAS RENDERED&nbsp;&nbsp;&nbsp; 420</span></div>
    <div className="modal-gesture eye-scroll"><b>◉</b>SCROLL</div>
  </div>;
}

function VoiceModal({ close }: { close: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: .5, y: .5 });
  const [activated, setActivated] = useState(false);
  const [muted, setMuted] = useState(false);
  const [ticks, setTicks] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTicks((value) => value + 1), 720);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let raf = 0;
    const resize = () => { const dpr = Math.min(2, window.devicePixelRatio || 1); canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; context.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const draw = (time: number) => {
      const width = canvas.clientWidth, height = canvas.clientHeight;
      context.clearRect(0, 0, width, height);
      const horizon = height * .49;
      for (let row = 0; row < 66; row += 1) {
        const p = row / 65;
        const y = horizon + p * p * height * .58;
        const spacing = 3 + p * 8;
        const wave = Math.sin(time * .0013 + row * .24) * (11 + p * 23);
        for (let x = -20; x < width + 20; x += spacing) {
          const influence = Math.max(0, 1 - Math.hypot(x / width - pointer.current.x, y / height - pointer.current.y) * 3.2);
          const py = y + wave * Math.sin(x * .009 + row * .08) - influence * 32;
          context.fillStyle = `rgba(245,245,245,${.17 + p * .7})`;
          context.fillRect(x, py, 1.2 + p * 1.2, 1.2 + p * 1.2);
        }
      }
      raf = window.requestAnimationFrame(draw);
    };
    resize(); window.addEventListener("resize", resize); raf = window.requestAnimationFrame(draw);
    return () => { window.cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <div className={`mind-modal mind-mouth ${activated ? "voice-active" : ""}`} role="dialog" aria-modal="true" aria-label="Inside an AI builder's words">
    <ModalClose close={close} />
    <button className="voice-mute" type="button" aria-label={muted ? "Unmute voice" : "Mute voice"} onClick={() => setMuted(!muted)}>{muted ? "⌁" : "◖"}</button>
    <canvas ref={canvasRef} className="voice-canvas" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); pointer.current = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height }; setActivated(true); }} />
    <img className="voice-modal-reference" src="/assets/voice-modal-active.png" alt="" aria-hidden="true" />
    <div className="voice-stats"><b>IN MY WORDS</b><span>AI MENTIONS&nbsp;&nbsp;&nbsp; {141 + ticks}</span><span>MINUTES STREAMED&nbsp;&nbsp;&nbsp; {239 + ticks}</span><span>IDEAS IN QUEUE&nbsp;&nbsp;&nbsp; 1,200</span><span>TRACKS RECORDED&nbsp;&nbsp;&nbsp; 4</span></div>
  </div>;
}

function Eligibility() {
  const [ref, visible] = useMotionStage<HTMLElement>(0.18);
  const [modal, setModal] = useState<"head" | "eyes" | "mouth" | null>(null);
  const [guide, setGuide] = useState(0);
  useEffect(() => {
    if (!visible || modal) return;
    const timer = window.setInterval(() => setGuide((value) => (value + 1) % 3), 1400);
    return () => window.clearInterval(timer);
  }, [modal, visible]);
  return (
    <section ref={ref} id="eligibility" className={`eligibility ${visible ? "visible" : ""}`}>
      <div className="eligibility-stage">
        <canvas className="eligibility-field" aria-hidden="true" />
        <img className="eligibility-reference" src="/assets/eligibility-desktop-1470.png" alt="" aria-hidden="true" />
        <span className="static-pulse-mask" aria-hidden="true" />
        <span className={`guide-pulse guide-${guide}`} aria-hidden="true">CLICK<i /><i /><i /></span>
        <AsciiImage src="/assets/person-2.webp" color="#164cff" cols={164} className="eligibility-ascii" />
        <svg className="feature-lines" viewBox="0 0 1440 750" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="154,354 496,354 566,430" /><polyline points="792,152 1045,185 1240,185" /><polyline points="752,302 920,386 1245,386" />
        </svg>
        <span className="target t1"><i>x100</i></span><span className="target t2"><i>x100</i></span><span className="target t3"><i>x100</i></span>
        <button className="feature-hit head-hit" type="button" onClick={() => setModal("head")} aria-label="Explore how an AI builder thinks" />
        <button className="feature-hit eye-hit" type="button" onClick={() => setModal("eyes")} aria-label="Explore an AI builder's workflows"><span className="pulse-dot">CLICK</span></button>
        <button className="feature-hit mouth-hit" type="button" onClick={() => setModal("mouth")} aria-label="Explore an AI builder's prompts" />
        <p className="callout callout-left">SPEAKS IN PROMPTS<br />AND GITHUB LINKS</p><p className="callout callout-top">ALWAYS THINKING<br />HOW TO HARNESS AI</p><p className="callout callout-right">SEES EVERY WORKFLOW<br />AS AN AGENT LOOP</p>
        <h2><ScrambleText text="Is this " active={visible} /><em>you?</em></h2>
      </div>
      {modal === "head" && <BrainModal close={() => setModal(null)} />}
      {modal === "eyes" && <EyeModal close={() => setModal(null)} />}
      {modal === "mouth" && <VoiceModal close={() => setModal(null)} />}
    </section>
  );
}

function ProcessMonitor() {
  const [channel, setChannel] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const channels = [
    { label: "", video: "" },
    { label: "HUMAN / BUILDER", video: "https://cdn.razorpay.com/static/assets/ai-builders/images/channel-guy.mp4" },
    { label: "INTERVIEW LOOP", video: "https://cdn.razorpay.com/static/assets/ai-builders/images/channel-interview-loop.mp4" },
    { label: "CAT AGENT", video: "https://cdn.razorpay.com/static/assets/ai-builders/images/channel-cat-1.mp4" },
    { label: "RAT LOOP", video: "https://cdn.razorpay.com/static/assets/ai-builders/images/channel-rat.mp4" },
  ];
  const cycle = () => {
    if (glitch) return;
    setGlitch(true);
    window.setTimeout(() => setChannel((channel + 1) % channels.length), 260);
    window.setTimeout(() => setGlitch(false), 620);
  };
  return <button type="button" className={`screen-channel channel-${channel} ${glitch ? "glitching" : ""}`} onClick={cycle} aria-label="Change the channel on the monitor"><span className="screen-hint">CLICK HERE</span><span className="screen-noise" />{channel > 0 && <video className="screen-video" key={channels[channel].video} src={channels[channel].video} autoPlay muted loop playsInline />}<span className="screen-subject">{channels[channel].label}</span><span className="screen-click">CLICK</span></button>;
}

function Process() {
  const [ref, visible] = useMotionStage<HTMLElement>(0.18);
  return (
    <section ref={ref} id="process" className={`process ${visible ? "visible" : ""}`}>
      <div className="process-visual">
        <img className="process-desk" src="/assets/fold3-desk-clean.webp" alt="" /><AsciiImage src="/assets/fold3-person.webp" inverse color="#ececec" cols={92} className="process-person-ascii" /><img className="process-chair" src="/assets/fold3-chair.webp" alt="" /><ProcessMonitor />
      </div>
      <div className="process-copy"><h2><ScrambleText text="No resume theatre. Just" active={visible} /><br /><ScrambleText text="show us what you’ve built." active={visible} /></h2><p>Three steps. No nonsense.</p><ol><li><span>1/</span> Fill the form</li><li><span>2/</span> Submit your project or GitHub</li><li><span>3/</span> If it has signal, we’ll call in 48 hrs</li></ol><a className="outline-button" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a></div>
    </section>
  );
}

function Wins() {
  const [active, setActive] = useState(0);
  const [timerEpoch, setTimerEpoch] = useState(0);
  const [ref, visible] = useMotionStage<HTMLElement>(0.12);
  const move = (delta: number) => {
    setActive((value) => (value + delta + wins.length) % wins.length);
    setTimerEpoch((value) => value + 1);
  };
  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % wins.length), 6500);
    return () => window.clearInterval(timer);
  }, [timerEpoch, visible]);
  const previous = (active - 1 + wins.length) % wins.length;
  const next = (active + 1) % wins.length;
  return (
    <section ref={ref} id="wins" className={`wins ${visible ? "visible" : ""}`}>
      <h2><ScrambleText text="We’re doing a lot with AI." active={visible} /><br /><ScrambleText text="We still don’t think it’s enough." active={visible} /></h2>
      <div className="carousel-viewport">
        <img className="neighbor-card neighbor-left" src={wins[previous].image} alt="" /><img className="neighbor-card neighbor-right" src={wins[next].image} alt="" />
        <article className="win-slide active" key={wins[active].brand}><img src={wins[active].image} alt="" /><div className="win-copy"><p>{wins[active].brand}</p><h3>{wins[active].headline}</h3>{wins[active].href && <a href={wins[active].href} target="_blank" rel="noreferrer">Know More</a>}</div></article>
        <button className="arrow left" type="button" onClick={() => move(-1)} aria-label="Previous AI win">‹</button><button className="arrow right" type="button" onClick={() => move(1)} aria-label="Next AI win">›</button>
        <div className="carousel-dots" aria-label="AI wins slides">{wins.map((win, index) => <button className={index === active ? "active" : ""} type="button" key={win.brand} onClick={() => { setActive(index); setTimerEpoch((value) => value + 1); }} aria-label={`Go to card ${index + 1}`} />)}</div>
      </div>
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
  const [ref] = useMotionStage<HTMLElement>(0.1);
  return <section ref={ref} className="other-roles"><div className="roles-bg" /><img className="roles-reference" src="/assets/roles-desktop-1470.png" alt="" aria-hidden="true" /><DraggableChair className="chair-zero" /><DraggableChair className="chair-one" /><DraggableChair className="chair-two" /><DraggableChair className="chair-three" /><DraggableChair className="chair-four" /><h2>Looking for Other Roles?</h2><a href="https://razorpay.com/careers/" target="_blank" rel="noreferrer">check out our careers page. ↗</a><span className="drag-note">DRAG TO EXPLORE</span></section>;
}

type Particle = { x: number; y: number; vx: number; vy: number; life: number; color: string };
type GameBall = { x: number; y: number; vx: number; vy: number; color: string; trail: { x: number; y: number }[] };
type PowerUp = { x: number; y: number; vy: number; label: "CATCH" | "MEGA" | "LASER" | "MULTI"; color: string; life: number };
function ArcadeGame({ running, setRunning }: { running: boolean; setRunning: (value: boolean) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef(0.5);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0, last = performance.now(), score = 0, hits = 0, fever = false, spawnClock = 0, laserClock = 0;
    let balls: GameBall[] = [];
    let paddleX = canvas.clientWidth * 0.5;
    const particles: Particle[] = [];
    const powerUps: PowerUp[] = [];
    let bricks: { x: number; y: number; w: number; h: number; row: number; alive: boolean; color: string }[] = [];
    const colors = ["#ff4260", "#ff9838", "#e1dc43", "#6fe36f", "#42d8c6", "#6c89ff", "#c850e8"];
    const makeBall = (x: number, y: number, vx: number, vy: number, color = "#fff"): GameBall => ({ x, y, vx, vy, color, trail: [] });
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1); const w = canvas.clientWidth; const h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bricks = Array.from({ length: 34 }, (_, i) => {
        const row = Math.floor(i / 17); const column = i % 17;
        return { x: column * (w / 17) + 1, y: h - 82 + row * 37, w: w / 17 - 2, h: 35, row, alive: true, color: colors[(column + row * 2) % colors.length] };
      });
      balls = [makeBall(w * .5, h * .49, 245, 310)]; paddleX = w * 0.5;
    };
    const burst = (x: number, y: number, color: string) => { for (let i = 0; i < 20; i += 1) particles.push({ x, y, vx: (Math.random() - 0.5) * 280, vy: (Math.random() - 0.5) * 260, life: 1, color }); };
    const applyPower = (power: PowerUp, ball: GameBall) => {
      hits += power.label === "MEGA" ? 2 : 1;
      score += 3;
      if ((power.label === "MULTI" || power.label === "CATCH") && balls.length < (fever ? 5 : 3)) {
        balls.push(makeBall(ball.x, ball.y, -ball.vx * .92, ball.vy * .95, colors[(hits + 2) % colors.length]));
      }
      if (power.label === "LASER") laserClock = 7.5;
      burst(power.x, power.y, power.color);
      power.life = 0;
    };
    const draw = (now: number) => {
      const dt = Math.min(0.025, (now - last) / 1000); last = now; const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const wash = ctx.createLinearGradient(0, 0, w, h);
      wash.addColorStop(0, fever ? "rgba(38,73,48,.32)" : "rgba(12,12,12,.4)"); wash.addColorStop(.5, fever ? "rgba(28,18,48,.2)" : "rgba(12,12,12,.28)"); wash.addColorStop(1, fever ? "rgba(30,74,72,.28)" : "rgba(12,12,12,.4)");
      ctx.fillStyle = wash; ctx.fillRect(0, 0, w, h);
      if (running) {
        paddleX += (pointer.current * w - paddleX) * 0.2;
        spawnClock += dt;
        laserClock = Math.max(0, laserClock - dt);
        if (spawnClock > 4.2) {
          spawnClock = 0;
          const labels: PowerUp["label"][] = ["CATCH", "MEGA", "LASER", "MULTI"];
          const label = labels[(hits + Math.floor(Math.random() * labels.length)) % labels.length];
          powerUps.push({ x: 40 + Math.random() * (w - 80), y: 86 + Math.random() * (h * .2), vy: 16 + Math.random() * 16, label, color: label === "CATCH" ? "#48dc91" : label === "MEGA" ? "#f5c338" : label === "LASER" ? "#ef4552" : "#557dff", life: 13 });
        }
        const paddleY = h * .53;
        balls.forEach((ball) => {
          ball.trail.unshift({ x: ball.x, y: ball.y }); if (ball.trail.length > 10) ball.trail.pop();
          ball.x += ball.vx * dt; ball.y += ball.vy * dt;
          if (ball.x < 7 || ball.x > w - 7) ball.vx *= -1;
          if (ball.y < 86) ball.vy = Math.abs(ball.vy);
          if (ball.y > paddleY - 14 && ball.y < paddleY + 14 && Math.abs(ball.x - paddleX) < (fever ? 96 : 74) && ball.vy > 0) {
            ball.vy = -Math.abs(ball.vy) * 1.018; ball.vx += (ball.x - paddleX) * 2.35; score += 1; hits += 1; ball.color = fever ? colors[hits % colors.length] : "#fff"; burst(ball.x, ball.y, ball.color);
          }
          powerUps.forEach((power) => { if (power.life > 0 && Math.hypot(power.x - ball.x, power.y - ball.y) < 24) applyPower(power, ball); });
          if (ball.y > h - 90) {
            const brick = bricks.find((item) => item.alive && ball.x > item.x && ball.x < item.x + item.w && ball.y > item.y - 8 && ball.y < item.y + item.h + 8);
            if (brick) { brick.alive = false; ball.vy = -Math.abs(ball.vy); score += 1; hits += 1; burst(ball.x, brick.y, brick.color); }
            else if (ball.y > h + 24) { ball.x = paddleX; ball.y = paddleY + 40; ball.vx = (Math.random() > .5 ? 1 : -1) * (245 + hits * 3); ball.vy = 315; }
          }
        });
        powerUps.forEach((power) => { power.y += power.vy * dt; power.life -= dt; if (power.y > h - 60) power.life = 0; });
        fever = hits >= 14;
      }
      if (running) { ctx.strokeStyle = fever ? colors[hits % colors.length] : "#ececec"; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(paddleX - (fever ? 96 : 74), h * .53); ctx.lineTo(paddleX + (fever ? 96 : 74), h * .53); ctx.stroke(); }
      const idleGradient = ctx.createLinearGradient(0, h - 81, 0, h - 50); idleGradient.addColorStop(0, "#f0f2f6"); idleGradient.addColorStop(.22, "#d7dae0"); idleGradient.addColorStop(1, "#bfc2c8");
      bricks.forEach((brick) => { if (brick.alive) { ctx.fillStyle = fever ? brick.color : brick.row === 0 ? idleGradient : "#c7c7c7"; ctx.fillRect(brick.x, brick.y, brick.w, brick.h); ctx.strokeStyle = "rgba(0,0,0,.78)"; ctx.lineWidth = 2; ctx.strokeRect(brick.x, brick.y, brick.w, brick.h); } });
      if (running) balls.forEach((ball) => { ball.trail.forEach((point, index) => { ctx.beginPath(); ctx.fillStyle = fever ? `${ball.color}${Math.max(12, 62 - index * 5).toString(16)}` : `rgba(255,255,255,${Math.max(.03,.22-index*.018)})`; ctx.arc(point.x, point.y, Math.max(1.5, 6 - index * .38), 0, Math.PI * 2); ctx.fill(); }); ctx.beginPath(); ctx.shadowBlur = fever ? 30 : 11; ctx.shadowColor = ball.color; ctx.fillStyle = ball.color; ctx.arc(ball.x, ball.y, fever ? 8 : 7, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
      powerUps.forEach((power) => { if (power.life <= 0) return; ctx.fillStyle = power.color; ctx.fillRect(power.x - 19, power.y - 6, 38, 12); ctx.fillStyle = "#071008"; ctx.font = "700 7px ui-monospace,monospace"; ctx.textAlign = "center"; ctx.fillText(power.label, power.x, power.y + 3); ctx.textAlign = "left"; });
      if (laserClock > 0) { ctx.strokeStyle = "rgba(255,55,70,.72)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(paddleX, h * .53); ctx.lineTo(paddleX, h - 49); ctx.stroke(); }
      particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * 0.85; ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 3, 3); }); ctx.globalAlpha = 1;
      for (let i = particles.length - 1; i >= 0; i -= 1) if (particles[i].life <= 0) particles.splice(i, 1);
      if (running) { ctx.font = "10px ui-monospace, monospace"; ctx.fillStyle = fever ? colors[(hits + 2) % colors.length] : "#ff3a4d"; ctx.fillText(`MULTI ${balls.length}x · LASER ${laserClock.toFixed(1)}s · CATCH ${Math.max(0, 8.4 - hits * .08).toFixed(1)}s`, Math.max(8, paddleX - 80), h * .53 - 15); ctx.font = "700 18px ui-monospace,monospace"; ctx.fillStyle = colors[(hits + 3) % colors.length]; ctx.fillText(`x${Math.max(1, hits)}${hits > 10 ? "!!" : ""}`, 26 + (hits * 61) % Math.max(80, w - 120), h * .68 + Math.sin(hits) * 60); }
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
  const [ref, visible] = useInView<HTMLElement>(0.16);
  return <footer ref={ref} className={`footer ${running ? "game-running" : ""}`}><ArcadeGame running={running} setRunning={setRunning} /><div className="footer-title"><ScrambleText text="Razorpay" active={visible} /><br /><ScrambleText text="/ai builders" active={visible} /></div><button className="game-toggle" type="button" onClick={() => setRunning(!running)}><u>{running ? "STOP" : "PLAY"}</u> this game,<br />Bet you can win.</button><p className="copyright">Copyright © Razorpay</p><div className="socials"><a href="https://www.instagram.com/razorpay/">Instagram</a><span>|</span><a href="https://x.com/razorpay">X</a><span>|</span><a href="https://www.linkedin.com/company/razorpay/">LinkedIn</a><span>|</span><a href="https://razorpay.com/">www.razorpay.com</a></div></footer>;
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return <div className="site-shell"><CustomCursor />{!ready && <BootScreen done={done} />}<Navbar /><main><Hero ready={ready} /><Intro /><Eligibility /><Process /><Wins /><OtherRoles /></main><Footer /></div>;
}
