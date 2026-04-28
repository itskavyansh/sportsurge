import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Download, LogOut, Trash2, RefreshCw, Search, ChevronUp, ChevronDown } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'sportsurge2025';

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

// ── Login ─────────────────────────────────────
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
          <p className="text-[--text-muted] text-sm mt-1">Sport Surge Registration Dashboard</p>
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

// ── Dashboard ─────────────────────────────────
function Dashboard({ onLogout }) {
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
    } catch (e) {
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
    <div className="min-h-screen px-[3%] py-8" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <Link to="/" className="nav-logo text-[1.2rem]">SPORT <span>SURGE</span></Link>
          <p className="text-[--text-muted] text-xs mt-0.5">Admin Dashboard</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[0.78rem] text-[--text-secondary] bg-[--bg-card] border border-[--border] px-3 py-1.5 rounded-full">
            {filtered.length} registration{filtered.length !== 1 ? 's' : ''}
          </span>
          <button className="reg-btn-secondary text-sm gap-2" onClick={load} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button className="reg-btn-secondary text-sm gap-2" onClick={exportCSV} disabled={!filtered.length}>
            <Download size={14} /> Export CSV
          </button>
          <button className="reg-btn-secondary text-sm gap-2 border-red-900/40 hover:border-red-500/60 text-red-400 hover:text-red-300" onClick={onLogout}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[--text-muted]" />
        <input
          className="reg-input pl-9"
          placeholder="Search by name, school, sport, city…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-[--text-muted]">
          <RefreshCw size={18} className="animate-spin" /> Loading registrations…
        </div>
      )}
      {error && <p className="text-red-400 text-sm py-10 text-center">{error}</p>}

      {/* Table */}
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
    </div>
  );
}
