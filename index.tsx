
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
  RotateCcw,
  Fingerprint,
  ZapOff,
  Clock,
  Phone,
  UserCheck,
  HardDrive,
  Wifi,
  PhoneCall,
  Power
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

const INCIDENT_TYPES = [
  "NETWORK - FIBER CUT",
  "NETWORK - ROUTER/SWITCH FAILURE",
  "POWER - UPS/INVERTER FAULT",
  "POWER - NATIONAL GRID DOWN",
  "VOICE - IP PHONE UNREACHABLE",
  "SYSTEMS - SERVER OFFLINE",
  "SECURITY - UNAUTHORIZED ACCESS",
  "OTHER TECHNICAL FAULT"
];

const REQUEST_TYPES = [
  "SERVICE - BANDWIDTH UPGRADE",
  "SERVICE - NEW NODE DEPLOYMENT",
  "SERVICE - IP PHONE PROVISIONING",
  "HARDWARE - SPARE PARTS REPLACEMENT",
  "TECHNICAL - SITE SURVEY REQUEST",
  "ADMIN - ESCALATION TO CSS"
];

interface Visitation {
  id: string;
  frfId: string;
  frfName: string;
  date: string;
  timestamp: number;
  mdaId: string;
  mdaName: string;
  contactName: string;
  contactPhone: string;
  visitStartTime: string;
  visitEndTime: string;
  wasVisited: 'Yes' | 'No';
  reasonNotVisited?: string;
  checklist: {
    internet: boolean;
    power: boolean;
    voice: boolean;
    lan: boolean;
  };
  hasIncident: 'Yes' | 'No';
  incidentType?: string;
  incidentTicket?: string;
  incidentStatus?: 'YES RESOLVED' | 'NO PENDING' | 'PROCESSING';
  hasRequest: 'Yes' | 'No';
  requestType?: string;
  requestTicket?: string;
  requestStatus?: 'YES GRANTED' | 'NO PENDING' | 'PROCESSING';
  comments: string;
}

// --- Constants ---

const LOGO_URL = "http://galaxybackbone.com.ng/wp-content/uploads/2020/12/Galaxy-New-Logo-scaled.jpg";

