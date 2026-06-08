import { http } from '@/utils/http'
import { getToken } from '@/utils/token'
import { i18n } from '@/locales'

/** AI 调用走大模型，需长于普通接口默认 20s */
const AI_TIMEOUT_MS = 120_000
const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export type AiChatReply = {
  conversation_id: number
  reply: string
  structured?: Record<string, unknown>
}

export type PlanAnalyzeOut = AiChatReply & {
  risk_level?: string
  summary?: string
  risks?: string[]
  suggestions?: string[]
}

export type PlanScheduleOut = AiChatReply & {
  suggest_mode?: string
  suggest_start_date?: string | null
  suggest_end_date?: string | null
  suggest_work_days?: number | null
  dispatch_hints?: string[]
  overload_warnings?: string[]
}

export type PlanOptimizeOut = {
  ok?: boolean
  solver?: string
  suggest_mode?: string
  suggest_start_date?: string | null
  suggest_end_date?: string | null
  suggest_work_days?: number | null
  total_minutes?: number
  notes?: string[]
  error?: string
}

export type AuditSummaryOut = AiChatReply & {
  high_risk_ids?: number[]
  summary?: string
  risk_points?: string[]
  suggest_actions?: string[]
  pending_count?: number
}

export type AlertSettingsOut = {
  pending_audit: number
  yield_drop_delta: number
  pending_tasks: number
  unassigned_sample_min: number
}

export type AiGatewaySettingsOut = {
  enabled: boolean
  base_url: string
  api_key_configured: boolean
  api_key_masked: string
  model_id: string
  timeout_seconds: number
}

export type AiHelpOut = {
  answer: string
  sources: Array<{ source: string; title: string; snippet: string; score?: number }>
}

export type AiBriefOut = {
  mode: string
  content: string
  data?: Record<string, unknown>
}

export type PlanForecastOut = {
  plan_id: number
  order_id: number
  due_date: string | null
  days_left: number | null
  due_risk: 'green' | 'yellow' | 'red' | string
  remaining_tasks: number
  avg_daily_output_7d: number
  kitting_ok: boolean
  shortage_count: number
  notes?: string[]
}

export type PlanApsStrategyItem = {
  key: string
  title: string
  score: number
  pros?: string[]
  cons?: string[]
  enabled?: boolean
  suggest_start?: string | null
  suggest_end?: string | null
  solver?: string
}

export type PlanApsStrategyOut = {
  plan_id: number
  forecast: PlanForecastOut
  optimizer?: Record<string, unknown>
  strategies: PlanApsStrategyItem[]
  recommended: string
  llm_summary?: string | null
}

function parseSseBlock(block: string): { event: string; data: string } | null {
  let event = 'message'
  let data = ''
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim()
    else if (line.startsWith('data:')) data += line.slice(5).trim()
  }
  if (!data) return null
  return { event, data }
}

