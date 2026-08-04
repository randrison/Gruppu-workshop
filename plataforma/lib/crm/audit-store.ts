"use client";

export type AuditLog = { id: string; actor: string; action: string; entity: string; details: string; createdAt: string };
const auditKey = "gruppu.crm.audit.v2";
const auditEvent = "gruppu:audit-updated";

export function readAuditLogs(): AuditLog[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(auditKey) || "[]") as AuditLog[]; } catch { return []; }
}

export function recordAuditLog(input: Omit<AuditLog, "id" | "actor" | "createdAt"> & { actor?: string }) {
  if (typeof window === "undefined") return;
  const log: AuditLog = { ...input, id: crypto.randomUUID(), actor: input.actor || "Administrador local", createdAt: new Date().toISOString() };
  window.localStorage.setItem(auditKey, JSON.stringify([log, ...readAuditLogs()].slice(0, 500)));
  window.dispatchEvent(new CustomEvent(auditEvent));
}

export function subscribeAuditLogs(callback: () => void) {
  window.addEventListener(auditEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(auditEvent, callback); window.removeEventListener("storage", callback); };
}
