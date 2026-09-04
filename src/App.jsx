import { useState, useEffect, useRef } from "react";

/* ── Brand tokens ── */
const B = {
  navy:     "#01113d",
  navy2:    "#1a3061",
  orange:   "#fca311",
  orangeLt: "#ffbe4f",
  silver:   "#b1bfcc",
  mist:     "#dde5f2",
  offwhite: "#efefef",
};

/* ── Intersection reveal hook ── */
function useReveal(threshold = 0.14) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ── Animated counter ── */
function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useReveal(0.5);
  useEffect(() => {
    if (!visible) return;
    const steps = 1800 / 16;
    let cur = 0;
    const inc = target / steps;
    const t = setInterval(() => {
      cur = Math.min(cur + inc, target);
      setVal(Math.floor(cur));
      if (cur >= target) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [visible, target]);
  return <span ref={ref} className="stat-num">{val}{suffix}</span>;
}

/* ══════════════════════════════
   NAV
══════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Início",      href: "#hero" },
    { label: "Serviços",    href: "#servicos" },
    { label: "Cases",       href: "#cases" },
    { label: "Quem Somos",  href: "#sobre" },
    { label: "Contato",     href: "#contato" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(1,17,61,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? `1px solid rgba(252,163,17,0.12)` : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-[70px] flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          {/* Emblem */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
              <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill={B.navy2} stroke={B.orange} strokeWidth="1.5" />
              <polygon points="20,8 33,14.5 33,25.5 20,32 7,25.5 7,14.5" fill="none" stroke={B.orange} strokeWidth="0.8" opacity="0.5" />
              <path d="M11 22 Q15 16 20 20 Q25 24 29 18" stroke={B.orange} strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <circle cx="20" cy="20" r="2.5" fill={B.orange} />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.05rem", color: B.offwhite, letterSpacing: "0.02em" }}>
              Atlântica
            </span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, fontSize: "0.6rem", color: B.silver, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Consultoria Internacional
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        <a
          href="#contato"
          className="hidden md:inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded text-sm"
        >
          Fale Conosco
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>

        {/* Mobile burger */}
        <button className="md:hidden p-2" style={{ color: B.silver }} onClick={() => setOpen(v => !v)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open
              ? <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>
              : <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 py-5 space-y-4" style={{ background: "rgba(1,17,61,0.98)", borderTop: `1px solid rgba(252,163,17,0.12)` }}>
          {links.map(l => (
            <a key={l.href} href={l.href} className="block nav-link py-1.5" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="#contato" className="block btn-primary px-5 py-3 rounded text-sm text-center mt-2" onClick={() => setOpen(false)}>
            Fale Conosco
          </a>
        </div>
      )}
    </nav>
  );
}

/* ══════════════════════════════
   HERO
══════════════════════════════ */
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `linear-gradient(160deg, ${B.navy} 0%, ${B.navy2} 100%)` }}
    >
      {/* Dot grid */}
      <div className="dot-grid absolute inset-0 opacity-30" />

      {/* Ambient orbs */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent 65%)`, filter: "blur(80px)" }} />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full pointer-events-none opacity-8"
        style={{ background: `radial-gradient(circle, ${B.navy2}, transparent 70%)`, filter: "blur(60px)" }} />

      {/* Decorative globe — right side */}
      <div className="absolute right-8 xl:right-20 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <div className="relative w-72 xl:w-96 h-72 xl:h-96 float-slow opacity-30">
          <svg viewBox="0 0 380 380" fill="none" className="w-full h-full">
            <circle cx="190" cy="190" r="175" stroke={B.orange} strokeWidth="0.8" />
            <circle cx="190" cy="190" r="125" stroke={B.orange} strokeWidth="0.5" />
            <circle cx="190" cy="190" r="75"  stroke={B.orange} strokeWidth="0.5" />
            <ellipse cx="190" cy="190" rx="175" ry="70"  stroke={B.orange} strokeWidth="0.5" />
            <ellipse cx="190" cy="190" rx="175" ry="120" stroke={B.orange} strokeWidth="0.4" />
            <line x1="15"  y1="190" x2="365" y2="190" stroke={B.orange} strokeWidth="0.4" />
            <line x1="190" y1="15"  x2="190" y2="365" stroke={B.orange} strokeWidth="0.4" />
            {/* Continent blobs */}
            <path d="M90,145 Q115,130 145,138 Q158,152 145,168 Q115,172 90,158 Z" fill={B.orange} opacity="0.35" />
            <path d="M160,118 Q190,105 222,112 Q240,126 234,150 Q220,168 196,172 Q164,166 158,148 Q152,132 160,118 Z" fill={B.orange} opacity="0.32" />
            <path d="M244,155 Q268,148 285,162 Q290,178 278,190 Q260,198 244,186 Q234,175 244,155 Z" fill={B.orange} opacity="0.28" />
            <path d="M118,188 Q140,182 154,198 Q150,216 134,220 Q114,214 112,200 Z" fill={B.orange} opacity="0.24" />
            <path d="M184,204 Q202,196 215,210 Q212,230 196,234 Q178,228 178,215 Z" fill={B.orange} opacity="0.24" />
            {/* Hotspot dots */}
            <circle cx="116" cy="152" r="4" fill={B.orange} opacity="0.9" />
            <circle cx="200" cy="134" r="4" fill={B.orange} opacity="0.9" />
            <circle cx="262" cy="170" r="4" fill={B.orange} opacity="0.9" />
            <circle cx="136" cy="205" r="4" fill={B.orange} opacity="0.9" />
            <circle cx="198" cy="218" r="4" fill={B.orange} opacity="0.9" />
            <circle cx="190" cy="190" r="5" fill={B.orange} opacity="1"   />
            {/* Connection lines */}
            <line x1="116" y1="152" x2="200" y2="134" stroke={B.orange} strokeWidth="0.8" opacity="0.5" strokeDasharray="5 4" />
            <line x1="200" y1="134" x2="262" y2="170" stroke={B.orange} strokeWidth="0.8" opacity="0.5" strokeDasharray="5 4" />
            <line x1="136" y1="205" x2="198" y2="218" stroke={B.orange} strokeWidth="0.8" opacity="0.5" strokeDasharray="5 4" />
            <line x1="190" y1="190" x2="116" y2="152" stroke={B.orange} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
            <line x1="190" y1="190" x2="262" y2="170" stroke={B.orange} strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />
          </svg>
          {/* Pulse rings */}
          {[0, 1].map(i => (
            <div key={i} className="absolute inset-0 rounded-full"
              style={{ border: `1px solid rgba(252,163,17,0.18)`, animation: `pulse-ring 3.5s ease-out ${i * 1.75}s infinite` }} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="max-w-[600px]">
          <div className="section-label mb-5 flex items-center gap-3" style={{ animation: "fade-up 0.5s ease both" }}>
            <span className="w-8 h-px" style={{ background: B.orange }} />
            Consultoria Internacional de Alto Nível
          </div>

          <h1
            className="leading-[1.08] mb-6"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
              color: B.offwhite,
              animation: "fade-up 0.6s 0.1s ease both",
            }}
          >
            Sua empresa,{" "}
            <em className="orange-text not-italic">sem fronteiras</em>
          </h1>

          <p
            className="text-base leading-relaxed mb-10 max-w-lg"
            style={{ color: B.silver, animation: "fade-up 0.6s 0.2s ease both" }}
          >
            Há mais de 15 anos, a Atlântica conecta empresas e famílias brasileiras ao mercado global com estratégia, segurança jurídica e uma rede exclusiva de parceiros em mais de 40 países.
          </p>

          <div className="flex flex-wrap gap-4" style={{ animation: "fade-up 0.6s 0.3s ease both" }}>
            <a href="#contato" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded text-sm">
              Agendar Consulta Gratuita
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#cases" className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 rounded text-sm">
              Ver Cases de Sucesso
            </a>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-8 mt-16 pt-8"
            style={{ borderTop: "1px solid rgba(221,229,242,0.1)", animation: "fade-up 0.6s 0.45s ease both" }}
          >
            {[
              { val: 15, suf: "+", label: "Anos de experiência" },
              { val: 40, suf: "+", label: "Países atendidos" },
              { val: 320, suf: "+", label: "Clientes atendidos" },
              { val: 98, suf: "%", label: "Taxa de satisfação" },
            ].map(s => (
              <div key={s.label} className="flex flex-col">
                <span className="text-[2.2rem] leading-none font-bold">
                  <Counter target={s.val} suffix={s.suf} />
                </span>
                <span className="text-xs mt-0.5" style={{ color: B.silver }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-35 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: B.silver }}>Scroll</span>
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <rect x="1" y="1" width="14" height="20" rx="7" stroke={B.silver} strokeWidth="1.5" />
          <circle cx="8" cy="7" r="2" fill={B.orange}>
            <animate attributeName="cy" values="7;13;7" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full h-10">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#01113d" opacity="0.5" />
        </svg>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   SERVICES
══════════════════════════════ */
const SERVICES = [
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>,
    title: "Expansão Internacional",
    desc: "Planejamento estratégico para entrada em novos mercados, análise regulatória e estabelecimento de operações locais em mais de 40 países.",
    tags: ["Europa", "EUA", "Ásia", "LatAm"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    title: "Investimentos & M&A",
    desc: "Assessoria completa em fusões, aquisições e investimentos cross-border: due diligence, valuations e estruturação de transações.",
    tags: ["M&A", "Private Equity", "Valuation"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    title: "Estruturação Societária",
    desc: "Holdings internacionais, planejamento tributário cross-border e estruturas jurídicas otimizadas para operações e patrimônio global.",
    tags: ["Holding", "Tax Planning", "Offshore"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    title: "Vistos & Residência",
    desc: "Golden Visa, residência por investimento e cidadania internacional. Acompanhamento completo para você e toda a família.",
    tags: ["Golden Visa", "EB-5", "Cidadania"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: "Consultoria Digital Global",
    desc: "Internacionalização de negócios digitais: e-commerce global, marketplaces internacionais, regulamentação de dados e pagamentos.",
    tags: ["E-commerce", "SaaS", "FinTech"],
  },
  {
    icon: <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    title: "Compliance Internacional",
    desc: "Adequação às normas GDPR, FCPA, LGPD e regulamentações locais. Gestão de riscos regulatórios e governança corporativa global.",
    tags: ["GDPR", "FCPA", "KYC/AML"],
  },
];

function Services() {
  const { ref, visible } = useReveal();
  return (
    <section id="servicos" className="py-28 relative"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, ${B.navy2} 50%, ${B.navy} 100%)` }}>

      {/* Top divider accent */}
      <div className="brand-divider mb-0" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className={`text-center mb-16 reveal ${visible ? "visible" : ""}`}>
          <div className="section-label mb-4">O que fazemos</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
            Nossos <span className="orange-text">Serviços</span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: B.silver }}>
            Soluções integradas para clientes que buscam crescimento e proteção patrimonial além das fronteiras brasileiras.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            const { ref: cr, visible: cv } = useReveal();
            return (
              <div
                key={s.title}
                ref={cr}
                className={`service-card rounded-xl p-7 reveal ${cv ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 75}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                  style={{ background: "rgba(252,163,17,0.1)", color: B.orange, border: "1px solid rgba(252,163,17,0.22)" }}
                >
                  {s.icon}
                </div>
                <h3 className="font-semibold text-base mb-3" style={{ color: B.offwhite }}>{s.title}</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: B.silver }}>{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   CASES
══════════════════════════════ */
const CASES = [
  {
    flag: "🇩🇪", country: "Alemanha",
    client: "Grupo Industrial Paulista", sector: "Manufatura",
    title: "Aquisição de fábrica na Bavária e estruturação da holding europeia",
    result: "€ 42M em ativos internacionalizados em 18 meses",
    tags: ["M&A", "Holding", "Europa"], color: "#4A90D9",
  },
  {
    flag: "🇺🇸", country: "Estados Unidos",
    client: "Fintech Brasileira", sector: "Tecnologia",
    title: "Expansão para o mercado norte-americano e captação de Série B",
    result: "US$ 28M captados em Miami em 12 meses",
    tags: ["EB-5", "Startup", "VC"], color: B.orange,
  },
  {
    flag: "🇵🇹", country: "Portugal",
    client: "Família Empresarial", sector: "Patrimônio",
    title: "Golden Visa e planejamento patrimonial para família com 4 membros",
    result: "Residência europeia obtida em 7 meses",
    tags: ["Golden Visa", "Família", "Imóveis"], color: "#22c55e",
  },
  {
    flag: "🇸🇬", country: "Singapura",
    client: "Gestora de Fundos", sector: "Finanças",
    title: "Estruturação de fundo offshore e compliance no sudeste asiático",
    result: "US$ 85M sob gestão offshore estruturados",
    tags: ["Offshore", "Fund", "MAS"], color: "#a855f7",
  },
];

function Cases() {
  const { ref, visible } = useReveal();
  return (
    <section id="cases" className="py-28 relative overflow-hidden"
      style={{ background: B.navy }}>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none opacity-6"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent)`, filter: "blur(90px)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div ref={ref} className={`mb-14 reveal ${visible ? "visible" : ""}`}>
          <div className="section-label mb-4">Resultados comprovados</div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
              Cases de <span className="orange-text">Sucesso</span>
            </h2>
            <p className="text-sm max-w-xs" style={{ color: B.silver }}>
              Histórias reais de clientes que transformaram sua visão em realidade global.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {CASES.map((c, i) => {
            const { ref: cr, visible: cv } = useReveal();
            return (
              <div
                key={c.title}
                ref={cr}
                className={`case-card rounded-xl p-8 reveal ${cv ? "visible" : ""}`}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{c.flag}</span>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: B.offwhite }}>{c.country}</div>
                      <div className="text-xs" style={{ color: B.silver }}>{c.sector} · {c.client}</div>
                    </div>
                  </div>
                  <span
                    className="text-xs px-2.5 py-1 rounded font-medium"
                    style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}35` }}
                  >
                    Concluído
                  </span>
                </div>

                <h3 className="font-medium text-base leading-snug mb-4" style={{ color: B.offwhite }}>{c.title}</h3>

                <div
                  className="flex items-center gap-2.5 py-3 px-4 rounded mb-5"
                  style={{ background: "rgba(252,163,17,0.07)", border: "1px solid rgba(252,163,17,0.15)" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={B.orange} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: B.orange }}>{c.result}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {c.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded"
                      style={{ background: "rgba(221,229,242,0.05)", border: "1px solid rgba(221,229,242,0.1)", color: B.silver }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Testimonial */}
        <div
          className="mt-10 rounded-xl p-8 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, rgba(252,163,17,0.07), rgba(26,48,97,0.7))`, border: "1px solid rgba(252,163,17,0.16)" }}
        >
          <div
            className="absolute top-4 right-6 text-7xl opacity-8 select-none leading-none"
            style={{ color: B.orange, fontFamily: "Georgia, serif" }}
          >"</div>
          <p
            className="text-lg leading-relaxed max-w-3xl italic mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: B.mist }}
          >
            "A Atlântica não apenas nos ajudou a internacionalizar — nos guiou por cada decisão estratégica com profissionalismo impecável. Nossa holding europeia hoje representa 60% da receita do grupo."
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${B.orange}, ${B.orangeLt})`, color: B.navy }}
            >RM</div>
            <div>
              <div className="font-semibold text-sm" style={{ color: B.offwhite }}>Ricardo Mendes</div>
              <div className="text-xs" style={{ color: B.silver }}>CEO · Grupo Industrial Paulista</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   ABOUT
══════════════════════════════ */
/* ── CEO Mascote card ── */
function CeoCard() {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}>
      <div className="section-label mb-3 text-center">Liderança executiva</div>
      <h3 className="text-center mb-10"
        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: B.offwhite }}>
        CEO
      </h3>

      <div
        className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${B.navy2} 0%, ${B.navy} 100%)`,
          border: `1px solid rgba(252,163,17,0.25)`,
          boxShadow: `0 0 80px rgba(252,163,17,0.07)`,
        }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72"
            style={{ background: `radial-gradient(circle at top right, rgba(252,163,17,0.08), transparent 60%)` }} />
          <div className="absolute bottom-0 left-0 w-56 h-56"
            style={{ background: `radial-gradient(circle at bottom left, rgba(26,48,97,0.8), transparent 60%)` }} />
        </div>

        <div className="relative flex flex-col sm:flex-row">

          {/* Mascote slot */}
          <div
            className="flex-shrink-0 flex flex-col items-center justify-end sm:w-56 min-h-[220px] sm:min-h-0 relative overflow-hidden"
            style={{ background: `linear-gradient(160deg, rgba(252,163,17,0.12), rgba(1,17,61,0.6))` }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, rgba(252,163,17,0.12), transparent 70%)` }} />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full pointer-events-none"
              style={{ border: `1px solid rgba(252,163,17,0.12)` }} />
            <div className="absolute -bottom-2 -right-4 w-20 h-20 rounded-full pointer-events-none"
              style={{ border: `1px solid rgba(252,163,17,0.08)` }} />

            {/* ↓ Coloque aqui a imagem/ilustração do mascote */}
            <div
              className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center mt-6 mb-4 sm:my-auto"
              style={{ filter: "drop-shadow(0 8px 24px rgba(252,163,17,0.25))" }}
            >
              {/* Placeholder SVG mascote — substitua por <img src="mascote.png" /> */}
                  <img
                    src="mascote.png"
                    alt="Mascote CEO"
                    className="w-full h-full object-contain"
                    />
            </div>

            {/* Label sob o mascote */}
            <div
              className="relative z-10 mb-4 text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ background: "rgba(252,163,17,0.15)", color: B.orange, border: "1px solid rgba(252,163,17,0.3)" }}
            >
              Mascote Oficial
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-7 sm:p-9 flex flex-col justify-center">
            <div
              className="inline-flex items-center gap-2 mb-4 text-[11px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full w-fit"
              style={{ background: "rgba(252,163,17,0.1)", color: B.orange, border: "1px solid rgba(252,163,17,0.25)" }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill={B.orange}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Chief Executive Officer
            </div>

            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.75rem", color: B.offwhite, lineHeight: 1.1 }}>
              Nome do CEO
            </div>
            <div className="mt-1 mb-5 text-sm" style={{ color: B.orange }}>CEO & Fundador · Atlântica Consultoria Internacional</div>

            <div className="w-10 h-px mb-5" style={{ background: `linear-gradient(90deg, ${B.orange}, transparent)` }} />

            <p className="text-sm leading-relaxed mb-6" style={{ color: B.silver }}>
              Breve biografia ou mensagem do CEO. Visão, missão e os valores que guiam a Atlântica Consultoria Internacional no mercado global.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { icon: "🎓", text: "Formação acadêmica" },
                { icon: "🌍", text: "Experiência internacional" },
                { icon: "📅", text: "Fundou a empresa em 2009" },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-2" style={{ color: B.silver }}>
                  <span>{item.icon}</span>
                  <span className="text-xs">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DIRETORIAS = [
  {
    name: "Jurídico Internacional",
    acento: "#4A90D9",
    director: { name: "Dra. Isabela Fonseca", role: "Diretora Jurídica", initials: "IF", grad: ["#4A90D9", "#7CB9F0"] },
    staff: [
      { name: "Lucas Tavares",    role: "Advogado Sênior",      initials: "LT", grad: ["#4A90D9", "#7CB9F0"] },
      { name: "Camila Rezende",   role: "Especialista em M&A",  initials: "CR", grad: ["#4A90D9", "#7CB9F0"] },
      { name: "Bruno Salles",     role: "Analista Jurídico",    initials: "BS", grad: ["#4A90D9", "#7CB9F0"] },
    ],
  },
  {
    name: "Investimentos & M&A",
    acento: B.orange,
    director: { name: "Carlos Drummond Jr.", role: "Diretor de Investimentos", initials: "CD", grad: [B.orange, B.orangeLt] },
    staff: [
      { name: "Fernanda Lopes",   role: "Analista de M&A",      initials: "FL", grad: [B.orange, B.orangeLt] },
      { name: "Diego Pinheiro",   role: "Gestor de Portfólio",  initials: "DP", grad: [B.orange, B.orangeLt] },
      { name: "Ana Beatriz Costa",role: "Especialista Offshore", initials: "AB", grad: [B.orange, B.orangeLt] },
    ],
  },
  {
    name: "Operações & Vistos",
    acento: "#10b981",
    director: { name: "Sophia Nakamura", role: "Diretora de Operações", initials: "SN", grad: ["#10b981", "#34d399"] },
    staff: [
      { name: "Marcelo Freitas",  role: "Consultor de Vistos",  initials: "MF", grad: ["#10b981", "#34d399"] },
      { name: "Juliana Matos",    role: "Analista de Imigração", initials: "JM", grad: ["#10b981", "#34d399"] },
      { name: "Pedro Augusto",    role: "Coord. de Processos",  initials: "PA", grad: ["#10b981", "#34d399"] },
    ],
  },
  {
    name: "Compliance & Riscos",
    acento: "#a855f7",
    director: { name: "André Castellan", role: "Diretor de Compliance", initials: "AC", grad: ["#a855f7", "#d8b4fe"] },
    staff: [
      { name: "Renata Borges",    role: "Analista de Compliance", initials: "RB", grad: ["#a855f7", "#d8b4fe"] },
      { name: "Thiago Mendes",    role: "Especialista KYC/AML",   initials: "TM", grad: ["#a855f7", "#d8b4fe"] },
      { name: "Larissa Viana",    role: "Gestora de Riscos",      initials: "LV", grad: ["#a855f7", "#d8b4fe"] },
    ],
  },
];

function PersonCard({ person, delay, acento, isDirector = false }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal flex items-center gap-3 p-3 rounded-lg ${visible ? "visible" : ""}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: isDirector ? `${acento}10` : "rgba(1,17,61,0.4)",
        border: `1px solid ${isDirector ? `${acento}35` : "rgba(221,229,242,0.07)"}`,
        transition: "border-color 0.25s ease, opacity 0.65s ease, transform 0.65s ease",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${acento}45`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isDirector ? `${acento}35` : "rgba(221,229,242,0.07)"; }}
    >
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
        style={{ background: `linear-gradient(135deg, ${person.grad[0]}, ${person.grad[1]})`, color: B.navy }}
      >
        {person.initials}
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold truncate" style={{ color: B.offwhite }}>{person.name}</div>
        <div className="text-[11px] truncate" style={{ color: isDirector ? acento : B.silver }}>{person.role}</div>
      </div>
      {isDirector && (
        <span
          className="ml-auto flex-shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ background: `${acento}18`, color: acento, border: `1px solid ${acento}30` }}
        >Dir.</span>
      )}
    </div>
  );
}

