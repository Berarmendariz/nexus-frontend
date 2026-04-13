import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReportDisplay from '../components/ReportDisplay.jsx'

const API = import.meta.env.VITE_API_URL || ''

export default function HistoryPage() {
  const [simulations, setSimulations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSim, setSelectedSim] = useState(null)
  const [compareIds, setCompareIds] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => { loadSimulations() }, [])

  async function loadSimulations() {
    setLoading(true)
    try {
      const res = await fetch(API + '/api/simulations')
      const data = await res.json()
      setSimulations(data.data || [])
    } catch { setSimulations([]) }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta simulación?')) return
    await fetch(API + `/api/simulations/${id}`, { method: 'DELETE' })
    setSimulations(prev => prev.filter(s => s.id !== id))
    if (selectedSim?.id === id) setSelectedSim(null)
  }

  async function handleView(id) {
    const res = await fetch(API + `/api/simulations/${id}`)
    const data = await res.json()
    setSelectedSim(data.data)
  }

  function handleDownloadPDF(id) {
    window.open(API + `/api/simulations/${id}/pdf`, '_blank')
  }

  function toggleCompare(id) {
    setCompareIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else if (next.size < 4) next.add(id)
      return next
    })
  }

  function handleCompare() {
    if (compareIds.size >= 2) {
      navigate('/compare?ids=' + [...compareIds].join(','))
    }
  }

  const formatDate = (ts) => {
    try { return new Date(ts).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return ts }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 16 }}>← Inicio</button>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Historial de Simulaciones</h1>
          <span style={{ fontSize: 12, color: 'var(--text-3)', background: 'var(--surface-2)', borderRadius: 8, padding: '4px 10px' }}>{simulations.length} simulaciones</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {compareIds.size >= 2 && (
            <button onClick={handleCompare} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Comparar ({compareIds.size})
            </button>
          )}
          <button onClick={() => navigate('/simulator')} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 20px', color: 'var(--text)', fontSize: 13, cursor: 'pointer' }}>
            + Nueva Simulación
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 65px)' }}>
        {/* Left: list */}
        <div style={{ width: 420, borderRight: '1px solid var(--border)', overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading && <p style={{ color: 'var(--text-3)', textAlign: 'center', padding: 32 }}>Cargando...</p>}
          {!loading && simulations.length === 0 && (
            <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-3)' }}>
              <p style={{ fontSize: 32, marginBottom: 12 }}>📊</p>
              <p>No hay simulaciones aún</p>
              <button onClick={() => navigate('/simulator')} style={{ marginTop: 16, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', cursor: 'pointer', fontSize: 13 }}>
                Crear primera simulación
              </button>
            </div>
          )}
          {simulations.map(sim => (
            <div
              key={sim.id}
              style={{
                background: selectedSim?.id === sim.id ? 'var(--surface-2)' : 'var(--surface)',
                border: `1px solid ${compareIds.has(sim.id) ? '#3b82f6' : 'var(--border)'}`,
                borderRadius: 12, padding: 16, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => handleView(sim.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>{sim.project?.name || 'Sin nombre'}</h3>
                <span style={{ fontSize: 10, color: 'var(--text-3)' }}>{formatDate(sim.timestamp)}</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-2)', margin: '0 0 10px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {sim.question || sim.project?.location || ''}
              </p>
              {/* KPI badges */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {(sim.kpis || []).slice(0, 3).map((kpi, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: '2px 8px', borderRadius: 6,
                    background: kpi.type === 'positive' ? 'rgba(34,197,94,0.1)' : kpi.type === 'negative' ? 'rgba(239,68,68,0.1)' : 'var(--surface-2)',
                    color: kpi.type === 'positive' ? '#22c55e' : kpi.type === 'negative' ? '#ef4444' : 'var(--text-2)',
                    border: '1px solid transparent',
                  }}>
                    {kpi.label}: {kpi.value}
                  </span>
                ))}
              </div>
              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={e => { e.stopPropagation(); toggleCompare(sim.id) }} style={{ fontSize: 10, padding: '4px 10px', background: compareIds.has(sim.id) ? '#3b82f620' : 'var(--surface-2)', border: `1px solid ${compareIds.has(sim.id) ? '#3b82f6' : 'var(--border)'}`, borderRadius: 6, color: compareIds.has(sim.id) ? '#3b82f6' : 'var(--text-3)', cursor: 'pointer' }}>
                  {compareIds.has(sim.id) ? '✓ Comparar' : 'Comparar'}
                </button>
                <button onClick={e => { e.stopPropagation(); handleDownloadPDF(sim.id) }} style={{ fontSize: 10, padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text-3)', cursor: 'pointer' }}>
                  📄 PDF
                </button>
                <button onClick={e => { e.stopPropagation(); handleDelete(sim.id) }} style={{ fontSize: 10, padding: '4px 10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 6, color: '#ef4444', cursor: 'pointer' }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: detail */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {!selectedSim && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-3)' }}>
              <p>Selecciona una simulación para ver el reporte</p>
            </div>
          )}
          {selectedSim?.report && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{selectedSim.project?.name || 'Simulación'}</h2>
                <p style={{ fontSize: 13, color: 'var(--text-2)', margin: 0 }}>{selectedSim.question}</p>
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>{formatDate(selectedSim.timestamp)}</p>
              </div>
              <ReportDisplay report={selectedSim.report} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
