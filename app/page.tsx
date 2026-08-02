"use client";

import { useEffect, useRef, useState } from "react";

const APPLY_URL = "https://razorpay.typeform.com/to/Aj64eENJ";

type Win = {
  brand: string;
  headline: string;
  image: string;
  href?: string;
};

const wins: Win[] = [
  {
    brand: "// Agentic Platform",
    headline: "Payment platform to manage your money movement with AI.",
    href: "https://razorpay.com/blog/razorpay-agentic-platform",
    image: "/assets/fold4-agentic-platform.webp",
  },
  {
    brand: "// Agentic Payments",
    headline: "AI-powered conversations that take you from discovery to purchase.",
    href: "https://razorpay.com/agentic-payments/",
    image: "/assets/fold4-agentic-payments.webp",
  },
  {
    brand: "// Agent Studio",
    headline: "Agents for payments and revenue. One click to deploy.",
    href: "https://razorpay.com/agent-studio/",
    image: "/assets/fold4-agent-studio.webp",
  },
  {
    brand: "// Slash",
    headline: "Non-engineers pushed code to production with AI.",
    image: "/assets/fold4-slash.webp",
  },
  {
    brand: "// Call-E",
    headline: "Helped 1000+ customers with AI calls.",
    image: "/assets/fold4-calle.webp",
  },
  {
    brand: "// AI-Led Marketing Campaigns",
    headline: "Lights. Camera. Action. All with AI.",
    image: "/assets/fold4-ai-marketing.webp",
  },
];

function useReveal() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const jump = () => setOpen(false);

  return (
    <header className="nav-shell">
      <a className="brand" href="#hero" aria-label="Razorpay AI Builders home">
        <img src="/assets/razorpay-logo.svg" alt="Razorpay" />
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#eligibility">Eligibility</a>
        <a href="#process">Process</a>
        <a href="#wins">Our AI Wins</a>
        <a className="nav-apply" href={APPLY_URL} target="_blank" rel="noreferrer">
          Apply Now
        </a>
      </nav>

      <a className="mobile-apply" href={APPLY_URL} target="_blank" rel="noreferrer">
        Apply
      </a>
      <button
        className={`menu-toggle ${open ? "is-open" : ""}`}
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <div className="mobile-menu" role="dialog" aria-label="Menu">
          <a href="#eligibility" onClick={jump}>Eligibility</a>
          <a href="#process" onClick={jump}>Process</a>
          <a href="#wins" onClick={jump}>Our AI Wins</a>
          <a href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const scene = useRef<HTMLDivElement>(null);

  const tilt = (event: React.PointerEvent<HTMLElement>) => {
    if (!scene.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 7;
    scene.current.style.setProperty("--hero-x", `${x}px`);
    scene.current.style.setProperty("--hero-y", `${y}px`);
  };

  return (
    <section id="hero" className="hero" onPointerMove={tilt}>
      <div className="hero-noise" aria-hidden="true" />
      <h1>
        <span className="muted">Hiring The Most </span>
        <em>Obsessed AI Builders</em>
        <br />
        <span className="muted">To Solve The Toughest Problems</span>
      </h1>

      <a className="hero-apply" href={APPLY_URL} target="_blank" rel="noreferrer">
        Apply Now
      </a>

      <div className="hero-scene" ref={scene} aria-hidden="true">
        <img className="bg-layer" src="/assets/bg-layer.webp" alt="" />
        <img className="hero-person hero-person-one" src="/assets/person-1.webp" alt="" />
        <img className="hero-object monitor" src="/assets/monitor.webp" alt="" />
        <img className="hero-object keyboard" src="/assets/keyboard.webp" alt="" />
        <img className="hero-person hero-person-two" src="/assets/person-2.webp" alt="" />
        <img className="hero-object tablet" src="/assets/mid-tablet.webp" alt="" />
        <img className="hero-object pot" src="/assets/pot.webp" alt="" />
        <img className="hero-person hero-person-three" src="/assets/person-3.webp" alt="" />
        <img className="hero-object right-tablet" src="/assets/right-tablet.webp" alt="" />
        <img className="hero-object cup" src="/assets/chat-gpt-cup.webp" alt="" />
        <img className="table" src="/assets/table-surface.webp" alt="" />
        <div className="code-card code-one">j C+<br />ckga.<br />Cp=</div>
        <div className="code-card code-two">:ctl1<br />asaoVn<br />skifh</div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="intro reveal" data-reveal>
      <p>
        The AI era has created a new generation of exceptional builders. We value those who have
        dedicated the last few years to mastering this craft through relentless learning,
        experimentation, and execution. If you possess the rare drive to turn the unimaginable into
        reality, let&apos;s craft the future together. <span>Come build with us. Here&apos;s what life at Razorpay looks like.</span>
      </p>
      <div className="manifesto" aria-label="Unlimited tokens, any model, any tool, no hierarchy, ship fast">
        <span>/Unlimited Tokens</span>
        <span>/Any Model</span>
        <span>/Any Tool</span>
        <span>/No Hierarchy</span>
        <span>/Ship Fast</span>
      </div>
    </section>
  );
}

function Eligibility() {
  return (
    <section id="eligibility" className="eligibility reveal" data-reveal>
      <div className="eligibility-art" aria-hidden="true">
        <div className="scanlines" />
        <img src="/assets/person-2-ascii.svg" alt="" />
        <span className="target target-one" />
        <span className="target target-two" />
        <span className="target target-three" />
      </div>

      <p className="callout callout-left">Speaks in prompts<br />and GitHub links</p>
      <p className="callout callout-top">Always thinking<br />how to harness AI</p>
      <p className="callout callout-right">Sees every workflow<br />as an agent loop</p>
      <h2>Is this <em>you?</em></h2>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="process reveal" data-reveal>
      <div className="process-visual" aria-hidden="true">
        <img className="process-desk" src="/assets/fold3-desk-clean.webp" alt="" />
        <img className="process-person" src="/assets/fold3-person.webp" alt="" />
        <img className="process-chair" src="/assets/fold3-chair.webp" alt="" />
        <span className="green-click">CLICK</span>
      </div>

      <div className="process-copy">
        <h2>No resume theatre. Just<br />show us what you&apos;ve built.</h2>
        <p>Three steps. No nonsense.</p>
        <ol>
          <li><span>1/</span> Fill the form</li>
          <li><span>2/</span> Submit your project or GitHub</li>
          <li><span>3/</span> If it has signal, we&apos;ll call in 48 hrs</li>
        </ol>
        <a className="outline-button" href={APPLY_URL} target="_blank" rel="noreferrer">Apply Now</a>
      </div>
    </section>
  );
}

function Wins() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setActive((value) => (value + 1) % wins.length), 5000);
    return () => window.clearInterval(id);
  }, []);

  const change = (direction: number) => {
    setActive((value) => (value + direction + wins.length) % wins.length);
  };

  const item = wins[active];

  return (
    <section id="wins" className="wins reveal" data-reveal>
      <h2>We&apos;re doing a lot with AI.<br />We still don&apos;t think it&apos;s enough.</h2>

      <div className="win-stage">
        <button className="arrow arrow-left" type="button" onClick={() => change(-1)} aria-label="Previous AI win">‹</button>
        <div className="win-card">
          <img key={item.image} src={item.image} alt={item.brand.replace("// ", "")} />
        </div>
        <div className="win-copy" aria-live="polite">
          <p>{item.brand}</p>
          <h3>{item.headline}</h3>
          {item.href && <a href={item.href} target="_blank" rel="noreferrer">Know More</a>}
        </div>
        <button className="arrow arrow-right" type="button" onClick={() => change(1)} aria-label="Next AI win">›</button>
      </div>

      <div className="dots" aria-label="Choose AI win">
        {wins.map((win, index) => (
          <button
            key={win.brand}
            type="button"
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
            aria-label={`Show ${win.brand.replace("// ", "")}`}
          />
        ))}
      </div>
    </section>
  );
}

