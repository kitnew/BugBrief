import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const reportsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export type AnalyzeReportRequest = {
  projectName: string
  environment: string
  rawDescription: string
}

export type AnalyzeReportResponse = {
  id?: number
  title: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  category?: string
  stepsToReproduce?: string[]
  expectedResult?: string
  actualResult?: string
  technicalNotes?: string
  suggestedFix?: string
  status?: 'open' | 'in progress' | 'resolved'
}

export async function analyzeBugReport(payload: AnalyzeReportRequest) {
  const response = await reportsApi.post<AnalyzeReportResponse>('/api/reports/analyze', payload)
  return response.data
}
