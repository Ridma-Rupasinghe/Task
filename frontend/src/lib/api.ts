import axios from "axios";

import type {
  AgendaSession,
  ApiSession,
  GenerateInviteRequest,
  GenerateInviteResponse,
} from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export function mapSession(s: ApiSession): AgendaSession {
  return {
    sessionId: s.session_id,
    time: s.time,
    title: s.title,
    speaker: s.speaker,
    focusKeywords: s.focus_keywords,
    description: s.description,
  };
}

export async function fetchAllSessions(): Promise<AgendaSession[]> {
  const res = await api.get<ApiSession[]>("/get-all-sessions");
  return res.data.map(mapSession);
}

export async function fetchSessionsByQuery(
  query: string,
): Promise<AgendaSession[]> {
  const res = await api.get<ApiSession[]>("/sessions", {
    params: { query },
  });
  return res.data.map(mapSession);
}

export async function fetchAllKeywords(): Promise<string[]> {
  const res = await api.get<string[]>("/get-all-keywords");
  return res.data;
}

export async function fetchInvite(payload: GenerateInviteRequest) {
  const res = await api.post<GenerateInviteResponse>(
    "/generate-invite",
    payload,
  );

  return res.data;
}
