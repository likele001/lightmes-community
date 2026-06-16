import { http } from '@/utils/http'

export type AiEmployeeItem = {
  id: number
  name: string
  avatar_url: string | null
  role_desc: string | null
  system_prompt: string
  status: string
  bindchannels: string[] | null
  knowledge_scopes: string[] | null
  enabled_tools: string[] | null
  gateway_override: string | null
  welcome_message: string | null
  created_at: string
  updated_at: string
}

export type AvailableTool = {
  code: string
  description: string
  parameters: Record<string, unknown> | null
}

export type AiEmployeeStats = {
  total_conversations: number
  total_messages: number
  total_tokens: number
  today_conversations: number
  today_messages: number
  tool_call_count: number
}

export type AiEmployeeLog = {
  id: number
  ai_employee_id: number
  action: string
  channel: string | null
  detail: Record<string, unknown> | null
  tokens_used: number | null
  created_at: string
}

export type AiEmployeeConversation = {
  id: number
  ai_employee_id: number
  channel: string
  user_id: number | null
  external_user_id: string | null
  external_user_name: string | null
  title: string | null
  created_at: string
  updated_at: string
}

export function listAiEmployees() {
  return http.get('/admin/ai-employees')
}

export function getAiEmployee(id: number) {
  return http.get(`/admin/ai-employees/${id}`)
}

export function createAiEmployee(data: Partial<AiEmployeeItem>) {
  return http.post('/admin/ai-employees', data)
}

export function updateAiEmployee(id: number, data: Partial<AiEmployeeItem>) {
  return http.put(`/admin/ai-employees/${id}`, data)
}

export function deleteAiEmployee(id: number) {
  return http.delete(`/admin/ai-employees/${id}`)
}

export function toggleAiEmployee(id: number) {
  return http.post(`/admin/ai-employees/${id}/toggle`)
}

export function listAiEmployeeTools(): Promise<AvailableTool[]> {
  return http.get('/admin/ai-employees/tools')
}

export function getAiEmployeeStats(id: number): Promise<AiEmployeeStats> {
  return http.get(`/admin/ai-employees/${id}/stats`)
}

export function listAiEmployeeConversations(id: number, channel?: string): Promise<AiEmployeeConversation[]> {
  return http.get(`/admin/ai-employees/${id}/conversations`, { params: channel ? { channel } : {} })
}

export function listAiEmployeeLogs(id: number, params?: { limit?: number; offset?: number }): Promise<AiEmployeeLog[]> {
  return http.get(`/admin/ai-employees/${id}/logs`, { params })
}
