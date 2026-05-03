import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { SLIDES } from '../slides';
import { motion, AnimatePresence } from 'framer-motion';
import jioLogo from '../assets/jiohotstar-logo.png';

/* ─── Tool icon definitions via CDN ─── */
const TOOL_ICONS: Record<string, { url: string; color: string; label: string }> = {
  docker:     { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/docker.svg',         color: '#2496ED', label: 'Docker'         },
  kubernetes: { url: 'https://cdn.jsdelivr.net/gh/cncf/artwork@main/projects/kubernetes/icon/color/kubernetes-icon-color.svg', color: '#326CE5', label: 'Kubernetes' },
  eks:        { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazoneks.svg',       color: '#FF9900', label: 'AWS EKS'        },
  github:     { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/githubactions.svg',   color: '#2088FF', label: 'GitHub Actions' },
  redis:      { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/redis.svg',           color: '#DC382D', label: 'Redis'          },
  cloudfront: { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/amazonaws.svg',       color: '#FF9900', label: 'CloudFront'     },
  prometheus: { url: 'https://cdn.jsdelivr.net/gh/cncf/artwork@main/projects/prometheus/icon/color/prometheus-icon-color.svg', color: '#E6522C', label: 'Prometheus' },
  grafana:    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/grafana.svg',         color: '#F46800', label: 'Grafana'        },
  terraform:  { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/terraform.svg',       color: '#7B42BC', label: 'Terraform'      },
  istio:      { url: 'https://cdn.jsdelivr.net/gh/cncf/artwork@main/projects/istio/icon/color/istio-icon-color.svg', color: '#466BB0', label: 'Istio' },
};

/* ─── Hook: load + cache SVG as object URL ─── */
function useSvgIcon(url: string, tintColor?: string) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(r => r.text())
      .then(svg => {
        if (cancelled) return;
        // For single-color simple-icons SVGs, tint them
        const tinted = tintColor
          ? svg.replace(/fill="[^"]*"/g, '').replace(/<svg/, `<svg fill="${tintColor}"`)
          : svg;
        const blob = new Blob([tinted], { type: 'image/svg+xml' });
        setSrc(URL.createObjectURL(blob));
      })
      .catch(() => setSrc(null));
    return () => { cancelled = true; };
  }, [url, tintColor]);
  return src;
}

/* ─── Single tool chip with loaded icon ─── */
const ToolChip = ({ toolKey }: { toolKey: string }) => {
  const t = TOOL_ICONS[toolKey];
  const isSimpleIcon = t.url.includes('simple-icons');
  const src = useSvgIcon(t.url, isSimpleIcon ? t.color : undefined);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        background: `${t.color}12`,
        border: `1px solid ${t.color}44`,
        borderRadius: '12px',
        padding: '10px 10px 8px',
        minWidth: '72px', flex: '1',
      }}
    >
      {src
        ? <img src={src} alt={t.label} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
        : <div style={{ width: '32px', height: '32px', background: `${t.color}33`, borderRadius: '8px' }} />
      }
      <span style={{ fontSize: '0.6rem', color: t.color, fontWeight: 700, letterSpacing: '0.5px', textAlign: 'center', lineHeight: 1.2 }}>{t.label}</span>
    </motion.div>
  );
};

/* ─── Tools grid for slide 4 ─── */
const ToolsGrid = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.6rem' }}>
    {Object.keys(TOOL_ICONS).map((k, i) => (
      <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} style={{ flex: '1 1 70px' }}>
        <ToolChip toolKey={k} />
      </motion.div>
    ))}
  </div>
);

