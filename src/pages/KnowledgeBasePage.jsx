import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || ''

const s = {
  page: { minHeight: '100vh', background: 'var(--nexus-bg)', color: 'var(--nexus-text)' },
  nav: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 48px', borderBottom: '1px solid var(--nexus-border)',
    backdropFilter: 'blur(12px)', background: 'rgba(8,12,20,0.85)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, var(--nexus-accent), var(--nexus-accent-2))',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  navLinks: { display: 'flex', gap: '24px', alignItems: 'center' },
  navLink: { color: 'var(--nexus-text-2)', fontSize: '14px', fontWeight: 500, background: 'none', padding: 0, textDecoration: 'none' },
  main: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: 700 },
  subtitle: { color: 'var(--nexus-text-2)', fontSize: '14px', marginTop: '4px' },
  statsRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  stat: {
    flex: 1, padding: '16px 20px', borderRadius: '12px',
    background: 'var(--nexus-card)', border: '1px solid var(--nexus-border)',
  },
  statLabel: { fontSize: '12px', color: 'var(--nexus-text-2)', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { fontSize: '24px', fontWeight: 700, marginTop: '4px' },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
  input: {
    flex: 1, minWidth: '200px', padding: '10px 14px', borderRadius: '8px',
    background: 'var(--nexus-card)', border: '1px solid var(--nexus-border)',
    color: 'var(--nexus-text)', fontSize: '14px', outline: 'none',
  },
  select: {
    padding: '10px 14px', borderRadius: '8px',
    background: 'var(--nexus-card)', border: '1px solid var(--nexus-border)',
    color: 'var(--nexus-text)', fontSize: '14px', outline: 'none',
  },
  btn: {
    padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '14px',
    cursor: 'pointer', border: 'none', transition: 'all 0.2s',
  },
  btnPrimary: { background: 'var(--nexus-accent)', color: '#fff' },
  btnDanger: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
  th: {
    textAlign: 'left', padding: '12px 16px', fontSize: '12px', fontWeight: 600,
    color: 'var(--nexus-text-2)', textTransform: 'uppercase', letterSpacing: '0.5px',
    borderBottom: '1px solid var(--nexus-border)',
  },
  td: {
    padding: '14px 16px', fontSize: '14px', borderBottom: '1px solid var(--nexus-border)',
    verticalAlign: 'top',
  },
  row: { transition: 'background 0.15s', cursor: 'default' },
  badge: (color) => ({
    display: 'inline-block', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600,
    background: `${color}20`, color, border: `1px solid ${color}40`,
  }),
  pagination: { display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' },
  pageBtn: (active) => ({
    padding: '6px 12px', borderRadius: '6px', fontSize: '13px', fontWeight: 500,
    background: active ? 'var(--nexus-accent)' : 'var(--nexus-card)',
    color: active ? '#fff' : 'var(--nexus-text-2)',
    border: active ? 'none' : '1px solid var(--nexus-border)',
    cursor: 'pointer',
  }),
  // Upload modal
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: 'var(--nexus-card)', border: '1px solid var(--nexus-border)',
    borderRadius: '16px', padding: '32px', width: '520px', maxWidth: '90vw',
    maxHeight: '85vh', overflowY: 'auto',
  },
  modalTitle: { fontSize: '20px', fontWeight: 700, marginBottom: '20px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--nexus-text-2)', marginBottom: '6px' },
  dropzone: {
    border: '2px dashed var(--nexus-border)', borderRadius: '12px', padding: '32px',
    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
    color: 'var(--nexus-text-2)', fontSize: '14px',
  },
  dropzoneActive: { borderColor: 'var(--nexus-accent)', background: 'rgba(59,130,246,0.05)' },
  empty: { textAlign: 'center', padding: '60px 20px', color: 'var(--nexus-text-2)' },
}

const TYPE_COLORS = {
  ley: '#3b82f6', pdu: '#8b5cf6', reglamento: '#06b6d4', norma: '#f59e0b',
  decreto: '#ef4444', acuerdo: '#10b981', manual: '#ec4899', otro: '#6b7280',
}

const SCOPE_LABELS = { federal: 'Federal', estatal: 'Estatal', municipal: 'Municipal' }

