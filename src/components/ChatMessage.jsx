import ReportDisplay from './ReportDisplay.jsx'

const styles = {
  wrapper: {
    display: 'flex',
    marginBottom: '16px',
    animation: 'fadeIn 0.3s ease',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  assistantWrapper: {
    justifyContent: 'flex-start',
  },
  userBubble: {
    maxWidth: '70%',
    background: 'linear-gradient(135deg, var(--nexus-accent), #2563eb)',
    color: '#fff',
    padding: '12px 18px',
    borderRadius: '16px 16px 4px 16px',
    fontSize: '14px',
    lineHeight: 1.6,
    boxShadow: '0 2px 12px rgba(59,130,246,0.2)',
  },
  assistantBubble: {
    maxWidth: '85%',
    background: 'var(--nexus-surface)',
    border: '1px solid var(--nexus-border)',
    color: 'var(--nexus-text)',
    padding: '16px 20px',
    borderRadius: '16px 16px 16px 4px',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  assistantLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--nexus-accent-2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--nexus-accent)',
  },
  typingWrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '16px',
    animation: 'fadeIn 0.3s ease',
  },
  typingBubble: {
    background: 'var(--nexus-surface)',
    border: '1px solid var(--nexus-border)',
    padding: '16px 20px',
    borderRadius: '16px 16px 16px 4px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  typingLabel: {
    fontSize: '12px',
    color: 'var(--nexus-accent-2)',
    fontWeight: 600,
  },
  dotsContainer: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--nexus-accent)',
  },
}

export function TypingIndicator() {
  return (
    <div style={styles.typingWrapper}>
      <div style={styles.typingBubble}>
        <span style={styles.typingLabel}>Nexus está analizando...</span>
        <div style={styles.dotsContainer}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                ...styles.typingDot,
                animation: `dotBounce 1.4s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div style={{ ...styles.wrapper, ...styles.userWrapper }}>
        <div style={styles.userBubble}>
          {message.content}
        </div>
      </div>
    )
  }

  if (message.isReport) {
    return (
      <div style={{ ...styles.wrapper, ...styles.assistantWrapper }}>
        <div style={{ ...styles.assistantBubble, maxWidth: '95%' }}>
          <div style={styles.assistantLabel}>
            <div style={styles.dot} />
            <span>Nexus AI</span>
          </div>
          <ReportDisplay report={message.report} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...styles.wrapper, ...styles.assistantWrapper }}>
      <div style={styles.assistantBubble}>
        <div style={styles.assistantLabel}>
          <div style={styles.dot} />
          <span>Nexus AI</span>
        </div>
        {message.content}
      </div>
    </div>
  )
}
