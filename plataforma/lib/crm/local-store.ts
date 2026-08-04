"use client";

import type { CaptureLeadInput, CrmLead, LeadActivity, LeadProposal, LeadStatus } from "./types";
import { recordAuditLog } from "./audit-store";

// A chave v2 inicia a operação real sem carregar os contatos de demonstração.
const LEADS_KEY = "gruppu.crm.leads.v2";
const LEADS_EVENT = "gruppu:leads-updated";

const goalLabels: Record<string, string> = {
  vendas: "Vender sem promoções",
  cardapio: "Melhorar o cardápio",
  analise: "Participar da análise ao vivo",
};

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `lead-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "LD";
}

function estimateScore(revenue: string, goals: string[]) {
  const revenueScore = revenue.includes("Acima") ? 88 : revenue.includes("100 mil") ? 82 : revenue.includes("50 mil") ? 72 : 58;
  return Math.min(98, revenueScore + Math.max(0, goals.length - 1) * 4);
}

export function readLocalLeads(): CrmLead[] {
  if (typeof window === "undefined") return [];
  try {
    const value = window.localStorage.getItem(LEADS_KEY);
    return value ? JSON.parse(value) as CrmLead[] : [];
  } catch {
    return [];
  }
}

function writeLocalLeads(leads: CrmLead[]) {
  window.localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  window.dispatchEvent(new CustomEvent(LEADS_EVENT));
}

export function createLocalLead(input: CaptureLeadInput): CrmLead {
  const source = input.attribution.source || (input.attribution.landingPage?.includes("calculadora") ? "Calculadora de precificação" : "Página de captura");
  const lead: CrmLead = {
    id: createId(),
    name: input.name.trim(),
    initials: getInitials(input.name),
    phone: input.phone.trim(),
    email: input.email.trim().toLowerCase(),
    revenue: input.revenue,
    goal: input.goals.map((goal) => goalLabels[goal] || goal).join(" · "),
    source,
    registeredAt: "Agora",
    status: "Novo",
    workshop: "Aguardando confirmação",
    score: estimateScore(input.revenue, input.goals),
    potential: "R$ 0/mês",
    createdAt: new Date().toISOString(),
    consentEmail: input.consentEmail,
    consentWhatsapp: input.consentWhatsapp,
    attribution: input.attribution,
    notes: [],
    activities: [],
    proposals: [],
  };
  writeLocalLeads([lead, ...readLocalLeads()]);
  recordAuditLog({ action: "Lead recebido", entity: lead.name, details: `${lead.source} · ${lead.phone}` , actor: "Formulário público" });
  return lead;
}

export function markLocalLeadGroupClick(id: string) {
  const leads = readLocalLeads().map((lead) => lead.id === id ? { ...lead, groupClickedAt: new Date().toISOString() } : lead);
  writeLocalLeads(leads);
}

export function updateLocalLead(id: string, updates: Partial<Pick<CrmLead, "status" | "notes" | "workshop" | "activities" | "proposals" | "potential">>) {
  const leads = readLocalLeads().map((lead) => lead.id === id ? { ...lead, ...updates } : lead);
  writeLocalLeads(leads);
}

export function addLocalLeadActivity(id: string, activity: Omit<LeadActivity, "id">) {
  const lead = findLocalLead(id);
  if (!lead) return;
  const item: LeadActivity = { ...activity, id: createId() };
  updateLocalLead(id, { activities: [item, ...(lead.activities ?? [])] });
  return item;
}

export function deleteLocalLeadActivity(id: string, activityId: string) {
  const lead = findLocalLead(id);
  if (!lead) return;
  updateLocalLead(id, { activities: (lead.activities ?? []).filter((item) => item.id !== activityId) });
}

export function addLocalLeadProposal(id: string, proposal: Omit<LeadProposal, "id" | "createdAt" | "status">) {
  const lead = findLocalLead(id);
  if (!lead) return;
  const item: LeadProposal = { ...proposal, id: createId(), createdAt: new Date().toISOString(), status: "Rascunho" };
  updateLocalLead(id, { proposals: [item, ...(lead.proposals ?? [])] });
  return item;
}

export function findLocalLead(id: string) {
  return readLocalLeads().find((lead) => lead.id === id);
}

export function subscribeToLocalLeads(callback: () => void) {
  window.addEventListener(LEADS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(LEADS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function leadStatusAfterContact(current: LeadStatus): LeadStatus {
  return current === "Novo" ? "Contatado" : current;
}