export default function KnowledgeBasePage() {
  const [docs, setDocs] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [stats, setStats] = useState(null)
  const [docTypes, setDocTypes] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const pageSize = 20

  const fetchDocs = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, pageSize })
      if (search) params.set('search', search)
      if (typeFilter) params.set('type', typeFilter)
      const res = await fetch(`${API}/api/knowledge-base?${params}`)
      const json = await res.json()
      if (json.success) { setDocs(json.data); setCount(json.count) }
    } catch (e) { console.error('Fetch docs error:', e) }
    setLoading(false)
  }, [page, search, typeFilter])

  useEffect(() => { fetchDocs() }, [fetchDocs])

  useEffect(() => {
    fetch(`${API}/api/rag/stats`).then(r => r.json()).then(j => j.success && setStats(j.data)).catch(() => {})
    fetch(`${API}/api/knowledge-base/types`).then(r => r.json()).then(j => j.success && setDocTypes(j.data)).catch(() => {})
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este documento?')) return
    await fetch(`${API}/api/knowledge-base/${id}`, { method: 'DELETE' })
    fetchDocs()
  }

  const totalPages = Math.ceil(count / pageSize)

  return (
    <div style={s.page}>
      {/* Nav */}
      <nav style={s.nav}>
        <Link to="/" style={{ textDecoration: 'none' }}><span style={s.logo}>NEXUS</span></Link>
        <div style={s.navLinks}>
          <Link to="/simulator" style={s.navLink}>Simulador</Link>
          <Link to="/history" style={s.navLink}>Historial</Link>
          <Link to="/knowledge-base" style={{ ...s.navLink, color: 'var(--nexus-accent)' }}>Knowledge Base</Link>
        </div>
      </nav>

      <main style={s.main}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>📚 Knowledge Base</h1>
            <p style={s.subtitle}>Documentos legales, normativos y de mercado que alimentan las simulaciones con datos reales</p>
          </div>
          <button style={{ ...s.btn, ...s.btnPrimary }} onClick={() => setShowUpload(true)}>
            + Subir Documento
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div style={s.statsRow}>
            <div style={s.stat}>
              <div style={s.statLabel}>Documentos</div>
              <div style={{ ...s.statValue, color: '#3b82f6' }}>{stats.knowledgeDocs?.toLocaleString()}</div>
            </div>
            <div style={s.stat}>
              <div style={s.statLabel}>Listings Activos</div>
              <div style={{ ...s.statValue, color: '#22c55e' }}>{stats.listings?.toLocaleString()}</div>
            </div>
            <div style={s.stat}>
              <div style={s.statLabel}>Avalúos</div>
              <div style={{ ...s.statValue, color: '#f59e0b' }}>{stats.appraisals?.toLocaleString()}</div>
            </div>
            <div style={s.stat}>
              <div style={s.statLabel}>Conexión</div>
              <div style={{ ...s.statValue, color: stats.connected ? '#22c55e' : '#ef4444', fontSize: '16px' }}>
                {stats.connected ? '✅ Supabase conectado' : '❌ Sin conexión'}
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div style={s.toolbar}>
          <input
            style={s.input}
            placeholder="Buscar documentos..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            onKeyDown={e => e.key === 'Enter' && fetchDocs()}
          />
          <select style={s.select} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}>
            <option value="">Todos los tipos</option>
            {docTypes.map(t => <option key={t.code} value={t.code}>{t.name_es}</option>)}
          </select>
          <button style={{ ...s.btn, background: 'var(--nexus-card)', color: 'var(--nexus-text)', border: '1px solid var(--nexus-border)' }} onClick={fetchDocs}>
            🔄 Actualizar
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={s.empty}>Cargando...</div>
        ) : docs.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>No hay documentos</div>
            <div style={{ marginTop: '8px' }}>Sube documentos para enriquecer las simulaciones con datos reales</div>
          </div>
        ) : (
          <>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Documento</th>
                  <th style={s.th}>Tipo</th>
                  <th style={s.th}>Alcance</th>
                  <th style={s.th}>Autoridad</th>
                  <th style={s.th}>Fecha</th>
                  <th style={s.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id} style={s.row} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...s.td, maxWidth: '400px' }}>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>{doc.title?.slice(0, 80)}{doc.title?.length > 80 ? '...' : ''}</div>
                      {doc.description && <div style={{ fontSize: '12px', color: 'var(--nexus-text-2)' }}>{doc.description.slice(0, 100)}</div>}
                    </td>
                    <td style={s.td}>
                      <span style={s.badge(TYPE_COLORS[doc.document_type] || '#6b7280')}>
                        {doc.document_type}
                      </span>
                    </td>
                    <td style={s.td}>{SCOPE_LABELS[doc.scope] || doc.scope || '—'}</td>
                    <td style={{ ...s.td, fontSize: '13px' }}>{doc.issuing_authority || '—'}</td>
                    <td style={{ ...s.td, fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {doc.effective_date || doc.publication_date || doc.created_at?.slice(0, 10) || '—'}
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {doc.file_url && (
                          <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ color: 'var(--nexus-accent)', fontSize: '13px', textDecoration: 'none' }}>
                            📄 Ver
                          </a>
                        )}
                        <button onClick={() => handleDelete(doc.id)} style={{ ...s.btn, ...s.btnDanger, padding: '4px 10px', fontSize: '12px' }}>
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={s.pagination}>
                <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = totalPages <= 7 ? i + 1 : page <= 4 ? i + 1 : Math.min(page - 3 + i, totalPages)
                  return <button key={p} style={s.pageBtn(p === page)} onClick={() => setPage(p)}>{p}</button>
                })}
                <button style={s.pageBtn(false)} onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
                <span style={{ fontSize: '13px', color: 'var(--nexus-text-2)', alignSelf: 'center', marginLeft: '8px' }}>
                  {count.toLocaleString()} documentos
                </span>
              </div>
            )}
          </>
        )}
      </main>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          docTypes={docTypes}
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); fetchDocs() }}
        />
      )}
    </div>
  )
}

