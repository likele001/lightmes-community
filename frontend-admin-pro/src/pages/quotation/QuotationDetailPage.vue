<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <el-button text @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h2 class="text-lg font-semibold">{{ t('quotation.detailTitle') }} - {{ qt?.code }}</h2>
        </div>
        <div class="flex items-center gap-2">
          <el-button v-if="qt?.status === 'draft'" @click="handleSubmit">{{ t('quotation.submit') }}</el-button>
          <el-button v-if="qt?.status === 'submitted'" type="success" @click="handleApprove">{{ t('quotation.approve') }}</el-button>
          <el-button v-if="qt?.status === 'submitted'" type="danger" @click="handleReject">{{ t('quotation.reject') }}</el-button>
          <el-button v-if="qt?.status === 'approved'" type="primary" :loading="converting" @click="handleConvert">{{ t('quotation.convertToOrder') }}</el-button>
        </div>
      </div>
    </template>

    <el-card class="mb-4">
      <el-descriptions :column="3" border>
        <el-descriptions-item :label="t('quotation.code')">{{ qt?.code }}</el-descriptions-item>
        <el-descriptions-item :label="t('quotation.customer')">{{ qt?.customer_name }}</el-descriptions-item>
        <el-descriptions-item :label="t('quotation.status')">
          <el-tag v-if="qt" :type="statusTagType(qt.status)">{{ statusLabel(qt.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="t('quotation.amount')">
          {{ qt?.total_amount != null ? `¥${qt.total_amount.toFixed(2)}` : '—' }}
        </el-descriptions-item>
        <el-descriptions-item :label="t('quotation.validUntil')">{{ qt?.valid_until || '—' }}</el-descriptions-item>
        <el-descriptions-item :label="t('common.remark')">{{ qt?.remark || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <template #header>
        <span>{{ t('quotation.items') }}</span>
      </template>
      <el-table :data="qt?.items || []" stripe>
        <el-table-column type="index" width="50" />
        <el-table-column :label="t('quotation.sku')" min-width="180">
          <template #default="{ row }">
            <div class="font-medium">{{ row.sku_code || '—' }}</div>
            <div class="text-xs text-el-placeholder">{{ row.sku_name || '—' }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('quotation.qty')" prop="qty" width="80" align="right" />
        <el-table-column :label="t('quotation.unitPrice')" width="120" align="right">
          <template #default="{ row }">
            {{ row.unit_price != null ? `¥${row.unit_price.toFixed(2)}` : '—' }}
          </template>
        </el-table-column>
        <el-table-column :label="t('quotation.amount')" width="120" align="right">
          <template #default="{ row }">
            {{ row.amount != null ? `¥${row.amount.toFixed(2)}` : '—' }}
          </template>
        </el-table-column>
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
import { getQuotation, submitQuotation, approveQuotation, rejectQuotation, convertQuotationToOrder, type QuotationOut } from '@/api/quotation'
import { useStatus } from '@/utils/status-maps'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { label: statusLabel, type: statusTagType } = useStatus('quotation')

const loading = ref(false)
const converting = ref(false)
const qt = ref<QuotationOut | null>(null)

async function load() {
  loading.value = true
  try {
    qt.value = await getQuotation(Number(route.params.id))
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await ElMessageBox.confirm(t('common.confirm'), t('quotation.submit'))
    await submitQuotation(Number(route.params.id))
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

async function handleApprove() {
  try {
    await ElMessageBox.confirm(t('common.confirm'), t('quotation.approve'))
    await approveQuotation(Number(route.params.id))
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

async function handleReject() {
  try {
    await ElMessageBox.confirm(t('common.confirm'), t('quotation.reject'))
    await rejectQuotation(Number(route.params.id))
    ElMessage.success(t('common.operationSuccess'))
    await load()
  } catch { /* ignore */ }
}

async function handleConvert() {
  try {
    await ElMessageBox.confirm(t('quotation.convertToOrder'), t('common.confirm'))
    converting.value = true
    const res = await convertQuotationToOrder(Number(route.params.id))
    ElMessage.success(`${t('quotation.convertedToOrder')}: ${res.order_code}`)
    await load()
  } catch { /* ignore */ }
  finally { converting.value = false }
}

onMounted(load)
</script>
