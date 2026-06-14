import { http } from '@/utils/http'

export type MrpRunOut = {
  id: number
  code: string
  status: string
  scope: string
  run_at: string
  result_summary: string | null
  error_message: string | null
  created_by: number | null
  created_at: string
}

export type MrpDemandOut = {
  id: number
  run_id: number
  sku_id: number
  sku_code: string | null
  sku_name: string | null
  required_qty: number
  in_stock_qty: number
  on_order_qty: number
  shortage_qty: number
  suggestion: string | null
  remark: string | null
}

export function runMrp(scope = 'all', orderIds?: string) {
  return http.post<MrpRunOut>('/admin/mrp/run', null, { params: { scope, order_ids: orderIds } })
}

export function listMrpRuns(offset = 0, limit = 50) {
  return http.get<MrpRunOut[]>('/admin/mrp/runs', { params: { offset, limit } })
}

export function getMrpRunDetail(runId: number) {
  return http.get<{ run: MrpRunOut; demands: MrpDemandOut[] }>(`/admin/mrp/runs/${runId}`)
}

export function convertMrpToPurchaseOrder(runId: number, supplierId: number) {
  return http.post<{ purchase_order_id: number; code: string }>(`/admin/mrp/runs/${runId}/convert`, null, {
    params: { supplier_id: supplierId },
  })
}
