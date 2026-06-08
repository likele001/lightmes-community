<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getMyTasks, type H5Task } from '@/api/tasks'
import { tenantH5Path } from '@/utils/tenant'

const router = useRouter()

const items = ref<H5Task[]>([])
const loading = ref(false)
const refreshing = ref(false)
const finished = ref(false)
const statusFilter = ref('')

const offset = ref(0)
const limit = 50

const tabs = [
  { key: '', label: '全部' },
  { key: 'pending', label: '待开始' },
  { key: 'working', label: '进行中' },
  { key: 'done', label: '已完成' },
]

const taskStats = computed(() => {
  const total = items.value.length
  const pending = items.value.filter((t) => t.status === 'pending').length
  const working = items.value.filter((t) => t.status === 'working').length
  const done = items.value.filter((t) => t.status === 'done').length
  return { total, pending, working, done }
})

function goDetail(code: string) {
  router.push(`/tasks/${encodeURIComponent(code)}`)
}

function goReport(t: H5Task, e: Event) {
  e.stopPropagation()
  const path = t.use_unit_report === false ? '/report' : '/report-unit'
  router.push({ path: tenantH5Path(path), query: { task_code: t.task_code } })
}

function statusTag(s: string) {
  if (s === 'pending') return { type: 'primary' as const, text: '待开始' }
  if (s === 'working') return { type: 'warning' as const, text: '进行中' }
  if (s === 'done') return { type: 'success' as const, text: '已完成' }
  return { type: 'default' as const, text: s }
}

async function load(reset = false) {
  if (loading.value) return
  if (reset) {
    offset.value = 0
    finished.value = false
    items.value = []
  }
  if (finished.value) return

  loading.value = true
  try {
    const resp = await getMyTasks({ status: statusFilter.value || undefined, offset: offset.value, limit })
    const arr = resp?.items ?? []
    items.value = reset ? arr : [...items.value, ...arr]
    offset.value += arr.length
    if (arr.length < limit) finished.value = true
  } finally {
    loading.value = false
  }
}

async function onRefresh() {
  refreshing.value = true
  try {
    await load(true)
  } finally {
    refreshing.value = false
  }
}

function onTabChange(key: string) {
  statusFilter.value = key
  load(true)
}

watch(statusFilter, () => load(true), { immediate: true })

onMounted(() => load(true))
</script>

<template>
  <div>
    <div class="grid grid-cols-4 gap-2 px-1">
      <div class="rounded-lg bg-blue-50 p-2 text-center">
        <div class="text-lg font-bold text-blue-600">{{ taskStats.total }}</div>
        <div class="text-[11px] text-blue-500">全部</div>
      </div>
      <div class="rounded-lg bg-yellow-50 p-2 text-center">
        <div class="text-lg font-bold text-yellow-600">{{ taskStats.pending }}</div>
        <div class="text-[11px] text-yellow-500">待开始</div>
      </div>
      <div class="rounded-lg bg-orange-50 p-2 text-center">
        <div class="text-lg font-bold text-orange-600">{{ taskStats.working }}</div>
        <div class="text-[11px] text-orange-500">进行中</div>
      </div>
      <div class="rounded-lg bg-green-50 p-2 text-center">
        <div class="text-lg font-bold text-green-600">{{ taskStats.done }}</div>
        <div class="text-[11px] text-green-500">已完成</div>
      </div>
    </div>

    <van-tabs v-model:active="statusFilter" class="mt-2" @change="onTabChange">
      <van-tab v-for="t in tabs" :key="t.key" :title="t.label" :name="t.key" />
    </van-tabs>

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="load(false)">
        <div v-if="items.length" class="mt-2 space-y-3 px-2">
          <div
            v-for="t in items"
            :key="t.id"
            class="rounded-xl border border-zinc-100 bg-white p-3 shadow-sm"
            @click="goDetail(t.task_code)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-medium text-zinc-900">{{ t.process?.name || `工序#${t.process_id}` }}</span>
                  <van-tag :type="statusTag(t.status).type" plain size="medium">{{ statusTag(t.status).text }}</van-tag>
                </div>
                <div class="mt-2 text-xs text-zinc-500 space-y-1">
                  <div v-if="t.work_order">订单/工单 #{{ t.work_order.order_id }}</div>
                  <div v-if="t.work_order?.sku">
                    产品：{{ t.work_order.sku.code }}
                    <span class="text-zinc-400">{{ t.work_order.sku.name }}</span>
                  </div>
                  <div class="flex gap-4 mt-1">
                    <span>分配 <b class="text-zinc-800">{{ t.assigned_qty ?? '—' }}</b></span>
                    <span>已报 <b class="text-green-600">{{ t.reported_qty ?? 0 }}</b></span>
                    <span>待报 <b class="text-orange-500">{{ t.remaining_qty ?? 0 }}</b></span>
                  </div>
                </div>
              </div>
              <van-button
                v-if="t.status !== 'done' && (t.remaining_qty ?? 0) > 0"
                type="primary"
                size="small"
                @click="goReport(t, $event)"
              >
                报工
              </van-button>
            </div>
            <div class="mt-2 text-[11px] text-zinc-400 font-mono">{{ t.task_code }}</div>
          </div>
        </div>
        <van-empty v-else-if="!loading && !refreshing" description="暂无任务" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>
