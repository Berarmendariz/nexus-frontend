import { useNavigate } from 'react-router-dom'

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  /* ── NAV ── */
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 48px',
    borderBottom: '1px solid var(--nexus-border)',
    backdropFilter: 'blur(12px)',
    background: 'rgba(8,12,20,0.85)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '24px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, var(--nexus-accent), var(--nexus-accent-2))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLinks: {
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
  },
  navLink: {
    color: 'var(--nexus-text-2)',
    fontSize: '14px',
    fontWeight: 500,
    background: 'none',
    padding: 0,
  },
  navCta: {
    background: 'var(--nexus-accent)',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 600,
    padding: '8px 20px',
    borderRadius: '8px',
  },
  /* ── HERO ── */
  hero: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '120px 24px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute',
    top: '-200px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '800px',
    height: '800px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(59,130,246,0.1)',
    border: '1px solid rgba(59,130,246,0.2)',
    borderRadius: '100px',
    padding: '6px 16px',
    fontSize: '13px',
    color: 'var(--nexus-accent-2)',
    fontWeight: 500,
    marginBottom: '32px',
    animation: 'fadeIn 0.6s ease',
  },
  heroTitle: {
    fontSize: 'clamp(48px, 8vw, 80px)',
    fontWeight: 900,
    letterSpacing: '-2px',
    lineHeight: 1.05,
    marginBottom: '24px',
    background: 'linear-gradient(135deg, #fff 0%, var(--nexus-text-2) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: 'slideUp 0.6s ease',
  },
  heroSubtitle: {
    fontSize: '20px',
    color: 'var(--nexus-text-2)',
    maxWidth: '560px',
    lineHeight: 1.6,
    marginBottom: '48px',
    animation: 'slideUp 0.7s ease',
  },
  heroCta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, var(--nexus-accent), #2563eb)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    padding: '16px 36px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(59,130,246,0.3)',
    transition: 'all 0.3s ease',
    animation: 'slideUp 0.8s ease',
  },
  /* ── FEATURES ── */
  features: {
    padding: '80px 48px',
    maxWidth: '1100px',
    margin: '0 auto',
    width: '100%',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: 800,
    letterSpacing: '-1px',
    marginBottom: '16px',
  },
  sectionSub: {
    textAlign: 'center',
    fontSize: '16px',
    color: 'var(--nexus-text-2)',
    marginBottom: '56px',
    maxWidth: '500px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
  },
  featureCard: {
    background: 'var(--nexus-surface)',
    border: '1px solid var(--nexus-border)',
    borderRadius: '16px',
    padding: '32px',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    marginBottom: '20px',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 700,
    marginBottom: '12px',
    color: 'var(--nexus-text)',
  },
  featureDesc: {
    fontSize: '14px',
    color: 'var(--nexus-text-2)',
    lineHeight: 1.7,
  },
  /* ── HOW IT WORKS ── */
  howItWorks: {
    padding: '80px 48px',
    background: 'var(--nexus-surface)',
    borderTop: '1px solid var(--nexus-border)',
    borderBottom: '1px solid var(--nexus-border)',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    maxWidth: '900px',
    margin: '0 auto',
  },
  step: {
    textAlign: 'center',
    padding: '24px',
  },
  stepNumber: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--nexus-accent), #2563eb)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: 800,
    color: '#fff',
    margin: '0 auto 20px',
    boxShadow: '0 4px 20px rgba(59,130,246,0.25)',
  },
  stepTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'var(--nexus-text-2)',
    lineHeight: 1.6,
  },
  /* ── FOOTER ── */
  footer: {
    padding: '40px 48px',
    textAlign: 'center',
    borderTop: '1px solid var(--nexus-border)',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: '13px',
    color: 'var(--nexus-text-3)',
  },
}

const features = [
  {
    icon: '⚡',
    bg: 'rgba(59,130,246,0.1)',
    title: 'Simulación Inteligente',
    desc: 'Modela escenarios de inversión inmobiliaria con IA. Evalúa retorno, riesgo y viabilidad en segundos.',
  },
  {
    icon: '📊',
    bg: 'rgba(34,197,94,0.1)',
    title: 'Análisis Profundo',
    desc: 'Obtén métricas clave: TIR, VPN, cap rate, absorción y comparables de mercado al instante.',
  },
  {
    icon: '📄',
    bg: 'rgba(245,158,11,0.1)',
    title: 'Reportes Ejecutivos',
    desc: 'Genera reportes completos listos para presentar a inversionistas o comités de inversión.',
  },
]

const steps = [
  {
    num: '1',
    title: 'Describe tu Proyecto',
    desc: 'Ingresa los datos básicos: ubicación, tipo de desarrollo, unidades y rango de precios.',
  },
  {
    num: '2',
    title: 'Simula con IA',
    desc: 'Nexus analiza tu proyecto con agentes de IA especializados en el mercado mexicano.',
  },
  {
    num: '3',
    title: 'Decide con Datos',
    desc: 'Recibe un reporte ejecutivo con métricas, riesgos y recomendaciones para tu inversión.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>NEXUS</div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
            Características
          </button>
          <button style={styles.navLink} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
            Cómo Funciona
          </button>
          <button style={styles.navLink} onClick={() => navigate('/history')}>
            Historial
          </button>
          <button style={styles.navLink} onClick={() => navigate('/knowledge-base')}>
            Knowledge Base
          </button>
          <button
            style={styles.navCta}
            onClick={() => navigate('/simulator')}
            onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)' }}
          >
            Abrir Simulador
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.badge}>
          <span>🚀</span>
          <span>Impulsado por IA</span>
        </div>
        <h1 style={styles.heroTitle}>
          Simula. Decide.<br />Invierte.
        </h1>
        <p style={styles.heroSubtitle}>
          La plataforma de simulación de inversiones inmobiliarias más avanzada de México.
          Analiza proyectos con inteligencia artificial en segundos.
        </p>
        <button
          style={styles.heroCta}
          onClick={() => navigate('/simulator')}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 32px rgba(59,130,246,0.4)' }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 24px rgba(59,130,246,0.3)' }}
        >
          Abrir Simulador
          <span style={{ fontSize: '20px' }}>→</span>
        </button>
      </section>

      {/* Features */}
      <section id="features" style={styles.features}>
        <h2 style={styles.sectionTitle}>Todo lo que necesitas</h2>
        <p style={styles.sectionSub}>
          Herramientas profesionales de análisis inmobiliario impulsadas por inteligencia artificial.
        </p>
        <div style={styles.featureGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={styles.featureCard}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--nexus-accent)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(59,130,246,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--nexus-border)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ ...styles.featureIcon, background: f.bg }}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={styles.howItWorks}>
        <h2 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>Cómo Funciona</h2>
        <p style={styles.sectionSub}>Tres pasos para tomar mejores decisiones de inversión.</p>
        <div style={styles.stepsGrid}>
          {steps.map((s, i) => (
            <div key={i} style={styles.step}>
              <div style={styles.stepNumber}>{s.num}</div>
              <h3 style={styles.stepTitle}>{s.title}</h3>
              <p style={styles.stepDesc}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © {new Date().getFullYear()} Nexus — Simulador de Decisiones Inmobiliarias. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  )
}
