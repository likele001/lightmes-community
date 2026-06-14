<template>
  <AdminPage>
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <el-button text @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          <h2 class="text-lg font-semibold">{{ t('mrp.demand') }} - {{ run?.code }}</h2>
        </div>
        <el-button
          v-if="hasShortage"
          type="primary"
          :loading="converting"
          @click="handleConvert"
        >
          {{ t('mrp.convertToPo') }}
        </el-button>
      </div>
    </template>

    <AdminDataTable
      :loading="loading"
      :empty="!demands.length"
    >
      <template #table>
        <el-table :data="demands" stripe>
          <el-table-column :label="t('mrp.sku')" min-width="180">
            <template #default="{ row }">
              <div class="font-medium">{{ row.sku_code || '—' }}</div>
              <div class="text-xs text-el-placeholder">{{ row.sku_name || '—' }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="t('mrp.requiredQty')" prop="required_qty" width="100" align="right" />
          <el-table-column :label="t('mrp.inStockQty')" prop="in_stock_qty" width="100" align="right" />
          <el-table-column :label="t('mrp.onOrderQty')" prop="on_order_qty" width="100" align="right" />
          <el-table-column :label="t('mrp.shortageQty')" prop="shortage_qty" width="100" align="right">
            <template #default="{ row }">
              <span :class="row.shortage_qty > 0 ? 'text-[var(--el-color-danger)] font-semibold' : ''">
                {{ row.shortage_qty }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="t('mrp.suggestion')" prop="suggestion" width="100">
            <template #default="{ row }">
              <el-tag v-if="row.suggestion === 'purchase'" type="warning" size="small">{{ t('common.purchase') }}</el-tag>
              <el-tag v-else type="info" size="small">{{ t('common.none') }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </AdminDataTable>
  </AdminPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { getMrpRunDetail, convertMrpToPurchaseOrder, type MrpRunOut, type MrpDemandOut } from '@/api/mrp'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const loading = ref(false)
const converting = ref(false)
const run = ref<MrpRunOut | null>(null)
const demands = ref<MrpDemandOut[]>([])

const hasShortage = computed(() => demands.value.some((d) => d.shortage_qty > 0))

async function load() {
  loading.value = true
  try {
    const res = await getMrpRunDetail(Number(route.params.id))
    run.value = res.run
    demands.value = res.demands || []
  } finally {
    loading.value = false
  }
}

async function handleConvert() {
  try {
    const { value: supplierId } = await ElMessageBox.prompt(t('common.supplierId'), t('mrp.convertToPo'), {
      inputType: 'number',
      inputPlaceholder: t('common.supplierIdPlaceholder'),
    })
    converting.value = true
    const res = await convertMrpToPurchaseOrder(Number(route.params.id), Number(supplierId))
    ElMessage.success(`${t('mrp.convertSuccess')}: ${res.code}`)
    await load()
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.detail || t('mrp.runFailed'))
    }
  } finally {
    converting.value = false
  }
}

onMounted(load)
</script>
