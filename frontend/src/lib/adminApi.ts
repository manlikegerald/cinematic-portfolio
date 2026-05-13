const BASE = "/api/admin";

function getToken(): string | null {
  return localStorage.getItem("admin_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  return res.json();
}

export const adminApi = {
  login: (password: string) =>
    request<{ token: string }>("POST", "/login", { password }),

  // Projects
  getProjects: () => request<Project[]>("GET", "/projects"),
  createProject: (data: ProjectIn) => request<Project>("POST", "/projects", data),
  updateProject: (id: number, data: ProjectIn) => request<Project>("PUT", `/projects/${id}`, data),
  deleteProject: (id: number) => request<void>("DELETE", `/projects/${id}`),

  // Timeline
  getTimeline: () => request<TimelineEntry[]>("GET", "/timeline"),
  createTimelineEntry: (data: TimelineIn) => request<TimelineEntry>("POST", "/timeline", data),
  updateTimelineEntry: (id: number, data: TimelineIn) =>
    request<TimelineEntry>("PUT", `/timeline/${id}`, data),
  deleteTimelineEntry: (id: number) => request<void>("DELETE", `/timeline/${id}`),

  // Profile
  getProfile: () => request<Profile>("GET", "/profile"),
  updateProfile: (data: ProfileIn) => request<Profile>("PUT", "/profile", data),

  // Upload
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: form,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail ?? "Upload failed");
    }
    return res.json();
  },
};

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ContentBlock {
  type: string;
  value?: string;
  src?: string;
  caption?: string;
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  year: number;
  type: string;
  role: string;
  summary: string;
  cover: string;
  gallery: string[];
  content: ContentBlock[];
  tags: string[];
  link_live: string | null;
  link_repo: string | null;
  video_url: string | null;
}

export interface ProjectIn {
  slug: string;
  title: string;
  year: number;
  type: string;
  role: string;
  summary: string;
  cover: string;
  gallery: string[];
  content: ContentBlock[];
  tags: string[];
  link_live: string | null;
  link_repo: string | null;
  video_url: string | null;
}

export interface TimelineEntry {
  id: number;
  year: number;
  title: string;
  description: string;
  category: "work" | "life" | "award";
}

export interface TimelineIn {
  year: number;
  title: string;
  description: string;
  category: "work" | "life" | "award";
}

export interface Social {
  label: string;
  href: string;
}

export interface Profile {
  id: number;
  name: string;
  tagline: string;
  bio_short: string;
  bio_long: string;
  location: string;
  socials: Social[];
  currently: string;
  next: string;
}

export interface ProfileIn {
  name: string;
  tagline: string;
  bio_short: string;
  bio_long: string;
  location: string;
  socials: Social[];
  currently: string;
  next: string;
}
