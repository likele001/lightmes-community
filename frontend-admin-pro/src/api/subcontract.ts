import { http } from '@/utils/http'

export type SubcontractItemOut = {
  id: number
  sku_id: number
  sku_code: string | null
  sku_name: string | null
  qty: number
  unit_price: number | null
  sent_qty: number
  received_qty: number
  remark: string | null
}

export type SubcontractOut = {
  id: number
  tenant_id: number
  supplier_id: number
  supplier_name: string | null
  code: string
  status: string
  remark: string | null
  created_by: number | null
  created_at: string
  updated_at: string
  items: SubcontractItemOut[]
}

export function listSubcontracts(supplierId?: number, status?: string, offset = 0, limit = 50) {
  return http.get<SubcontractOut[]>('/admin/subcontract', { params: { supplier_id: supplierId, status, offset, limit } })
}

export function getSubcontract(id: number) {
  return http.get<SubcontractOut>(`/admin/subcontract/${id}`)
}

export function createSubcontract(supplierId: number, remark?: string) {
  return http.post<SubcontractOut>('/admin/subcontract', null, { params: { supplier_id: supplierId, remark } })
}

export function addSubcontractItems(id: number, items: { sku_id: number; qty: number; unit_price?: number; remark?: string }[]) {
  return http.post<SubcontractOut>(`/admin/subcontract/${id}/items`, items)
}

export function sendSubcontract(id: number) {
  return http.post<SubcontractOut>(`/admin/subcontract/${id}/send`)
}

export function receiveSubcontract(id: number, itemId: number, qty: number) {
  return http.post<SubcontractOut>(`/admin/subcontract/${id}/receive`, null, { params: { item_id: itemId, qty } })
}

export function settleSubcontract(id: number) {
  return http.post<SubcontractOut>(`/admin/subcontract/${id}/settle`)
}