/* ─── Stat Card ─── */
const StatCard = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}44`, borderRadius: '12px',
    padding: '0.75rem 1rem', flex: 1, minWidth: '90px', textAlign: 'center',
    boxShadow: `0 0 16px ${color}22`,
  }}>
    <div style={{ fontSize: '1.65rem', fontWeight: 800, color, lineHeight: 1, letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '1.2px' }}>{label}</div>
  </div>
);

/* ─── Highlight Row ─── */
const HighlightRow = ({ text, color, delay = 0 }: { text: string; color: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -14 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.35 }}
    style={{
      background: 'rgba(255,255,255,0.025)', border: `1px solid rgba(255,255,255,0.07)`,
      borderLeft: `3px solid ${color}`, borderRadius: '8px',
      padding: '0.55rem 0.85rem', fontSize: '0.84rem', color: '#cdd8f0',
      lineHeight: 1.5, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    }}
  >{text}</motion.div>
);

/* ─── Pipeline Visual ─── */
const PipelineVisual = ({ color }: { color: string }) => {
  const steps = [
    { icon: '💻', label: 'CODE', sub: 'GitHub' },
    { icon: '⚙️', label: 'BUILD', sub: 'Actions' },
    { icon: '🧪', label: 'TEST', sub: 'Jest/Pytest' },
    { icon: '📦', label: 'PACKAGE', sub: 'Docker/ECR' },
    { icon: '🚀', label: 'DEPLOY', sub: 'AWS EKS' },
    { icon: '📡', label: 'MONITOR', sub: 'Grafana' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', marginTop: '0.5rem' }}>
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{
              background: `${color}18`, border: `1px solid ${color}55`, borderRadius: '10px',
              padding: '0.5rem 0.55rem', textAlign: 'center', flex: 1, minWidth: '68px',
            }}
          >
            <div style={{ fontSize: '1.3rem' }}>{s.icon}</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, color, letterSpacing: '1px', marginTop: '3px' }}>{s.label}</div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.38)', marginTop: '2px' }}>{s.sub}</div>
          </motion.div>
          {i < steps.length - 1 && <div style={{ color: `${color}88`, fontSize: '0.9rem', flexShrink: 0 }}>›</div>}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ─── Survey Bars ─── */
const SurveyBar = ({ question, items }: { question: string; items: { label: string; pct: number; color: string }[] }) => (
  <div style={{ marginBottom: '0.7rem' }}>
    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', marginBottom: '5px', fontWeight: 600 }}>{question}</div>
    {items.map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ fontSize: '0.68rem', color: '#8a9cc0', width: '115px', flexShrink: 0 }}>{item.label}</div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', height: '11px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
            style={{ height: '100%', background: item.color, borderRadius: '4px', boxShadow: `0 0 6px ${item.color}88` }}
          />
        </div>
        <div style={{ fontSize: '0.7rem', color: item.color, fontWeight: 700, width: '34px', textAlign: 'right' }}>{item.pct}%</div>
      </div>
    ))}
  </div>
);

/* ─── MindMap Columns ─── */
const MindMapVisual = () => {
  const pillars = [
    { label: '🧰 TOOLS', items: ['Docker', 'Kubernetes', 'Terraform', 'Grafana', 'Prometheus'], col: '#00bfff' },
    { label: '🔄 STAGES', items: ['Build', 'Test', 'Package', 'Deploy', 'Monitor'], col: '#22C55E' },
    { label: '🤖 AUTO', items: ['Auto-Scale', 'Auto-Heal', 'Auto-Deploy', 'Load Test', 'Cost Opt'], col: '#F5A623' },
    { label: '👥 PEOPLE', items: ['Dev Team', 'SRE/Ops', 'QA', 'Security', 'Data Eng'], col: '#8B5CF6' },
  ];
  return (
    <div style={{ display: 'flex', gap: '8px', marginTop: '0.5rem' }}>
      {pillars.map((p, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          style={{ flex: 1, background: `${p.col}0e`, border: `1px solid ${p.col}33`, borderRadius: '10px', padding: '0.6rem 0.55rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: p.col, marginBottom: '7px', letterSpacing: '0.5px' }}>{p.label}</div>
          {p.items.map((item, j) => (
            <div key={j} style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{item}</div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Slide 0: Hero with logo + cricket stadium ─── */
const HeroSlide = ({ slide }: { slide: typeof SLIDES[0] }) => (
  <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', marginBottom: '1rem' }}>
    {/* Cricket stadium background image */}
    <div style={{
      background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 40%, #1a0a2e 100%)',
      borderRadius: '12px', padding: '1.5rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-30%', left: '-10%', width: '60%', height: '160%',
        background: 'radial-gradient(ellipse, rgba(0,191,255,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-30%', right: '-10%', width: '60%', height: '160%',
        background: 'radial-gradient(ellipse, rgba(255,0,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo block */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <img
          src={jioLogo}
          alt="JioHotstar"
          style={{
            height: '56px', width: 'auto', objectFit: 'contain',
            filter: 'drop-shadow(0 0 20px rgba(0,191,255,0.6)) drop-shadow(0 0 40px rgba(255,0,255,0.3))',
          }}
        />
        <div style={{
          fontSize: '0.65rem', letterSpacing: '3px', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)', fontWeight: 600,
        }}>DevOps Case Study — MCA 2026</div>
      </div>

      {/* Stats cluster */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {(slide.stats ?? []).map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', background: `${s.color}18`,
            border: `1px solid ${s.color}44`, borderRadius: '10px',
            padding: '0.6rem 0.9rem', minWidth: '80px',
            boxShadow: `0 0 14px ${s.color}22`,
          }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─── Cricket World Cup visual for Slide 0 body ─── */
const CricketBadge = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '12px',
    background: 'linear-gradient(135deg, rgba(255,153,0,0.12), rgba(0,191,255,0.08))',
    border: '1px solid rgba(255,153,0,0.3)', borderRadius: '12px',
    padding: '0.8rem 1.2rem',
  }}>
    <div style={{ fontSize: '2.5rem' }}>🏏</div>
    <div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FF9900' }}>2023 ICC Cricket World Cup</div>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>
        India vs New Zealand Semi-Final · 15 Nov 2023 · World Record Live Stream
      </div>
    </div>
    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00bfff' }}>61M</div>
      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>concurrent users</div>
    </div>
  </div>
);

/* ─── Architecture diagram image panel (for Slide 5) ─── */
const ArchDiagram = ({ color }: { color: string }) => {
  const layers = [
    { label: 'Users (500M+)', icon: '👥', tools: ['Mobile', 'Web', 'Smart TV'], col: '#00C2CB' },
    { label: 'CDN Layer', icon: '🌍', tools: ['AWS CloudFront', '150+ Edge PoPs'], col: '#F5A623' },
    { label: 'Gateway', icon: '🔀', tools: ['Envoy Proxy', 'Load Balancer'], col: '#8B5CF6' },
    { label: 'EKS Cluster', icon: '☸️', tools: ['800+ Microservices', 'Istio Mesh'], col: '#22C55E' },
    { label: 'Data Layer', icon: '🗄️', tools: ['Redis Cache', 'Cassandra', 'S3'], col: '#E8433A' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '0.5rem' }}>
      {layers.map((l, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', background: `${l.col}0c`, border: `1px solid ${l.col}30`, borderRadius: '8px', padding: '0.45rem 0.8rem' }}>
          <span style={{ fontSize: '1.1rem' }}>{l.icon}</span>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: l.col, width: '110px', flexShrink: 0 }}>{l.label}</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {l.tools.map((t, j) => (
              <span key={j} style={{ fontSize: '0.6rem', background: `${l.col}18`, border: `1px solid ${l.col}33`, borderRadius: '4px', padding: '2px 7px', color: 'rgba(255,255,255,0.65)' }}>{t}</span>
            ))}
          </div>
          {i < layers.length - 1 && <div style={{ marginLeft: 'auto', color: `${color}55`, fontSize: '0.8rem' }}>▼</div>}
        </motion.div>
      ))}
    </div>
  );
};

/* ─── Future Tech Cards ─── */
const FutureTechCards = () => {
  const cards = [
    { icon: '🤖', title: 'AI Autoscaling', desc: 'ML predicts traffic 10 min ahead', col: '#00C2CB' },
    { icon: '☁️', title: 'Multi-Cloud', desc: 'AWS + Azure + GCP failover', col: '#8B5CF6' },
    { icon: '🔐', title: 'DevSecOps', desc: 'Security in every PR pipeline', col: '#E8433A' },
    { icon: '📡', title: '5G Edge', desc: 'Stream latency below 1 second', col: '#22C55E' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '0.5rem' }}>
      {cards.map((c, i) => (
        <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
          style={{ background: `${c.col}0e`, border: `1px solid ${c.col}33`, borderRadius: '10px', padding: '0.7rem 0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>{c.icon}</span>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: c.col }}>{c.title}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{c.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
const UIOverlay: React.FC = () => {
  const { currentSlide, nextSlide, prevSlide, setSlide } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') nextSlide(SLIDES.length);
      if (e.key === 'ArrowLeft'  || e.key === 'PageUp')                      prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const slide = SLIDES[currentSlide];
  const progress = (currentSlide / (SLIDES.length - 1)) * 100;

  return (
    <div className="ui-overlay" style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      {/* ── Top bar ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '12px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(4,6,15,0.92) 0%, transparent 100%)',
        zIndex: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={jioLogo} alt="JioHotstar" style={{ height: '22px', width: 'auto', objectFit: 'contain', opacity: 0.75 }} />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            DevOps Case Study
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '140px', height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
              style={{ height: '100%', background: `linear-gradient(90deg, ${slide.color}, ${slide.accent})`, borderRadius: '2px' }} />
          </div>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '10px' }}>{currentSlide + 1}/{SLIDES.length}</span>
        </div>
      </div>

      {/* ── Main slide card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.96, y: 22 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit  ={{ opacity: 0, scale: 1.02,  y: -18}}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(5, 8, 22, 0.90)',
            backdropFilter: 'blur(22px)',
            borderLeft: `6px solid ${slide.color}`,
            border: `1px solid rgba(255,255,255,0.06)`,
            borderLeftWidth: '6px',
            borderLeftColor: slide.color,
            borderRadius: '20px',
            padding: '2.2rem 2.6rem',
            width: '83%',
            maxWidth: '1060px',
            maxHeight: '78vh',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            boxShadow: `0 28px 64px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px ${slide.color}0a`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            position: 'relative',
          }}
        >
          {/* Ambient glow bg */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
            background: `radial-gradient(ellipse at top left, ${slide.color}0d 0%, transparent 55%),
                         radial-gradient(ellipse at bottom right, ${slide.accent}0a 0%, transparent 55%)`,
          }} />

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

            {/* ── Hero (slide 0 only) ── */}
            {currentSlide === 0 && <HeroSlide slide={slide} />}

            {/* ── Header ── */}
            {currentSlide !== 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.55rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>{slide.icon}</span>
                  <div style={{
                    background: `linear-gradient(135deg, ${slide.color}28, ${slide.accent}18)`,
                    border: `1px solid ${slide.color}44`,
                    padding: '3px 12px', borderRadius: '20px',
                    fontSize: '10px', color: slide.color, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>{slide.tag}</div>
                </div>
                <h1 style={{
                  fontSize: currentSlide === SLIDES.length - 1 ? '3.2rem' : '2.4rem',
                  margin: 0, lineHeight: 1.05, fontWeight: 800,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                  ...(currentSlide === SLIDES.length - 1 ? {
                    background: `linear-gradient(90deg, ${slide.color}, ${slide.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  } : {}),
                }}>{slide.title}</h1>
                <h2 style={{ fontSize: '0.95rem', margin: '0.4rem 0 0', color: slide.color, fontWeight: 500, opacity: 0.9 }}>{slide.subtitle}</h2>
              </div>
            )}

            {/* Slide 0 title (below hero) */}
            {currentSlide === 0 && (
              <div>
                <h1 style={{
                  fontSize: '3.6rem', margin: 0, lineHeight: 1.05, fontWeight: 800, letterSpacing: '-1px',
                  background: `linear-gradient(90deg, ${slide.color}, ${slide.accent})`,
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{slide.title}</h1>
                <h2 style={{ fontSize: '1rem', margin: '0.4rem 0 0', color: slide.color, fontWeight: 500, opacity: 0.85 }}>{slide.subtitle}</h2>
              </div>
            )}

            {/* Divider */}
            <div style={{ height: '1px', background: `linear-gradient(90deg, ${slide.color}66, ${slide.accent}33, transparent)` }} />

            {/* Body text */}
            {slide.body && (
              <div style={{ color: '#b5c8e2', fontSize: '0.92rem', whiteSpace: 'pre-line', lineHeight: 1.72 }}>
                {slide.body}
              </div>
            )}

            {/* Cricket badge on title slide */}
            {currentSlide === 0 && <CricketBadge />}

            {/* Visuals per slide type */}
            {slide.visual === 'pipeline' && <PipelineVisual color={slide.color} />}
            {slide.visual === 'tools'    && <ToolsGrid />}
            {slide.visual === 'mindmap'  && <MindMapVisual />}
            {slide.visual === 'arch'     && <ArchDiagram color={slide.color} />}
            {slide.visual === 'future'   && <FutureTechCards />}

            {/* Survey bars */}
            {slide.visual === 'survey' && (
              <div>
                <SurveyBar question="Q1 — Do you know what DevOps is?" items={[
                  { label: 'Yes', pct: 58, color: '#22C55E' },
                  { label: 'Heard of it', pct: 33, color: '#F5A623' },
                  { label: 'No', pct: 9, color: '#E8433A' },
                ]} />
                <SurveyBar question="Q2 — Does automation reduce errors?" items={[
                  { label: 'Strongly Agree', pct: 67, color: '#22C55E' },
                  { label: 'Agree', pct: 25, color: '#00C2CB' },
                  { label: 'Not Sure', pct: 8, color: '#8B5CF6' },
                ]} />
                <SurveyBar question="Q3 — Is DevOps the future of IT?" items={[
                  { label: 'Yes', pct: 75, color: '#22C55E' },
                  { label: 'Maybe', pct: 17, color: '#F5A623' },
                  { label: 'No', pct: 8, color: '#E8433A' },
                ]} />
              </div>
            )}

            {/* Highlights */}
            {slide.highlights && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {slide.highlights.map((h, i) => <HighlightRow key={i} text={h} color={slide.color} delay={i * 0.05} />)}
              </div>
            )}

            {/* Stats row (skip slide 0 — shown in hero) */}
            {slide.stats && currentSlide !== 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {slide.stats.map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} style={{ flex: 1, minWidth: '80px' }}>
                    <StatCard label={s.label} value={s.value} color={s.color ?? slide.color} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom navigation ── */}
      <div style={{
        position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '14px', pointerEvents: 'auto',
        background: 'rgba(5,8,22,0.75)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.07)', borderRadius: '40px', padding: '7px 14px',
      }}>
        <button className="nav-btn" onClick={() => prevSlide()} style={{ opacity: currentSlide === 0 ? 0.25 : 1 }}>‹</button>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <motion.div key={i} onClick={() => setSlide(i)}
              animate={{ width: currentSlide === i ? '22px' : '6px', background: currentSlide === i ? slide.color : 'rgba(255,255,255,0.18)' }}
              transition={{ duration: 0.3 }}
              style={{ height: '6px', borderRadius: '3px', cursor: 'pointer', boxShadow: currentSlide === i ? `0 0 8px ${slide.color}` : 'none' }}
            />
          ))}
        </div>
        <button className="nav-btn" onClick={() => nextSlide(SLIDES.length)} style={{ opacity: currentSlide === SLIDES.length - 1 ? 0.25 : 1 }}>›</button>
      </div>

      <div style={{ position: 'absolute', bottom: '28px', right: '22px', color: 'rgba(255,255,255,0.13)', fontSize: '10px', letterSpacing: '1px' }}>
        ← → keys
      </div>
    </div>
  );
};

export default UIOverlay;
