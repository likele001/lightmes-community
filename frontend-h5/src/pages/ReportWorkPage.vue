<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showToast, showLoadingToast, closeToast, showDialog } from 'vant'
import { getTaskDetail, submitReport, type H5Task } from '@/api/tasks'
import { uploadFile } from '@/api/files'
import ScanTaskCodeButton from '@/components/ScanTaskCodeButton.vue'
import { parseTaskCodeFromScan } from '@/utils/parseTaskCode'
import { tenantH5Path } from '@/utils/tenant'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const task = ref<H5Task | null>(null)
const scanned = ref(!!route.query.task_code)

const form = reactive({
  task_code: route.query.task_code as string || '',
  good_qty: 0,
  bad_qty: 0,
  remark: '',
  attachment_ids: '',
})

const uploads = ref<{ id: number | string; url?: string; name: string }[]>([])

const totalQty = computed(() => form.good_qty + form.bad_qty)

function onScanned(raw: string) {
  const code = parseTaskCodeFromScan(raw)
  if (!code) {
    showToast('无法识别任务码')
    return
  }
  form.task_code = code
  loadTask()
}

async function loadTask() {
  if (!form.task_code.trim()) return
  try {
    task.value = await getTaskDetail(form.task_code.trim())
    scanned.value = true
    if (task.value?.use_unit_report === true) {
      router.replace({ path: tenantH5Path('/report-unit'), query: { task_code: form.task_code.trim() } })
      return
    }
  } catch {
    showToast('查询任务失败')
    task.value = null
  }
}

