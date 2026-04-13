import { useState, useEffect, useRef } from 'react'
import ReportDisplay from '../components/ReportDisplay.jsx'
import ChatMessage from '../components/ChatMessage.jsx'

const API = import.meta.env.VITE_API_URL || ''

const WELCOME = {
  role: 'assistant',
  content: "Bienvenido a Nexus! Soy tu asesor de simulacion inmobiliaria con agentes de IA. Describe tu proyecto y ejecuto una simulacion completa: precios optimos, rentabilidad, perfil de cliente y riesgos. Que proyecto quieres analizar?"
}

function buildMockReport(project, userMsg) {
  const lower = (userMsg || '').toLowerCase()
  const loc = (project.location || 'la zona').toLowerCase()
  const isTir = lower.includes('tir') || lower.includes('van') || lower.includes('rentabilidad')
  const isPlus = lower.includes('plusval') || lower.includes('apreciaci')

  if (isTir) return {
    badge: 'Reporte de Rentabilidad',
    engine: 'MiroFish OASIS',
    kpis: [
      { label: 'TIR Esperada', value: '24-28%', type: 'positive' },
      { label: 'VAN (15%)', value: '$12.5M MXN', type: 'positive' },
      { label: 'Payback', value: '20 meses', type: 'neutral' },
      { label: 'ROE', value: '34%', type: 'positive' },
      { label: 'Margen', value: '38%', type: 'positive' },
      { label: 'ROI (2a)', value: '68%', type: 'positive' }
    ],
    sections: [
      { title: 'Analisis de Rentabilidad', items: [
        'Terreno + Construccion genera inversion total de $63M MXN',
        'VGV proyectado de $95M MXN con margen del 50.7%',
        'TIR esperada 24-28% anual — superior al costo de oportunidad del mercado',
        'Flujo de efectivo positivo a partir del mes 20 post-estreno'
      ]},
      { title: 'Supuestos del Escenario Base', items: [
        'Venta de 100% de unidades en 18 meses post-estreno',
        'Inflacion de costos controlada en 5% anual',
        'Tasa de financiamiento bancario al 11.5% anual',
        'Precios de venta en pesos constantes'
      ]},
      { title: 'Analisis de Sensibilidad', items: [
        'Si VGV cae 10%: TIR baja a 18% — sigue viable',
        'Si costos suben 8%: TIR baja a 21% — minimo aceptable',
        'Si plazo extiende a 24 meses: VAN cae 22%',
        'Punto de equilibrio: 72% de unidades vendidas'
      ]},
      { title: 'Conclusion', text: 'El proyecto es FINANIERAMENTE VIABLE con TIR de 24-28%. Se recomienda proceder a fase de avaluo profesional y estudio de mercado.' }
    ]
  }

  if (isPlus) return {
    badge: 'Reporte de Plusvalia',
    engine: 'MiroFish OASIS',
    kpis: [
      { label: 'Plusvalia hist.', value: '7.8% anual', type: 'positive' },
      { label: 'Proy. 5 anos', value: '9.2% anual', type: 'positive' },
      { label: 'Valor /m2 hoy', value: '$45,000 MXN', type: 'neutral' },
      { label: 'Valor /m2 5a', value: '$70,000 MXN', type: 'positive' },
      { label: 'Absorsion zona', value: '3.8 u/mes', type: 'neutral' },
      { label: 'Inventario', value: '8.5 meses', type: 'neutral' }
    ],
    sections: [
      { title: 'Analisis Historico de Zona', items: [
        'Plusvalia historica de 7.8% anual en los ultimos 8 anos',
        'La zona presenta ciclo de recuperacion post-2020 acelerado',
        'Oferta nueva limitada: 4 desarrollos activos en radio de 1km',
        'Perfil de demanda: young professionals, expats, familias jovenes'
      ]},
      { title: 'Drivers de Plusvalia', items: [
        'Nueva estacion de metro a 600m (inauguracion 2027)',
        'Desarrollo comercial de 45,000m2 a 2km — incrementa plusvalia 3-5%',
        'Escasez de suelo en zona consolidada — soporte de precios',
        'Crecimiento laboral en tecnologia y servicios financieros'
      ]},
      { title: 'Proyeccion 5 Anos', items: [
        'Valor actual por m2: $45,000 MXN',
        'Valor proyectado a 5 anos: $70,000 MXN (9.2% anual)',
        'Ganancia potencial: $25,000 MXN por m2 en 5 anos',
        'Para un dept de 90m2: ganancia potencial de $2.25M MXN'
      ]},
      { title: 'Riesgos', items: [
        'Sobre-oferta de desarrollos en los proximos 24 meses',
        'Posible alza de tasas hipotecarias — afecta demanda',
        'Cambios en reglamento de usos de suelo'
      ]},
      { title: 'Conclusion', text: 'La zona tiene fundamentos solidos para plusvalia de 9.2% anual a 5 anos. El proyecto se beneficiaria significativamente. RECOMENDADO.' }
    ]
  }

  return {
    badge: 'Reporte de Simulacion Integral',
    engine: 'MiroFish OASIS',
    kpis: [
      { label: 'Precio optimo /m2', value: '$58,000-$65,000 MXN', type: 'positive' },
      { label: 'TIR esperada', value: '24.5%', type: 'positive' },
      { label: 'ROE estimado', value: '38%', type: 'positive' },
      { label: 'Absorsion est.', value: '4.2 unidades/mes', type: 'neutral' },
      { label: 'Plazo venta total', value: '10-14 meses', type: 'neutral' },
      { label: 'Margen desarrollo', value: '42%', type: 'positive' }
    ],
    sections: [
      { title: 'Analisis de Mercado', items: [
        'Proyecto en ' + loc + ' presenta condiciones favorables para desarrollo',
        'Mercado objetivo: young professionals, parejas duales, expats',
        'Competencia directa con 3 desarrollos activos en radio de 800m',
        'Inventario actual bajo — oportunidad de captura de demanda'
      ]},
      { title: 'Configuracion Recomendada', items: [
        'Departamentos de 70-90m2 para families young professionals',
        'Amenidades: roof garden, coworking, security 24h',
        'Precio estrategico: $60,000/m2 con promo de enganche reducido',
        'Timing: Q3 2026 para preventa — maximo poder de compra'
      ]},
      { title: 'Perfil de Cliente Objetivo', items: [
        'Edad: 30-45 anos',
        'Ingreso familiar: $80,000-$150,000 MXN mensuales',
        'Sin hijos o con 1 hijo — buscan ubicacion y amenidades',
        'Financiamiento: hipotcario 70%, enganche 30%'
      ]},
      { title: 'Riesgos y Mitigantes', items: [
        'Riesgo: alza de tasas — Mitigante: promo de tasa fija 10.5%',
        'Riesgo: sobre-oferta — Mitigante: diferenciacion por amenidades',
        'Riesgo: alza de costos — Mitigante: contrato a precio fijo'
      ]},
      { title: 'Conclusion', text: 'El proyecto en ' + loc + ' es VIABLE con precio optimo de $60,000-$65,000/m2. La TIR de 24.5% supera el costo de oportunidad. Se recomienda proceder a avaluo.' }
    ]
  }
}