function OtherRoles() {
  return (
    <section className="other-roles reveal" data-reveal>
      <div className="roles-bg" aria-hidden="true" />
      <img className="roles-chair roles-chair-one" src="/assets/fold5-chair.webp" alt="" />
      <img className="roles-chair roles-chair-two" src="/assets/fold5-chair.webp" alt="" />
      <h2>Looking for Other Roles?</h2>
      <a href="https://razorpay.com/careers/" target="_blank" rel="noreferrer">check out our careers page. ↗</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer reveal" data-reveal>
      <div className="footer-title">RazorUOS<br />/ai bU1lFVIE</div>
      <p className="game"><a href="#hero">PLAY</a> this game.<br />Bet you can win.</p>
      <p className="copyright">Copyright © Razorpay</p>
      <div className="socials">
        <a href="https://www.instagram.com/razorpay/" target="_blank" rel="noreferrer">Instagram</a>
        <span>|</span>
        <a href="https://x.com/razorpay" target="_blank" rel="noreferrer">X</a>
        <span>|</span>
        <a href="https://www.linkedin.com/company/razorpay/" target="_blank" rel="noreferrer">LinkedIn</a>
        <span>|</span>
        <a href="https://razorpay.com/" target="_blank" rel="noreferrer">www.razorpay.com</a>
      </div>
      <div className="footer-grid" aria-hidden="true" />
    </footer>
  );
}

export default function Home() {
  useReveal();

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <Intro />
        <Eligibility />
        <Process />
        <Wins />
        <OtherRoles />
      </main>
      <Footer />
    </div>
  );
}
