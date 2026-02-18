
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Plus, 
  LogOut, 
  Search, 
  Activity, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  Menu, 
  Globe, 
  Server, 
  FileEdit, 
  History, 
  Trophy, 
  ActivitySquare, 
  X, 
  AlertTriangle, 
  Briefcase, 
  ShieldAlert, 
  ClipboardCheck, 
  HelpCircle,
  Trash2,
  CheckCircle2,
  Settings2,
  MonitorCheck,
  Zap,
  LayoutGrid,
  CalendarRange,
  FileStack,
  Download,
  FileText,
  PieChart,
  ClipboardList,
  MessageSquare,
  Filter,
  FileSpreadsheet,
  Loader2,
  Printer,
  ChevronRight,
  Database,
  FileDown,
  CheckSquare,
  Square,
  ListChecks,
  AlertOctagon,
  ClipboardType,
  KeyRound,
  ShieldX,
  RotateCcw
} from 'lucide-react';

// --- Types & Interfaces ---

type Role = 'ADMIN' | 'FRF' | 'HEAD_OF_CSS';

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  assignedMdaIds: string[];
}

interface MDA {
  id: string;
  name: string;
  category: string;
  active: boolean;
}

const REASONS_NOT_VISITED = [
  "ABSENT - NO EXCUSE",
  "ABSENT - SICK WITH EXCUSE",
  "DRAFTED TO WORK/SUPPORT AT THE SERVICEDESK",
  "LOGISTICS CHALLENGES (NON AVAILABILITY OF BUS, DRIVER, FUEL ETC)",
  "PUBLIC HOLDAY",
  "DEPARTMENTAL MEETING",
  "REQUEST/INCIDENT AT CUSTOMER SITE REMAIN UNRESOLVED",
  "CDS",
  "NO MOVEMENT, DUE TO PROTEST"
];

interface Visitation {
  id: string;
  frfId: string;
  frfName: string;
  date: string;
  timestamp: number;
  mdaId: string;
  mdaName: string;
  wasVisited: 'Yes' | 'No';
  reasonNotVisited?: string;
  hasIncident: 'Yes' | 'No';
  incidentTicket?: string;
  incidentStatus?: 'YES RESOLVED' | 'NO PENDING' | 'PROCESSING';
  hasRequest: 'Yes' | 'No';
  requestTicket?: string;
  requestStatus?: 'YES GRANTED' | 'NO PENDING' | 'PROCESSING';
  comments: string;
}

// --- Constants ---

const LOGO_URL = "http://galaxybackbone.com.ng/wp-content/uploads/2020/12/Galaxy-New-Logo-scaled.jpg";

// SYSTEM RESET: Cleared MDAs for manual provisioning
const INITIAL_MDAS: MDA[] = [];

// SYSTEM RESET: Maintained only essential access for system setup
const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Strategic Administrator', email: 'admin@gbb.com.ng', password: 'admin123', role: 'ADMIN', assignedMdaIds: [] },
  { id: 'u4', name: 'Head of CSS', email: 'css@gbb.com.ng', password: 'css123', role: 'HEAD_OF_CSS', assignedMdaIds: [] }
];

// --- Utils ---
const generateId = () => Math.random().toString(36).substring(2, 11);
const getTodayString = () => new Date().toISOString().split('T')[0];

// --- UI Components ---

const Badge = ({ children, variant, size = "md", className = "" }: { children?: React.ReactNode, variant: 'success' | 'warning' | 'error' | 'info' | 'gray', size?: 'sm' | 'md', className?: string }) => {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 print:bg-white print:text-emerald-700 print:border-emerald-600',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20 print:bg-white print:text-amber-700 print:border-amber-600',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20 print:bg-white print:text-rose-700 print:border-rose-600',
    info: `bg-blue-500/10 text-blue-300 border-blue-500/20 print:bg-white print:text-blue-700 print:border-blue-600`,
    gray: 'bg-slate-500/10 text-slate-400 border-slate-500/20 print:bg-white print:text-slate-700 print:border-slate-600',
  };
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[8px]' : 'px-3 py-1 text-[10px]';
  return (
    <span className={`${sizeClasses} rounded-full uppercase font-black border tracking-widest flex items-center gap-1.5 w-fit ${styles[variant]} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_rgba(16,185,129,0.5)] print:shadow-none`} />
      {children}
    </span>
  );
};

const CommandCard = ({ title, subtitle, children, icon: Icon, className = "" }: { title?: string, subtitle?: string, children?: React.ReactNode, icon?: any, className?: string }) => (
  <div className={`bg-[#011a0e]/60 backdrop-blur-xl border border-white/5 rounded-2xl md:rounded-3xl overflow-hidden group shadow-2xl transition-all duration-500 hover:border-emerald-500/30 print:bg-white print:border-slate-200 print:shadow-none ${className}`}>
    {(title || subtitle) && (
      <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02] print:bg-slate-50 print:border-slate-200">
        <div className="min-w-0 pr-2">
          <h3 className="text-white font-black text-xs md:text-sm uppercase tracking-wider truncate print:text-slate-900">{title}</h3>
          {subtitle && <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mt-1 tracking-widest truncate print:text-slate-600">{subtitle}</p>}
        </div>
        {Icon && <div className="p-2 md:p-2.5 bg-white/5 rounded-xl shrink-0 print:bg-slate-200 print:text-slate-900"><Icon className="w-3 h-3 md:w-4 h-4 text-emerald-400 print:text-emerald-700" /></div>}
      </div>
    )}
    <div className="p-4 md:p-6">{children}</div>
  </div>
);

const StatPanel = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-[#011a0e] p-5 md:p-8 rounded-[24px] md:rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 print:bg-white print:border-slate-300 print:shadow-none">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.05] rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000 print:hidden`} />
    <div className="relative z-10 flex flex-col gap-3 md:gap-4">
      <div className={`w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-2xl ${color} flex items-center justify-center text-white shadow-xl group-hover:rotate-12 transition-transform print:shadow-none`}>
        <Icon className="w-4 h-4 md:w-6 md:h-6" />
      </div>
      <div className="space-y-1">
        <p className="text-slate-500 text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] truncate print:text-slate-700">{label}</p>
        <p className="text-2xl md:text-4xl font-black text-white tracking-tighter tabular-nums truncate print:text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children?: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#011a0e]/95 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#022a18] w-full max-w-2xl rounded-2xl md:rounded-[40px] shadow-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-6 py-5 md:px-10 md:py-8 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter truncate">{title}</h3>
          <button onClick={onClose} className="p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all shrink-0"><X className="w-5 h-5 md:w-6 md:h-6 text-slate-400" /></button>
        </div>
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar text-white">{children}</div>
      </div>
    </div>
  );
};