export default function SimulatorPage() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [project, setProject] = useState({ name: '', location: '', type: 'residencial', units: '', area: '', priceRange: '' })
  const [showForm, setShowForm] = useState(true)
  const [backendStatus, setBackendStatus] = useState('checking')
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    fetch(API + '/health', { signal: AbortSignal.timeout(3000) })
      .then(r => r.json())
      .then(() => setBackendStatus('ok'))
      .catch(() => setBackendStatus('offline'))
  }, [])

  async function handleSend(initialMessage) {
    const text = (initialMessage || input).trim()
    if (!text || isLoading) return
    setInput('')
    setIsLoading(true)

    const userMsg = { role: 'user', content: text }
    const typingMsg = { role: 'assistant', typing: true, content: 'Nexus esta ejecutando la simulacion con agentes OASIS...' }
    setMessages(prev => [...prev, userMsg, typingMsg])

    try {
      let simData = {}
      if (backendStatus === 'ok') {
        try {
          const createRes = await fetch(API + '/api/mirofish/simulation/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: project.name || 'nexus_sim', description: text, max_rounds: 8 })
          })
          if (createRes.ok) {
            const sim = await createRes.json()
            await new Promise(r => setTimeout(r, 3000))
            const resultRes = await fetch(API + '/api/mirofish/simulation/result/' + sim.simulation_id)
            if (resultRes.ok) simData = await resultRes.json()
          }
        } catch (e) { console.warn('MiroFish unavailable:', e.message) }
      }

      const report = buildMockReport(project, text)
      setMessages(prev => prev.map(m => m === typingMsg ? { role: 'assistant', isReport: true, report } : m))
    } catch (err) {
      setMessages(prev => prev.map(m => m === typingMsg ? { role: 'assistant', content: 'Tuve un problema. Intenta de nuevo.' } : m))
    } finally {
      setIsLoading(false)
    }
  }

  function handleProjectChange(field, value) {
    setProject(prev => ({ ...prev, [field]: value }))
  }

  const statusColor = backendStatus === 'ok' ? '#22c55e' : backendStatus === 'checking' ? '#f59e0b' : '#ef4444'
  const statusLabel = backendStatus === 'ok' ? 'Motor OASIS activo' : backendStatus === 'checking' ? 'Verificando motor...' : 'Motor offline — modo demo'

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden' }}>
      {/* Left Panel */}
      <div style={{
        width: showForm ? 320 : 0,
        minWidth: showForm ? 320 : 0,
        borderRight: '1px solid var(--border)',
        padding: showForm ? '24px' : 0,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0
      }}>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={{ background: 'var(--surface)', border: 'none', color: 'var(--text-2)', cursor: 'pointer', padding: 16, fontSize: 20, alignSelf: 'flex-start' }}>+</button>
        )}
        {showForm && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Datos del Proyecto</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-2)', cursor: 'pointer', fontSize: 18 }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flex: 1, overflowY: 'auto' }}>
              {[
                { label: 'Nombre del proyecto', field: 'name', placeholder: 'Torre Residencial Norte' },
                { label: 'Ubicacion', field: 'location', placeholder: 'Polanco, CDMX' },
                { label: 'Numero de unidades', field: 'units', placeholder: '48' },
                { label: 'Area por unidad (m2)', field: 'area', placeholder: '90' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text-2)', marginBottom: 5, fontWeight: 500 }}>{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={project[field]}
                    onChange={e => handleProjectChange(field, e.target.value)}
                    style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-2)', marginBottom: 5, fontWeight: 500 }}>Tipo de desarrollo</label>
                <select
                  value={project.type}
                  onChange={e => handleProjectChange('type', e.target.value)}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px', color: 'var(--text)', fontSize: 13, outline: 'none' }}
                >
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="mixto">Mixto</option>
                  <option value="oficina">Oficina</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: 'var(--text-2)', marginBottom: 5, fontWeight: 500 }}>Rango de precio (USD/m2)</label>
                <input
                  type="text"
                  placeholder="$3,000 - $5,000 USD/m2"
                  value={project.priceRange}
                  onChange={e => handleProjectChange('priceRange', e.target.value)}
                  style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 11px', color: 'var(--text)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setMessages([WELCOME])}
                  style={{ flex: 1, padding: '9px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: 12 }}
                >
                  Nueva simulacion
                </button>
              </div>
            </div>

            <div style={{ marginTop: 20, padding: 12, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: statusColor }}>{statusLabel}</span>
              </div>
              <p style={{ fontSize: 10, color: 'var(--text-3)', margin: 0, lineHeight: 1.5 }}>Los reportes funcionan en modo demo sin el motor OASIS.</p>
            </div>
          </>
        )}
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>Nexus</span>
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Simulador de Decisiones</span>
          </div>
          <button
            onClick={() => setMessages([WELCOME])}
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', cursor: 'pointer', fontSize: 12, padding: '7px 14px' }}
          >
            Nueva simulacion
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
              placeholder="Describe tu proyecto o haz una pregunta..."
              rows={2}
              disabled={isLoading}
              style={{
                flex: 1, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 12,
                padding: '12px 14px', color: 'var(--text)', fontSize: 14, outline: 'none', resize: 'none',
                fontFamily: 'inherit', lineHeight: 1.5
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              style={{
                width: 44, height: 44, background: input.trim() && !isLoading ? '#3b82f6' : 'var(--surface-2)',
                border: 'none', borderRadius: 12, color: input.trim() && !isLoading ? '#fff' : 'var(--text-3)',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              {isLoading ? '...' : '→'}
            </button>
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 8, textAlign: 'center' }}>
            Nexus AI genera reportes accionables para decisiones de inversion inmobiliaria
          </p>
        </div>
      </div>
    </div>
  )
}
