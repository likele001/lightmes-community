import { http } from '@/utils/http'
import type { ListResp } from '@/types/api'

export type SpcChartOut = {
  id: number; name: string; chart_type: string
  process_id: number | null; process_name: string | null
  sku_id: number | null; sku_code: string | null
  sample_size: number
  ucl: number | null; lcl: number | null; target: number | null
  remark: string | null; created_at: string
}

export type SpcSampleOut = {
  id: number; sample_no: number
  values: number[] | null; mean: number | null
  range: number | null; std_dev: number | null
  defect_count: number | null; collected_by: number; created_at: string
}

export type SpcCalculateOut = {
  mean: number; range_mean: number | null; std_dev: number | null
  ucl: number | null; lcl: number | null; cpk: number | null
  sample_count: number; chart_type: string
}

export const CHART_TYPES: Record<string, string> = {
  xbar_r: 'Xbar-R', xbar_s: 'Xbar-S', np: 'np', c: 'c', p: 'p',
}

export const spcApi = {
  list() { return http.request<ListResp<SpcChartOut>>({ url: '/admin/spc', method: 'GET' }) },
  create(data: Record<string, unknown>) { return http.request<{ id: number; name: string }>({ url: '/admin/spc', method: 'POST', data }) },
  get(id: number) { return http.request<SpcChartOut>({ url: `/admin/spc/${id}`, method: 'GET' }) },
  update(id: number, data: Record<string, unknown>) { return http.request<SpcChartOut>({ url: `/admin/spc/${id}`, method: 'PUT', data }) },
  delete(id: number) { return http.request<{ deleted: boolean }>({ url: `/admin/spc/${id}`, method: 'DELETE' }) },
  listSamples(chartId: number, limit = 100) { return http.request<ListResp<SpcSampleOut>>({ url: `/admin/spc/${chartId}/samples`, method: 'GET', params: { limit } }) },
  addSample(chartId: number, data: { values?: number[]; defect_count?: number }) { return http.request<SpcSampleOut>({ url: `/admin/spc/${chartId}/samples`, method: 'POST', data }) },
  calculate(chartId: number) { return http.request<SpcCalculateOut>({ url: `/admin/spc/${chartId}/calculate`, method: 'GET' }) },
}
