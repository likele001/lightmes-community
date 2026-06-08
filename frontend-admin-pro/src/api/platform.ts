import { http } from '@/utils/http'
export { getPlatformToken, setPlatformToken } from '@/utils/platform-token'

function platformRequest<T>(config: { url: string; method?: string; data?: unknown; params?: unknown }) {
  return http.request<T>(config)
}

export const platformApi = {
  publicConfig() {
    return http.request<{
      saas_mode_enabled: boolean
      register_enabled: boolean
      login_captcha_enabled?: boolean
      admin_site_url?: string
      h5_site_url?: string
    }>({
      url: '/platform/public-config',
      method: 'GET',
    })
  },
  login(data: {
    username: string
    password: string
    remember_me?: boolean
    captcha_id?: string
    captcha_code?: string
  }) {
    return http.request<{ access_token: string; expires_in?: number; remember_me?: boolean }>({
      url: '/platform/auth/login',
      method: 'POST',
      data,
    })
  },
  me() {
    return platformRequest<{
      id: number
      username: string
      full_name: string | null
      phone: string | null
      email: string | null
    }>({
      url: '/platform/auth/me',
      method: 'GET',
    })
  },
  updateProfile(data: { full_name?: string | null; phone?: string | null; email?: string | null }) {
    return platformRequest<{
      id: number
      username: string
      full_name: string | null
      phone: string | null
      email: string | null
    }>({ url: '/platform/auth/profile', method: 'PUT', data })
  },
  changePassword(data: { old_password: string; new_password: string }) {
    return platformRequest({ url: '/platform/auth/password', method: 'PUT', data })
  },
  getSettings() {
    return platformRequest<{
      login_captcha_enabled: boolean
      saas_mode_enabled: boolean
      xunhu_app_id: string
      xunhu_app_secret: string
      xunhu_gateway: string
      default_trial_days: number
      admin_site_url: string
      h5_site_url: string
    }>({ url: '/platform/settings', method: 'GET' })
  },
  updateSettings(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/settings', method: 'PUT', data })
  },
  getStorageSettings() {
    return platformRequest<{
      storage_enabled: boolean
      storage_driver: string
      local_root: string
      aliyun_oss: Record<string, unknown>
      tencent_cos: Record<string, unknown>
      qiniu: Record<string, unknown>
    }>({ url: '/platform/storage', method: 'GET' })
  },
  updateStorageSettings(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/storage', method: 'PUT', data })
  },
  testStorageSettings(data?: { driver?: string }) {
    return platformRequest<{ driver: string; ok: boolean; message: string; sample_url?: string }>({
      url: '/platform/storage/test',
      method: 'POST',
      data: data || {},
    })
  },
  listTenants(params?: { keyword?: string }) {
    return platformRequest<{ items: Array<Record<string, unknown>> }>({
      url: '/platform/tenants',
      method: 'GET',
      params,
    })
  },
  createTenant(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/tenants', method: 'POST', data })
  },
  updateTenant(id: number, data: Record<string, unknown>) {
    return platformRequest({ url: `/platform/tenants/${id}`, method: 'PUT', data })
  },
  listPackages() {
    return platformRequest<{ items: Array<Record<string, unknown>> }>({ url: '/platform/packages', method: 'GET' })
  },
  createPackage(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/packages', method: 'POST', data })
  },
  updatePackage(id: number, data: Record<string, unknown>) {
    return platformRequest({ url: `/platform/packages/${id}`, method: 'PUT', data })
  },
  listSubscriptionOrders() {
    return platformRequest<{ items: Array<Record<string, unknown>> }>({
      url: '/platform/subscription-orders',
      method: 'GET',
    })
  },
  markSubscriptionPaid(id: number) {
    return platformRequest({ url: `/platform/subscription-orders/${id}/mark-paid`, method: 'POST' })
  },
  publicPackages() {
    return http.request<{ items: Array<Record<string, unknown>> }>({ url: '/platform/public-packages', method: 'GET' })
  },
  getAiSettings() {
    return platformRequest<{ enabled: boolean }>({ url: '/platform/ai/settings', method: 'GET' })
  },
  updateAiSettings(data: { enabled: boolean }) {
    return platformRequest<{ enabled: boolean }>({ url: '/platform/ai/settings', method: 'PUT', data })
  },
  /** @deprecated 兼容旧调用，等同 getAiSettings */
  getAiProfile() {
    return this.getAiSettings()
  },
  /** @deprecated 兼容旧调用，等同 updateAiSettings */
  updateAiProfile(data: { enabled: boolean }) {
    return this.updateAiSettings(data)
  },
  listAiGateways() {
    return platformRequest<{ items: Array<Record<string, unknown>> }>({ url: '/platform/ai/gateways', method: 'GET' })
  },
  createAiGateway(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/ai/gateways', method: 'POST', data })
  },
  updateAiGateway(id: number, data: Record<string, unknown>) {
    return platformRequest({ url: `/platform/ai/gateways/${id}`, method: 'PUT', data })
  },
  setDefaultAiGateway(id: number) {
    return platformRequest({ url: `/platform/ai/gateways/${id}/set-default`, method: 'POST' })
  },
  deleteAiGateway(id: number) {
    return platformRequest({ url: `/platform/ai/gateways/${id}`, method: 'DELETE' })
  },
  listAiModels(gatewayId: number) {
    return platformRequest<{ items: Array<Record<string, unknown>> }>({
      url: '/platform/ai/models',
      method: 'GET',
      params: { gateway_id: gatewayId },
    })
  },
  createAiModel(data: Record<string, unknown>) {
    return platformRequest({ url: '/platform/ai/models', method: 'POST', data })
  },
  updateAiModel(id: number, data: Record<string, unknown>) {
    return platformRequest({ url: `/platform/ai/models/${id}`, method: 'PUT', data })
  },
  setDefaultAiModel(id: number) {
    return platformRequest({ url: `/platform/ai/models/${id}/set-default`, method: 'POST' })
  },
  deleteAiModel(id: number) {
    return platformRequest({ url: `/platform/ai/models/${id}`, method: 'DELETE' })
  },
  testAi(data?: { gateway_id?: number; model_code?: string }) {
    return platformRequest<{ ok: boolean; reply: string }>({ url: '/platform/ai/test', method: 'POST', data: data || {} })
  },
}
