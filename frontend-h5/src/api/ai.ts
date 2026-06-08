import { apiGet, apiPost } from '@/utils/http'

const AI_TIMEOUT_MS = 120_000

export type AiHelpOut = {
  answer: string
  sources: Array<{ source: string; title: string; snippet?: string }>
}

export type AiChatOut = {
  conversation_id: number
  reply: string
}

export type AlertItem = {
  id: number
  level: string
  title: string
  summary?: string
}

export type AiBriefOut = {
  mode: string
  content: string
  data?: Record<string, unknown>
}

export function reportAiCheck(data: {
  task_id: number
  result_type: string
  remark?: string
  good_qty?: number
  bad_qty?: number
}) {
  return apiPost<{ ok: boolean; hints: string[]; suggest_remark?: string; reply?: string }>(
    '/h5/ai/report/check',
    data,
    { timeout: 60_000 },
  )
}

export function aiHelp(question: string) {
  return apiPost<AiHelpOut>('/h5/ai/help', { question }, { timeout: AI_TIMEOUT_MS })
}

export function aiChat(data: { message: string; conversation_id?: number; model_code?: string }) {
  return apiPost<AiChatOut>(
    '/h5/ai/chat',
    { scene: 'boss_qa', ...data },
    { timeout: AI_TIMEOUT_MS },
  )
}

export function getAiBrief() {
  return apiGet<AiBriefOut>('/h5/ai/brief', { timeout: AI_TIMEOUT_MS })
}

export function listAiAlerts() {
  return apiGet<{ items: AlertItem[] }>('/h5/ai/alerts', { timeout: 30_000 })
}

export function runAiAlerts() {
  return apiPost<{ events: number; notified: number }>('/h5/ai/alerts/run', undefined, { timeout: AI_TIMEOUT_MS })
}

export function listAiModels() {
  return apiGet<{ items: Array<{ code: string; display_name: string; is_default: boolean }> }>('/h5/ai/models')
}

export function listAiConversations(scene = 'boss_qa') {
  return apiGet<{ items: Array<{ id: number; title: string | null; updated_at: string }> }>(
    '/h5/ai/conversations',
    { params: { scene } },
  )
}

export function deleteAiConversation(id: number) {
  return apiPost<{ ok: boolean }>(`/h5/ai/conversations/${id}/delete`, {})
}
