import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * AgentNetworkGraph — Force-directed graph visualization of agent interactions
 * Inspired by Zep Playground's node graph UI
 * 
 * Renders agents as nodes and their interactions as animated edges.
 * Uses canvas for performance with many nodes.
 */

// ── Color palette ──
const COLORS = {
  bg: '#080c14',
  surface: '#0f1623',
  border: '#1e2d42',
  accent: '#3b82f6',
  accent2: '#60a5fa',
  text: '#e2e8f0',
  text2: '#94a3b8',
  text3: '#64748b',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  pink: '#ec4899',
  emerald: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  indigo: '#6366f1',
  teal: '#14b8a6',
  lime: '#84cc16',
  orange: '#f97316',
}

const ROLE_COLORS = {
  'Inversionista': '#22c55e',
  'Analista': '#3b82f6',
  'Comprador': '#f59e0b',
  'Urbanista': '#8b5cf6',
  'Periodista': '#ef4444',
  'Broker': '#06b6d4',
  'Cliente': '#ec4899',
  'Familia': '#10b981',
  'Expat': '#f97316',
  'Financiero': '#6366f1',
  'Regulador': '#14b8a6',
  'Arquitecto': '#84cc16',
  'Legal': '#f43f5e',
  'Marketing': '#a855f7',
  'default': '#64748b',
}

function getRoleColor(role) {
  if (!role) return ROLE_COLORS.default
  for (const [key, color] of Object.entries(ROLE_COLORS)) {
    if (role.toLowerCase().includes(key.toLowerCase())) return color
  }
  return ROLE_COLORS.default
}

// ── Physics simulation ──
class Node {
  constructor(id, data) {
    this.id = id
    this.data = data
    this.x = 300 + (Math.random() - 0.5) * 200
    this.y = 200 + (Math.random() - 0.5) * 150
    this.vx = 0
    this.vy = 0
    this.radius = data.type === 'expert' ? 28 : data.type === 'buyer' ? 18 : 22
    this.color = getRoleColor(data.role)
    this.pulsePhase = Math.random() * Math.PI * 2
    this.targetOpacity = 0
    this.opacity = 0
    this.isActive = false
    this.lastActiveTime = 0
    this.interactionCount = 0
  }
}

class Edge {
  constructor(source, target, data) {
    this.source = source
    this.target = target
    this.data = data
    this.opacity = 0
    this.targetOpacity = 0
    this.animProgress = 0
    this.particles = []
  }
}

function simulate(nodes, edges, width, height) {
  const centerX = width / 2
  const centerY = height / 2

  // Repulsion between nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const minDist = (a.radius + b.radius) * 3
      if (dist < minDist) {
        const force = (minDist - dist) / dist * 0.15
        a.vx -= dx * force
        a.vy -= dy * force
        b.vx += dx * force
        b.vy += dy * force
      }
    }
  }

  // Attraction along edges
  for (const edge of edges) {
    const a = edge.source, b = edge.target
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    const idealDist = (a.radius + b.radius) * 4
    const force = (dist - idealDist) / dist * 0.02
    a.vx += dx * force
    a.vy += dy * force
    b.vx -= dx * force
    b.vy -= dy * force
  }

  // Center gravity
  for (const node of nodes) {
    const dx = centerX - node.x
    const dy = centerY - node.y
    node.vx += dx * 0.001
    node.vy += dy * 0.001

    // Apply velocity
    node.vx *= 0.9
    node.vy *= 0.9
    node.x += node.vx
    node.y += node.vy

    // Bounds
    const margin = node.radius + 10
    node.x = Math.max(margin, Math.min(width - margin, node.x))
    node.y = Math.max(margin, Math.min(height - margin, node.y))

    // Fade in
    node.opacity += (node.targetOpacity - node.opacity) * 0.08
  }

  // Edge animations
  for (const edge of edges) {
    edge.opacity += (edge.targetOpacity - edge.opacity) * 0.06
    if (edge.animProgress < 1) edge.animProgress += 0.02

    // Particles along edge
    if (edge.opacity > 0.1 && Math.random() < 0.03) {
      edge.particles.push({ progress: 0, speed: 0.005 + Math.random() * 0.01 })
    }
    edge.particles = edge.particles.filter(p => {
      p.progress += p.speed
      return p.progress < 1
    })
  }
}

