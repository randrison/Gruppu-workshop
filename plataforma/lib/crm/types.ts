export type LeadStatus = "Novo" | "Contatado" | "Qualificado" | "Cliente" | "Não compareceu";

export type LeadAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
};

export type LeadActivity = {
  id: string;
  type: "Ligação" | "WhatsApp" | "E-mail" | "Reunião" | "Observação";
  title: string;
  description: string;
  occurredAt: string;
};

export type LeadProposal = {
  id: string;
  title: string;
  amount: number;
  description: string;
  createdAt: string;
  status: "Rascunho" | "Enviada" | "Aceita" | "Recusada";
};

export type CrmLead = {
  id: string;
  name: string;
  initials: string;
  phone: string;
  email: string;
  revenue: string;
  goal: string;
  source: string;
  registeredAt: string;
  status: LeadStatus;
  workshop: string;
  score: number;
  potential: string;
  createdAt?: string;
  groupClickedAt?: string;
  consentEmail?: boolean;
  consentWhatsapp?: boolean;
  attribution?: LeadAttribution;
  notes?: string[];
  activities?: LeadActivity[];
  proposals?: LeadProposal[];
};

export type CaptureLeadInput = {
  name: string;
  phone: string;
  email: string;
  revenue: string;
  goals: string[];
  consentEmail: boolean;
  consentWhatsapp: boolean;
  consentPrivacy: boolean;
  attribution: LeadAttribution;
};
