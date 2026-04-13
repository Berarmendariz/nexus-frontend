const API = import.meta.env.VITE_API_URL || ''

const styles = {
  container: { animation: 'slideUp 0.5s ease' },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  kpiCard: {
    background: 'var(--nexus-surface-2)',
    border: '1px solid var(--nexus-border)',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center',
    transition: 'border-color 0.2s ease',
  },
  kpiLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--nexus-text-3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  kpiValue: { fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' },
  section: { marginBottom: '20px' },
  sectionTitle: {
    fontSize: '15px', fontWeight: 700, color: 'var(--nexus-accent-2)',
    marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
  },
  sectionDivider: { flex: 1, height: '1px', background: 'var(--nexus-border)' },
  bulletList: { listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' },
  bulletItem: {
    fontSize: '13px', color: 'var(--nexus-text-2)', lineHeight: 1.6,
    paddingLeft: '16px', position: 'relative',
  },
  bullet: { position: 'absolute', left: 0, top: '8px', width: '4px', height: '4px', borderRadius: '50%', background: 'var(--nexus-accent)' },
  conclusion: {
    background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: '12px', padding: '16px 20px', marginBottom: '20px',
  },
  conclusionTitle: { fontSize: '13px', fontWeight: 700, color: 'var(--nexus-accent-2)', marginBottom: '8px' },
  conclusionText: { fontSize: '13px', color: 'var(--nexus-text-2)', lineHeight: 1.7 },
  actions: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' },
  btnPrimary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--nexus-accent)',
    color: '#fff', fontSize: '13px', fontWeight: 600, padding: '10px 20px',
    borderRadius: '8px', border: 'none', cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent',
    color: 'var(--nexus-accent-2)', fontSize: '13px', fontWeight: 600, padding: '10px 20px',
    borderRadius: '8px', border: '1px solid var(--nexus-border)', cursor: 'pointer',
  },
  badgeRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 },
  badge: {
    display: 'inline-flex', padding: '4px 12px', borderRadius: 999, fontSize: 12,
    fontWeight: 700, letterSpacing: '0.5px',
  },
  score: { fontSize: 13, color: 'var(--nexus-text-3)', marginLeft: 8 },
}

const BADGE_STYLES = {
  'strong-buy':  { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' },
  'buy':         { background: 'rgba(34,197,94,0.1)',  color: '#86efac', border: '1px solid rgba(34,197,94,0.2)' },
  'hold':        { background: 'rgba(245,158,11,0.1)', color: '#fcd34d', border: '1px solid rgba(245,158,11,0.2)' },
  'sell':        { background: 'rgba(239,68,68,0.1)',  color: '#fca5a5', border: '1px solid rgba(239,68,68,0.2)' },
  'strong-sell': { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
}

function getKpiColor(label, type) {
  if (type === 'positive' || type === 'up') return 'var(--nexus-success)'
  if (type === 'negative' || type === 'down') return 'var(--nexus-danger)'
  if (type === 'warning') return 'var(--nexus-warning)'
  const l = (label || '').toLowerCase()
  if (l.includes('tir') || l.includes('retorno') || l.includes('roi') || l.includes('roe')) return 'var(--nexus-success)'
  if (l.includes('riesgo') || l.includes('risk')) return 'var(--nexus-warning)'
  return 'var(--nexus-text)'
}

function renderSectionContent(section) {
  if (section.content) {
    return (
      <>
        {section.content && <p style={{ fontSize: '13px', color: 'var(--nexus-text-2)', lineHeight: 1.7, marginBottom: 8 }}>{section.content}</p>}
        {(section.subsections || []).map((sub, j) => (
          <div key={j} style={{ marginTop: 10 }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nexus-text-2)', marginBottom: 4 }}>{sub.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--nexus-text-2)', lineHeight: 1.6 }}>{sub.content}</div>
          </div>
        ))}
      </>
    )
  }
  if (section.items) {
    return (
      <ul style={styles.bulletList}>
        {section.items.map((item, j) => (
          <li key={j} style={styles.bulletItem}>
            <div style={styles.bullet} />
            {item}
          </li>
        ))}
      </ul>
    )
  }
  if (section.text) {
    return <p style={{ fontSize: '13px', color: 'var(--nexus-text-2)', lineHeight: 1.7 }}>{section.text}</p>
  }
  return null
}

