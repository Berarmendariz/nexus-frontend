const AGENT_CONFIG = {
  'Inversionista Angel': { emoji: '💰', color: '#22c55e' },
  'Analista de Mercado': { emoji: '📊', color: '#3b82f6' },
  'Comprador Potencial': { emoji: '🏠', color: '#f59e0b' },
  'Urbanista':           { emoji: '🏗️', color: '#8b5cf6' },
  'Periodista Financiero': { emoji: '📰', color: '#ef4444' },
}

const DEFAULT_AGENT = { emoji: '🤖', color: '#6b7280' }

const ACTION_LABELS = {
  post: 'Publicó',
  like: 'Le gustó',
  reply: 'Respondió',
  analysis: 'Analizó',
  repost: 'Compartió',
  follow: 'Siguió',
}

export default function AgentCard({ activity, index }) {
  const cfg = AGENT_CONFIG[activity.agent] || DEFAULT_AGENT
  const actionLabel = ACTION_LABELS[activity.action] || activity.action

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '14px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        animation: 'fadeSlideIn 0.4s ease both',
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* Header: agent info + round */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{cfg.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
            {activity.agent}
          </span>
          {activity.role && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: cfg.color,
                background: `${cfg.color}18`,
                border: `1px solid ${cfg.color}40`,
                borderRadius: 6,
                padding: '2px 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
              }}
            >
              {activity.role}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--text-3)',
              background: 'var(--surface-2)',
              borderRadius: 6,
              padding: '2px 8px',
            }}
          >
            Ronda {activity.round}
          </span>
        </div>
      </div>

      {/* Action badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: cfg.color,
            letterSpacing: '0.3px',
          }}
        >
          {actionLabel}
        </span>
      </div>

      {/* Content */}
      {activity.content && (
        <p
          style={{
            fontSize: 13,
            color: 'var(--text-2)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {activity.content}
        </p>
      )}
    </div>
  )
}
