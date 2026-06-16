import { http } from '@/utils/http'
import type { ListResp } from '@/types/api'

export type MoldType = 'injection' | 'die_casting' | 'stamping'
export const MOLD_TYPES: Record<MoldType, string> = { injection: '注塑', die_casting: '压铸', stamping: '冲压' }
export const MOLD_STATUS_TAGS: Record<string, string> = { active: 'success', repair: 'warning', retired: 'info' }
export const MOLD_STATUS_LABELS: Record<string, string> = { active: '正常', repair: '维修中', retired: '已退役' }

export type MoldOut = {
  id: number; tenant_id: number; code: string; name: string
  model: string | null; mold_type: string; workshop: string | null
  status: string; sku_id: number | null; sku_code: string | null; sku_name: string | null
  expected_lifespan: number | null; current_shots: number
  purchase_date: string | null; last_maintenance_date: string | null
  next_maintenance_date: string | null; maintenance_interval_shots: number | null
  remark: string | null; created_at: string; updated_at: string
}

export type MoldMaintenanceLog = {
  id: number; maintenance_type: string; description: string | null
  shots_at_maintenance: number | null; checked_by: number; created_at: string
}

export type ProcessBinding = {
  id: number; process_id: number; process_name: string | null
}

function lifePercent(m: MoldOut): number {
  if (!m.expected_lifespan || m.expected_lifespan <= 0) return 0
  return Math.round((m.current_shots / m.expected_lifespan) * 100)
}

function lifeTag(pct: number): string {
  if (pct >= 95) return 'danger'
  if (pct >= 80) return 'warning'
  return 'success'
}

export const moldApi = {
  list(params?: { mold_type?: string; status?: string }) {
    return http.request<ListResp<MoldOut>>({ url: '/admin/mold', method: 'GET', params })
  },
  create(data: Record<string, unknown>) {
    return http.request<{ id: number; code: string; name: string }>({ url: '/admin/mold', method: 'POST', data })
  },
  get(id: number) {
    return http.request<MoldOut>({ url: `/admin/mold/${id}`, method: 'GET' })
  },
  update(id: number, data: Record<string, unknown>) {
    return http.request<MoldOut>({ url: `/admin/mold/${id}`, method: 'PUT', data })
  },
  delete(id: number) {
    return http.request<{ deleted: boolean }>({ url: `/admin/mold/${id}`, method: 'DELETE' })
  },
  listMaintenanceLogs(moldId: number, params?: { offset?: number; limit?: number }) {
    return http.request<ListResp<MoldMaintenanceLog>>({ url: `/admin/mold/${moldId}/maintenance-logs`, method: 'GET', params })
  },
  createMaintenanceLog(moldId: number, data: { maintenance_type: string; description?: string }) {
    return http.request<{ id: number; maintenance_type: string }>({ url: `/admin/mold/${moldId}/maintenance-logs`, method: 'POST', data })
  },
  listProcessBindings(moldId: number) {
    return http.request<ListResp<ProcessBinding>>({ url: `/admin/mold/${moldId}/process-bindings`, method: 'GET' })
  },
  setProcessBindings(moldId: number, process_ids: number[]) {
    return http.request<{ count: number }>({ url: `/admin/mold/${moldId}/process-bindings`, method: 'PUT', data: { process_ids } })
  },
}

export { lifePercent, lifeTag }
