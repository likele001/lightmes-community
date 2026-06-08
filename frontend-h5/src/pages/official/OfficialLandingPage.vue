<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getStoredTenantCode } from '@/utils/tenant'
import PhonePreview from '@/components/official/PhonePreview.vue'
import DashboardPreview from '@/components/official/DashboardPreview.vue'
import { coreFeatures, highlights, workflowSteps } from '@/data/official-content'

const loginPath = computed(() => {
  const code = getStoredTenantCode()
  return code ? `/t/${code}/login` : '/login'
})

const previewScreens = [
  { screen: 'home' as const, label: '工作看板' },
  { screen: 'report' as const, label: '扫码报工' },
  { screen: 'tasks' as const, label: '任务列表' },
]

const iconPaths: Record<string, string> = {
  'shopping-cart': 'M6 6h15l-1.5 9h-12L6 6Zm3 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  scan: 'M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 1-1 1h-2M8 12h8',
  wallet: 'M3 7a2 2 0 0 1 2-2h14v14H5a2 2 0 0 1-2-2V7Zm16 0v2H7a2 2 0 0 0 0 4h12v-6Z',
  'shield-check': 'M12 3 20 7v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7l8-4Zm-1 9 2 2 4-4',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  'check-circle': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  monitor: 'M2 3h20v14H2Zm3 17h14M12 21v-4',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm-1-4v5h5M8 13h8M8 17h5',
}

onMounted(() => {
  document.title = 'LightMes · 轻量化生产管理'
})
</script>

<template>
  <div class="official-container">
    <!-- Hero：左文案 + 右预览（PC 双栏） -->
    <header class="official-hero">
      <div class="official-hero-grid">
        <div class="official-hero__content">
          <div class="official-badge">
            <span class="official-badge__dot" />
            中小型加工厂 · 全端覆盖
          </div>
          <h1 class="official-hero__title">
            深色工业风<br>也能<em>轻快</em>管生产
          </h1>
          <p class="official-hero__desc">
            PC 管理后台排产派工，手机扫码报工算薪——从下单到发货，一套系统跑通加工厂全流程。
          </p>
          <div class="official-hero__actions">
            <router-link class="official-btn official-btn--primary" :to="loginPath">立即登录</router-link>
            <router-link class="official-btn official-btn--ghost" to="/site/features">浏览功能</router-link>
          </div>
          <div class="official-highlights">
            <div v-for="h in highlights" :key="h.label" class="official-highlight">
              <strong>{{ h.label }}</strong>
              <span>{{ h.desc }}</span>
            </div>
          </div>
        </div>

        <div class="official-showcase">
          <div class="official-showcase__dash">
            <DashboardPreview label="PC 管理后台" />
          </div>
          <div class="official-showcase__float">
            <PhonePreview screen="report" label="员工 H5" />
            <PhonePreview screen="home" label="移动看板" />
          </div>
        </div>
      </div>
    </header>

    <!-- 全端能力 -->
    <section class="official-section official-section--bordered" aria-labelledby="platform-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">全端协同</p>
        <h2 id="platform-heading" class="official-section__title">PC 管全局，手机干实事</h2>
        <p class="official-section__desc">
          厂长在电脑前看报表排产，员工在车间扫码报工——两端数据实时同步。
        </p>
      </div>
      <div class="official-platforms">
        <DashboardPreview label="订单 · 排产 · 报表 · 大屏" />
        <div>
          <span class="official-platform-tag">移动端 H5</span>
          <div class="official-carousel">
            <div v-for="item in previewScreens" :key="item.label" class="official-carousel__item">
              <PhonePreview :screen="item.screen" :label="item.label" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento 核心能力 -->
    <section class="official-section official-section--bordered" aria-labelledby="core-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">核心能力</p>
        <h2 id="core-heading" class="official-section__title">八大高频场景，开箱即用</h2>
        <p class="official-section__desc">不搞大而全的复杂部署，聚焦加工厂真正每天在用的事。</p>
      </div>
      <div class="official-bento">
        <article
          v-for="f in coreFeatures"
          :key="f.title"
          class="official-feature-card"
        >
          <div class="official-feature-card__icon" :class="`official-feature-card__icon--${f.color}`">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
              <path :d="iconPaths[f.icon]" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <div>
            <h3 class="official-feature-card__title">{{ f.title }}</h3>
            <p class="official-feature-card__desc">{{ f.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <!-- 流程预览 -->
    <section class="official-section official-section--bordered" aria-labelledby="flow-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">生产流程</p>
        <h2 id="flow-heading" class="official-section__title">从下单到算薪，四步闭环</h2>
        <router-link to="/site/workflow" class="official-link">查看完整流程 →</router-link>
      </div>
      <div class="official-timeline official-timeline--horizontal">
        <article v-for="step in workflowSteps" :key="step.step" class="official-step">
          <div class="official-step__num">{{ step.step }}</div>
          <div>
            <span class="official-step__tag">{{ step.tag }}</span>
            <h3 class="official-step__title">{{ step.title }}</h3>
            <p class="official-step__desc">{{ step.desc }}</p>
          </div>
        </article>
      </div>
    </section>

    <aside class="official-cta">
      <p class="official-cta__title">准备好接入你的工厂？</p>
      <p class="official-cta__desc">登录后即可体验 PC 后台与移动端报工、任务推送和工资统计。</p>
      <router-link class="official-btn official-btn--primary official-btn--block" :to="loginPath">
        进入系统
      </router-link>
    </aside>

    <footer class="official-footer">
      <p>LightMes · 轻量化生产管理系统</p>
    </footer>
  </div>
</template>