const INITIAL_MDAS: MDA[] = [
  { id: 'mda-01', name: 'FEDERAL MINISTRY OF TRANSPORTATION', category: 'Ministry', active: true },
  { id: 'mda-02', name: 'FEDERAL CAPITAL TERRITORY ADMINISTRATION', category: 'Agency', active: true },
  { id: 'mda-03', name: 'FEDERAL MINISTRY OF AGRICULTURE', category: 'Ministry', active: true },
  { id: 'mda-04', name: 'FEDERAL MINISTRY OF MARINE AND BLUE ECONOMY', category: 'Ministry', active: true },
  { id: 'mda-05', name: 'VOICE OF NIGERIA', category: 'Agency', active: true },
  { id: 'mda-06', name: 'FEDERAL RADIO CORPORATION', category: 'Corporation', active: true },
  { id: 'mda-07', name: 'FEDERAL MINISTRY OF INFORMATION AND NATIONAL ORIENTATION', category: 'Ministry', active: true },
  { id: 'mda-08', name: 'FEDERAL MINISTRY OF STEEL DEVELOPMENT', category: 'Ministry', active: true },
  { id: 'mda-09', name: 'FEDERAL MINISTRY OF SOLID MINERALS DEVELOPMENT', category: 'Ministry', active: true },
  { id: 'mda-10', name: 'FEDERAL MINISTRY OF WOMEN AFFAIRS (FMWA)', category: 'Ministry', active: true },
  { id: 'mda-11', name: 'FEDERAL CIVIL SERVICE COMMISSION', category: 'Commission', active: true },
  { id: 'mda-12', name: 'FEDERAL MINISTRY OF BUDGET AND ECONOMIC PLANNING', category: 'Ministry', active: true },
  { id: 'mda-13', name: 'FEDERAL MINISTRY OF JUSTICE', category: 'Ministry', active: true },
  { id: 'mda-14', name: 'FEDERAL MINISTRY OF FOREIGN AFFAIRS', category: 'Ministry', active: true },
  { id: 'mda-15', name: 'FEDERAL BUDGET OFFICE OF THE FEDERATION', category: 'Agency', active: true },
  { id: 'mda-16', name: 'FEDERAL MINISTRY OF COMMUNICATIONS INNOVATION AND DIGITAL ECONOMY (FMCIDE)', category: 'Ministry', active: true },
  { id: 'mda-17', name: 'NIGERIAN NAVY', category: 'Agency', active: true },
  { id: 'mda-18', name: 'FEDERAL MINISTRY OF POWER', category: 'Ministry', active: true },
  { id: 'mda-19', name: 'FEDERAL MINISTRY OF DEFENCE', category: 'Ministry', active: true },
  { id: 'mda-20', name: 'FEDERAL MINISTRY OF FINANCE', category: 'Ministry', active: true },
  { id: 'mda-21', name: 'OSGF CLINIC', category: 'Agency', active: true },
  { id: 'mda-22', name: 'FEDERAL MINISTRY OF AVIATION', category: 'Ministry', active: true },
  { id: 'mda-23', name: 'MINISTRY OF HUMANITARIAN AFFAIRS AND POVERTY ALLEVIATION', category: 'Ministry', active: true },
  { id: 'mda-24', name: 'FEDERAL MINISTRY OF SPECIAL DUTIES AND INTER GOVERNMENTAL AFFAIRS (FMSD)', category: 'Ministry', active: true },
  { id: 'mda-25', name: 'FEDERAL MINISTRY OF REGIONAL DEVELOPMENT', category: 'Ministry', active: true },
  { id: 'mda-26', name: 'FEDERAL MINISTRY OF LABOUR AND EMPLOYMENT (FML)', category: 'Ministry', active: true },
  { id: 'mda-27', name: 'CODE OF CONDUCT BUREAU (CCB)', category: 'Agency', active: true },
  { id: 'mda-28', name: 'NATIONAL COMMISSION FOR REFUGEES, MIGRANTS AND INTERNALLY DISPLACED PERSONS (NCFRMI)', category: 'Commission', active: true },
  { id: 'mda-29', name: 'NATIONAL INCOME, SALARIES & WAGES COMMISSION (NSIWC)', category: 'Commission', active: true },
  { id: 'mda-30', name: 'NATIONAL COPYRIGHT COMMISSION (NCC)', category: 'Commission', active: true },
  { id: 'mda-31', name: 'FEDERAL MINISTRY OF POLICE AFFAIRS', category: 'Ministry', active: true },
  { id: 'mda-32', name: 'NIGERIANS IN DIASPORA COMMISSION (NIDCOM)', category: 'Commission', active: true },
  { id: 'mda-33', name: 'NATIONAL ANTI DOPING COMMISSION (NADC)', category: 'Commission', active: true },
  { id: 'mda-34', name: 'SSA TO PRESIDENT ON HUMANITARIAN AFFAIRS', category: 'Agency', active: true },
  { id: 'mda-35', name: 'NIGERIA INTER RELIGIOUS COUNCIL (NIREC)', category: 'Agency', active: true },
  { id: 'mda-36', name: 'NATIONAL CENTER FOR TECHNOLOGY MANAGEMENT (NACETEM)', category: 'Agency', active: true },
  { id: 'mda-37', name: 'SSA TO PRESIDENT ON CHIEFTANCY MATTERS', category: 'Agency', active: true },
  { id: 'mda-38', name: 'FEDERAL MINISTRY OF WORKS', category: 'Ministry', active: true },
  { id: 'mda-39', name: 'RADIOGRAPHERS REGISTRATION BOARD (RRBN)', category: 'Agency', active: true },
  { id: 'mda-40', name: 'FEDERAL MINISTRY OF ENVIRONMENT', category: 'Ministry', active: true },
  { id: 'mda-41', name: 'ENVIRONMENTAL HEALTH REGISTRATION OFFICERS COUNCIL OF NIGERIA (EHRECON)', category: 'Agency', active: true },
  { id: 'mda-42', name: 'FEDERAL MINISTRY OF HOUSING', category: 'Ministry', active: true },
  { id: 'mda-43', name: 'OFFICE OF THE HEAD OF CIVIL SERVICE OF THE FEDERATION (OHCSF)', category: 'Agency', active: true },
  { id: 'mda-44', name: 'AGRICULTURAL RESEARCH COUNCIL OF NIGERIA', category: 'Agency', active: true },
  { id: 'mda-45', name: 'FEDERAL MINISTRY OF SCIENCE AND TECHNOLOGY', category: 'Ministry', active: true },
  { id: 'mda-46', name: 'OFFICE OF THE SECRETARY GENERAL OF THE FEDERATION', category: 'Agency', active: true },
  { id: 'mda-47', name: 'FEDERAL MINISTRY OF YOUTH DEVELOPMENT', category: 'Ministry', active: true },
  { id: 'mda-48', name: 'FEDERAL MINISTRY OF LIVESTOCK DEVELOPMENT', category: 'Ministry', active: true },
  { id: 'mda-49', name: 'FEDERAL MINISTRY OF ART AND CULTURE', category: 'Ministry', active: true },
  { id: 'mda-50', name: 'FEDERAL MINISTRY OF INDUSTRY, TRADE AND INVESTMENT', category: 'Ministry', active: true },
  { id: 'mda-51', name: 'FEDERAL MINISTRY OF EDUCATION', category: 'Ministry', active: true },
  { id: 'mda-52', name: 'FEDERAL MINISTRY OF INTERIOR', category: 'Ministry', active: true },
  { id: 'mda-53', name: 'FEDERAL MINISTRY OF HEALTH', category: 'Ministry', active: true },
  { id: 'mda-54', name: 'FEDERAL MINISTRY OF WATER RESOURCES', category: 'Ministry', active: true },
  { id: 'mda-55', name: 'NATIONAL ORIENTATION AGENCY', category: 'Agency', active: true },
  { id: 'mda-56', name: 'CORRECTIONAL SERVICES & IMMIGRATION SERVICE BOARD', category: 'Agency', active: true },
  { id: 'mda-57', name: 'NIGERIAN LAW REFORM COMMISSION', category: 'Commission', active: true },
];

