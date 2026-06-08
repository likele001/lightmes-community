<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getStoredTenantCode } from '@/utils/tenant'
import DashboardPreview from '@/components/official/DashboardPreview.vue'
import PhonePreview from '@/components/official/PhonePreview.vue'
import { userRoles } from '@/data/official-content'

const loginPath = computed(() => {
  const code = getStoredTenantCode()
  return code ? `/t/${code}/login` : '/login'
})

const principles = [
  '产品与型号独立管理，工价与「型号 × 工序」强关联',
  '工资只基于审核通过的报工记录计算',
  '报工支持图片/视频证据，审核可直接查看',
  'Windows / Linux 均可部署，无需 Docker',
]

const techStack = [
  { title: '后端', desc: 'Python FastAPI · SQLAlchemy · MySQL · Celery + Redis' },
  { title: 'PC 前端', desc: 'Vue 3 · TypeScript · Element Plus · 管理后台' },
  { title: '移动 H5', desc: 'Vue 3 · Vant 4 · 扫码报工 · 客户下单' },
]

onMounted(() => {
  document.title = '关于 LightMes'
})
</script>

<template>
  <div class="official-container">
    <header class="official-page-head">
      <p class="official-section__eyebrow">关于我们</p>
      <h1 class="official-page-head__title">为中小型加工厂而生</h1>
      <p class="official-page-head__desc">
        LightMes 是 KeleMes 轻量化重构版，PC 管全局、手机干现场，快速交付不折腾。
      </p>
    </header>

    <section class="official-section" style="padding-top: 0" aria-labelledby="platform-about">
      <div class="official-platforms">
        <div>
          <h2 id="platform-about" class="official-section__title" style="font-size: 1.25rem">双端一体</h2>
          <p class="official-section__desc" style="margin-bottom: var(--lm-space-6)">
            管理端排产报表，员工端扫码报工，客户端自助下单——同一套数据，不同角色不同视图。
          </p>
          <div class="official-showcase__phones">
            <PhonePreview screen="home" label="员工端" />
            <PhonePreview screen="report" label="报工端" />
          </div>
        </div>
        <DashboardPreview label="PC 管理后台" />
      </div>
    </section>

    <section class="official-section official-section--bordered" aria-labelledby="roles-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">角色场景</p>
        <h2 id="roles-heading" class="official-section__title">谁在用</h2>
        <p class="official-section__desc">同一套系统，不同角色看到不同视图与权限。</p>
      </div>
      <div class="official-role-grid">
        <article
          v-for="role in userRoles"
          :key="role.role"
          class="official-role-card"
          :style="{ '--role-accent': role.color }"
        >
          <p class="official-role-card__role">{{ role.role }}</p>
          <h3 class="official-role-card__title">{{ role.title }}</h3>
          <ul class="official-role-card__list">
            <li v-for="p in role.points" :key="p">{{ p }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="official-section official-section--bordered" aria-labelledby="principles-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">设计原则</p>
        <h2 id="principles-heading" class="official-section__title">我们坚持的事</h2>
      </div>
      <div class="official-feature-list">
        <article v-for="p in principles" :key="p" class="official-feature-card">
          <div class="official-feature-card__icon official-feature-card__icon--cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M9 12 11 14 15 10" stroke-linecap="round" stroke-linejoin="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div>
            <p class="official-feature-card__desc" style="margin: 0">{{ p }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="official-section official-section--bordered" aria-labelledby="stack-heading">
      <div class="official-section__head">
        <p class="official-section__eyebrow">技术栈</p>
        <h2 id="stack-heading" class="official-section__title">稳定可靠</h2>
      </div>
      <div class="official-chip-grid">
        <article v-for="t in techStack" :key="t.title" class="official-chip">
          <h3 class="official-chip__title">{{ t.title }}</h3>
          <p class="official-chip__desc">{{ t.desc }}</p>
        </article>
      </div>
    </section>

    <aside class="official-cta">
      <p class="official-cta__title">接入你的工厂</p>
      <p class="official-cta__desc">登录体验 PC 后台与移动端报工、任务流与工资统计。</p>
      <router-link class="official-btn official-btn--primary official-btn--block" :to="loginPath">
        登录系统
      </router-link>
    </aside>

    <footer class="official-footer-bar">
      <p>© LightMes · 轻量化生产管理系统</p>
    </footer>
  </div>
</template>