async function handleUpload() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*,video/*'
  input.multiple = false
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const toast = showLoadingToast({ message: '上传中...', duration: 0 })
    try {
      const resp = (await uploadFile(file)) as any
      const id = resp?.id ?? resp?.file_id
      if (id) {
        uploads.value.push({ id, name: file.name })
        form.attachment_ids = uploads.value.map((u) => u.id).join(',')
        showToast('上传成功')
      }
    } catch {
      showToast('上传失败')
    } finally {
      closeToast()
    }
  }
  input.click()
}

function removeUpload(idx: number) {
  uploads.value.splice(idx, 1)
  form.attachment_ids = uploads.value.map((u) => u.id).join(',')
}

async function handleSubmit() {
  if (!form.task_code.trim()) {
    showToast('请输入任务码')
    return
  }
  if (totalQty.value <= 0) {
    showToast('合格数+不良数必须大于0')
    return
  }
  if (task.value?.assigned_qty && totalQty.value > (task.value.remaining_qty ?? 0)) {
    showToast(`报工数量超出派工上限，最多还可报 ${task.value.remaining_qty ?? 0} 件`)
    return
  }
  if (!scanned.value) {
    // 用户手动输入的任务码，先查询再提交
    try {
      await getTaskDetail(form.task_code.trim())
    } catch {
      showToast('任务码无效')
      return
    }
  }
  submitting.value = true
  showLoadingToast({ message: '提交中...', duration: 0 })
  try {
    const result = await submitReport({
      task_code: form.task_code.trim(),
      good_qty: form.good_qty,
      bad_qty: form.bad_qty,
      remark: form.remark || undefined,
      attachment_ids: form.attachment_ids || undefined,
    })
    closeToast()
    await showDialog({
      title: '报工成功',
      message: `合格 ${result.good_qty} 件，不良 ${result.bad_qty} 件\n状态：${result.status}`,
      confirmButtonText: '继续报工',
    })
    // 重置表单，保留任务码
    form.good_qty = 0
    form.bad_qty = 0
    form.remark = ''
    uploads.value = []
    form.attachment_ids = ''
  } catch {
    // toast already shown in interceptor
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <!-- 任务码 -->
    <div class="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
      <div class="text-sm opacity-80">扫码报工</div>
      <div class="mt-2">扫描任务标签上的二维码，或手动输入任务码</div>
    </div>

    <!-- 任务码输入 -->
    <div class="mx-4 -mt-3 space-y-3 rounded-xl bg-white p-3 shadow-sm">
      <ScanTaskCodeButton @scan="onScanned" />
      <div class="flex items-center gap-2">
        <input
          v-model="form.task_code"
          type="text"
          placeholder="输入或粘贴任务码"
          class="min-w-0 flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-blue-400"
          @change="loadTask"
        />
        <van-button size="small" type="primary" plain @click="loadTask">查询</van-button>
      </div>
      <van-button block plain type="success" @click="router.push(tenantH5Path('/tasks'))">
        去「我的任务」选任务报工（已派工列表）
      </van-button>
    </div>

    <!-- 任务信息 -->
    <div v-if="task" class="mx-4 mt-3 rounded-xl bg-white p-3 shadow-sm">
      <div class="flex items-center gap-2 text-sm">
        <van-icon name="info-o" class="text-blue-500" />
        <span class="font-medium">{{ task.process?.name || `工序#${task.process_id}` }}</span>
        <van-tag v-if="task.status === 'done'" type="success" size="medium">已完成</van-tag>
      </div>
      <div v-if="task.work_order?.sku" class="mt-1 text-xs text-zinc-500">
        型号：{{ task.work_order.sku.code }} {{ task.work_order.sku.name }}
      </div>
      <div class="mt-1 text-xs text-zinc-500">任务计划：{{ task.planned_qty }} 件</div>
      <div v-if="task.assigned_qty" class="mt-1 text-xs text-zinc-500">
        我的派工：{{ task.assigned_qty }} 件 · 已报 {{ task.reported_qty ?? 0 }} · 还可报
        <span class="font-medium text-blue-600">{{ task.remaining_qty ?? 0 }}</span> 件
      </div>
    </div>

    <!-- 数量输入 -->
    <div class="mx-4 mt-4">
      <div class="mb-2 text-sm font-medium text-zinc-700">报工数量</div>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-white p-3 shadow-sm">
          <div class="text-xs text-zinc-500">合格数</div>
          <input
            v-model.number="form.good_qty"
            type="number"
            min="0"
            placeholder="0"
            class="mt-1 w-full text-2xl font-bold text-green-600 outline-none"
          />
        </div>
        <div class="rounded-xl bg-white p-3 shadow-sm">
          <div class="text-xs text-zinc-500">不良数</div>
          <input
            v-model.number="form.bad_qty"
            type="number"
            min="0"
            placeholder="0"
            class="mt-1 w-full text-2xl font-bold text-red-500 outline-none"
          />
        </div>
      </div>
      <div v-if="totalQty > 0" class="mt-2 text-center text-sm text-zinc-500">
        共计 <span class="font-semibold text-zinc-800">{{ totalQty }}</span> 件
      </div>
    </div>

    <!-- 备注 -->
    <div class="mx-4 mt-4">
      <div class="mb-1 text-sm font-medium text-zinc-700">备注</div>
      <textarea
        v-model="form.remark"
        placeholder="可选备注信息"
        rows="2"
        class="w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm outline-none focus:border-blue-400"
      />
    </div>

    <!-- 附件上传 -->
    <div class="mx-4 mt-4">
      <div class="mb-2 text-sm font-medium text-zinc-700">图片/视频证据</div>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(u, idx) in uploads"
          :key="idx"
          class="relative flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-600"
        >
          <van-icon name="photograph" />
          <span class="max-w-[120px] truncate">{{ u.name }}</span>
          <van-icon name="cross" class="cursor-pointer" @click="removeUpload(idx)" />
        </div>
        <div
          class="flex cursor-pointer items-center gap-1 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs text-zinc-500"
          @click="handleUpload"
        >
          <van-icon name="plus" />
          添加文件
        </div>
      </div>
    </div>

    <!-- 提交按钮：不按数量禁用按钮，便于点击后出现 Toast 提示；禁用时观感像「失灵」 -->
    <div class="mx-4 mt-6 pb-[max(6rem,calc(env(safe-area-inset-bottom,0px)+5rem))]">
      <van-button block type="primary" size="large" :loading="submitting" native-type="button" @click="handleSubmit">
        提交报工
      </van-button>
      <p v-if="totalQty <= 0" class="mt-2 text-center text-xs text-zinc-400">请先填写合格数或不良数（合计须大于 0）</p>
    </div>
  </div>
</template>