function UploadModal({ docTypes, onClose, onUploaded }) {
  const [form, setForm] = useState({ title: '', description: '', documentType: 'otro', scope: 'federal', state: '', municipality: '', sourceUrl: '' })
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) return alert('El título es requerido')
    setUploading(true)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
    if (file) fd.append('file', file)

    try {
      const res = await fetch(`${API}/api/knowledge-base`, { method: 'POST', body: fd })
      const json = await res.json()
      if (json.success) onUploaded()
      else alert(`Error: ${json.error}`)
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
    setUploading(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer?.files?.[0]
    if (f) { setFile(f); if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') })) }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <h2 style={s.modalTitle}>📤 Subir Documento</h2>
        <form onSubmit={handleSubmit}>
          {/* Dropzone */}
          <div
            style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}), marginBottom: '20px' }}
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            {file ? (
              <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                <div style={{ fontWeight: 600, color: 'var(--nexus-text)' }}>{file.name}</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
                <div>Arrastra un archivo aquí o haz clic para seleccionar</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>PDF, DOCX, TXT — máx 50MB</div>
              </div>
            )}
            <input id="file-input" type="file" accept=".pdf,.docx,.doc,.txt,.xlsx" style={{ display: 'none' }}
              onChange={e => {
                const f = e.target.files?.[0]
                if (f) { setFile(f); if (!form.title) setForm(prev => ({ ...prev, title: f.name.replace(/\.[^.]+$/, '') })) }
              }}
            />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Título *</label>
            <input style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>Descripción</label>
            <textarea style={{ ...s.input, width: '100%', boxSizing: 'border-box', minHeight: '60px', resize: 'vertical' }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={s.formGroup}>
              <label style={s.label}>Tipo de documento</label>
              <select style={{ ...s.select, width: '100%' }} value={form.documentType} onChange={e => setForm(p => ({ ...p, documentType: e.target.value }))}>
                {docTypes.map(t => <option key={t.code} value={t.code}>{t.name_es}</option>)}
                <option value="otro">Otro</option>
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Alcance</label>
              <select style={{ ...s.select, width: '100%' }} value={form.scope} onChange={e => setForm(p => ({ ...p, scope: e.target.value }))}>
                <option value="federal">Federal</option>
                <option value="estatal">Estatal</option>
                <option value="municipal">Municipal</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={s.formGroup}>
              <label style={s.label}>Estado</label>
              <input style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} placeholder="Ej: CDMX, Jalisco" value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Municipio</label>
              <input style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} placeholder="Ej: Benito Juárez" value={form.municipality} onChange={e => setForm(p => ({ ...p, municipality: e.target.value }))} />
            </div>
          </div>

          <div style={s.formGroup}>
            <label style={s.label}>URL fuente (opcional)</label>
            <input style={{ ...s.input, width: '100%', boxSizing: 'border-box' }} placeholder="https://..." value={form.sourceUrl} onChange={e => setForm(p => ({ ...p, sourceUrl: e.target.value }))} />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" style={{ ...s.btn, background: 'var(--nexus-card)', color: 'var(--nexus-text)', border: '1px solid var(--nexus-border)' }} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" style={{ ...s.btn, ...s.btnPrimary, opacity: uploading ? 0.6 : 1 }} disabled={uploading}>
              {uploading ? '⏳ Subiendo...' : '📤 Subir documento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