export const aiApi = {
  chat(data: { scene?: string; message: string; conversation_id?: number }) {
    return http.request<AiChatReply>({
      url: '/admin/ai/chat',
      method: 'POST',
      data: { scene: 'boss_qa', ...data },
      timeout: AI_TIMEOUT_MS,
    })
  },
  async chatStream(
    data: { message: string; conversation_id?: number; model_code?: string },
    onDelta: (text: string) => void,
  ): Promise<AiChatReply> {
    const token = getToken()
    const resp = await fetch(`${API_BASE}/admin/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-LightMes-Portal': 'admin',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ scene: 'boss_qa', ...data }),
    })
    if (!resp.ok) {
      let detail = i18n.global.t('api.ai.unavailable')
      try {
        const j = await resp.json()
        if (typeof j.detail === 'string') detail = j.detail
      } catch {
        /* ignore */
      }
      throw new Error(detail)
    }
    const reader = resp.body?.getReader()
    if (!reader) throw new Error(i18n.global.t('api.ai.browserNotSupported'))
    const decoder = new TextDecoder()
    let buf = ''
    let result: AiChatReply = { conversation_id: 0, reply: '' }
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const parts = buf.split('\n\n')
      buf = parts.pop() || ''
      for (const part of parts) {
        const parsed = parseSseBlock(part.trim())
        if (!parsed) continue
        if (parsed.event === 'delta') {
          const j = JSON.parse(parsed.data) as { text?: string }
          if (j.text) onDelta(j.text)
        } else if (parsed.event === 'done') {
          result = JSON.parse(parsed.data) as AiChatReply
        } else if (parsed.event === 'error') {
          const j = JSON.parse(parsed.data) as { message?: string }
          throw new Error(j.message || i18n.global.t('api.ai.serviceError'))
        }
      }
    }
    if (!result.reply && !result.conversation_id) throw new Error(i18n.global.t('api.ai.incompleteResult'))
    return result
  },
  help(question: string) {
    return http.request<AiHelpOut>({
      url: '/admin/ai/help',
      method: 'POST',
      data: { question },
      timeout: AI_TIMEOUT_MS,
    })
  },
  getGatewaySettings() {
    return http.request<AiGatewaySettingsOut>({ url: '/admin/ai/gateway-settings', method: 'GET' })
  },
  saveGatewaySettings(data: Partial<AiGatewaySettingsOut & { api_key?: string }>) {
    return http.request<AiGatewaySettingsOut>({ url: '/admin/ai/gateway-settings', method: 'PUT', data })
  },
  planAnalyze(planId: number) {
    return http.request<PlanAnalyzeOut>({
      url: `/admin/ai/plan/${planId}/analyze`,
      method: 'POST',
      timeout: AI_TIMEOUT_MS,
    })
  },
  planScheduleSuggest(planId: number) {
    return http.request<PlanScheduleOut>({
      url: `/admin/ai/plan/${planId}/schedule-suggest`,
      method: 'POST',
      timeout: AI_TIMEOUT_MS,
    })
  },
  planScheduleOptimize(planId: number) {
    return http.request<PlanOptimizeOut>({
      url: `/admin/ai/plan/${planId}/schedule-optimize`,
      method: 'POST',
      timeout: AI_TIMEOUT_MS,
    })
  },
  planScheduleApply(
    planId: number,
    data?: {
      mode?: string
      user_ids?: number[]
      unassigned_only?: boolean
      auto_release?: boolean
      allow_shortage?: boolean
      start_date?: string
      end_date?: string
      work_days?: number
    },
  ) {
    return http.request<Record<string, unknown>>({
      url: `/admin/ai/plan/${planId}/schedule-apply`,
      method: 'POST',
      data: data || { mode: 'backward', unassigned_only: true },
      timeout: AI_TIMEOUT_MS,
    })
  },
  listAlerts() {
    return http.request<{ items: Array<{ id: number; rule_code: string; level: string; title: string; summary?: string; created_at?: string }> }>({
      url: '/admin/ai/alerts',
      method: 'GET',
    })
  },
  runAlerts() {
    return http.request<{ events: number; notified: number }>({ url: '/admin/ai/alerts/run', method: 'POST' })
  },
  getAlertSettings() {
    return http.request<AlertSettingsOut>({ url: '/admin/ai/alert-settings', method: 'GET' })
  },
  saveAlertSettings(data: Partial<AlertSettingsOut>) {
    return http.request<AlertSettingsOut>({ url: '/admin/ai/alert-settings', method: 'PUT', data })
  },
  auditSummary(status = 'submitted') {
    return http.request<AuditSummaryOut>({
      url: '/admin/ai/audit/summary',
      method: 'POST',
      params: { status },
      timeout: AI_TIMEOUT_MS,
    })
  },
  reportVision(unitId: number) {
    return http.request<Record<string, unknown>>({
      url: `/admin/ai/report-units/${unitId}/vision`,
      method: 'POST',
      timeout: AI_TIMEOUT_MS,
    })
  },
  deepOverview() {
    return http.request<Record<string, unknown>>({ url: '/admin/ai/deep/overview', method: 'GET', timeout: AI_TIMEOUT_MS })
  },
  stats(days = 30) {
    return http.request<{
      total_calls: number
      tokens_in: number
      tokens_out: number
      by_scene: Array<{ scene: string; calls: number; tokens_in: number; tokens_out: number }>
      daily: Array<{ date: string; calls: number; tokens_in: number; tokens_out: number }>
    }>({ url: '/admin/ai/stats', method: 'GET', params: { days } })
  },
  listModels() {
    return http.request<{ items: Array<{ code: string; display_name: string; is_default: boolean }> }>({
      url: '/admin/ai/models',
      method: 'GET',
    })
  },
  getPromptSettings() {
    return http.request<{ prompt: string; max_length: number }>({ url: '/admin/ai/prompt-settings', method: 'GET' })
  },
  savePromptSettings(data: { prompt?: string }) {
    return http.request<{ prompt: string; max_length: number }>({ url: '/admin/ai/prompt-settings', method: 'PUT', data })
  },
  listConversations(scene = 'boss_qa') {
    return http.request<{ items: Array<{ id: number; title: string | null; updated_at: string }> }>({
      url: '/admin/ai/conversations',
      method: 'GET',
      params: { scene },
    })
  },
  deleteConversation(id: number) {
    return http.request<{ ok: boolean }>({ url: `/admin/ai/conversations/${id}`, method: 'DELETE' })
  },
  getAiBrief() {
    return http.request<AiBriefOut>({ url: '/admin/ai/brief', method: 'GET', timeout: AI_TIMEOUT_MS })
  },
  getPlanForecast(planId: number) {
    return http.request<PlanForecastOut>({ url: `/admin/plans/${planId}/forecast`, method: 'GET' })
  },
  getPlanApsStrategy(planId: number) {
    return http.request<PlanApsStrategyOut>({
      url: `/admin/plans/${planId}/aps-strategy`,
      method: 'GET',
      timeout: AI_TIMEOUT_MS,
    })
  },
}
