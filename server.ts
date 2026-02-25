import express from "express";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// --- Types & Interfaces (Shared with frontend) ---
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

// --- Initial Data ---
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
  { id: 'u5', name: 'Asmau Alkali', email: 'asmau.alkali@galaxybackbone.com.ng', password: 'frf123', role: 'FRF', assignedMdaIds: [] }
];

// --- In-Memory Database ---
let mdas: MDA[] = [...INITIAL_MDAS];
let users: User[] = [...INITIAL_USERS];
let visitations: Visitation[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // MDAs
  app.get("/api/mdas", (req, res) => res.json(mdas));
  app.post("/api/mdas", (req, res) => {
    const mda = req.body;
    const index = mdas.findIndex(m => m.id === mda.id);
    if (index > -1) mdas[index] = mda;
    else mdas.push(mda);
    res.json(mda);
  });
  app.delete("/api/mdas/:id", (req, res) => {
    const { id } = req.params;
    mdas = mdas.filter(m => m.id !== id);
    users = users.map(u => ({ ...u, assignedMdaIds: u.assignedMdaIds.filter(mId => mId !== id) }));
    res.json({ success: true });
  });

  // Users
  app.get("/api/users", (req, res) => res.json(users));
  app.post("/api/users", (req, res) => {
    const user = req.body;
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    res.json(user);
  });
  app.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    users = users.filter(u => u.id !== id);
    res.json({ success: true });
  });

  // Visitations
  app.get("/api/visitations", (req, res) => res.json(visitations));
  app.post("/api/visitations", (req, res) => {
    const visitation = req.body;
    const index = visitations.findIndex(v => v.id === visitation.id);
    if (index > -1) visitations[index] = visitation;
    else visitations.push(visitation);
    res.json(visitation);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