const DateRangePicker = ({ start, end, onStartChange, onEndChange, labelStart = "Start Date", labelEnd = "End Date" }: { start: string, end: string, onStartChange: (v: string) => void, onEndChange: (v: string) => void, labelStart?: string, labelEnd?: string }) => (
  <div className="flex flex-col sm:flex-row items-center gap-2 bg-black/40 p-2 rounded-[24px] border border-white/10 shadow-inner group print:hidden">
    <div className="flex items-center gap-3 pl-4 pr-3 py-2.5 bg-white/[0.03] rounded-2xl border border-white/5 focus-within:border-emerald-500/50 transition-all hover:bg-white/[0.05]">
      <CalendarRange className="w-4 h-4 text-emerald-500" />
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">{labelStart}</span>
        <input type="date" value={start} onChange={e => onStartChange(e.target.value)} className="bg-transparent border-none text-[11px] font-black text-white outline-none cursor-pointer" />
      </div>
    </div>
    <div className="h-6 w-px bg-white/10 hidden sm:block mx-1" />
    <div className="flex items-center gap-3 pl-4 pr-3 py-2.5 bg-white/[0.03] rounded-2xl border border-white/5 focus-within:border-emerald-500/50 transition-all hover:bg-white/[0.05]">
      <CalendarRange className="w-4 h-4 text-emerald-500" />
      <div className="flex flex-col min-w-[120px]">
        <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] mb-0.5">{labelEnd}</span>
        <input type="date" value={end} onChange={e => onEndChange(e.target.value)} className="bg-transparent border-none text-[11px] font-black text-white outline-none cursor-pointer" />
      </div>
    </div>
  </div>
);

// --- Main Engine ---

