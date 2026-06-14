<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ t('menu.quotations') }}</h2>
        <el-button type="primary" @click="openForm">{{ t('common.create') }}</el-button>
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
          <el-table-column prop="code" :label="t('quotation.code')" width="160" />
          <el-table-column prop="customer_name" :label="t('quotation.customer')" width="150" />
          <el-table-column prop="status" :label="t('quotation.status')" width="100">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="total_amount" :label="t('quotation.amount')" width="120" align="right">
            <template #default="{ row }">
              {{ row.total_amount != null ? `¥${row.total_amount.toFixed(2)}` : '—' }}
            </template>
          </el-table-column>
          <el-table-column prop="valid_until" :label="t('quotation.validUntil')" width="120" />
          <el-table-column prop="created_at" :label="t('common.createdAt')" width="180" />
        </el-table>
      </template>
    </AdminDataTable>

    <el-dialog v-model="formVisible" :title="t('quotation.createTitle')" width="600px">
      <el-form label-width="100px">
        <el-form-item :label="t('quotation.customer')">
          <el-select v-model="formCustomerId" filterable :placeholder="t('common.pleaseSelect')" class="w-full">
            <el-option v-for="c in customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('quotation.validUntil')">
          <el-date-picker v-model="formValidUntil" type="date" class="w-full" />
        </el-form-item>
        <el-form-item :label="t('common.remark')">
          <el-input v-model="formRemark" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">{{ t('common.cancel') }}</el-button>
        <el-button type="primary" :loading="saving" @click="handleCreate">{{ t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </AdminPage>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { listQuotations, createQuotation, type QuotationOut } from '@/api/quotation'
import { customerApi } from '@/api/customers'
import { useStatus } from '@/utils/status-maps'

const { t } = useI18n()
const router = useRouter()
const { label: statusLabel, type: statusTagType } = useStatus('quotation')

const loading = ref(false)
const saving = ref(false)
const items = ref<QuotationOut[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 50

const formVisible = ref(false)
const formCustomerId = ref<number | null>(null)
const formValidUntil = ref('')
const formRemark = ref('')
const customers = ref<{ id: number; name: string }[]>([])

async function load() {
  loading.value = true
  try {
    const res = await listQuotations(undefined, undefined, (page.value - 1) * pageSize, pageSize)
    items.value = res || []
    total.value = res.length ?? 0
  } finally {
    loading.value = false
  }
}

async function openForm() {
  formCustomerId.value = null
  formValidUntil.value = ''
  formRemark.value = ''
  try {
    const res = await customerApi.listCustomers({})
    customers.value = (res?.items || []).map((c: any) => ({ id: c.id, name: c.name }))
  } catch { /* ignore */ }
  formVisible.value = true
}

async function handleCreate() {
  if (!formCustomerId.value) {
    ElMessage.warning(t('common.pleaseSelect'))
    return
  }
  saving.value = true
  try {
    await createQuotation(formCustomerId.value, formValidUntil.value || undefined, formRemark.value || undefined)
    ElMessage.success(t('common.saveSuccess'))
    formVisible.value = false
    await load()
  } catch (e: any) {
    ElMessage.error(e?.detail || t('common.saveFailed'))
  } finally {
    saving.value = false
  }
}

function goDetail(row: QuotationOut) {
  router.push({ name: 'quotation-detail', params: { id: row.id } })
}

onMounted(load)
</script>
