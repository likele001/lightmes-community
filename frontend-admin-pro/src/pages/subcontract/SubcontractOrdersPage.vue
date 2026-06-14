<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">{{ t('menu.subcontract') }}</h2>
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
          <el-table-column prop="code" :label="t('subcontract.code')" width="160" />
          <el-table-column prop="supplier_name" :label="t('subcontract.supplier')" width="150" />
          <el-table-column prop="status" :label="t('subcontract.status')" width="120">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)">{{ statusLabel(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="t('common.remark')" min-width="200" />
          <el-table-column prop="created_at" :label="t('common.createdAt')" width="180" />
        </el-table>
      </template>
    </AdminDataTable>

    <el-dialog v-model="formVisible" :title="t('subcontract.createTitle')" width="500px">
      <el-form label-width="100px">
        <el-form-item :label="t('subcontract.supplier')">
          <el-select v-model="formSupplierId" filterable :placeholder="t('common.pleaseSelect')" class="w-full">
            <el-option v-for="s in suppliers" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
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
import { listSubcontracts, createSubcontract, type SubcontractOut } from '@/api/subcontract'
import { useStatus } from '@/utils/status-maps'

const { t } = useI18n()
const router = useRouter()
const { label: statusLabel, type: statusTagType } = useStatus('subcontract')

const loading = ref(false)
const saving = ref(false)
const items = ref<SubcontractOut[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 50

const formVisible = ref(false)
const formSupplierId = ref<number | null>(null)
const formRemark = ref('')
const suppliers = ref<{ id: number; name: string }[]>([])

async function load() {
  loading.value = true
  try {
    const res = await listSubcontracts(undefined, undefined, (page.value - 1) * pageSize, pageSize)
    items.value = res || []
    total.value = res.length ?? 0
  } finally {
    loading.value = false
  }
}

async function openForm() {
  formSupplierId.value = null
  formRemark.value = ''
  try {
    const { materialsApi } = await import('@/api/materials')
    const res = await materialsApi.listSuppliers({})
    suppliers.value = (res?.items || []).map((s: any) => ({ id: s.id, name: s.name }))
  } catch { /* ignore */ }
  formVisible.value = true
}

async function handleCreate() {
  if (!formSupplierId.value) {
    ElMessage.warning(t('common.pleaseSelect'))
    return
  }
  saving.value = true
  try {
    await createSubcontract(formSupplierId.value, formRemark.value || undefined)
    ElMessage.success(t('common.saveSuccess'))
    formVisible.value = false
    await load()
  } catch (e: any) {
    ElMessage.error(e?.detail || t('common.saveFailed'))
  } finally {
    saving.value = false
  }
}

function goDetail(row: SubcontractOut) {
  router.push({ name: 'subcontract-detail', params: { id: row.id } })
}

onMounted(load)
</script>
