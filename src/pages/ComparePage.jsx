import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || ''

export default function ComparePage() {
  const [searchParams] = useSearchParams()
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ids = (searchParams.get('ids') || '').split(',').filter(Boolean)
    if (ids.length < 2) {
      setError('Selecciona al menos 2 simulaciones para comparar')
      setLoading(false)
      return
    }
    runComparison(ids)
  }, [searchParams])

  async function runComparison(ids) {
    setLoading(true)
    try {
      const res = await fetch(API + '/api/scenarios/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulationIds: ids }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setComparison(data.data)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const typeColor = (type) => type === 'positive' ? '#22c55e' : type === 'negative' ? '#ef4444' : 'var(--text-2)'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 16 }}>← Historial</button>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Comparación de Escenarios</h1>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
        {loading && <p style={{ textAlign: 'center', color: 'var(--text-3)', padding: 48 }}>Generando comparación con IA...</p>}
        {error && <p style={{ textAlign: 'center', color: '#ef4444', padding: 48 }}>{error}</p>}

        {comparison && (
          <>
            {/* KPI Comparison Table */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Comparativa de KPIs</h2>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-3)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>KPI</th>
                      {comparison.simulations.map(s => (
                        <th key={s.id} style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--text)', fontWeight: 600, fontSize: 12 }}>
                          {s.project?.name || s.id.slice(0, 8)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(comparison.kpiMatrix || {}).map(([label, values]) => (
                      <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 16px', color: 'var(--text-2)', fontWeight: 500 }}>{label}</td>
                        {values.map((v, i) => (
                          <td key={i} style={{ textAlign: 'center', padding: '10px 16px', color: typeColor(v.type), fontWeight: 600 }}>
                            {v.value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Summary */}
            {comparison.aiSummary && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 20 }}>🤖</span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Análisis Comparativo IA</h2>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {comparison.aiSummary}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
