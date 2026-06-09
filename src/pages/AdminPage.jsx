import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, getDocs, query, orderBy, deleteDoc, doc,
  addDoc, updateDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Users, Download, LogOut, Trash2, RefreshCw, Search,
  ChevronUp, ChevronDown, Newspaper, Plus, Pin, PinOff,
} from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sportsurge2025';

const EMPTY_NEWS = { title: '', summary: '', imageUrl: '', source: 'Sport Surge', url: '', pinned: false };

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ss_admin') === '1');
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');

  const login = () => {
    if (pw === ADMIN_PASSWORD) { sessionStorage.setItem('ss_admin', '1'); setAuthed(true); }
    else { setPwError('Incorrect password. Please try again.'); setPw(''); }
  };

  const logout = () => { sessionStorage.removeItem('ss_admin'); setAuthed(false); };

  if (!authed) return <LoginScreen pw={pw} setPw={setPw} onLogin={login} error={pwError} />;
  return <Dashboard onLogout={logout} />;
}

function LoginScreen({ pw, setPw, onLogin, error }) {
  const handleKey = (e) => { if (e.key === 'Enter') onLogin(); };
  return (
    <div className="min-h-screen flex items-center justify-center px-[5%] relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute top-0 left-0 w-full h-0.5 pointer-events-none"
        style={{ background: 'var(--accent)' }} />
      <div className="w-full max-w-[380px] relative">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center"
            style={{ background: 'rgba(200,240,0,0.08)', border: '1px solid rgba(200,240,0,0.2)' }}>
            <Users size={26} color="var(--accent)" />
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[--text-primary]">Admin Access</h1>
          <p className="text-[--text-muted] text-sm mt-1">Sport Surge Admin Dashboard</p>
        </div>
        <div className="reg-card">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.78rem] font-semibold text-[--text-secondary]">Password</label>
              <input
                className="reg-input"
                type="password"
                placeholder="Enter admin password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={handleKey}
                autoFocus
              />
              {error && <p className="field-error">{error}</p>}
            </div>
            <button className="reg-btn-primary w-full justify-center" onClick={onLogin}>
              Access Dashboard
            </button>
          </div>
        </div>
        <Link to="/" className="block text-center text-[0.75rem] text-[--text-muted] mt-4 hover:text-[--accent] transition-colors uppercase tracking-widest">
          ← Back to Site
        </Link>
      </div>
    </div>
  );
}

function Dashboard({ onLogout }) {
  const [tab, setTab] = useState('registrations');

  return (
    <div className="min-h-screen px-[3%] py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <Link to="/" className="nav-logo text-[1.2rem]">SPORT <span>SURGE</span></Link>
          <p className="text-[--text-muted] text-xs mt-0.5">Admin Dashboard</p>
        </div>
        <button
          className="reg-btn-secondary text-sm gap-2 border-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300"
          onClick={onLogout}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="admin-tabs mb-6">
        <button
          className={`admin-tab${tab === 'registrations' ? ' admin-tab-active' : ''}`}
          onClick={() => setTab('registrations')}
        >
          <Users size={14} /> Registrations
        </button>
        <button
          className={`admin-tab${tab === 'news' ? ' admin-tab-active' : ''}`}
          onClick={() => setTab('news')}
        >
          <Newspaper size={14} /> News
        </button>
      </div>

      {tab === 'registrations' ? <RegistrationsPanel /> : <NewsPanel />}
    </div>
  );
}

function RegistrationsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const snap = await getDocs(query(collection(db, 'registrations'), orderBy('createdAt', 'desc')));
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setError('Failed to load data. Check your Firebase connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    setDeleting(id);
    try { await deleteDoc(doc(db, 'registrations', id)); setRows(r => r.filter(x => x.id !== id)); }
    catch { alert('Failed to delete. Try again.'); }
    finally { setDeleting(null); }
  };

  const exportCSV = () => {
    const cols = ['fullName','age','gender','sport','experience','schoolName','className','city','parentName','parentMobile','parentEmail'];
    const header = cols.join(',');
    const body = filtered.map(r => cols.map(c => `"${(r[c] ?? '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([header + '\n' + body], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'sportsurge_registrations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const q = search.toLowerCase();
  const filtered = rows
    .filter(r =>
      !q ||
      r.fullName?.toLowerCase().includes(q) ||
      r.schoolName?.toLowerCase().includes(q) ||
      r.sport?.toLowerCase().includes(q) ||
      r.city?.toLowerCase().includes(q) ||
      r.parentMobile?.includes(q)
    )
    .sort((a, b) => {
      const av = a[sortKey] ?? ''; const bv = b[sortKey] ?? '';
      const cmp = typeof av === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const Th = ({ col, label }) => (
    <th className="admin-th cursor-pointer select-none" onClick={() => handleSort(col)}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === col ? (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
      </span>
    </th>
  );

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap mb-5">
        <span className="text-[0.78rem] text-[--text-secondary] bg-[--bg-card] border border-[--border] px-3 py-1.5 rounded-full">
          {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
        </span>
        <button className="reg-btn-secondary text-sm gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
        <button className="reg-btn-secondary text-sm gap-2" onClick={exportCSV} disabled={!filtered.length}>
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
        <input
          className="reg-input pl-9"
          placeholder="Search by name, school, sport, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-[--text-muted]">
          <RefreshCw size={18} className="animate-spin" /> Loading registrations…
        </div>
      )}
      {error && <p className="text-red-400 text-sm py-10 text-center">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          {filtered.length === 0
            ? <p className="text-center text-[--text-muted] py-16 text-sm">No registrations found.</p>
            : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <Th col="fullName"   label="Name" />
                    <Th col="age"        label="Age" />
                    <Th col="gender"     label="Gender" />
                    <Th col="sport"      label="Sport" />
                    <Th col="experience" label="Level" />
                    <Th col="schoolName" label="School" />
                    <Th col="className"  label="Class" />
                    <Th col="city"       label="City" />
                    <Th col="parentName" label="Guardian" />
                    <th className="admin-th">Mobile</th>
                    <th className="admin-th">Email</th>
                    <Th col="createdAt"  label="Registered" />
                    <th className="admin-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => (
                    <tr key={r.id} className="admin-tr">
                      <td className="admin-td font-semibold text-white">{r.fullName}</td>
                      <td className="admin-td">{r.age}</td>
                      <td className="admin-td">{r.gender}</td>
                      <td className="admin-td"><span className="admin-badge">{r.sport}</span></td>
                      <td className="admin-td">{r.experience}</td>
                      <td className="admin-td">{r.schoolName}</td>
                      <td className="admin-td">{r.className ? `Class ${r.className}` : '—'}</td>
                      <td className="admin-td">{r.city}</td>
                      <td className="admin-td">{r.parentName}</td>
                      <td className="admin-td font-mono text-xs">{r.parentMobile}</td>
                      <td className="admin-td text-xs">{r.parentEmail || '—'}</td>
                      <td className="admin-td text-xs whitespace-nowrap">
                        {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="admin-td">
                        <button
                          className="p-1.5 rounded-lg text-[--text-muted] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          onClick={() => handleDelete(r.id)}
                          disabled={deleting === r.id}
                          title="Delete"
                        >
                          {deleting === r.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}
    </>
  );
}

function NewsPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_NEWS);
  const [editingId, setEditingId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const snap = await getDocs(query(collection(db, 'news'), orderBy('publishedAt', 'desc')));
      setRows(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch {
      setError('Failed to load news. Check your Firebase connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => { setForm(EMPTY_NEWS); setEditingId(null); };

  const handleSave = async () => {
    if (!form.title.trim() || !form.url.trim()) {
      alert('Title and URL are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim(),
        imageUrl: form.imageUrl.trim(),
        source: form.source.trim() || 'Sport Surge',
        url: form.url.trim(),
        pinned: !!form.pinned,
        country: 'IN',
      };

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), payload);
      } else {
        await addDoc(collection(db, 'news'), { ...payload, publishedAt: serverTimestamp() });
      }
      resetForm();
      await load();
    } catch {
      alert('Failed to save article. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setForm({
      title: row.title ?? '',
      summary: row.summary ?? '',
      imageUrl: row.imageUrl ?? '',
      source: row.source ?? 'Sport Surge',
      url: row.url ?? '',
      pinned: !!row.pinned,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news article?')) return;
    setDeleting(id);
    try {
      await deleteDoc(doc(db, 'news', id));
      if (editingId === id) resetForm();
      setRows(r => r.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete. Try again.');
    } finally {
      setDeleting(null);
    }
  };

  const togglePin = async (row) => {
    try {
      await updateDoc(doc(db, 'news', row.id), { pinned: !row.pinned });
      setRows(r => r.map(x => x.id === row.id ? { ...x, pinned: !row.pinned } : x));
    } catch {
      alert('Failed to update pin status.');
    }
  };

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap mb-5">
        <span className="text-[0.78rem] text-[--text-secondary] bg-[--bg-card] border border-[--border] px-3 py-1.5 rounded-full">
          {rows.length} article{rows.length !== 1 ? 's' : ''}
        </span>
        <button className="reg-btn-secondary text-sm gap-2" onClick={load} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="reg-card mb-6">
        <h3 className="text-[--text-primary] font-semibold mb-4 flex items-center gap-2">
          {editingId ? <><Newspaper size={16} /> Edit Article</> : <><Plus size={16} /> Add Article</>}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-semibold text-[--text-secondary]">Title *</label>
            <input className="reg-input" value={form.title} onChange={set('title')} placeholder="Article headline" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.78rem] font-semibold text-[--text-secondary]">Source</label>
            <input className="reg-input" value={form.source} onChange={set('source')} placeholder="Sport Surge" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[0.78rem] font-semibold text-[--text-secondary]">URL *</label>
            <input className="reg-input" value={form.url} onChange={set('url')} placeholder="https://…" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[0.78rem] font-semibold text-[--text-secondary]">Summary</label>
            <textarea className="reg-input min-h-[80px] resize-y" value={form.summary} onChange={set('summary')} placeholder="Short description (optional)" />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[0.78rem] font-semibold text-[--text-secondary]">Image URL</label>
            <input className="reg-input" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://… (optional)" />
          </div>
          <label className="flex items-center gap-2 text-[0.85rem] text-[--text-secondary] cursor-pointer">
            <input type="checkbox" checked={form.pinned} onChange={set('pinned')} />
            Pin as featured (shows first on homepage)
          </label>
        </div>
        <div className="flex gap-3 mt-4 flex-wrap">
          <button className="reg-btn-primary text-sm gap-2" onClick={handleSave} disabled={saving}>
            {saving ? <RefreshCw size={14} className="animate-spin" /> : editingId ? null : <Plus size={14} />}
            {editingId ? 'Update Article' : 'Publish Article'}
          </button>
          {editingId && (
            <button className="reg-btn-secondary text-sm" onClick={resetForm}>Cancel Edit</button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16 gap-3 text-[--text-muted]">
          <RefreshCw size={18} className="animate-spin" /> Loading news…
        </div>
      )}
      {error && <p className="text-red-400 text-sm py-10 text-center">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          {rows.length === 0
            ? <p className="text-center text-[--text-muted] py-16 text-sm">No curated articles yet. Add one above.</p>
            : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th">Title</th>
                    <th className="admin-th">Source</th>
                    <th className="admin-th">Pinned</th>
                    <th className="admin-th">Published</th>
                    <th className="admin-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.id} className="admin-tr">
                      <td className="admin-td font-semibold text-white max-w-[280px] truncate">{r.title}</td>
                      <td className="admin-td">{r.source || 'Sport Surge'}</td>
                      <td className="admin-td">
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${r.pinned ? 'text-[--accent]' : 'text-[--text-muted] hover:text-[--accent]'}`}
                          onClick={() => togglePin(r)}
                          title={r.pinned ? 'Unpin' : 'Pin as featured'}
                        >
                          {r.pinned ? <Pin size={14} /> : <PinOff size={14} />}
                        </button>
                      </td>
                      <td className="admin-td text-xs whitespace-nowrap">
                        {r.publishedAt?.toDate ? r.publishedAt.toDate().toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="admin-td">
                        <div className="flex gap-1">
                          <button
                            className="p-1.5 rounded-lg text-[--text-muted] hover:text-[--accent] hover:bg-[--accent]/10 transition-colors text-xs"
                            onClick={() => handleEdit(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-[--text-muted] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            onClick={() => handleDelete(r.id)}
                            disabled={deleting === r.id}
                          >
                            {deleting === r.id ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </div>
      )}
    </>
  );
}