function DiretoriaBlock({ d, index }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`rounded-xl overflow-hidden reveal ${visible ? "visible" : ""}`}
      style={{
        border: `1px solid rgba(221,229,242,0.09)`,
        background: "rgba(26,48,97,0.25)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center gap-2.5"
        style={{ background: `${d.acento}12`, borderBottom: `1px solid ${d.acento}22` }}
      >
        <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ background: d.acento }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: d.acento }}>
          Diretoria de {d.name}
        </span>
      </div>

      {/* Director row */}
      <div className="px-4 pt-4 pb-2">
        <PersonCard person={d.director} delay={index * 60} acento={d.acento} isDirector />
      </div>

      {/* Divider */}
      <div className="mx-4 my-1" style={{ height: "1px", background: "rgba(221,229,242,0.06)" }} />

      {/* Staff */}
      <div className="px-4 pb-4 space-y-2">
        {d.staff.map((s, si) => (
          <PersonCard key={s.name} person={s} delay={index * 60 + (si + 1) * 50} acento={d.acento} />
        ))}
      </div>
    </div>
  );
}

function About() {
  const { ref, visible } = useReveal();
  const { ref: teamRef, visible: teamVis } = useReveal();
  return (
    <section id="sobre" className="py-28"
      style={{ background: `linear-gradient(180deg, ${B.navy} 0%, ${B.navy2} 100%)` }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Intro row */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div ref={ref} className={`reveal-left ${visible ? "visible" : ""}`}>
            <div className="section-label mb-4">Nossa história</div>
            <h2 className="mb-6" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,4vw,3rem)", color: B.offwhite }}>
              Quem <span className="orange-text">Somos</span>
            </h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: B.silver }}>
              Fundada em 2009 por advogados e banqueiros de investimento com experiência em Londres, Nova York e Hong Kong, a <strong style={{ color: B.offwhite }}>Atlântica Consultoria Internacional</strong> nasceu da percepção de que empresas e famílias brasileiras mereciam um parceiro de confiança para navegar a complexidade do cenário global.
            </p>
            <p className="text-sm leading-relaxed mb-8" style={{ color: B.silver }}>
              Hoje somos referência em assessoria internacional, combinando rigor técnico, rede de parceiros locais em mais de 40 países e compromisso inabalável com a confidencialidade dos nossos clientes.
            </p>
            <div className="flex flex-wrap gap-8">
              {[
                { label: "Escritórios",   value: "São Paulo · Lisboa · Miami" },
                { label: "Parcerias",     value: "40+ países" },
                { label: "Certificações", value: "ISO 27001 · OAB" },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs mb-0.5" style={{ color: B.silver }}>{item.label}</div>
                  <div className="text-sm font-semibold" style={{ color: B.offwhite }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`reveal-right ${visible ? "visible" : ""}`}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🔐", title: "Confidencialidade", desc: "Sigilo absoluto em todas as operações e informações dos clientes." },
                { icon: "🎯", title: "Precisão",           desc: "Análises detalhadas e estratégias personalizadas para cada caso." },
                { icon: "🌐", title: "Rede Global",        desc: "Parceiros locais especializados em mais de 40 jurisdições." },
                { icon: "⚖️", title: "Ética",             desc: "Compliance rigoroso e conduta íntegra em todas as operações." },
              ].map(v => (
                <div key={v.title} className="p-5 rounded-xl"
                  style={{ background: "rgba(1,17,61,0.5)", border: "1px solid rgba(221,229,242,0.08)" }}>
                  <div className="text-2xl mb-3">{v.icon}</div>
                  <div className="font-semibold text-sm mb-1.5" style={{ color: B.offwhite }}>{v.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: B.silver }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="brand-divider mb-16" />

        {/* ── CEO / Mascote ── */}
        <CeoCard />

        <div className="brand-divider my-16" />

        {/* Diretorias */}
        <div ref={teamRef} className={`text-center mb-12 reveal ${teamVis ? "visible" : ""}`}>
          <div className="section-label mb-3">Estrutura organizacional</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(1.5rem,3vw,2.2rem)", color: B.offwhite }}>
            Nossas Diretorias
          </h3>
          <p className="text-sm mt-3 max-w-lg mx-auto" style={{ color: B.silver }}>
            Equipes especializadas organizadas por área de atuação, cada uma liderada por um diretor de referência no mercado.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {DIRETORIAS.map((d, i) => <DiretoriaBlock key={d.name} d={d} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   CONTACT
══════════════════════════════ */
function Contact() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
  const [sent, setSent] = useState(false);

  const set = (k) => (e) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <section id="contato" className="py-28 relative overflow-hidden"
      style={{ background: B.navy }}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-5 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${B.orange}, transparent)`, filter: "blur(100px)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-5 gap-12">

          {/* Left */}
          <div ref={ref} className={`lg:col-span-2 reveal-left ${visible ? "visible" : ""}`}>
            <div className="section-label mb-4">Vamos conversar</div>
            <h2 className="mb-5" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "clamp(2rem,3.5vw,2.8rem)", color: B.offwhite }}>
              Entre em <span className="orange-text">Contato</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: B.silver }}>
              Agende uma consulta gratuita e confidencial. Nossa equipe retornará em até 24 horas úteis.
            </p>

            <div className="space-y-5">
              {[
                { icon: "📍", label: "Endereço",  val: "Av. Brigadeiro Faria Lima, 3144 — São Paulo, SP" },
                { icon: "📞", label: "Telefone",  val: "+55 (11) 3000-0000" },
                { icon: "✉️", label: "E-mail",    val: "contato@atlantica.com.br" },
                { icon: "🕐", label: "Horário",   val: "Seg – Sex · 8h às 19h (Horário de Brasília)" },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: B.silver }}>{item.label}</div>
                    <div className="text-sm" style={{ color: B.offwhite }}>{item.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(221,229,242,0.08)" }}>
              <div className="text-xs mb-3 uppercase tracking-widest" style={{ color: B.silver }}>Escritórios</div>
              <div className="flex flex-wrap gap-2">
                {["🇧🇷 São Paulo", "🇵🇹 Lisboa", "🇺🇸 Miami"].map(o => (
                  <span key={o} className="text-xs px-3 py-1.5 rounded"
                    style={{ background: "rgba(221,229,242,0.05)", border: "1px solid rgba(221,229,242,0.1)", color: B.silver }}>
                    {o}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={`lg:col-span-3 reveal-right ${visible ? "visible" : ""}`}>
            {sent ? (
              <div
                className="h-full flex flex-col items-center justify-center text-center py-16 px-8 rounded-xl"
                style={{ background: "rgba(26,48,97,0.5)", border: "1px solid rgba(252,163,17,0.2)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                  style={{ background: "rgba(252,163,17,0.1)", border: "1px solid rgba(252,163,17,0.3)" }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={B.orange} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: B.offwhite }}>Mensagem enviada!</h3>
                <p className="text-sm" style={{ color: B.silver }}>Nossa equipe entrará em contato em até 24 horas úteis.</p>
                <button className="mt-6 text-sm btn-outline px-6 py-2.5 rounded" onClick={() => setSent(false)}>
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form
                onSubmit={e => { e.preventDefault(); setSent(true); }}
                className="p-8 rounded-xl space-y-5"
                style={{ background: "rgba(26,48,97,0.4)", border: "1px solid rgba(221,229,242,0.08)" }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Nome completo *</label>
                    <input required className="form-input w-full px-4 py-3 rounded text-sm" placeholder="Seu nome" value={form.nome} onChange={set("nome")} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>E-mail *</label>
                    <input required type="email" className="form-input w-full px-4 py-3 rounded text-sm" placeholder="email@empresa.com" value={form.email} onChange={set("email")} />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Telefone / WhatsApp</label>
                    <input className="form-input w-full px-4 py-3 rounded text-sm" placeholder="+55 (11) 00000-0000" value={form.telefone} onChange={set("telefone")} />
                  </div>
                  <div>
                    <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Assunto *</label>
                    <select required className="form-input w-full px-4 py-3 rounded text-sm" value={form.assunto} onChange={set("assunto")}>
                      <option value="" disabled>Selecione...</option>
                      <option>Expansão Internacional</option>
                      <option>Investimentos & M&A</option>
                      <option>Estruturação Societária</option>
                      <option>Vistos & Residência</option>
                      <option>Compliance Internacional</option>
                      <option>Outro assunto</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: B.silver }}>Mensagem *</label>
                  <textarea
                    required rows={4}
                    className="form-input w-full px-4 py-3 rounded text-sm resize-none"
                    placeholder="Descreva brevemente sua necessidade..."
                    value={form.mensagem}
                    onChange={set("mensagem")}
                  />
                </div>

                <div className="flex items-start gap-2.5">
                  <input type="checkbox" required id="lgpd" className="mt-0.5" style={{ accentColor: B.orange }} />
                  <label htmlFor="lgpd" className="text-xs leading-relaxed" style={{ color: B.silver }}>
                    Concordo com a{" "}
                    <span style={{ color: B.orange }}>Política de Privacidade</span>{" "}
                    e autorizo o tratamento dos meus dados conforme a LGPD.
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full py-3.5 rounded font-semibold text-sm flex items-center justify-center gap-2">
                  Enviar Mensagem
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
function Footer() {
  return (
    <footer className="py-10" style={{ background: B.navy, borderTop: "1px solid rgba(221,229,242,0.07)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid sm:grid-cols-3 items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 flex-shrink-0">
              <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
                <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill={B.navy2} stroke={B.orange} strokeWidth="1.5" />
                <circle cx="20" cy="20" r="3" fill={B.orange} />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "0.9rem", color: B.offwhite }}>
                Atlântica
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.55rem", color: B.silver, letterSpacing: "0.16em", textTransform: "uppercase" }}>
                Consultoria Internacional
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-6">
            {["Privacidade", "Termos de Uso", "Cookies"].map(l => (
              <a key={l} href="#" className="text-xs transition-colors hover:text-white" style={{ color: B.silver }}>{l}</a>
            ))}
          </div>

          <p className="text-xs text-right" style={{ color: "#4a5568" }}>
            © 2026 Atlântica Consultoria Internacional.<br />Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════
   APP ROOT
══════════════════════════════ */
export default function App() {
  return (
    <div className="min-h-full">
      <Nav />
      <Hero />
      <Services />
      <Cases />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
