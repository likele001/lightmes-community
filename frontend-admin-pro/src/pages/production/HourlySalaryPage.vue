<template>
  <AdminPage :title="t('menu.hourlySalary')">
    <template #actions>
      <div class="flex items-center gap-2 flex-wrap">
        <el-select v-model="query.user_id" clearable filterable :placeholder="t('salary.employeeId')" style="width: 160px">
          <el-option v-for="u in users" :key="u.id" :label="u.full_name || u.username" :value="u.id" />
        </el-select>
        <el-input v-model="query.month" placeholder="YYYY-MM" style="width: 120px" maxlength="7" @keyup.enter="reload(true)" />
        <el-button type="primary" @click="reload(true)">{{ t('salary.search') }}</el-button>
        <el-button @click="showGenerate = true">手动生成</el-button>
        <el-button @click="showSetRate = true">批量设时薪</el-button>
      </div>
    </template>

    <template #extra>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <el-card shadow="never">
          <div class="text-sm text-gray-500">总工时（小时）</div>
          <div class="text-2xl font-bold mt-1">{{ summary.total_hours.toFixed(2) }}</div>
        </el-card>
        <el-card shadow="never">
          <div class="text-sm text-gray-500">计时工资总额（元）</div>
          <div class="text-2xl font-bold mt-1">{{ summary.total_amount.toFixed(2) }}</div>
        </el-card>
        <el-card shadow="never">
          <div class="text-sm text-gray-500">本月记录条数</div>
          <div class="text-2xl font-bold mt-1">{{ total }}</div>
        </el-card>
      </div>
    </template>

    <AdminDataTable
      :loading="loading"
      :empty="!loading && !items.length"
      :page-size="query.limit"
      :total="total"
      :current-page="page"
      @page-change="onPageChange"
    >
      <template #table>
        <el-table :data="items" border>
          <el-table-column prop="id" label="ID" width="70" />
          <el-table-column prop="user_name" label="员工" width="120" />
          <el-table-column label="日期" width="120">
            <template #default="{ row }">{{ row.work_date || '-' }}</template>
          </el-table-column>
          <el-table-column label="类型" width="80">
            <template #default="{ row }">
              <el-tag :type="row.is_absent ? 'danger' : 'success'" size="small">
                {{ row.is_absent ? '缺卡' : '正常' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="work_hours" label="工时" width="80" />
          <el-table-column prop="hourly_rate" label="时薪" width="100">
            <template #default="{ row }">{{ row.hourly_rate.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="amount" label="金额" width="120">
            <template #default="{ row }">{{ row.amount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="month" label="月份" width="90" />
        </el-table>
      </template>
    </AdminDataTable>

    <el-dialog v-model="showGenerate" title="手动生成计时工资" width="480px">
      <el-form label-width="100px">
        <el-form-item label="开始日期" required>
          <el-date-picker v-model="genDateFrom" type="date" placeholder="开始日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker v-model="genDateTo" type="date" placeholder="结束日期（默认同开始）" style="width: 100%" />
        </el-form-item>
        <el-form-item label="员工">
          <el-select v-model="genUserId" clearable filterable placeholder="不选则全部 hourly/mixed 员工" style="width: 100%">
            <el-option v-for="u in users" :key="u.id" :label="u.full_name || u.username" :value="u.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGenerate = false">取消</el-button>
        <el-button type="primary" :loading="genLoading" @click="onGenerate">生成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="showSetRate" title="批量设置时薪" width="480px">
      <p class="text-sm text-gray-500 mb-3">设置 hourly/mixed 员工的时薪（元/小时）</p>
      <el-table :data="rateUsers" border max-height="400">
        <el-table-column prop="full_name" label="姓名" width="120" />
        <el-table-column prop="salary_type" label="计薪方式" width="90">
          <template #default="{ row }">
            {{ { piece: '计件', hourly: '计时', mixed: '混合' }[row.salary_type] || row.salary_type }}
          </template>
        </el-table-column>
        <el-table-column label="时薪">
          <template #default="{ row }">
            <el-input-number v-model="row._rate" :min="0" :precision="2" size="small" style="width: 140px" />
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="showSetRate = false">取消</el-button>
        <el-button type="primary" :loading="rateLoading" @click="onSaveRates">保存</el-button>
      </template>
    </el-dialog>
  </AdminPage>
</template>

<script setup lang="ts">
import AdminPage from '@/components/admin/AdminPage.vue'
import AdminDataTable from '@/components/admin/AdminDataTable.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { productionApi, type HourlyItemOut } from '@/api/production'
import { systemApi, type UserOut } from '@/api/system'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const { t } = useI18n()

const loading = ref(false)
const items = ref<HourlyItemOut[]>([])
const users = ref<UserOut[]>([])
const total = ref(0)
const query = reactive({ month: dayjs().format('YYYY-MM'), user_id: null as number | null, offset: 0, limit: 50 })
const summary = reactive({ total_hours: 0, total_amount: 0 })

const page = computed(() => Math.floor(query.offset / query.limit) + 1)

const showGenerate = ref(false)
const genLoading = ref(false)
const genDateFrom = ref(new Date())
const genDateTo = ref<Date | null>(null)
const genUserId = ref<number | null>(null)

const showSetRate = ref(false)
const rateLoading = ref(false)
const rateUsers = ref<(UserOut & { _rate: number })[]>([])

async function loadUsers() {
  const res = await systemApi.listUsers({ offset: 0, limit: 200, include_inactive: false })
  users.value = res.items
}

async function loadSummary() {
  const res = await productionApi.getHourlySummary({ month: query.month || undefined, user_id: query.user_id || undefined })
  summary.total_hours = res.total_hours
  summary.total_amount = res.total_amount
}

async function reload(reset = false) {
  if (reset) query.offset = 0
  loading.value = true
  try {
    const [listRes] = await Promise.all([
      productionApi.listHourlyItems({ ...query, month: query.month || undefined, user_id: query.user_id || undefined }),
      loadSummary(),
    ])
    items.value = listRes.items
    total.value = listRes.total
  } finally {
    loading.value = false
  }
}

function onPageChange(p: number) {
  query.offset = (p - 1) * query.limit
  reload(false)
}

async function onGenerate() {
  if (!genDateFrom.value) {
    ElMessage.warning('请选择开始日期')
    return
  }
  genLoading.value = true
  try {
    const dFrom = dayjs(genDateFrom.value).format('YYYY-MM-DD')
    const dTo = genDateTo.value ? dayjs(genDateTo.value).format('YYYY-MM-DD') : undefined
    await productionApi.generateTimeItems({
      date_from: dFrom,
      date_to: dTo,
      user_id: genUserId.value || undefined,
    })
    ElMessage.success('计时工资已生成')
    showGenerate.value = false
    await reload(true)
  } finally {
    genLoading.value = false
  }
}

async function loadRateUsers() {
  const res = await systemApi.listUsers({ offset: 0, limit: 200, include_inactive: false })
  rateUsers.value = res.items
    .filter((u) => u.salary_type !== 'piece')
    .map((u) => ({ ...u, _rate: u.hourly_rate ?? 0 }))
}

async function onSaveRates() {
  rateLoading.value = true
  try {
    for (const u of rateUsers.value) {
      if (u._rate !== (u.hourly_rate ?? 0)) {
        await systemApi.updateUser(u.id, { hourly_rate: u._rate })
      }
    }
    ElMessage.success('时薪已更新')
    showSetRate.value = false
  } finally {
    rateLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([loadUsers(), loadRateUsers()])
  await reload(true)
})
</script>
