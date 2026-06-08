<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getStoredTenantCode } from '@/utils/tenant'
import PhonePreview from '@/components/official/PhonePreview.vue'
import DashboardPreview from '@/components/official/DashboardPreview.vue'
import { workflowSteps } from '@/data/official-content'

const loginPath = computed(() => {
  const code = getStoredTenantCode()
  return code ? `/t/${code}/login` : '/login'
})

onMounted(() => {
  document.title = '生产流程 · LightMes'
})
</script>

<template>
  <div class="official-container official-container--narrow">
    <header class="official-page-head">
      <p class="official-section__eyebrow">生产流程</p>
      <h1 class="official-page-head__title">从下单到算薪</h1>
      <p class="official-page-head__desc">四个阶段串起加工厂日常闭环，PC 与手机在每个环节各司其职。</p>
    </header>

    <section class="official-timeline" aria-label="生产流程">
      <article v-for="step in workflowSteps" :key="step.step" class="official-step">
        <div class="official-step__num">{{ step.step }}</div>
        <div>
          <span class="official-step__tag">{{ step.tag }}</span>
          <h2 class="official-step__title">{{ step.title }}</h2>
          <p class="official-step__desc">{{ step.desc }}</p>
        </div>
        <div class="official-step__preview">
          <PhonePreview
            v-if="step.step <= 3"
            :screen="step.screen"
            :label="step.step <= 2 ? '移动端' : '扫码报工'"
          />
          <DashboardPreview v-else label="PC 审核算薪" />
        </div>
      </article>
    </section>

    <aside class="official-cta">
      <p class="official-cta__title">从第一阶段开始</p>
      <p class="official-cta__desc">登录后创建或确认第一笔订单，系统自动分解工单。</p>
      <router-link class="official-btn official-btn--primary official-btn--block" :to="loginPath">
        开始试用
      </router-link>
    </aside>

    <footer class="official-footer-bar">
      <p>流程细节以系统操作手册为准</p>
    </footer>
  </div>
</template>