const INITIAL_USERS: User[] = [
  { id: 'u1', name: 'Strategic Administrator', email: 'admin@gbb.com.ng', password: 'admin123', role: 'ADMIN', assignedMdaIds: [] },
  { id: 'u4', name: 'Head of CSS', email: 'css@gbb.com.ng', password: 'css123', role: 'HEAD_OF_CSS', assignedMdaIds: [] },
  { id: 'u5', name: 'Asmau Alkali', email: 'asmau.alkali@galaxybackbone.com.ng', password: 'frf123', role: 'FRF', assignedMdaIds: ['mda-01', 'mda-05', 'mda-10'] },
  { id: 'u6', name: 'Muhammad Bello', email: 'Muhammad.bello2@galaxybackbone.com.ng', password: 'frf123', role: 'FRF', assignedMdaIds: ['mda-02', 'mda-08', 'mda-15'] }
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

  const [mdas, setMdas] = useState<MDA[]>(() => JSON.parse(localStorage.getItem('gbb_mdas_v4') || JSON.stringify(INITIAL_MDAS)));
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('gbb_users_v4') || JSON.stringify(INITIAL_USERS)));
  const [visitations, setVisitations] = useState<Visitation[]>(() => JSON.parse(localStorage.getItem('gbb_visitations_v4') || "[]"));

  const [isEditTicketModalOpen, setIsEditTicketModalOpen] = useState(false);
  const [activeEditRecord, setActiveEditRecord] = useState<Visitation | null>(null);

  const [isUserEditorOpen, setIsUserEditorOpen] = useState(false);
  const [isAssignMdaOpen, setIsAssignMdaOpen] = useState(false);
  const [isMdaEditorOpen, setIsMdaEditorOpen] = useState(false);
  
  const [mgmtUser, setMgmtUser] = useState<User | null>(null);
  const [mgmtMda, setMgmtMda] = useState<MDA | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [mdaAssignSearch, setMdaAssignSearch] = useState('');
  const [mdaAssignCategory, setMdaAssignCategory] = useState('ALL');
  const [mdaAssignStatus, setMdaAssignStatus] = useState('ALL');

  useEffect(() => {
    localStorage.setItem('gbb_mdas_v4', JSON.stringify(mdas));
    localStorage.setItem('gbb_users_v4', JSON.stringify(users));
    localStorage.setItem('gbb_visitations_v4', JSON.stringify(visitations));
  }, [mdas, users, visitations]);

  const stats = useMemo(() => {
    const isFRF = user && user.role === 'FRF';
    const personalVisits = isFRF ? visitations.filter(v => v.frfId === user.id) : visitations;
    const totalIncidents = personalVisits.filter(v => v.hasIncident === 'Yes').length;
    const resolvedIncidents = personalVisits.filter(v => v.incidentStatus === 'YES RESOLVED').length;
    const activeIncidents = personalVisits.filter(v => v.hasIncident === 'Yes' && v.incidentStatus !== 'YES RESOLVED').length;
    
    const frfPersonnel = users.filter(u => u.role === 'FRF');
    const activeFrfIds = new Set(visitations.map(v => v.frfId));
    const activeFrfsCount = Array.from(activeFrfIds).filter(id => users.find(u => u.id === id)?.role === 'FRF').length;

    return {
      totalMdas: isFRF ? user.assignedMdaIds.length : mdas.length,
      totalVisits: personalVisits.length,
      activeIncidents,
      incidents: { total: totalIncidents, resolved: resolvedIncidents, rate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 100 },
      totalFrfs: frfPersonnel.length,
      activeFrfs: activeFrfsCount,
      frfLeaderboard: frfPersonnel.map(frf => ({ 
        name: frf.name, 
        id: frf.id, 
        count: visitations.filter(v => v.frfId === frf.id).length 
      })).sort((a, b) => b.count - a.count)
    };
  }, [mdas, visitations, user, users]);

  const handleLogin = (email: string, pass: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password || 'admin123') === pass);
    if (found) { 
      setUser(found); 
      setAppState('APP'); 
      if (found.role === 'HEAD_OF_CSS' || found.role === 'ADMIN') setActiveTab('dashboard');
      else setActiveTab('dashboard'); 
    }
    else { alert("Tactical Error: Invalid Credentials or Unauthorized Access."); }
  };

  const handleLogout = () => { setUser(null); setAppState('LANDING'); setLoginEmail(''); setLoginPassword(''); };

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
      name: (fd.get('name') as string).toUpperCase(),
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
    setUsers(prevUsers => prevUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        assignedMdaIds: u.assignedMdaIds.includes(mdaId) 
          ? u.assignedMdaIds.filter(id => id !== mdaId) 
          : [...u.assignedMdaIds, mdaId] 
      } : u
    ));
  };

  const filteredMdasForAssignment = useMemo(() => {
    return mdas.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(mdaAssignSearch.toLowerCase());
      const matchesCategory = mdaAssignCategory === 'ALL' || m.category === mdaAssignCategory;
      const matchesStatus = mdaAssignStatus === 'ALL' || 
                           (mdaAssignStatus === 'ACTIVE' && m.active) || 
                           (mdaAssignStatus === 'OFFLINE' && !m.active);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [mdas, mdaAssignSearch, mdaAssignCategory, mdaAssignStatus]);

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
                <h4 className="text-sm font-black text-white uppercase truncate mb-1 leading-tight">{m.name}</h4>
                <div className="flex items-center gap-2 text-[8px] text-slate-500 font-black uppercase tracking-widest mb-8">
                  <Layers className="w-2.5 h-2.5" /> {m.category}
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

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-20 print:p-0">
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
                    </div>
                  </CommandCard>
                </div>
              </div>
            ) : null}
        </div>
    );
  };

  const HistoryView = () => {
    const [q, setQ] = useState('');
    const baseData = user?.role === 'FRF' ? visitations.filter(v => v.frfId === user?.id) : visitations;
    const filteredData = useMemo(() => {
        return baseData.filter(v => v.mdaName.toLowerCase().includes(q.toLowerCase())).reverse();
    }, [baseData, q]);

    return (
      <div className="space-y-6 animate-in fade-in duration-700">
        <div className="flex justify-between items-center bg-[#011a0e] p-8 rounded-[40px] border border-white/5">
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Tactical Vault</h2>
            <div className="relative w-[300px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search Archive..." className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white text-[11px] uppercase outline-none" /></div>
        </div>
        <div className="space-y-4">
          {filteredData.map(v => (
            <div key={v.id} className="bg-[#011a0e] p-8 rounded-[32px] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">{new Date(v.date).getDate()}</span>
                        <span className="text-[8px] font-black text-slate-500 uppercase">{new Date(v.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-white uppercase truncate">{v.mdaName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{v.frfName}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-700" />
                            <span className="text-[9px] text-slate-500 font-bold uppercase">{v.visitStartTime} - {v.visitEndTime}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex gap-1">
                        {v.checklist?.internet ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <Wifi className="w-3.5 h-3.5 text-rose-500/50" />}
                        {v.checklist?.power ? <Power className="w-3.5 h-3.5 text-emerald-500" /> : <Power className="w-3.5 h-3.5 text-rose-500/50" />}
                        {v.checklist?.voice ? <PhoneCall className="w-3.5 h-3.5 text-emerald-500" /> : <PhoneCall className="w-3.5 h-3.5 text-rose-500/50" />}
                    </div>
                    <Badge variant={v.hasIncident === 'Yes' ? 'error' : 'success'} size="sm">{v.hasIncident === 'Yes' ? 'Alert' : 'Secure'}</Badge>
                    {(user?.role === 'ADMIN' || user?.role === 'HEAD_OF_CSS') && (
                      <button onClick={() => { setActiveEditRecord(v); setIsEditTicketModalOpen(true); }} className="p-3 bg-white/5 hover:bg-emerald-600 rounded-xl transition-all text-slate-400 hover:text-white"><FileEdit className="w-4 h-4" /></button>
                    )}
                </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SubmitReportForm = () => {
    const [step, setStep] = useState(1);
    const [q3, setQ3] = useState<'Yes' | 'No'>('Yes');
    const [q5, setQ5] = useState<'Yes' | 'No'>('No');
    const [q6, setQ6] = useState<'Yes' | 'No'>('No');
    const [checklist, setChecklist] = useState({ internet: true, power: true, voice: true, lan: true });
    
    const myMdas = mdas.filter(m => user?.assignedMdaIds.includes(m.id) && m.active);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget as HTMLFormElement);
        const mdaId = fd.get('mdaId') as string;
        const mda = mdas.find(m => m.id === mdaId);
        
        const newVisitation: Visitation = {
            id: generateId(), 
            frfId: user!.id, 
            frfName: user!.name, 
            date: fd.get('date') as string, 
            timestamp: Date.now(), 
            mdaId, 
            mdaName: mda?.name || '',
            contactName: fd.get('contactName') as string,
            contactPhone: fd.get('contactPhone') as string,
            visitStartTime: fd.get('startTime') as string,
            visitEndTime: fd.get('endTime') as string,
            wasVisited: q3, 
            reasonNotVisited: q3 === 'No' ? fd.get('reasonNotVisited') as string : undefined, 
            checklist,
            hasIncident: q5, 
            incidentType: q5 === 'Yes' ? fd.get('incidentType') as string : undefined,
            incidentTicket: q5 === 'Yes' ? fd.get('incidentTicket') as string : undefined,
            incidentStatus: q5 === 'Yes' ? 'NO PENDING' : undefined,
            hasRequest: q6, 
            requestType: q6 === 'Yes' ? fd.get('requestType') as string : undefined,
            requestTicket: q6 === 'Yes' ? fd.get('requestTicket') as string : undefined,
            requestStatus: q6 === 'Yes' ? 'NO PENDING' : undefined,
            comments: (fd.get('comments') as string) || "N/A"
        };
        
        setVisitations([...visitations, newVisitation]);
        setActiveTab('history');
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8 animate-in slide-in-from-bottom-6 duration-500">
            <div className="flex items-center justify-between bg-[#011a0e] p-8 rounded-[40px] border border-white/5">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Strategic Intelligence Broadcast</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase mt-1">Capture critical site metrics</p>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`w-10 h-1.5 rounded-full transition-all ${step >= s ? 'bg-emerald-500' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {step === 1 && (
                    <CommandCard title="Sector 1: Site Metadata & Personnel" icon={UserCheck}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4"><label className="text-[9px] font-black text-slate-500 uppercase">1. Authorized Hub Node</label><select name="mdaId" required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl font-black text-white text-xs"><option value="">Select MDA...</option>{myMdas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
                            <div className="space-y-4"><label className="text-[9px] font-black text-slate-500 uppercase">2. Reporting Window</label><input name="date" type="date" required defaultValue={getTodayString()} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl font-black text-white text-xs" /></div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase">3. Site Contact Personnel Met</label>
                                <div className="flex gap-4">
                                    <div className="flex-1 relative"><UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" /><input name="contactName" placeholder="Full Name" className="w-full pl-12 pr-4 py-5 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white" /></div>
                                    <div className="flex-1 relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" /><input name="contactPhone" placeholder="Official Phone" className="w-full pl-12 pr-4 py-5 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white" /></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black text-slate-500 uppercase">4. Operational Duration</label>
                                <div className="flex gap-4">
                                    <div className="flex-1 relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" /><input name="startTime" type="time" className="w-full pl-12 pr-4 py-5 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white" /></div>
                                    <div className="flex-1 relative"><Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" /><input name="endTime" type="time" className="w-full pl-12 pr-4 py-5 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white" /></div>
                                </div>
                            </div>
                        </div>
                        <button type="button" onClick={() => setStep(2)} className="mt-12 w-full py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-3xl">Proceed to Sector 2</button>
                    </CommandCard>
                )}
                {step === 2 && (
                    <CommandCard title="Sector 2: Technical Audit & Logistics" icon={Activity}>
                        <div className="space-y-12">
                            <div className="p-8 bg-black/40 border border-white/10 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="min-w-0 flex-1"><h4 className="text-sm font-black text-white uppercase tracking-tight">Was Hub Visited?</h4><p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Verification required</p></div>
                                <div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQ3(o as any)} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase border transition-all ${q3 === o ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl' : 'bg-white/5 border-white/10 text-slate-500'}`}>{o}</button>))}</div>
                            </div>
                            {q3 === 'No' ? (
                                <div className="p-8 bg-rose-600/5 border border-rose-500/20 rounded-[32px] space-y-4 animate-in zoom-in-95"><label className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Reason for Absence</label><select name="reasonNotVisited" required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl font-black text-white text-xs"><option value="">Select official reason...</option>{REASONS_NOT_VISITED.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 bg-emerald-600/5 border border-emerald-500/10 rounded-[32px] space-y-6">
                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border-b border-emerald-500/10 pb-4">Checklist</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { id: 'internet', icon: Wifi, label: 'Internet OK' },
                                                { id: 'power', icon: Power, label: 'Power OK' },
                                                { id: 'voice', icon: PhoneCall, label: 'Voice OK' },
                                                { id: 'lan', icon: HardDrive, label: 'LAN OK' }
                                            ].map(item => (
                                                <div key={item.id} onClick={() => setChecklist(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof prev] }))} className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col items-center gap-2 ${checklist[item.id as keyof typeof checklist] ? 'bg-emerald-600/10 border-emerald-500/50 text-white' : 'bg-white/5 border-transparent text-slate-700'}`}><item.icon className="w-5 h-5" /><span className="text-[8px] font-black uppercase">{item.label}</span></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[32px] space-y-6"><h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-blue-500/10 pb-4">Observations</h4><textarea name="comments" rows={5} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-xs font-bold text-white outline-none focus:border-blue-500" placeholder="Describe site conditions..." /></div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 mt-12"><button type="button" onClick={() => setStep(1)} className="flex-1 py-6 bg-white/5 text-slate-500 rounded-[24px] font-black uppercase text-xs tracking-widest">Previous</button><button type="button" onClick={() => setStep(3)} className="flex-[2] py-6 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-3xl">Next Sector</button></div>
                    </CommandCard>
                )}
                {step === 3 && (
                    <CommandCard title="Sector 3: Escalations" icon={ShieldAlert}>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-rose-600/5 border border-rose-500/10 rounded-[32px] space-y-8">
                                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Incident?</label><div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQ5(o as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${q5 === o ? 'bg-rose-600 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-slate-600'}`}>{o}</button>))}</div></div>
                                    {q5 === 'Yes' && (<div className="space-y-6 animate-in fade-in"><div className="space-y-2"><label className="text-[8px] font-black text-slate-600 uppercase">Nature</label><select name="incidentType" required className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-black text-white text-xs"><option value="">Select...</option>{INCIDENT_TYPES.map(i => <option key={i} value={i}>{i}</option>)}</select></div><div className="space-y-2"><label className="text-[8px] font-black text-slate-600 uppercase">Ticket</label><input name="incidentTicket" placeholder="INCT-..." className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-black text-white text-xs uppercase" /></div></div>)}
                                </div>
                                <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[32px] space-y-8">
                                    <div className="flex justify-between items-center"><label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Request?</label><div className="flex gap-2">{['Yes', 'No'].map(o => (<button key={o} type="button" onClick={() => setQ6(o as any)} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${q6 === o ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-600'}`}>{o}</button>))}</div></div>
                                    {q6 === 'Yes' && (<div className="space-y-6 animate-in fade-in"><div className="space-y-2"><label className="text-[8px] font-black text-slate-600 uppercase">Type</label><select name="requestType" required className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-black text-white text-xs"><option value="">Select...</option>{REQUEST_TYPES.map(r => <option key={r} value={r}>{r}</option>)}</select></div><div className="space-y-2"><label className="text-[8px] font-black text-slate-600 uppercase">Ticket</label><input name="requestTicket" placeholder="REQT-..." className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-black text-white text-xs uppercase" /></div></div>)}
                                </div>
                            </div>
                            <div className="pt-8"><button type="submit" className="w-full py-8 bg-emerald-600 text-white rounded-[32px] font-black uppercase text-sm tracking-[0.3em] shadow-3xl">Broadcast Intelligence</button></div>
                        </div>
                    </CommandCard>
                )}
            </form>
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
          {(user?.role === 'ADMIN' || user?.role === 'HEAD_OF_CSS') && (
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
        <div className="p-6 mt-auto"><button onClick={handleLogout} className="w-full py-4 bg-rose-600/10 text-rose-500 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 border border-rose-500/20 hover:bg-rose-600 transition-all"><LogOut className="w-4 h-4" /> Shutdown Session</button></div>
      </div>
    </>
  );

  const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}><Icon className="w-4.5 h-4.5" /> <span>{label}</span></button>
  );

  const MissionControlDashboard = () => {
    const isFRF = user?.role === 'FRF';
    const canManage = user?.role === 'ADMIN' || user?.role === 'HEAD_OF_CSS';
    const feedData = isFRF ? visitations.filter(v => v.frfId === user.id) : visitations;

    return (
      <div className="space-y-12 animate-in fade-in duration-700">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {canManage ? (
                <>
                  <StatPanel label="Authorized Nodes" value={mdas.length} icon={Building2} color="bg-emerald-600" />
                  <StatPanel label="System Telemetry" value={stats.totalVisits} icon={History} color="bg-blue-600" />
                  <StatPanel label="Critical Alerts" value={stats.incidents.total} icon={AlertTriangle} color="bg-rose-600" />
                  <StatPanel label="Respondent Force" value={stats.totalFrfs} icon={Users} color="bg-amber-500" />
                </>
              ) : (
                <>
                  <StatPanel label="My Tactical Hubs" value={user?.assignedMdaIds.length || 0} icon={Building2} color="bg-emerald-600" />
                  <StatPanel label="My Deployments" value={stats.totalVisits} icon={History} color="bg-blue-600" />
                  <StatPanel label="Active Field Alerts" value={stats.activeIncidents} icon={AlertTriangle} color="bg-rose-600" />
                  <StatPanel label="Success Rate" value={`${stats.incidents.rate}%`} icon={CheckCircle2} color="bg-amber-500" />
                </>
              )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CommandCard title={canManage ? "Strategic Command Console" : "Respondent Command Console"} icon={Settings2}>
                  <div className="grid grid-cols-2 gap-4">
                      {canManage ? (
                          <>
                              <button onClick={() => setActiveTab('mdas')} className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all group shadow-sm"><Building2 className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Nodes Matrix</span></button>
                              <button onClick={() => setActiveTab('users')} className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-blue-600 hover:text-white transition-all group shadow-sm"><Users className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Personnel Auth</span></button>
                              <button onClick={() => setActiveTab('reports')} className="p-6 bg-amber-600/10 border border-amber-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-amber-600 hover:text-white transition-all group shadow-sm"><PieChart className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Intelligence Hub</span></button>
                              <button onClick={() => setActiveTab('history')} className="p-6 bg-rose-600/10 border border-rose-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-rose-600 hover:text-white transition-all group shadow-sm"><History className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Tactical Vault</span></button>
                          </>
                      ) : (
                          <>
                              <button onClick={() => setActiveTab('submit')} className="p-6 bg-emerald-600/10 border border-emerald-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-emerald-600 hover:text-white transition-all group shadow-sm"><Plus className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Initiate Deployment</span></button>
                              <button onClick={() => setActiveTab('history')} className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex flex-col items-center gap-3 hover:bg-blue-600 hover:text-white transition-all group shadow-sm"><History className="w-8 h-8" /><span className="text-[10px] font-black uppercase text-center">Review Archive</span></button>
                          </>
                      )}
                  </div>
              </CommandCard>
              <CommandCard title={isFRF ? "My Recent Deployments" : "Tactical Feed Summary"} icon={ActivitySquare}>
                  <div className="space-y-3">
                      {feedData.slice(-5).reverse().map(v => (
                          <div key={v.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center transition-all hover:bg-white/5">
                              <div className="min-w-0"><p className="text-[10px] font-black text-white uppercase truncate">{v.mdaName}</p><p className="text-[8px] text-emerald-500 font-bold uppercase mt-0.5">{isFRF ? new Date(v.date).toLocaleDateString() : v.frfName}</p></div>
                              <Badge variant={v.hasIncident === 'Yes' ? 'error' : 'success'} size="sm">{v.hasIncident === 'Yes' ? 'Violation' : 'Secure'}</Badge>
                          </div>
                      ))}
                  </div>
              </CommandCard>
          </div>
      </div>
    );
  };

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
    <div className="min-h-screen bg-[#010a06] flex items-center justify-center p-8 relative overflow-hidden">
      <div className="max-w-md w-full z-10 space-y-6 animate-in slide-in-from-bottom-12 duration-700">
        <div className="bg-[#011a0e] rounded-[60px] p-12 border border-white/10 text-center shadow-3xl">
          <div className="w-16 h-16 bg-emerald-600/10 border border-emerald-500/20 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner"><Fingerprint className="w-8 h-8 text-emerald-500" /></div>
          <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tight">Personnel Authentication</h2>
          <form onSubmit={e => { e.preventDefault(); handleLogin(loginEmail, loginPassword); }} className="space-y-4">
            <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} name="email" type="email" placeholder="Official Email" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" required />
            <input value={loginPassword} onChange={e => setLoginPassword(e.target.value)} name="password" type="password" placeholder="Password" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl font-bold text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" required />
            <button className="w-full bg-emerald-600 py-4 rounded-2xl font-black text-white uppercase tracking-widest text-[10px] shadow-3xl hover:bg-emerald-500 transition-all active:scale-[0.98]">Authorize Entry</button>
          </form>
        </div>
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
          {activeTab === 'dashboard' && <MissionControlDashboard />}
          {activeTab === 'mdas' && <MDARegistry />}
          {activeTab === 'users' && <PersonnelRegistry />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'submit' && <SubmitReportForm />}
          {activeTab === 'history' && <HistoryView />}
        </div>
      </main>

      {/* Management Modals */}
      <Modal isOpen={isAssignMdaOpen} onClose={() => { setIsAssignMdaOpen(false); setMgmtUser(null); }} title={`Tactical Node Mapping: ${mgmtUser?.name}`}>
          <div className="p-10 space-y-6">
              {/* FIXED: Live lookup to prevent stale UI state */}
              {(() => {
                const liveUser = users.find(u => u.id === mgmtUser?.id);
                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/40 rounded-3xl border border-white/5">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                        <input value={mdaAssignSearch} onChange={e => setMdaAssignSearch(e.target.value)} placeholder="Filter Nodes..." className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase outline-none focus:border-emerald-500/50" />
                      </div>
                      <select value={mdaAssignCategory} onChange={e => setMdaAssignCategory(e.target.value)} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white uppercase outline-none appearance-none cursor-pointer"><option value="ALL">All Categories</option><option value="Ministry">Ministries</option><option value="Agency">Agencies</option></select>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                        {filteredMdasForAssignment.map(m => {
                          const isAssigned = liveUser?.assignedMdaIds.includes(m.id);
                          return (
                            <div key={m.id} onClick={() => mgmtUser && handleToggleMdaAssign(mgmtUser.id, m.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${isAssigned ? 'bg-emerald-600/20 border-emerald-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                              <div className="min-w-0 pr-4"><p className={`text-[10px] font-black uppercase truncate ${isAssigned ? 'text-emerald-400' : 'text-white'}`}>{m.name}</p><p className="text-[7px] text-slate-600 font-bold uppercase mt-0.5">{m.category} • {m.active ? 'Active' : 'Offline'}</p></div>
                              {isAssigned ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-emerald-500 transition-colors" />}
                            </div>
                          );
                        })}
                    </div>
                  </>
                );
              })()}
              <button onClick={() => { setIsAssignMdaOpen(false); setMgmtUser(null); }} className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Finalize Strategy Mapping</button>
          </div>
      </Modal>

      <Modal isOpen={isUserEditorOpen} onClose={() => { setIsUserEditorOpen(false); setMgmtUser(null); }} title={mgmtUser ? "Update Access Profile" : "Provision New Access"}>
          <form onSubmit={handleSaveUser} className="p-10 space-y-8">
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Personnel Name</label><input name="name" defaultValue={mgmtUser?.name} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Secure Email</label><input name="email" type="email" defaultValue={mgmtUser?.email} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs" /></div>
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Strategic Role</label><select name="role" defaultValue={mgmtUser?.role || 'FRF'} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs"><option value="FRF">FIRST RESPONDENT (FRF)</option><option value="ADMIN">SUPERVISOR (ADMIN)</option><option value="HEAD_OF_CSS">SECTOR HEAD (CSS)</option></select></div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Commit Identity Registry</button>
          </form>
      </Modal>

      <Modal isOpen={isMdaEditorOpen} onClose={() => { setIsMdaEditorOpen(false); setMgmtMda(null); }} title={mgmtMda ? "Configure Node" : "Provision Node"}>
          <form onSubmit={handleSaveMda} className="p-10 space-y-8">
              <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Formal Designation</label><input name="name" defaultValue={mgmtMda?.name} required className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs uppercase" /></div>
              <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-500 uppercase">Category</label><select name="category" defaultValue={mgmtMda?.category || 'Ministry'} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-white text-xs"><option value="Ministry">Ministry</option><option value="Agency">Agency</option><option value="Corporation">Corporation</option><option value="Commission">Commission</option></select></div>
                  <div className="flex flex-col items-center justify-center p-5 bg-black/40 border border-white/10 rounded-2xl"><label className="text-[10px] font-black text-slate-500 uppercase mb-3">Node Online</label><input type="checkbox" name="active" defaultChecked={mgmtMda?.active ?? true} className="w-6 h-6 accent-emerald-500" /></div>
              </div>
              <button type="submit" className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black uppercase text-xs shadow-3xl hover:bg-emerald-500">Sync Node Registry</button>
          </form>
      </Modal>

      <Modal isOpen={isEditTicketModalOpen} onClose={() => setIsEditTicketModalOpen(false)} title="Intelligence Sync">
          <form onSubmit={handleUpdateTickets} className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-rose-500/5 p-6 rounded-3xl border border-rose-500/10 space-y-4">
                    <p className="text-[10px] font-black text-rose-400 uppercase border-b border-rose-500/10 pb-4">Incident Log</p>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Ticket ID</label><input name="incidentTicket" defaultValue={activeEditRecord?.incidentTicket} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Status</label><select name="incidentStatus" defaultValue={activeEditRecord?.incidentStatus || 'NO PENDING'} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs uppercase"><option value="NO PENDING">NO PENDING</option><option value="YES RESOLVED">YES RESOLVED</option><option value="PROCESSING">PROCESSING</option></select></div>
                </div>
                <div className="bg-blue-500/5 p-6 rounded-3xl border border-blue-500/10 space-y-4">
                    <p className="text-[10px] font-black text-blue-400 uppercase border-b border-blue-500/10 pb-4">Request Log</p>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Ticket ID</label><input name="requestTicket" defaultValue={activeEditRecord?.requestTicket} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs" /></div>
                    <div className="space-y-2"><label className="text-[9px] font-black text-slate-500 uppercase">Status</label><select name="requestStatus" defaultValue={activeEditRecord?.requestStatus || 'NO PENDING'} className="w-full p-4 bg-black/40 border border-white/10 rounded-xl font-bold text-white text-xs uppercase"><option value="NO PENDING">NO PENDING</option><option value="YES GRANTED">YES GRANTED</option><option value="PROCESSING">PROCESSING</option></select></div>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-emerald-500">Finalize Synchronization</button>
          </form>
      </Modal>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<FRFSystem />);
