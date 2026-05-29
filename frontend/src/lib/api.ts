export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api/v1'

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `HTTP ${res.status}`)
  }
  return res.json()
}

export interface ApiArchive {
  id: number
  code: string
  category: string
  title: string
  status: string
  threatLevel: string | null
  threatLevelColor: string | null
  archiveDate: string | null
  sourceDepartment: { id: number; code: string; name: string } | null
  responsibleDepartment: { id: number; code: string; name: string } | null
  leadPerson: { id: number; name: string; code: string } | null
  accessLevel: string | null
  description: string | null
  mainDangers: string[]
  details: Record<string, unknown>
  finalReview: string | null
  reviewStatus: string
  remarks: string | null
  imagePath: string | null
  sourceText: string | null
  attachmentText: string | null
  videoPath: string | null
  useCustomTemplate: boolean
  customTemplate: string | null
  createdAt: string
  lastUpdate: string
  _count?: { relationsFrom: number; signatures: number }
}

export interface ApiArchiveDetail extends ApiArchive {
  sourceDepartment: { id: number; code: string; name: string; nameEn: string | null; type: string | null; description: string | null } | null
  responsibleDepartment: { id: number; code: string; name: string; nameEn: string | null; type: string | null; description: string | null } | null
  leadPerson: { id: number; name: string; code: string; title: string | null; codename: string | null } | null
  signatures: {
    id: number
    position: string
    name: string
    esigCode: string | null
    signedDate: string | null
    note: string | null
    personnel: { id: number; name: string; code: string } | null
  }[]
  relationsFrom: {
    id: number
    relationType: string
    relatedArchive: { id: number; code: string; title: string; category: string }
  }[]
  history: {
    id: number
    changeType: string
    fieldName: string | null
    oldValue: string | null
    newValue: string | null
    changedAt: string
    changedBy: { id: number; name: string; code: string } | null
  }[]
}

export interface ApiPersonnel {
  id: number
  code: string
  name: string
  nameEn: string | null
  title: string | null
  codename: string | null
  department: { id: number; code: string; name: string } | null
  position: string | null
  status: string
  specialty: string | null
  clearanceLevel: number
  esigCode: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiDepartment {
  id: number
  code: string
  name: string
  nameEn: string | null
  type: string | null
  description: string | null
  leader: { id: number; name: string; code: string } | null
  siteLocation: string | null
  internalChannel: string | null
  createdAt: string
  updatedAt: string
  _count?: { personnel: number }
}

export interface ApiStatsOverview {
  overview: {
    totalArchives: number
    totalPersonnel: number
    totalDepartments: number
    activeArchives: number
    sealedArchives: number
    archivedArchives: number
  }
  archivesByCategory: { category: string; count: number }[]
  archivesByThreatLevel: { threatLevel: string | null; count: number }[]
  personnelByDepartment: { departmentId: number | null; count: number }[]
  personnelByStatus: { status: string; count: number }[]
}

export interface ListMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ListResponse<T> {
  data: T[]
  meta: ListMeta
}

export interface ApiNewsBulletin {
  id: number
  code: string
  title: string
  summary: string | null
  content: string | null
  category: string
  priority: string
  featured: boolean
  imageUrl: string | null
  publishedAt: string
  createdAt: string
}

export interface ApiEquipmentItem {
  id: number
  code: string
  name: string
  subtitle: string | null
  description: string | null
  category: string
  price: number | null
  currency: string | null
  originalPrice: string | null
  stock: number
  status: string
  badge: string | null
  imageUrl: string | null
  createdAt: string
}

export interface ApiReview {
  id: number
  author: string
  content: string
  rating: number
  date: string
  verified: boolean
  createdAt: string
}

export interface ApiSystemAnnouncement {
  id: number
  title: string
  content: string
  type: string
  order: number
  createdAt: string
}

export interface EquipmentListResponse {
  data: ApiEquipmentItem[]
  total: number
  page: number
  limit: number
  categories: { name: string; count: number }[]
}

export interface NewsListResponse {
  data: ApiNewsBulletin[]
  total: number
  page: number
  limit: number
}

export interface CmsStats {
  archives: number
  news: number
  equipment: number
  reviews: number
  reviewsVerified: number
  announcements: number
}

export const api = {
  archives: {
    list: (params?: Record<string, string | number>) =>
      fetchJson<ListResponse<ApiArchive>>(`${API_BASE}/archives?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: number) => fetchJson<ApiArchiveDetail>(`${API_BASE}/archives/${id}`),
    create: (data: Record<string, unknown>) =>
      fetchJson<ApiArchive>(`${API_BASE}/archives`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    update: (id: number, data: Record<string, unknown>) =>
      fetchJson<ApiArchive>(`${API_BASE}/archives/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    delete: (id: number) => fetch(`${API_BASE}/archives/${id}`, { method: 'DELETE' }),
  },
  personnel: {
    list: (params?: Record<string, string | number>) =>
      fetchJson<ApiPersonnel[]>(`${API_BASE}/personnel?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: number) => fetchJson<ApiPersonnel>(`${API_BASE}/personnel/${id}`),
  },
  departments: {
    list: () => fetchJson<ApiDepartment[]>(`${API_BASE}/departments`),
    get: (id: number) => fetchJson<ApiDepartment>(`${API_BASE}/departments/${id}`),
  },
  stats: {
    overview: () => fetchJson<ApiStatsOverview>(`${API_BASE}/stats/overview`),
    archiveTrend: () => fetchJson<Record<string, Record<string, number>>>(`${API_BASE}/stats/archive-trend`),
  },
  news: {
    list: (params?: Record<string, string | number>) =>
      fetchJson<NewsListResponse>(`${API_BASE}/news?${new URLSearchParams(params as Record<string, string>)}`),
    featured: () => fetchJson<ApiNewsBulletin[]>(`${API_BASE}/news/featured`),
    get: (id: number) => fetchJson<ApiNewsBulletin>(`${API_BASE}/news/${id}`),
  },
  equipment: {
    list: (params?: Record<string, string | number>) =>
      fetchJson<EquipmentListResponse>(`${API_BASE}/equipment?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: number) => fetchJson<ApiEquipmentItem>(`${API_BASE}/equipment/${id}`),
  },
  reviews: {
    list: (params?: Record<string, string | number>) =>
      fetchJson<ApiReview[]>(`${API_BASE}/reviews?${new URLSearchParams(params as Record<string, string>)}`),
    get: (id: number) => fetchJson<ApiReview>(`${API_BASE}/reviews/${id}`),
  },
  announcements: {
    list: () => fetchJson<ApiSystemAnnouncement[]>(`${API_BASE}/announcements`),
    get: (id: number) => fetchJson<ApiSystemAnnouncement>(`${API_BASE}/announcements/${id}`),
  },
  cms: {
    stats: () => fetchJson<CmsStats>(`${API_BASE}/cms/stats`),
  },
}
