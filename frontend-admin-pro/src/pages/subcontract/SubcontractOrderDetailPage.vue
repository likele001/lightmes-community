<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <el-button text @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h2 class="text-lg font-semibold">{{ t('subcontract.detailTitle') }} - {{ sc?.code }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <el-button v-if="sc?.status === 'draft'" @click="handleSend">{{ t('subcontract.send') }}</el-button>
          <el-button v-if="sc?.status === 'sent' || sc?.status === 'partial_received'" @click="handleReceive">{{ t('subcontract.receive') }}</el-button>
          <el-button v-if="sc?.status === 'received'" type="success" @click="handleSettle">{{ t('subcontract.settle') }}</el-button>
        </div>
      </div>
    </template>

    <el-card class="mb-4">
      <el-descriptions :column="3" border>
        <el-descriptions-item :label="t('subcontract.code')">{{ sc?.code }}</el-descriptions-item>
        <el-descriptions-item :label="t('subcontract.supplier')">{{ sc?.supplier_name }}</el-descriptions-item>
        <el-descriptions-item :label="t('subcontract.status')">
          <el-tag v-if="sc" :type="statusTagType(sc.status)">{{ statusLabel(sc.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('common.remark')" :span="2">{{ sc?.remark || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <template #header>
        <span>{{ t('subcontract.items') }}</span>
      </template>
      <el-table :data="sc?.items || []" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column :label="t('subcontract.sku')" min-width="180">
          <template #default="{ row }">
            <div class="font-medium">{{ row.sku_code || '—' }}</div>
            <div class="text-xs text-el-placeholder">{{ row.sku_name || '—' }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('subcontract.qty')" prop="qty" width="80" align="right" />
        <el-table-column :label="t('subcontract.unitPrice')" width="120" align="right">
          <template #default="{ row }">
            {{ row.unit_price != null ? `¥${row.unit_price.toFixed(2)}` : '—' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('subcontract.sentQty')" prop="sent_qty" width="80" align="right" />
        <el-table-column :label="t('subcontract.receivedQty')" prop="received_qty" width="80" align="right" />
        <el-table-column :label="t('common.remark')" prop="remark" min-width="150" />
      </el-table>
    </el-card>
  </AdminPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getSubcontract, sendSubcontract, receiveSubcontract, settleSubcontract, type SubcontractOut } from '@/api/subcontract'
import { useStatus } from '@/utils/status-maps'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { label: statusLabel, type: statusTagType } = useStatus('subcontract')

const loading = ref(false)
const sc = ref<SubcontractOut | null>(null)

async function load() {
  loading.value = true
  try {
    sc.value = await getSubcontract(Number(route.params.id))
  } finally {
    loading.value = false
  }
}

async function handleSend() {
  try {
    await ElMessageBox.confirm(t('common.confirm'), t('subcontract.send'))
    await sendSubcontract(Number(route.params.id))
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

async function handleReceive() {
  try {
    const { value: form } = await ElMessageBox.prompt(t('subcontract.receive'), '', {
      inputType: 'textarea',
      inputPlaceholder: 'item_id:qty (每行一个，如 "1:50")',
    })
    for (const line of form.split('\n').filter(Boolean)) {
      const [itemId, qty] = line.split(':').map((s: string) => parseInt(s.trim()))
      if (itemId && qty) {
        await receiveSubcontract(Number(route.params.id), itemId, qty)
      }
    }
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

async function handleSettle() {
  try {
    await ElMessageBox.confirm(t('common.confirm'), t('subcontract.settle'))
    await settleSubcontract(Number(route.params.id))
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

onMounted(load)
</script>
