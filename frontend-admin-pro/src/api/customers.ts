import { http } from '@/utils/http'
import type { ListResp } from '@/types/api'

export type CustomerOut = {
  id: number
  tenant_id: number
  user_id: number | null
  owner_user_id?: number | null
  owner_name?: string | null
  login_username?: string | null
  product_count?: number
  code: string
  name: string
  contact_name: string | null
  contact_phone: string | null
  address: string | null
  remark: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CustomerContactOut = {
  id: number
  tenant_id: number
  customer_id: number
  name: string
  phone: string | null
  email: string | null
  title: string | null
  is_primary: boolean
  remark: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CustomerContactIn = {
  name: string
  phone?: string | null
  email?: string | null
  title?: string | null
  is_primary?: boolean
  remark?: string | null
  is_active?: boolean
}

export type OpportunityOut = {
  id: number
  tenant_id: number
  customer_id: number
  code: string
  title: string
  stage: string
  status: string
  amount: number | null
  probability: number | null
  expected_close_date: string | null
  owner_user_id: number | null
  owner_name: string | null
  converted_order_id?: number | null
  converted_order_code?: string | null
  remark: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type OpportunityIn = {
  code?: string | null
  title: string
  stage?: string
  status?: string
  amount?: number | null
  probability?: number | null
  expected_close_date?: string | null
  owner_user_id?: number | null
  remark?: string | null
  is_active?: boolean
}

export type OpportunityActivityOut = {
  id: number
  tenant_id: number
  opportunity_id: number
  action_type: string
  content: string
  created_by: number | null
  created_by_name: string | null
  next_follow_up_at?: string | null
  created_at: string
}

export type CustomerTagOut = {
  id: number
  tenant_id: number
  name: string
  color: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export const customerApi = {
  // 客户
  listCustomers(params: any) {
    return http.request<ListResp<CustomerOut>>({ url: '/admin/production/customers', method: 'GET', params })
  },
  getCustomer(id: number) {
    return http.request<CustomerOut>({ url: `/admin/production/customers/${id}`, method: 'GET' })
  },
  createCustomer(data: {
    code: string
    name: string
    contact_name?: string
    contact_phone?: string
    address?: string
    remark?: string
    is_active?: boolean
    user_id?: number
    login_username?: string
    login_password?: string
    owner_user_id?: number | null
  }) {
    return http.request<CustomerOut>({ url: '/admin/production/customers', method: 'POST', data })
  },
  updateCustomer(
    id: number,
    data: {
      code?: string
      name?: string
      contact_name?: string
      contact_phone?: string
      address?: string
      remark?: string
      is_active?: boolean
      user_id?: number
      login_username?: string
      login_password?: string
      owner_user_id?: number | null
    },
  ) {
    return http.request<CustomerOut>({ url: `/admin/production/customers/${id}`, method: 'PUT', data })
  },
  getCustomerProducts(customerId: number) {
    return http.request<{ product_ids: number[]; items: { id: number; code: string; name: string; category: string | null }[] }>({
      url: `/admin/production/customers/${customerId}/products`,
      method: 'GET',
    })
  },
  setCustomerProducts(customerId: number, product_ids: number[]) {
    return http.request<{ customer_id: number; product_ids: number[] }>({
      url: `/admin/production/customers/${customerId}/products`,
      method: 'PUT',
      data: { product_ids },
    })
  },
  listCustomerContacts(customerId: number, params?: any) {
    return http.request<ListResp<CustomerContactOut>>({ url: `/admin/production/customers/${customerId}/contacts`, method: 'GET', params })
  },
  createCustomerContact(customerId: number, data: CustomerContactIn) {
    return http.request<{ id: number }>({ url: `/admin/production/customers/${customerId}/contacts`, method: 'POST', data })
  },
  updateCustomerContact(customerId: number, contactId: number, data: Partial<CustomerContactIn>) {
    return http.request<{ id: number }>({ url: `/admin/production/customers/${customerId}/contacts/${contactId}`, method: 'PUT', data })
  },
  deleteCustomerContact(customerId: number, contactId: number) {
    return http.request<{ id: number }>({ url: `/admin/production/customers/${customerId}/contacts/${contactId}`, method: 'DELETE' })
  },
  listOpportunities(customerId: number, params?: any) {
    return http.request<ListResp<OpportunityOut>>({ url: `/admin/production/customers/${customerId}/opportunities`, method: 'GET', params })
  },
  createOpportunity(customerId: number, data: OpportunityIn) {
    return http.request<{ id: number; code: string }>({ url: `/admin/production/customers/${customerId}/opportunities`, method: 'POST', data })
  },
  updateOpportunity(customerId: number, opportunityId: number, data: Partial<OpportunityIn>) {
    return http.request<{ id: number }>({ url: `/admin/production/customers/${customerId}/opportunities/${opportunityId}`, method: 'PUT', data })
  },
  deleteOpportunity(customerId: number, opportunityId: number) {
    return http.request<{ id: number }>({ url: `/admin/production/customers/${customerId}/opportunities/${opportunityId}`, method: 'DELETE' })
  },
  listOpportunityActivities(customerId: number, opportunityId: number) {
    return http.request<ListResp<OpportunityActivityOut>>({
      url: `/admin/production/customers/${customerId}/opportunities/${opportunityId}/activities`,
      method: 'GET',
    })
  },
  createOpportunityActivity(
    customerId: number,
    opportunityId: number,
    data: { action_type?: string; content: string; next_follow_up_at?: string | null },
  ) {
    return http.request<{ id: number }>({
      url: `/admin/production/customers/${customerId}/opportunities/${opportunityId}/activities`,
      method: 'POST',
      data,
    })
  },
  convertOpportunityToOrder(
    customerId: number,
    opportunityId: number,
    data: { due_date?: string | null; remark?: string | null; items: { line_no: number; sku_id: number; qty: number; remark?: string | null }[] },
  ) {
    return http.request<{ order_id: number; order_code: string; opportunity_id: number }>({
      url: `/admin/production/customers/${customerId}/opportunities/${opportunityId}/convert-to-order`,
      method: 'POST',
      data,
    })
  },

  listCrmOpportunities(params?: any) {
    return http.request<ListResp<OpportunityOut & { customer_name?: string }>>({
      url: '/admin/production/crm/opportunities',
      method: 'GET',
      params,
    })
  },
  getCrmDashboardSummary() {
    return http.request<{ open_opportunities: number; public_pool: number; due_followups: number }>({
      url: '/admin/production/crm/dashboard-summary',
      method: 'GET',
    })
  },
  getCrmSettings() {
    return http.request<{ recycle_days: number; followup_remind_enabled: boolean; followup_remind_days_before: number }>({
      url: '/admin/production/crm/settings',
      method: 'GET',
    })
  },
  updateCrmSettings(data: { recycle_days?: number; followup_remind_enabled?: boolean; followup_remind_days_before?: number }) {
    return http.request<{ updated: boolean }>({ url: '/admin/production/crm/settings', method: 'PUT', data })
  },
  listCrmAfterSales(params?: any) {
    return http.request<ListResp<any>>({ url: '/admin/production/crm/after-sales', method: 'GET', params })
  },
  updateCrmAfterSale(id: number, data: { status?: string; solution?: string }) {
    return http.request<{ id: number; status: string }>({ url: `/admin/production/crm/after-sales/${id}`, method: 'PUT', data })
  },

  listCrmTags(params?: any) {
    return http.request<ListResp<CustomerTagOut>>({ url: '/admin/production/crm/tags', method: 'GET', params })
  },
  createCrmTag(data: { name: string; color?: string | null; is_active?: boolean }) {
    return http.request<CustomerTagOut>({ url: '/admin/production/crm/tags', method: 'POST', data })
  },
  updateCrmTag(tagId: number, data: { name?: string; color?: string | null; is_active?: boolean }) {
    return http.request<CustomerTagOut>({ url: `/admin/production/crm/tags/${tagId}`, method: 'PUT', data })
  },
  deleteCrmTag(tagId: number) {
    return http.request<{ id: number }>({ url: `/admin/production/crm/tags/${tagId}`, method: 'DELETE' })
  },
  getCustomerTags(customerId: number) {
    return http.request<{ items: { tag_id: number; tag_name: string | null; tag_color: string | null }[] }>({
      url: `/admin/production/customers/${customerId}/tags`,
      method: 'GET',
    })
  },
  setCustomerTags(customerId: number, tag_ids: number[]) {
    return http.request<{ customer_id: number; tag_ids: number[] }>({ url: `/admin/production/customers/${customerId}/tags`, method: 'PUT', data: { tag_ids } })
  },
  listCrmPublicPoolOpportunities(params?: any) {
    return http.request<ListResp<any>>({ url: '/admin/production/crm/public-pool/opportunities', method: 'GET', params })
  },
  claimCrmPublicPoolOpportunity(id: number) {
    return http.request<{ id: number; owner_user_id: number }>({ url: `/admin/production/crm/public-pool/opportunities/${id}/claim`, method: 'POST' })
  },
  releaseCrmPublicPoolOpportunity(id: number) {
    return http.request<{ id: number; owner_user_id: number | null }>({ url: `/admin/production/crm/public-pool/opportunities/${id}/release`, method: 'POST' })
  },
  recycleCrmPublicPool(days?: number) {
    return http.request<{ recycled: number; days: number }>({ url: `/admin/production/crm/public-pool/recycle`, method: 'POST', params: { days } })
  },
  getCrmOpportunityStats(params?: any) {
    return http.request<{ items: any[]; total_count: number; total_amount: number }>({ url: '/admin/production/crm/opportunities/stats', method: 'GET', params })
  },
}