export default function ReportDisplay({ report, onNewQuery, simulationId }) {
  if (!report) return null

  const badgeStyle = BADGE_STYLES[report.badge] || BADGE_STYLES.hold || {}

  return (
    <div style={styles.container}>
      {/* Badge + score */}
      {(report.badge || report.score) && (
        <div style={styles.badgeRow}>
          {report.badge && (
            <span style={{ ...styles.badge, ...badgeStyle }}>
              {report.badgeLabel || report.badge}
            </span>
          )}
          {report.score != null && (
            <span style={styles.score}>Score: {report.score}/100</span>
          )}
          {report.engine && (
            <span style={{ fontSize: 11, color: 'var(--nexus-text-3)', marginLeft: 'auto' }}>
              Motor: {report.engine}
            </span>
          )}
        </div>
      )}

      {/* Executive summary */}
      {report.summary && (
        <div style={{ background: 'var(--nexus-surface-2)', border: '1px solid var(--nexus-border)', borderRadius: 12, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--nexus-accent-2)', marginBottom: 6 }}>RESUMEN EJECUTIVO</div>
          <p style={{ fontSize: 14, color: 'var(--nexus-text-2)', lineHeight: 1.7 }}>{report.summary}</p>
        </div>
      )}

      {/* KPI Grid */}
      {report.kpis && Array.isArray(report.kpis) && report.kpis.length > 0 && (
        <div style={styles.kpiGrid}>
          {report.kpis.map((kpi, i) => (
            <div
              key={i}
              style={styles.kpiCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--nexus-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nexus-border)'}
            >
              <div style={styles.kpiLabel}>{kpi.label}</div>
              <div style={{ ...styles.kpiValue, color: getKpiColor(kpi.label, kpi.type || kpi.trend) }}>
                {kpi.value}
              </div>
              {kpi.description && <div style={{ fontSize: 11, color: 'var(--nexus-text-3)', marginTop: 4 }}>{kpi.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Risk indicators */}
      {report.risks && Array.isArray(report.risks) && report.risks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ ...styles.sectionTitle, marginBottom: 12 }}>
            <span>⚠️ Riesgos</span>
            <div style={styles.sectionDivider} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
            {report.risks.map((risk, i) => {
              const levelColor = risk.level === 'high' ? 'var(--nexus-danger)' : risk.level === 'medium' ? 'var(--nexus-warning)' : 'var(--nexus-success)'
              return (
                <div key={i} style={{ background: 'var(--nexus-surface-2)', border: '1px solid var(--nexus-border)', borderRadius: 10, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: levelColor, display: 'inline-block' }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--nexus-text)' }}>{risk.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--nexus-text-2)', lineHeight: 1.5 }}>{risk.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Report Sections */}
      {report.sections && Array.isArray(report.sections) && report.sections.map((section, i) => (
        <div key={i} style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>{section.icon ? `${section.icon} ` : ''}{section.title}</span>
            <div style={styles.sectionDivider} />
          </div>
          {renderSectionContent(section)}
        </div>
      ))}

      {/* Conclusion */}
      {report.conclusion && (
        <div style={styles.conclusion}>
          <div style={styles.conclusionTitle}>💡 Conclusión</div>
          <p style={styles.conclusionText}>{report.conclusion}</p>
        </div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={styles.btnPrimary}
          onClick={() => {
            const id = simulationId || report._simId
            if (!id) { alert('Primero guarda la simulación desde el simulador.'); return }
            window.open(`${API}/api/simulations/${id}/pdf`, '_blank')
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          📥 Descargar PDF
        </button>
        {onNewQuery && (
          <button
            style={styles.btnSecondary}
            onClick={onNewQuery}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--nexus-accent)'; e.target.style.background = 'rgba(59,130,246,0.05)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--nexus-border)'; e.target.style.background = 'transparent' }}
          >
            🔄 Nueva Consulta
          </button>
        )}
      </div>
    </div>
  )
}
