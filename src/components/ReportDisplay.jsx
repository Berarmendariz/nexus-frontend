const styles = {
  container: {
    animation: 'slideUp 0.5s ease',
  },
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
  kpiValue: {
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
  kpiSub: {
    fontSize: '11px',
    color: 'var(--nexus-text-3)',
    marginTop: '4px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--nexus-accent-2)',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sectionDivider: {
    flex: 1,
    height: '1px',
    background: 'var(--nexus-border)',
  },
  bulletList: {
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bulletItem: {
    fontSize: '13px',
    color: 'var(--nexus-text-2)',
    lineHeight: 1.6,
    paddingLeft: '16px',
    position: 'relative',
  },
  bullet: {
    position: 'absolute',
    left: 0,
    top: '8px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--nexus-accent)',
  },
  conclusion: {
    background: 'rgba(59,130,246,0.05)',
    border: '1px solid rgba(59,130,246,0.15)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '20px',
  },
  conclusionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: 'var(--nexus-accent-2)',
    marginBottom: '8px',
  },
  conclusionText: {
    fontSize: '13px',
    color: 'var(--nexus-text-2)',
    lineHeight: 1.7,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--nexus-accent)',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'transparent',
    color: 'var(--nexus-accent-2)',
    fontSize: '13px',
    fontWeight: 600,
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid var(--nexus-border)',
    cursor: 'pointer',
  },
}

function getKpiColor(label) {
  const l = label.toLowerCase()
  if (l.includes('tir') || l.includes('retorno')) return 'var(--nexus-success)'
  if (l.includes('riesgo') || l.includes('risk')) return 'var(--nexus-warning)'
  if (l.includes('vpn') || l.includes('inversión') || l.includes('inversion')) return 'var(--nexus-accent-2)'
  return 'var(--nexus-text)'
}

export default function ReportDisplay({ report, onNewQuery }) {
  if (!report) return null

  return (
    <div style={styles.container}>
      {/* KPI Grid */}
      {report.kpis && report.kpis.length > 0 && (
        <div style={styles.kpiGrid}>
          {report.kpis.map((kpi, i) => (
            <div
              key={i}
              style={styles.kpiCard}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--nexus-accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--nexus-border)'}
            >
              <div style={styles.kpiLabel}>{kpi.label}</div>
              <div style={{ ...styles.kpiValue, color: getKpiColor(kpi.label) }}>
                {kpi.value}
              </div>
              {kpi.sub && <div style={styles.kpiSub}>{kpi.sub}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Report Sections */}
      {report.sections && report.sections.map((section, i) => (
        <div key={i} style={styles.section}>
          <div style={styles.sectionTitle}>
            <span>{section.title}</span>
            <div style={styles.sectionDivider} />
          </div>
          <ul style={styles.bulletList}>
            {section.items.map((item, j) => (
              <li key={j} style={styles.bulletItem}>
                <div style={styles.bullet} />
                {item}
              </li>
            ))}
          </ul>
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
          onClick={() => alert('La descarga de PDF estará disponible próximamente.')}
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
