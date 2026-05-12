import { SITE } from "@/config/site";

// Generic fetch wrapper — adds base URL, JSON headers, error handling.
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${SITE.apiBase}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

// ── Types (mirror backend Pydantic schemas) ──

export interface Social {
  label: string;
  href: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio_short: string;
  bio_long: string;
  location: string;
  socials: Social[];
  currently: string;
  next: string;
}

export interface Project {
  slug: string;
  title: string;
  year: number;
  type: string;
  role: string;
  summary: string;
  cover: string;
  gallery: string[];
  content: Array<{ type: string; value?: string; src?: string; caption?: string }>;
  tags: string[];
  link_live: string | null;
  link_repo: string | null;
  video_url: string | null;
}

export interface TimelineItem {
  id: number;
  year: number;
  title: string;
  description: string;
  category: "work" | "life" | "award";
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ── API calls ──

export const getProfile  = ()          => request<Profile>("/profile");
export const getProjects = ()          => request<Project[]>("/projects");
export const getProject  = (slug: string) => request<Project>(`/projects/${slug}`);
export const getTimeline = ()          => request<TimelineItem[]>("/timeline");
export const postContact = (body: ContactPayload) =>
  request<{ ok: boolean }>("/contact", { method: "POST", body: JSON.stringify(body) });