function drawGraph(ctx, nodes, edges, width, height, time, hoveredNode, selectedNode) {
  ctx.clearRect(0, 0, width, height)

  // Background grid
  ctx.strokeStyle = 'rgba(30, 45, 66, 0.3)'
  ctx.lineWidth = 0.5
  const gridSize = 40
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }

  // Draw edges
  for (const edge of edges) {
    if (edge.opacity < 0.01) continue
    const { source: a, target: b } = edge
    const alpha = edge.opacity * 0.6

    // Edge line
    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.4})`
    ctx.lineWidth = 1 + edge.data.weight * 0.5
    ctx.stroke()

    // Particles
    for (const p of edge.particles) {
      const px = a.x + (b.x - a.x) * p.progress
      const py = a.y + (b.y - a.y) * p.progress
      const pAlpha = Math.sin(p.progress * Math.PI) * alpha
      ctx.beginPath()
      ctx.arc(px, py, 2, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(96, 165, 250, ${pAlpha})`
      ctx.fill()
    }

    // Interaction count label at midpoint
    if (edge.data.weight > 1) {
      const mx = (a.x + b.x) / 2
      const my = (a.y + b.y) / 2
      ctx.font = '9px Inter, sans-serif'
      ctx.fillStyle = `rgba(100, 116, 139, ${alpha})`
      ctx.textAlign = 'center'
      ctx.fillText(`${edge.data.weight}`, mx, my - 4)
    }
  }

  // Draw nodes
  for (const node of nodes) {
    if (node.opacity < 0.01) continue
    const { x, y, radius, color, data, opacity } = node
    const isHovered = hoveredNode === node
    const isSelected = selectedNode === node
    const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.15 + 0.85
    const r = radius * (isHovered ? 1.15 : 1) * (node.isActive ? 1.05 : 1)

    // Glow
    if (node.isActive || isHovered) {
      const gradient = ctx.createRadialGradient(x, y, r, x, y, r * 2.5)
      gradient.addColorStop(0, `${color}30`)
      gradient.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(x, y, r * 2.5, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    // Node circle
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = `${color}${Math.round(opacity * pulse * 25).toString(16).padStart(2, '0')}`
    ctx.fill()
    ctx.strokeStyle = `${color}${Math.round(opacity * 180).toString(16).padStart(2, '0')}`
    ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5
    ctx.stroke()

    // Emoji
    const fontSize = data.type === 'expert' ? 18 : data.type === 'buyer' ? 12 : 14
    ctx.font = `${fontSize}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(data.emoji || '🤖', x, y)

    // Name label below
    ctx.font = `${data.type === 'expert' ? 'bold ' : ''}10px Inter, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = `rgba(226, 232, 240, ${opacity * 0.9})`
    ctx.fillText(data.name.length > 14 ? data.name.slice(0, 13) + '…' : data.name, x, y + r + 4)

    // Role tag
    ctx.font = '8px Inter, sans-serif'
    ctx.fillStyle = `${color}${Math.round(opacity * 200).toString(16).padStart(2, '0')}`
    const roleText = data.role.length > 18 ? data.role.slice(0, 17) + '…' : data.role
    ctx.fillText(roleText, x, y + r + 16)

    // Interaction count badge
    if (node.interactionCount > 0) {
      const bx = x + r * 0.7
      const by = y - r * 0.7
      ctx.beginPath()
      ctx.arc(bx, by, 8, 0, Math.PI * 2)
      ctx.fillStyle = '#3b82f6'
      ctx.fill()
      ctx.font = 'bold 8px Inter, sans-serif'
      ctx.fillStyle = '#fff'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText(node.interactionCount, bx, by)
    }
  }
}

export default function AgentNetworkGraph({ activities, agents, phase }) {
  const canvasRef = useRef(null)
  const nodesRef = useRef([])
  const edgesRef = useRef([])
  const animRef = useRef(null)
  const hoveredRef = useRef(null)
  const selectedRef = useRef(null)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [dimensions, setDimensions] = useState({ width: 700, height: 450 })
  const containerRef = useRef(null)

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const obs = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDimensions({ width: Math.max(400, width), height: Math.max(300, height) })
    })
    obs.observe(container)
    return () => obs.disconnect()
  }, [])

  // Build graph from agents + activities
  useEffect(() => {
    if (!agents || agents.length === 0) return
    const nodeMap = new Map()

    // Create nodes
    agents.forEach(agent => {
      if (!nodeMap.has(agent.name)) {
        const node = new Node(agent.name, agent)
        node.targetOpacity = 1
        nodeMap.set(agent.name, node)
      }
    })

    // Preserve positions from existing nodes
    const existingNodes = nodesRef.current
    for (const existing of existingNodes) {
      if (nodeMap.has(existing.id)) {
        const node = nodeMap.get(existing.id)
        node.x = existing.x
        node.y = existing.y
        node.vx = existing.vx
        node.vy = existing.vy
        node.opacity = existing.opacity
        node.interactionCount = existing.interactionCount
      }
    }

    // Build edges from activities
    const edgeMap = new Map()
    const activeAgents = new Set()

    if (activities && activities.length > 0) {
      // Track who interacts with whom by round
      const rounds = {}
      activities.forEach(act => {
        if (act.action === 'join') return
        const r = act.round || 0
        if (!rounds[r]) rounds[r] = []
        rounds[r].push(act.agent)
        activeAgents.add(act.agent)
      })

      // Create edges between agents in same round
      Object.values(rounds).forEach(roundAgents => {
        const unique = [...new Set(roundAgents)]
        for (let i = 0; i < unique.length; i++) {
          for (let j = i + 1; j < unique.length; j++) {
            const key = [unique[i], unique[j]].sort().join('|')
            if (!edgeMap.has(key)) {
              const src = nodeMap.get(unique[i])
              const tgt = nodeMap.get(unique[j])
              if (src && tgt) {
                edgeMap.set(key, new Edge(src, tgt, { weight: 1 }))
              }
            } else {
              edgeMap.get(key).data.weight++
            }
          }
        }
      })

      // Count interactions per node
      activities.forEach(act => {
        if (act.action === 'join') return
        const node = nodeMap.get(act.agent)
        if (node) node.interactionCount++
      })
    }

    // Mark active edges
    for (const edge of edgeMap.values()) {
      edge.targetOpacity = 1
    }

    // Mark recently active nodes
    for (const node of nodeMap.values()) {
      node.isActive = activeAgents.has(node.id)
      if (node.isActive) node.lastActiveTime = Date.now()
    }

    nodesRef.current = Array.from(nodeMap.values())
    edgesRef.current = Array.from(edgeMap.values())
  }, [agents, activities])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let time = 0

    function loop() {
      time += 0.016
      simulate(nodesRef.current, edgesRef.current, dimensions.width, dimensions.height)
      drawGraph(ctx, nodesRef.current, edgesRef.current, dimensions.width, dimensions.height, time, hoveredRef.current, selectedRef.current)
      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [dimensions])

  // Mouse interaction
  const handleMouseMove = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let found = null
    for (const node of nodesRef.current) {
      const dx = mx - node.x
      const dy = my - node.y
      if (dx * dx + dy * dy < (node.radius + 5) ** 2) {
        found = node
        break
      }
    }
    hoveredRef.current = found
    canvasRef.current.style.cursor = found ? 'pointer' : 'default'
  }, [])

  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    let found = null
    for (const node of nodesRef.current) {
      const dx = mx - node.x
      const dy = my - node.y
      if (dx * dx + dy * dy < (node.radius + 5) ** 2) {
        found = node
        break
      }
    }
    selectedRef.current = found
    setSelectedAgent(found?.data || null)
  }, [])

  const isActive = phase && phase !== 'complete'
  const expertCount = agents?.filter(a => a.type === 'expert').length || 0
  const buyerCount = agents?.filter(a => a.type === 'buyer').length || 0
  const otherCount = (agents?.length || 0) - expertCount - buyerCount

  return (
    <div style={{
      background: 'var(--surface-2)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 16,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--surface)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: isActive ? '#22c55e' : 'var(--text-3)',
            animation: isActive ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>Red de Agentes</span>
          {agents && agents.length > 0 && (
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              {agents.length} nodos · {edgesRef.current?.length || 0} conexiones
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text-3)' }}>
          {expertCount > 0 && <span style={{ background: 'rgba(59,130,246,0.15)', padding: '2px 8px', borderRadius: 6 }}>🧠 {expertCount} expertos</span>}
          {buyerCount > 0 && <span style={{ background: 'rgba(236,72,153,0.15)', padding: '2px 8px', borderRadius: 6 }}>👤 {buyerCount} compradores</span>}
          {otherCount > 0 && <span style={{ background: 'rgba(100,116,139,0.15)', padding: '2px 8px', borderRadius: 6 }}>🔄 {otherCount} otros</span>}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: 450, position: 'relative' }}>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Selected agent detail panel */}
        {selectedAgent && (
          <div style={{
            position: 'absolute', top: 12, right: 12, width: 220,
            background: 'rgba(15, 22, 35, 0.95)', border: '1px solid var(--border)',
            borderRadius: 12, padding: 16, backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 24 }}>{selectedAgent.emoji}</span>
              <button onClick={() => { selectedRef.current = null; setSelectedAgent(null) }}
                style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{selectedAgent.name}</div>
            <div style={{ fontSize: 11, color: getRoleColor(selectedAgent.role), fontWeight: 600, marginBottom: 8 }}>{selectedAgent.role}</div>
            {selectedAgent.style && (
              <div style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 8 }}>{selectedAgent.style}</div>
            )}
            {selectedAgent.profile && (
              <div style={{ fontSize: 10, color: 'var(--text-3)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 8 }}>{selectedAgent.profile}</div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 10, color: 'var(--text-3)' }}>
              <span>Tipo: {selectedAgent.type}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
