import { http } from '@/utils/http'

export type QuotationItemOut = {
  id: number
  line_no: number
  sku_id: number
  sku_code: string | null
  sku_name: string | null
  qty: number
  unit_price: number | null
  amount: number | null
  remark: string | null
}

export type QuotationOut = {
  id: number
  tenant_id: number
  customer_id: number
  customer_name: string | null
  code: string
  status: string
  valid_until: string | null
  total_amount: number | null
  remark: string | null
  created_by: number | null
  created_at: string
  updated_at: string
  items: QuotationItemOut[]
}

export function listQuotations(customerId?: number, status?: string, offset = 0, limit = 50) {
  return http.get<QuotationOut[]>('/admin/quotation', { params: { customer_id: customerId, status, offset, limit } })
}

export function getQuotation(id: number) {
  return http.get<QuotationOut>(`/admin/quotation/${id}`)
}

export function createQuotation(customerId: number, validUntil?: string, remark?: string) {
  return http.post<QuotationOut>('/admin/quotation', null, { params: { customer_id: customerId, valid_until: validUntil, remark } })
}

export function updateQuotation(id: number, validUntil?: string, remark?: string) {
  return http.put<QuotationOut>(`/admin/quotation/${id}`, null, { params: { valid_until: validUntil, remark } })
}

export function addQuotationItems(id: number, items: { sku_id: number; qty: number; unit_price?: number; amount?: number; remark?: string }[]) {
  return http.post<QuotationOut>(`/admin/quotation/${id}/items`, items)
}

export function submitQuotation(id: number) {
  return http.post<QuotationOut>(`/admin/quotation/${id}/submit`)
}

export function approveQuotation(id: number) {
  return http.post<QuotationOut>(`/admin/quotation/${id}/approve`)
}

export function rejectQuotation(id: number) {
  return http.post<QuotationOut>(`/admin/quotation/${id}/reject`)
}

export function convertQuotationToOrder(id: number) {
  return http.post<{ order_id: number; order_code: string }>(`/admin/quotation/${id}/convert`)
}