export function FRFSystem() {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<'LANDING' | 'LOGIN' | 'APP'>('LANDING');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // SYSTEM RESET: Initializing with empty datasets
  const [mdas, setMdas] = useState<MDA[]>(() => JSON.parse(localStorage.getItem('gbb_mdas_v2') || JSON.stringify(INITIAL_MDAS)));
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('gbb_users_v2') || JSON.stringify(INITIAL_USERS)));
  const [visitations, setVisitations] = useState<Visitation[]>(() => JSON.parse(localStorage.getItem('gbb_visitations_v2') || "[]"));

  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [activeEditRecord, setActiveEditRecord] = useState<Visitation | null>(null);

  const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);
  const [isAssignMdaOpen, setIsAssignMdaOpen] = useState(false);
  const [isMdaEditorOpen, setIsMdaEditorOpen] = useState(false);
  
  const [mgmtUser, setMgmtUser] = useState<User | null>(null);
  const [mgmtMda, setMgmtMda] = useState<MDA | null>(null);

  useEffect(() => {
    localStorage.setItem('gbb_mdas_v2', JSON.stringify(mdas));
    localStorage.setItem('gbb_users_v2', JSON.stringify(users));
    localStorage.setItem('gbb_visitations_v2', JSON.stringify(visitations));
  }, [mdas, users, visitations]);

  const stats = useMemo(() => {
    const isFRF = user && user.role === 'FRF';
    const dataSet = isFRF ? visitations.filter(v => v.frfId === user.id) : visitations;
    const totalIncidents = dataSet.filter(v => v.hasIncident === 'Yes').length;
    const resolvedIncidents = dataSet.filter(v => v.incidentStatus === 'YES RESOLVED').length;
    return {
      totalMdas: isFRF ? user.assignedMdaIds.length : mdas.length,
      totalVisits: dataSet.length,
      incidents: { total: totalIncidents, resolved: resolvedIncidents, rate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 100 },
      activeFrfs: new Set(visitations.map(v => v.frfId)).size,
      frfLeaderboard: users.filter(u => u.role === 'FRF').map(frf => ({ name: frf.name, id: frf.id, count: visitations.filter(v => v.frfId === frf.id).length })).sort((a, b) => b.count - a.count)
    };
  }, [mdas, visitations, user, users]);

  const handleLogin = (email: string, pass: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password || 'admin123') === pass);
    if (found) { 
      setUser(found); 
      setAppState('APP'); 
      if (found.role === 'HEAD_OF_CSS') setActiveTab('reports');
      else setActiveTab('dashboard'); 
    }
    else { alert("Tactical Error: Invalid Credentials or Unauthorized Access."); }
  };

  const handleLogout = () => { setUser(null); setAppState('LANDING'); };

  const handleUpdateTickets = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeEditRecord) return;
    const fd = new FormData(e.currentTarget);
    const updates: Partial<Visitation> = {
        incidentTicket: fd.get('incidentTicket') as string, 
        incidentStatus: fd.get('incidentStatus') as any,
        requestTicket: fd.get('requestTicket') as string,
        requestStatus: fd.get('requestStatus') as any,
    };
    setVisitations(visitations.map(v => v.id === activeEditRecord.id ? { ...v, ...updates } : v));
    setIsEditTicketModalOpen(false);
  };

  const handleSaveMda = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newMda: MDA = {
      id: mgmtMda?.id || generateId(),
      name: fd.get('name') as string,
      category: fd.get('category') as string,
      active: fd.get('active') === 'on'
    };
    if (mgmtMda) setMdas(mdas.map(m => m.id === mgmtMda.id ? newMda : m));
    else setMdas([...mdas, newMda]);
    setIsMdaEditorOpen(false);
    setMgmtMda(null);
  };

  const handleDeleteMda = (id: string) => {
    if (confirm("System Audit: Permanently purge this Node? All associated tactical mappings will be disconnected.")) {
      setMdas(mdas.filter(m => m.id !== id));
      setUsers(users.map(u => ({ ...u, assignedMdaIds: u.assignedMdaIds.filter(mId => mId !== id) })));
    }
  };

  const handleSaveUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updatedUser: User = {
      id: mgmtUser?.id || generateId(),
      name: fd.get('name') as string, 
      email: fd.get('email') as string, 
      password: fd.get('password') as string || mgmtUser?.password || 'admin123',
      role: fd.get('role') as Role,
      assignedMdaIds: mgmtUser?.assignedMdaIds || []
    };
    if (mgmtUser) setUsers(users.map(u => u.id === mgmtUser.id ? updatedUser : u));
    else setUsers([...users, updatedUser]);
    setIsUserEditorOpen(false);
    setMgmtUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (id === user?.id) { alert("Security Protocol: You cannot terminate your own active session."); return; }
    if (confirm("Tactical Revocation: Permanently revoke all access for this personnel?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleMdaAssign = (userId: string, mdaId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, assignedMdaIds: u.assignedMdaIds.includes(mdaId) ? u.assignedMdaIds.filter(id => id !== mdaId) : [...u.assignedMdaIds, mdaId] } : u));
  };

  // --- Sub-Views ---

  const MDARegistry = () => {
    const [q, setQ] = useState('');
    const filtered = mdas.filter(m => m.name.toLowerCase().includes(q.toLowerCase()) || m.category.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#011a0e] p-8 rounded-[40px] border border-white/5 shadow-3xl gap-6">
          <div><h2 className="text-3xl font-black text-white uppercase tracking-tighter">Strategic Node Matrix</h2><p className="text-[10px] font-black text-slate-500 uppercase mt-1">Found {filtered.length} active hubs</p></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative lg:w-[300px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH NODES..." className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-[11px] uppercase outline-none" /></div>
            <button onClick={() => { setMgmtMda(null); setIsMdaEditorOpen(true); }} className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0 hover:bg-emerald-500 transition-all shadow-2xl"><Plus className="w-4 h-4" /> Provision New Node</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 && <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]"><p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">No Hubs Provisioned</p></div>}
          {filtered.map(m => (
            <div key={m.id} className="bg-[#011a0e] p-8 rounded-[40px] border border-white/5 group hover:border-emerald-500/30 transition-all shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Building2 className="w-6 h-6 text-emerald-500" /></div>
                  <Badge variant={m.active ? 'success' : 'gray'}>{m.active ? 'Active' : 'Offline'}</Badge>
                </div>
                <h4 className="text-lg font-black text-white uppercase truncate mb-1">{m.name}</h4>
                <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-widest mb-8">
                  <Layers className="w-3 h-3" /> {m.category}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setMgmtMda(m); setIsMdaEditorOpen(true); }} className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase text-slate-400 border border-white/5 hover:bg-white/10 transition-all">Edit Node</button>
                  <button onClick={() => handleDeleteMda(m.id)} className="p-3 bg-rose-600/10 text-rose-500 rounded-xl border border-rose-500/10 hover:bg-rose-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PersonnelRegistry = () => {
    const [q, setQ] = useState('');
    const filtered = users.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row justify-between items-center bg-[#011a0e] p-8 rounded-[40px] border border-white/5 shadow-3xl gap-6">
          <div><h2 className="text-3xl font-black text-white uppercase tracking-tighter">Personnel Authorization Matrix</h2><p className="text-[10px] font-black text-slate-500 uppercase mt-1">Found {filtered.length} synchronized identities</p></div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative lg:w-[300px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH IDENTITIES..." className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-[11px] uppercase outline-none" /></div>
            <button onClick={() => { setMgmtUser(null); setIsUserEditorOpen(true); }} className="px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0 hover:bg-emerald-500 transition-all shadow-2xl"><Plus className="w-4 h-4" /> Provision New Access</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <div key={u.id} className="bg-[#011a0e] p-8 rounded-[40px] border border-white/5 group hover:border-emerald-500/30 transition-all shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><Users className="w-6 h-6 text-emerald-500" /></div>
                  <Badge variant={u.role === 'ADMIN' ? 'error' : u.role === 'HEAD_OF_CSS' ? 'info' : 'success'}>{u.role === 'FRF' ? 'First Respondent' : u.role}</Badge>
                </div>
                <h4 className="text-lg font-black text-white uppercase truncate">{u.name}</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase truncate mb-1">{u.email}</p>
                <div className="flex items-center gap-2 text-[9px] text-emerald-600 font-black uppercase tracking-widest mb-8">
                  <KeyRound className="w-3 h-3" /> Credential Active
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setMgmtUser(u); setIsUserEditorOpen(true); }} className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase text-slate-400 border border-white/5 hover:bg-white/10 transition-all">Edit</button>
                  {u.role === 'FRF' && <button onClick={() => { setMgmtUser(u); setIsAssignMdaOpen(true); }} className="flex-1 py-3 bg-emerald-600/10 text-emerald-500 rounded-xl text-[9px] font-black uppercase border border-emerald-500/10 hover:bg-emerald-600/20 transition-all">Hubs ({u.assignedMdaIds.length})</button>}
                  <button onClick={() => handleDeleteUser(u.id)} className="p-3 bg-rose-600/10 text-rose-500 rounded-xl border border-rose-500/10 hover:bg-rose-600 hover:text-white transition-all"><ShieldX className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ReportsView = () => {
    const [startDate, setStartDate] = useState(getTodayString());
    const [endDate, setEndDate] = useState(getTodayString());
    const [reportMode, setReportMode] = useState<'PERSONNEL' | 'MASTER' | 'WEEKLY'>('WEEKLY');
    const [exportFormat, setExportFormat] = useState<'PDF' | 'CSV' | 'XLSX'>('CSV');
    const [isExporting, setIsExporting] = useState(false);

    const EXPORT_FIELDS = [
      { id: 'date', label: 'Date' },
      { id: 'mdaName', label: 'MDA Node' },
      { id: 'frfName', label: 'Respondent' },
      { id: 'wasVisited', label: 'Visited' },
      { id: 'hasIncident', label: 'Incident' },
      { id: 'incidentTicket', label: 'Ticket ID' },
      { id: 'incidentStatus', label: 'Status' },
      { id: 'comments', label: 'Comments' }
    ];

    const [selectedCols, setSelectedCols] = useState<string[]>(EXPORT_FIELDS.map(f => f.id));

    const audit = useMemo(() => {
        const filtered = visitations.filter(v => v.date >= startDate && v.date <= endDate);
        const visited = filtered.filter(v => v.wasVisited === 'Yes');
        const notVisited = filtered.filter(v => v.wasVisited === 'No');
        const incidents = filtered.filter(v => v.hasIncident === 'Yes');
        const incidentResolved = incidents.filter(v => v.incidentStatus === 'YES RESOLVED');
        const incidentPending = incidents.filter(v => v.incidentStatus !== 'YES RESOLVED');
        const requests = filtered.filter(v => v.hasRequest === 'Yes');
        const requestGranted = requests.filter(v => v.requestStatus === 'YES GRANTED');
        const requestPending = requests.filter(v => v.requestStatus !== 'YES GRANTED');
        const reasonCounts = REASONS_NOT_VISITED.reduce((acc, reason) => {
          acc[reason] = notVisited.filter(v => v.reasonNotVisited === reason).length;
          return acc;
        }, {} as Record<string, number>);
        const incidentTickets = incidents.map(v => v.incidentTicket).filter(Boolean).join(", ");
        const requestTickets = requests.map(v => v.requestTicket).filter(Boolean).join(", ");

        return {
            totalMdas: mdas.length,
            visitedMdasCount: new Set(visited.map(v => v.mdaId)).size,
            notVisitedMdasCount: mdas.length - new Set(visited.map(v => v.mdaId)).size,
            incidentsReceived: incidents.length,
            incidentsResolved: incidentResolved.length,
            incidentsPending: incidentPending.length,
            requestsReceived: requests.length,
            requestsGranted: requestGranted.length,
            requestsPending: requestPending.length,
            totalResponses: filtered.length,
            actualVisitsCount: visited.length,
            actualNotVisitedCount: notVisited.length,
            reasonCounts,
            incidentTickets,
            requestTickets,
            rawData: filtered,
            personnelCounts: users.filter(u => u.role === 'FRF').map(frf => ({
                id: frf.id,
                name: frf.name,
                count: filtered.filter(v => v.frfId === frf.id).length
            })).sort((a, b) => b.count - a.count)
        };
    }, [visitations, mdas, users, startDate, endDate]);

    const handleExportWeekly = () => {
      setIsExporting(true);
      setTimeout(() => {
          try {
              if (exportFormat === 'PDF') {
                  window.print();
                  setIsExporting(false);
                  return;
              }
              const delimiter = exportFormat === 'XLSX' ? '\t' : ',';
              const extension = exportFormat === 'XLSX' ? 'xls' : 'csv';
              const mimeType = exportFormat === 'XLSX' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
              let output = "";
              if (exportFormat === 'CSV') output += "sep=,\n";
              
              const rows = [
                [`WEEKLY STRATEGIC REPORT - ${startDate} TO ${endDate}`, ""],
                ["TOTAL NUMBER OF MDAS", audit.totalMdas],
                ["TOTAL NUMBER OF MDAS VISITED", audit.visitedMdasCount],
                ["TOTAL NUMBER OF MDAS NOT VISITED", audit.notVisitedMdasCount],
                ["TOTAL NUMBER OF INCIDENT RECEIVED", audit.incidentsReceived],
                ["TOTAL NUMBER OF INCIDENT RESOLVED", audit.incidentsResolved],
                ["INCIDENT UNRESOLVED/PENDING RESOLUTION", audit.incidentsPending],
                ["TOTAL NUMBER OF REQUEST RECEIVED", audit.requestsReceived],
                ["TOTAL NUMBER OF REQUEST GRANTED", audit.requestsGranted],
                ["REQUEST UNGRANTED/PENDING RESOLUTION", audit.requestsPending],
                ["Total Number of Responses", audit.totalResponses],
                ["Total Number of First Respondent Actual Visits to MDAs", audit.actualVisitsCount],
                ["Total Number of First Respondent Actual MDAs Not Visited", audit.actualNotVisitedCount],
                ["Reason for not visiting", ""],
                ...REASONS_NOT_VISITED.map(r => [r, audit.reasonCounts[r]]),
                ["COMPLAINED & RESOLVED INCIDENT", audit.incidentsResolved],
                ["State ticket numbers", audit.incidentTickets || "N/A"],
                ["Customer Comment/Findings/Suggestion/Specal Request/Complaint?", ""],
                ...audit.rawData.map(v => [v.mdaName, v.comments?.trim() ? v.comments : "N/A"])
              ];
              
              output += rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(delimiter)).join("\n");
              const BOM = '\uFEFF';
              const blob = new Blob([BOM + output], { type: mimeType });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.setAttribute("href", url);
              link.setAttribute("download", `GBB_Weekly_Executive_Report_${startDate}_to_${endDate}.${extension}`);
              link.click();
              URL.revokeObjectURL(url);
          } catch (e) { alert("Export Failure."); } finally { setIsExporting(false); }
      }, 1000);
    };

    const handleExportMaster = () => {
        setIsExporting(true);
        setTimeout(() => {
            try {
                if (exportFormat === 'PDF') {
                    window.print();
                    setIsExporting(false);
                    return;
                }
                const data = audit.rawData;
                const activeFields = EXPORT_FIELDS.filter(f => selectedCols.includes(f.id));
                const headers = activeFields.map(f => f.label);
                const delimiter = exportFormat === 'XLSX' ? '\t' : ',';
                const extension = exportFormat === 'XLSX' ? 'xls' : 'csv';
                const mimeType = exportFormat === 'XLSX' ? 'application/vnd.ms-excel' : 'text/csv;charset=utf-8;';
                let outputContent = "";
                if (exportFormat === 'CSV') outputContent += "sep=,\n";
                outputContent += headers.join(delimiter) + "\n";
                data.forEach(v => {
                    const row = activeFields.map(f => {
                        let val = (v as any)[f.id] || "";
                        if (f.id === 'comments' && !String(val).trim()) val = "N/A";
                        let cleaned = String(val).replace(/\n/g, ' ').replace(/\r/g, '');
                        if (exportFormat === 'CSV') return `"${cleaned.replace(/"/g, '""')}"`;
                        return cleaned;
                    });
                    outputContent += row.join(delimiter) + "\n";
                });
                const BOM = '\uFEFF';
                const blob = new Blob([BOM + outputContent], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `GBB_Master_Audit_${startDate}_to_${endDate}.${extension}`);
                link.click();
                URL.revokeObjectURL(url);
            } catch (error) { alert("Export Failure."); } finally { setIsExporting(false); }
        }, 1200);
    };

    const toggleColumn = (id: string) => {
        setSelectedCols(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 print:p-0">
            {/* Dynamic Print Header */}
            <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
              <div className="flex justify-between items-end">
                <img src={LOGO_URL} className="h-10 grayscale" />
                <div className="text-right">
                  <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    {reportMode === 'WEEKLY' ? 'Strategic Weekly Intelligence Summary' : 'Master Tactical Audit Log'}
                  </h1>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Audit Window: {startDate} — {endDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#011a0e] p-8 md:p-12 rounded-[40px] border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 shadow-3xl print:hidden relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 rounded-full blur-[80px] -mr-32 -mt-32" />
                <div className="text-center lg:text-left relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter">Strategic Intelligence Hub</h2>
                    <p className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-2 flex items-center gap-2 justify-center lg:justify-start">
                        <MonitorCheck className="w-3.5 h-3.5" /> Analytical Command Center
                    </p>
                </div>
                <div className="flex flex-col gap-3 relative z-10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Intelligence Sync Window</p>
                  <DateRangePicker start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 w-fit mx-auto lg:mx-0 print:hidden shadow-xl">
                <button onClick={() => setReportMode('WEEKLY')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${reportMode === 'WEEKLY' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <ListChecks className="w-3.5 h-3.5" /> Weekly Summary
                </button>
                <button onClick={() => setReportMode('MASTER')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${reportMode === 'MASTER' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <Database className="w-3.5 h-3.5" /> Master Audit
                </button>
                <button onClick={() => setReportMode('PERSONNEL')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${reportMode === 'PERSONNEL' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                    <Users className="w-3.5 h-3.5" /> Personnel Rank
                </button>
            </div>

            {reportMode === 'WEEKLY' ? (
              <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CommandCard title="Strategic Performance Metrics" icon={Trophy}>
                    <div className="space-y-4">
                      {[
                        { label: "TOTAL NETWORK NODES", val: audit.totalMdas },
                        { label: "NODES VERIFIED (VISITED)", val: audit.visitedMdasCount, color: "text-emerald-400" },
                        { label: "NODES UNREACHABLE", val: audit.notVisitedMdasCount, color: "text-rose-400" },
                        { label: "Total Operational Responses", val: audit.totalResponses },
                        { label: "Total Field Verification Gaps", val: audit.actualNotVisitedCount }
                      ].map(m => (
                        <div key={m.label} className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-700">{m.label}</span>
                          <span className={`text-xl font-black ${m.color || 'text-white'} print:text-slate-900`}>{m.val}</span>
                        </div>
                      ))}
                    </div>
                  </CommandCard>
                  <CommandCard title="Violation Log Analysis" icon={AlertOctagon}>
                    <div className="space-y-4">
                      {[
                        { label: "INCIDENTS RECEIVED", val: audit.incidentsReceived, color: "text-rose-500" },
                        { label: "INCIDENTS RESOLVED", val: audit.incidentsResolved, color: "text-emerald-500" },
                        { label: "INCIDENTS PENDING", val: audit.incidentsPending, color: "text-rose-600" }
                      ].map(m => (
                        <div key={m.label} className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest print:text-slate-700">{m.label}</span>
                          <span className={`text-xl font-black ${m.color || 'text-white'} print:text-slate-900`}>{m.val}</span>
                        </div>
                      ))}
                      <div className="pt-4">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 print:text-slate-600">Synchronized Ticket Index</p>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-[11px] font-mono text-emerald-500 break-words leading-relaxed print:bg-slate-50 print:border-slate-200 print:text-slate-900">
                          {audit.incidentTickets || "No incidents logged in window."}
                        </div>
                      </div>
                    </div>
                  </CommandCard>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CommandCard title="Verification Gap Justification" icon={AlertTriangle}>
                    <div className="space-y-3">
                      {REASONS_NOT_VISITED.map(reason => (
                        <div key={reason} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5 group hover:bg-emerald-600/10 transition-all print:bg-white print:border-slate-200">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight group-hover:text-white transition-all print:text-slate-800">{reason}</span>
                          <span className="text-sm font-black text-white tabular-nums px-3 py-1 bg-white/5 rounded-lg border border-white/10 print:text-slate-900 print:border-slate-300">{audit.reasonCounts[reason]}</span>
                        </div>
                      ))}
                    </div>
                  </CommandCard>
                  <div className="flex flex-col gap-8">
                    <CommandCard title="Request & Feedback Intelligence" icon={ClipboardType}>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest print:text-blue-800">Requests Received</span>
                          <span className="text-xl font-black text-white print:text-slate-900">{audit.requestsReceived}</span>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/10 text-[11px] font-mono text-blue-400 break-words print:bg-slate-50 print:border-slate-200 print:text-slate-900">
                          {audit.requestTickets || "No special requests logged."}
                        </div>
                      </div>
                    </CommandCard>
                    <div className="flex flex-col gap-3 print:hidden">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Intelligence Terminal</p>
                      <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                        {['PDF', 'CSV', 'XLSX'].map(fmt => (
                          <button key={fmt} onClick={() => setExportFormat(fmt as any)} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${exportFormat === fmt ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>
                            {fmt}
                          </button>
                        ))}
                      </div>
                      <button 
                        onClick={handleExportWeekly}
                        disabled={isExporting}
                        className="w-full py-8 bg-emerald-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.2em] shadow-3xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                      >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 group-hover:translate-y-1 transition-transform" />}
                        <span>{exportFormat === 'PDF' ? 'Print Strategy Deck' : `Download Weekly Summary (${exportFormat})`}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : reportMode === 'MASTER' ? (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4 print:gap-4">
                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl print:bg-white print:border-slate-300">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Network Nodes</p>
                            <p className="text-4xl font-black text-white tabular-nums print:text-slate-900">{audit.totalMdas}</p>
                        </div>
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl print:bg-white print:border-emerald-500">
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-2">Success Metrics</p>
                            <p className="text-4xl font-black text-white tabular-nums print:text-emerald-900">{audit.visitedMdasCount}</p>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/10 p-8 rounded-3xl print:bg-white print:border-rose-500">
                            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mb-2">Active Alerts</p>
                            <p className="text-4xl font-black text-white tabular-nums print:text-rose-900">{audit.incidentsReceived}</p>
                        </div>
                        <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-3xl print:bg-white print:border-blue-500">
                            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Total Telemetry</p>
                            <p className="text-4xl font-black text-white tabular-nums print:text-blue-900">{audit.rawData.length}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 print:hidden">
                        <CommandCard title="Master Telemetry Export" icon={FileDown} className="relative overflow-hidden">
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20"><LayoutGrid className="w-5 h-5" /></div>
                                        <p className="text-sm font-black text-white uppercase tracking-tight">1. Protocol Definition</p>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {EXPORT_FIELDS.map(f => (
                                            <button key={f.id} onClick={() => toggleColumn(f.id)} className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${selectedCols.includes(f.id) ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-white/5 border-transparent text-slate-500 hover:text-slate-300'}`}>
                                                {selectedCols.includes(f.id) ? <CheckSquare className="w-4 h-4 text-blue-400" /> : <Square className="w-4 h-4" />}
                                                <span className="text-[10px] font-black uppercase tracking-widest">{f.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-stretch pt-2">
                                    <div className="flex-1 space-y-4">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">2. Export Key</p>
                                        <div className="grid grid-cols-3 gap-3 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                                            {['PDF', 'CSV', 'XLSX'].map(fmt => (
                                                <button key={fmt} onClick={() => setExportFormat(fmt as any)} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${exportFormat === fmt ? 'bg-emerald-600 text-white shadow-xl' : 'bg-white/5 text-slate-500'}`}><span className="text-[9px] font-black uppercase">{fmt}</span></button>
                                            ))}
                                        </div>
                                    </div>
                                    <button onClick={handleExportMaster} disabled={isExporting} className="flex-[1.5] py-8 bg-emerald-600 text-white rounded-[32px] font-black uppercase text-xs tracking-[0.25em] shadow-3xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-5 disabled:opacity-50">
                                        {isExporting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Download className="w-6 h-6" />}
                                        <span>Synchronize Strategic Logs</span>
                                    </button>
                                </div>
                            </div>
                        </CommandCard>
                    </div>

                    {/* Visible Master List for Printing */}
                    <div className="hidden print:block space-y-4">
                      {audit.rawData.map(v => (
                        <div key={v.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                          <div className="flex justify-between mb-2">
                            <span className="text-[10px] font-black uppercase text-slate-900">{v.mdaName}</span>
                            <span className="text-[10px] text-slate-500">{v.date}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-[9px] uppercase font-bold text-slate-700">
                            <div>Visited: <span className={v.wasVisited === 'Yes' ? 'text-emerald-700' : 'text-rose-700'}>{v.wasVisited}</span></div>
                            <div>Incident: <span className={v.hasIncident === 'Yes' ? 'text-rose-700' : 'text-emerald-700'}>{v.hasIncident}</span></div>
                            <div>Respondent: {v.frfName}</div>
                          </div>
                          {v.comments && v.comments !== 'N/A' && (
                            <div className="mt-2 text-[9px] text-slate-600 italic border-t border-slate-100 pt-1">
                              Comment: {v.comments}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                </div>
            ) : (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                    <CommandCard title="Personnel Tactical Rankings" subtitle={`Verification Window: ${startDate} to ${endDate}`} icon={FileStack}>
                        <div className="space-y-2">
                            {audit.personnelCounts.length === 0 && <p className="text-center py-10 text-slate-500 font-black text-[10px] uppercase tracking-widest">No Operational Personnel Found</p>}
                            {audit.personnelCounts.map((row, idx) => (
                                <div key={row.id} className="flex justify-between items-center p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:bg-emerald-600/10 transition-all print:bg-white print:border-slate-200 print:p-4">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-[11px] font-black text-emerald-500 print:bg-slate-100 print:text-slate-900">{idx + 1}</div>
                                        <span className="text-sm font-black text-white uppercase tracking-tight print:text-slate-900">{row.name}</span>
                                    </div>
                                    <Badge variant={row.count > 10 ? 'success' : 'info'} size="md" className="min-w-[50px] justify-center tabular-nums">{row.count}</Badge>
                                </div>
                            ))}
                        </div>
                    </CommandCard>
                </div>
            )}
        </div>
    );
  };

  const HistoryView = () => {
    const [q, setQ] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const clearFilters = () => {
      setQ('');
      setStartDate('');
      setEndDate('');
      setStatusFilter('ALL');
    };

    const baseData = user?.role === 'FRF' ? visitations.filter(v => v.frfId === user?.id) : visitations;
    const filteredData = useMemo(() => {
        return baseData.filter(v => {
            const matchesName = v.mdaName.toLowerCase().includes(q.toLowerCase());
            const matchesStart = startDate ? v.date >= startDate : true;
            const matchesEnd = endDate ? v.date <= endDate : true;
            const matchesStatus = statusFilter === 'ALL' || 
                (statusFilter === 'YES RESOLVED' && v.incidentStatus === 'YES RESOLVED') ||
                (statusFilter === 'NO PENDING' && v.incidentStatus === 'NO PENDING') ||
                (statusFilter === 'PROCESSING' && v.incidentStatus === 'PROCESSING') ||
                (statusFilter === 'NO INCIDENT' && v.hasIncident === 'No');
            return matchesName && matchesStart && matchesEnd && matchesStatus;
        }).reverse();
    }, [baseData, q, startDate, endDate, statusFilter]);

    const isFiltered = q || startDate || endDate || statusFilter !== 'ALL';

    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="bg-[#011a0e] p-8 rounded-[40px] border border-white/5 space-y-8 shadow-3xl print:hidden">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Strategic Vault</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Total Records: {filteredData.length}</p>
            </div>
            <div className="relative w-full sm:w-[400px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="SEARCH NODES..." className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-[11px] uppercase outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <div className="space-y-3">
              <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2"><CalendarRange className="w-3 h-3 text-emerald-500" /> Deployment Window</p>
              <DateRangePicker start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} labelStart="Min" labelEnd="Max" />
            </div>
            <div className="space-y-3 flex items-end gap-3">
              <div className="flex-1">
                <p className="text-[9px] font-black text-slate-500 uppercase flex items-center gap-2 mb-3"><Filter className="w-3 h-3 text-blue-500" /> Sector Filter</p>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black text-white uppercase outline-none appearance-none"><option value="ALL">ALL LOGS</option><option value="YES RESOLVED">RESOLVED</option><option value="NO PENDING">PENDING</option><option value="PROCESSING">PROCESSING</option><option value="NO INCIDENT">SECURE</option></select>
              </div>
              {isFiltered && (
                <button 
                  onClick={clearFilters} 
                  className="px-6 py-[18px] bg-rose-600/10 text-rose-500 rounded-2xl border border-rose-500/10 hover:bg-rose-600 hover:text-white transition-all shrink-0 flex items-center gap-2 group h-fit"
                  title="Clear All Filters"
                >
                  <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase whitespace-nowrap">Clear All</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-4 max-h-[1000px] overflow-y-auto custom-scrollbar pr-2">
          {filteredData.length === 0 && <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px]"><p className="text-slate-500 font-black text-xs uppercase tracking-[0.3em]">No Historical Data Captured</p></div>}
          {filteredData.map(v => (
            <div key={v.id} className="bg-[#011a0e] p-6 rounded-[28px] border border-white/5 flex justify-between items-center group shadow-lg hover:border-emerald-500/20 transition-all print:bg-white print:border-slate-200">
              <div className="flex items-center gap-6">
                <div className="text-center bg-white/5 p-4 rounded-xl min-w-[80px] border border-white/5 print:bg-slate-50 print:border-slate-300"><p className="text-3xl font-black text-white print:text-slate-900">{new Date(v.date).getDate()}</p><p className="text-[9px] font-black text-slate-500 uppercase print:text-slate-600">{new Date(v.date).toLocaleString('default', { month: 'short' })}</p></div>
                <div><h4 className="text-lg font-black text-white uppercase tracking-tight print:text-slate-900">{v.mdaName}</h4><p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest print:text-emerald-800">{v.frfName}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-2"><Badge variant={v.hasIncident === 'Yes' ? 'error' : 'success'} size="sm">{v.hasIncident === 'Yes' ? 'Alert' : 'Secure'}</Badge>{v.incidentStatus && <Badge variant="info" size="sm" className="opacity-70">{v.incidentStatus}</Badge>}</div>
                {(user?.role === 'ADMIN' || (user?.role === 'FRF' && v.frfId === user.id)) && (<button onClick={() => { setActiveEditRecord(v); setIsEditTicketModalOpen(true); }} className="p-4 bg-white/5 hover:bg-emerald-600 text-blue-400 hover:text-white rounded-2xl border border-white/5 shadow-xl transition-all print:hidden"><FileEdit className="w-5 h-5" /></button>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SubmitReportForm = () => {
    const [q3, setQ3] = useState<'Yes' | 'No'>('Yes');
    const [reasonNotVisited, setReasonNotVisited] = useState<string>('');
    const [q5, setQ5] = useState<'Yes' | 'No'>('No');
    const [qHasRequest, setQHasRequest] = useState<'Yes' | 'No'>('No');
    const myMdas = mdas.filter(m => user?.assignedMdaIds.includes(m.id) && m.active);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const mdaId = fd.get('mdaId') as string;
        const mda = mdas.find(m => m.id === mdaId);
        const commentInput = (fd.get('comments') as string) || "";
        
        setVisitations([...visitations, {
            id: generateId(), 
            frfId: user!.id, 
            frfName: user!.name, 
            date: fd.get('date') as string, 
            timestamp: Date.now(), 
            mdaId, 
            mdaName: mda?.name || '',
            wasVisited: q3, 
            reasonNotVisited: q3 === 'No' ? reasonNotVisited : undefined, 
            hasIncident: q5, 
            hasRequest: qHasRequest, 
            comments: commentInput.trim() ? commentInput : "N/A"
        } as Visitation]);
        setActiveTab('history');
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {myMdas.length === 0 ? (
                <div className="bg-rose-500/10 p-12 rounded-[40px] border border-rose-500/20 text-center space-y-4">
                  <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                  <p className="text-rose-500 font-black uppercase text-xs tracking-widest">No Tactical Hubs Assigned</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-tight">Contact your supervisor to map authorized MDA nodes to your profile.</p>
                </div>
            ) : (
                <CommandCard title="Intelligence Broadcast" icon={ClipboardCheck}>
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><input name="date" type="date" required defaultValue={getTodayString()} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-black text-white text-xs" /><select name="mdaId" required className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-black text-white text-xs"><option value="">SELECT HUB...</option>{myMdas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                        <div className="space-y-6"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4"><label className="text-[10px] font-black text-white uppercase">3. Was Hub Site Visited?</label><div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQ3(o as any)} className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase border transition-all ${q3 === o ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>{o}</button>))}</div></div>{q3 === 'No' && (<div className="p-6 bg-rose-600/5 border border-rose-500/20 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300"><label className="text-[10px] font-black text-rose-400 uppercase">Reason for Non-Visitation</label><select value={reasonNotVisited} onChange={e => setReasonNotVisited(e.target.value)} required className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-black text-white text-xs"><option value="">SELECT REASON...</option>{REASONS_NOT_VISITED.map(r => <option key={r} value={r}>{r}</option>)}</select></div>)}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-4"><label className="text-[10px] font-black text-white uppercase">5. Violation (Incident) Detected?</label><div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQ5(o as any)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase border transition-all ${q5 === o ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>{o}</button>))}</div></div><div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-4"><label className="text-[10px] font-black text-white uppercase">Customer Request / Feedback?</label><div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQHasRequest(o as any)} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase border transition-all ${qHasRequest === o ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}>{o}</button>))}</div></div></div>
                        <textarea name="comments" rows={4} className="w-full p-6 bg-white/5 border border-white/10 rounded-2xl font-bold text-white text-sm outline-none focus:border-emerald-500" placeholder="Provide tactical findings and site observations..." />
                        <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500 transition-all">Broadcast Intelligence</button>
                    </form>
                </CommandCard>
            )}
        </div>
    );
  };

  const Sidebar = () => (
    <>
      <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden fixed bottom-6 right-6 z-[60] bg-emerald-600 text-white p-4 rounded-full shadow-3xl print:hidden"><Menu className="w-6 h-6" /></button>
      <div className={`w-[280px] bg-[#011a0e] h-screen flex flex-col fixed left-0 top-0 border-r border-white/5 shadow-3xl z-[55] transition-transform lg:translate-x-0 print:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8"><img src={LOGO_URL} className="w-full brightness-200 grayscale h-12 object-contain" /></div>
        <nav className="flex-1 px-6 space-y-3 overflow-y-auto custom-scrollbar">
          <NavItem icon={LayoutDashboard} label="Mission Control" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setIsSidebarOpen(false);}} />
          {user?.role === 'ADMIN' && (
            <>
              <div className="h-px bg-white/5 mx-4 my-2" />
              <NavItem icon={Building2} label="Node Matrix" active={activeTab === 'mdas'} onClick={() => {setActiveTab('mdas'); setIsSidebarOpen(false);}} />
              <NavItem icon={Users} label="Personnel Registry" active={activeTab === 'users'} onClick={() => {setActiveTab('users'); setIsSidebarOpen(false);}} />
              <NavItem icon={CalendarRange} label="Intelligence Hub" active={activeTab === 'reports'} onClick={() => {setActiveTab('reports'); setIsSidebarOpen(false);}} />
            </>
          )}
          <div className="h-px bg-white/5 mx-4 my-2" />
          {user?.role === 'FRF' && <NavItem icon={Plus} label="New Deployment" active={activeTab === 'submit'} onClick={() => {setActiveTab('submit'); setIsSidebarOpen(false);}} />}
          <NavItem icon={History} label="Strategic Archive" active={activeTab === 'history'} onClick={() => {setActiveTab('history'); setIsSidebarOpen(false);}} />
        </nav>
        <div className="p-6 mt-auto"><button onClick={handleLogout} className="w-full py-4 bg-rose-600/10 text-rose-500 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all"><LogOut className="w-4 h-4" /> Shutdown Session</button></div>
      </div>
    </>
  );

  const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}><Icon className="w-4.5 h-4.5" /> <span>{label}</span></button>
  );

  const AdminDashboard = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <StatPanel label="Authorized Nodes" value={mdas.length} icon={Building2} color="bg-emerald-600" />
            <StatPanel label="System Telemetry" value={stats.totalVisits} icon={History} color="bg-blue-600" />
            <StatPanel label="Critical Alerts" value={stats.incidents.total} icon={AlertTriangle} color="bg-rose-600" />
            <StatPanel label="Respondent Force" value={users.length} icon={Users} color="bg-amber-500" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CommandCard title="Strategic Command Shortcuts" icon={Settings2}>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab('mdas')} className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all group"><Building2 className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Nodes Matrix</span></button>
                    <button onClick={() => setActiveTab('users')} className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-blue-600 hover:text-white transition-all group"><Users className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Personnel Auth</span></button>
                    <button onClick={() => setActiveTab('reports')} className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-amber-600 hover:text-white transition-all group"><PieChart className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Intelligence Hub</span></button>
                    <button onClick={() => setActiveTab('history')} className="p-6 bg-rose-600/10 border border-rose-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-rose-600 hover:text-white transition-all group"><History className="w-8 h-8" /><span className="text-[10px] font-black uppercase">Tactical Vault</span></button>
                </div>
            </CommandCard>
            <CommandCard title="Tactical Feed Summary" icon={ActivitySquare}>
                <div className="space-y-3">
                    {visitations.length === 0 && <p className="text-center py-10 text-slate-500 font-black text-[9px] uppercase tracking-widest">Awaiting First Deployment</p>}
                    {visitations.slice(-5).reverse().map(v => (
                        <div key={v.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center"><div className="min-w-0"><p className="text-[10px] font-black text-white uppercase truncate">{v.mdaName}</p><p className="text-[8px] text-emerald-500 font-bold uppercase mt-0.5">{v.frfName}</p></div><Badge variant={v.hasIncident === 'Yes' ? 'error' : 'success'} size="sm">{v.hasIncident === 'Yes' ? 'Violation' : 'Secure'}</Badge></div>
                    ))}
                </div>
            </CommandCard>
        </div>
    </div>
  );

  if (appState === 'LANDING') return (
    <div className="min-h-screen bg-[#010a06] text-white flex flex-col items-center justify-center p-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -mr-96 -mt-96" />
      <div className="relative z-10 max-w-4xl text-center space-y-12 animate-in fade-in duration-1000">
        <img src={LOGO_URL} className="h-16 mx-auto brightness-200 grayscale" />
        <h1 className="text-7xl font-black tracking-tighter uppercase leading-none">First Respondent<br/><span className="text-emerald-500">Framework</span></h1>
        <button onClick={() => setAppState('LOGIN')} className="px-12 py-6 bg-emerald-600 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 shadow-3xl flex items-center gap-4 mx-auto transition-all">Authenticate Entry <ArrowRight className="w-5 h-5" /></button>
      </div>
    </div>
  );
  
  if (appState === 'LOGIN') return (
    <div className="min-h-screen bg-[#010a06] flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-[#011a0e] rounded-[60px] p-16 border border-white/10 text-center shadow-3xl animate-in slide-in-from-bottom-12 duration-700">
        <h2 className="text-3xl font-black text-white mb-12 uppercase tracking-tight">LOGIN</h2>
        <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.currentTarget); handleLogin(fd.get('email') as string, fd.get('password') as string); }} className="space-y-6">
          <input name="email" type="email" placeholder="Official GBB Email" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500" required />
          <input name="password" type="password" placeholder="Passphrase" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500" required />
          <button className="w-full bg-emerald-600 py-6 rounded-3xl font-black text-white uppercase tracking-widest text-xs shadow-3xl hover:bg-emerald-500">Decrypt entry</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#01110a] flex text-white relative">
      <Sidebar />
      <main className="flex-1 lg:ml-[280px] p-10 lg:p-16 w-full max-w-[1600px] mx-auto min-w-0 print:ml-0 print:p-0 print:bg-white print:text-black">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 gap-8 border-b border-white/5 pb-16 print:hidden">
          <div><h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none truncate">{activeTab.replace(/_/g, ' ')}</h1></div>
          <div className="text-right"><p className="text-xl font-black text-white uppercase leading-tight">{user?.name}</p><p className="text-[11px] font-black text-emerald-400 uppercase tracking-widest opacity-80">{user?.role === 'FRF' ? 'First Respondent' : user?.role}</p></div>
        </header>
        <div className="pb-24">
          {activeTab === 'dashboard' && <AdminDashboard />}
          {activeTab === 'mdas' && user?.role === 'ADMIN' && <MDARegistry />}
          {activeTab === 'users' && user?.role === 'ADMIN' && <PersonnelRegistry />}
          {activeTab === 'reports' && user?.role === 'ADMIN' && <ReportsView />}
          {activeTab === 'submit' && user?.role === 'FRF' && <SubmitReportForm />}
          {activeTab === 'history' && <HistoryView />}
        </div>
      </main>

      <Modal isOpen={isEditTicketModalOpen} onClose={() => setIsEditTicketModalOpen(false)} title="Intelligence Sync">
          <form onSubmit={handleUpdateTickets} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10 space-y-4">
                    <p className="text-[10px] font-black text-rose-400 uppercase border-b border-rose-500/10 pb-4">Incident Log</p>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Ticket ID</label><input name="incidentTicket" defaultValue={activeEditRecord?.incidentTicket} placeholder="INCT..." className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Status</label><select name="incidentStatus" defaultValue={activeEditRecord?.incidentStatus || 'NO PENDING'} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs uppercase"><option value="NO PENDING">NO PENDING</option><option value="YES RESOLVED">YES RESOLVED</option><option value="PROCESSING">PROCESSING</option></select></div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 space-y-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase border-b border-blue-500/10 pb-4">Request Log</p>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Ticket ID</label><input name="requestTicket" defaultValue={activeEditRecord?.requestTicket} placeholder="REQT..." className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Status</label><select name="requestStatus" defaultValue={activeEditRecord?.requestStatus || 'NO PENDING'} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs uppercase"><option value="NO PENDING">NO PENDING</option><option value="YES GRANTED">YES GRANTED</option><option value="PROCESSING">PROCESSING</option></select></div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-emerald-500">Finalize Synchronization</button>
          </form>
      </Modal>

      <Modal isOpen={isUserEditorOpen} onClose={() => { setIsUserEditorOpen(false); setMgmtUser(null); }} title={mgmtUser ? "Update Access Profile" : "Provision New Access"}>
          <form onSubmit={handleSaveUser} className="p-10 space-y-8">
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Personnel Name</label><input name="name" defaultValue={mgmtUser?.name} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Secure Email</label><input name="email" type="email" defaultValue={mgmtUser?.email} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Strategic Passphrase</label><input name="password" type="text" placeholder={mgmtUser ? "Enter new or leave for current" : "Define Access Key"} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Strategic Role</label><select name="role" defaultValue={mgmtUser?.role || 'FRF'} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs"><option value="FRF">FIRST RESPONDENT (FRF)</option><option value="ADMIN">SUPERVISOR (ADMIN)</option><option value="HEAD_OF_CSS">SECTOR HEAD (CSS)</option></select></div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Provision Records</button>
          </form>
      </Modal>

      <Modal isOpen={isMdaEditorOpen} onClose={() => { setIsMdaEditorOpen(false); setMgmtMda(null); }} title={mgmtMda ? "Configure Node" : "Provision Node"}>
          <form onSubmit={handleSaveMda} className="p-10 space-y-8">
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Formal Designation</label><input name="name" defaultValue={mgmtMda?.name} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs uppercase" /></div>
              <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Category</label><select name="category" defaultValue={mgmtMda?.category || 'Ministry'} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs"><option value="Ministry">Ministry</option><option value="Agency">Agency</option><option value="Corporation">Corporation</option></select></div>
                  <div className="flex flex-col items-center justify-center p-5 bg-black/40 border border-white/10 rounded-2xl"><label className="text-[10px] font-black text-slate-500 uppercase mb-3">Sync Active</label><input type="checkbox" name="active" defaultChecked={mgmtMda?.active ?? true} className="w-6 h-6 accent-emerald-500" /></div>
              </div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Verify Hub Provision</button>
          </form>
      </Modal>

      <Modal isOpen={isAssignMdaOpen} onClose={() => { setIsAssignMdaOpen(false); setMgmtUser(null); }} title={`Tactical Node Mapping: ${mgmtUser?.name}`}>
          <div className="p-10 space-y-6">
              <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  {mdas.length === 0 && <p className="text-center py-10 text-slate-500 font-black text-[10px] uppercase">No Hubs Provisioned Yet</p>}
                  {mdas.map(m => (
                      <div key={m.id} onClick={() => mgmtUser && handleToggleMdaAssign(mgmtUser.id, m.id)} className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${mgmtUser?.assignedMdaIds.includes(m.id) ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}><div><p className={`text-[11px] font-black uppercase truncate ${mgmtUser?.assignedMdaIds.includes(m.id) ? 'text-emerald-400' : 'text-white'}`}>{m.name}</p></div>{mgmtUser?.assignedMdaIds.includes(m.id) ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <Plus className="w-4 h-4 text-slate-700" />}</div>
                  ))}
              </div>
              <button onClick={() => { setIsAssignMdaOpen(false); setMgmtUser(null); }} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Finalize Strategy Mapping</button>
          </div>
      </Modal>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<FRFSystem />);
