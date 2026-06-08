<template>
  <AdminPage :title="t('system.invites.title')">
      <template #actions>
        <el-button type="primary" @click="createInvite">{{ t('system.invites.generateInvite') }}</el-button>
    </template>
      <el-descriptions v-if="entryUrls" :column="1" border class="mb-4">
        <el-descriptions-item :label="t('system.invites.adminEntry')">{{ entryUrls.admin }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.invites.h5Entry')">{{ entryUrls.h5 }}</el-descriptions-item>
        <el-descriptions-item :label="t('system.invites.customerEntry')">{{ entryUrls.customer }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="items" border v-loading="loading">
        <el-table-column prop="role_code" :label="t('system.invites.roleCode')" width="100" />
        <el-table-column prop="used_count" :label="t('system.invites.usedCount')" width="80" />
        <el-table-column prop="max_uses" :label="t('system.invites.maxUses')" width="80" />
        <el-table-column prop="expires_at" :label="t('system.invites.expiresAt')" width="180" />
        <el-table-column prop="join_url" :label="t('system.invites.inviteLink')" min-width="280" />
      </el-table>
  </AdminPage>
</template>

<script setup lang="ts">
import AdminPage from '@/components/admin/AdminPage.vue'
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { http } from '@/utils/http'

const { t } = useI18n()

const loading = ref(false)
const items = ref<Record<string, unknown>[]>([])
const entryUrls = ref<{ admin: string; h5: string; customer: string } | null>(null)

async function reload() {
  loading.value = true
  try {
    const res = await http.request<{ items: Record<string, unknown>[]; entry_urls: typeof entryUrls.value }>({
      url: '/admin/system/invites',
      method: 'GET',
    })
    items.value = res.items || []
    entryUrls.value = res.entry_urls
  } finally {
    loading.value = false
  }
}

async function createInvite() {
  const res = await http.request<{ join_url: string }>({
    url: '/admin/system/invites',
    method: 'POST',
    data: { role_code: 'employee', max_uses: 20, expires_days: 7 },
  })
  ElMessage.success(t('system.invites.generated', { url: res.join_url }))
  await reload()
}

onMounted(reload)
</script>
