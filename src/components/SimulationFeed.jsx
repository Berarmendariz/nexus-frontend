import { useEffect, useRef } from 'react'
import AgentCard from './AgentCard.jsx'

const PHASE_LABELS = {
  initializing: 'Inicializando agentes…',
  simulating: 'Simulación en progreso',
  analyzing: 'Analizando resultados…',
  generating: 'Generando reporte…',
  complete: 'Simulación completa',
}

export default function SimulationFeed({ activities, currentRound, totalRounds, phase }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activities.length])

  const phaseLabel = PHASE_LABELS[phase] || phase || 'Preparando…'
  const isActive = phase && phase !== 'complete'

  return (
    <div
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 16,
        animation: 'fadeSlideIn 0.4s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: isActive ? '#22c55e' : 'var(--text-3)',
              animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
            Simulación en Vivo
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
            — {phaseLabel}
          </span>
        </div>

        {totalRounds > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-2)',
                background: 'var(--surface-2)',
                borderRadius: 8,
                padding: '4px 10px',
                border: '1px solid var(--border)',
              }}
            >
              Ronda {currentRound} de {totalRounds}
            </span>

            {/* Progress bar */}
            <div
              style={{
                width: 80,
                height: 4,
                borderRadius: 2,
                background: 'var(--border)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0}%`,
                  height: '100%',
                  background: '#3b82f6',
                  borderRadius: 2,
                  transition: 'width 0.5s ease',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div
        style={{
          maxHeight: 420,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {activities.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '32px 0',
              color: 'var(--text-3)',
              fontSize: 13,
            }}
          >
            <span style={{ animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }}>
              Esperando actividad de agentes…
            </span>
          </div>
        )}

        {activities.map((activity, i) => (
          <AgentCard key={i} activity={activity} index={i} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Footer stats */}
      {activities.length > 0 && (
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 11,
            color: 'var(--text-3)',
          }}
        >
          <span>🤖 {new Set(activities.map(a => a.agent)).size} agentes activos</span>
          <span>💬 {activities.length} actividades</span>
        </div>
      )}
    </div>
  )
}
