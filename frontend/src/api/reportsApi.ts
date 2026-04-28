import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000'

const reportsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

reportsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ReportSeverity = 'Low' | 'Medium' | 'High' | 'Critical'
export type ReportStatus = 'open' | 'in progress' | 'resolved'

export type AnalyzeReportRequest = {
  projectName: string
  environment: string
  rawDescription: string
  saveToDb?: boolean
}

export type BugReport = {
  id: number
  projectName?: string
  title: string
  severity: ReportSeverity
  category?: string
  stepsToReproduce?: string[]
  expectedResult?: string
  actualResult?: string
  technicalNotes?: string
  suggestedFix?: string
  status: ReportStatus
  createdAt?: string
}

export type AnalyzeReportResponse = Omit<BugReport, 'id' | 'status'> & {
  id?: number
  status?: ReportStatus
}

export async function analyzeBugReport(payload: AnalyzeReportRequest) {
  const response = await reportsApi.post<AnalyzeReportResponse>('/api/reports/analyze', payload)
  return response.data
}

export async function getReports() {
  const response = await reportsApi.get<BugReport[]>('/api/reports')
  return response.data
}

export async function getReportById(id: number) {
  const response = await reportsApi.get<BugReport>(`/api/reports/${id}`)
  return response.data
}

export async function updateReportStatus(id: number, status: ReportStatus) {
  const response = await reportsApi.patch<BugReport>(`/api/reports/${id}/status`, { status })
  return response.data
}

export async function deleteReport(id: number) {
  const response = await reportsApi.delete<{ message: string, deletedId: number }>(`/api/reports/${id}`)
  return response.data
}
