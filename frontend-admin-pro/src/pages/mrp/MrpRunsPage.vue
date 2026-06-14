<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ t('menu.mrp') }}</h2>
        <el-button type="primary" :loading="running" @click="handleRun">
          {{ t('mrp.run') }}
        </el-button>
      </div>
    </template>

    <AdminDataTable
      :loading="loading"
      :empty="!items.length"
      :total="total"
      :current-page="page"
      @page-change="load"
    >
      <template #table>
        <el-table :data="items" stripe @row-click="goDetail" style="cursor:pointer">
          <el-table-column prop="code" :label="t('mrp.code')" width="160" />
          <el-table-column prop="status" :label="t('mrp.status')" width="100">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="scope" :label="t('mrp.scope')" width="120" />
          <el-table-column prop="run_at" :label="t('mrp.runAt')" width="180" />
          <el-table-column :label="t('mrp.result')" min-width="200">
            <template #default="{ row }">
              <span v-if="row.result_summary">{{ row.result_summary }}</span>
              <span v-else-if="row.error_message" class="text-el-regular">{{ row.error_message }}</span>
              <span v-else class="text-el-placeholder">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" :label="t('common.createdAt')" width="180" />
        </el-table>
      </template>
    </AdminDataTable>
  </AdminPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listMrpRuns, runMrp, type MrpRunOut } from '@/api/mrp'
import { useStatus } from '@/utils/status-maps'

const { t } = useI18n()
const router = useRouter()
const { label: statusLabel, type: statusTagType } = useStatus('mrp_run')

const loading = ref(false)
const running = ref(false)
const items = ref<MrpRunOut[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 50

async function load() {
  loading.value = true
  try {
    const res = await listMrpRuns((page.value - 1) * pageSize, pageSize)
    items.value = res || []
    total.value = res.length ?? 0
  } finally {
    loading.value = false
  }
}

async function handleRun() {
  try {
    await ElMessageBox.confirm(t('mrp.runConfirm'), t('common.confirm'), { type: 'info' })
  } catch {
    return
  }
  running.value = true
  try {
    await runMrp()
    ElMessage.success(t('mrp.runSuccess'))
    await load()
  } catch (e: any) {
    ElMessage.error(e?.detail || t('mrp.runFailed'))
  } finally {
    running.value = false
  }
}

function goDetail(row: MrpRunOut) {
  router.push({ name: 'mrp-result', params: { id: row.id } })
}

onMounted(load)
</script>
