<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getStoredTenantCode } from '@/utils/tenant'
import '@/styles/official.css'

const route = useRoute()

const loginPath = computed(() => {
  const code = getStoredTenantCode()
  return code ? `/t/${code}/login` : '/login'
})

const navItems = [
  { path: '/site', label: '首页' },
  { path: '/site/features', label: '功能' },
  { path: '/site/workflow', label: '流程' },
  { path: '/guide', label: '指南' },
  { path: '/site/about', label: '关于' },
] as const

const tabs = [
  { path: '/site', label: '首页', icon: 'home' },
  { path: '/site/features', label: '功能', icon: 'grid' },
  { path: '/site/workflow', label: '流程', icon: 'flow' },
  { path: '/guide', label: '指南', icon: 'book' },
  { path: '/site/about', label: '关于', icon: 'info' },
] as const

function isActive(tabPath: string): boolean {
  if (tabPath === '/site') return route.path === '/site'
  return route.path.startsWith(tabPath)
}
</script>

<template>
  <div class="official-root">
    <header class="official-header">
      <router-link class="official-brand" to="/site">
        <span class="official-brand__mark">LM</span>
        <div>
          <span class="official-brand__name">LightMes</span>
          <span class="official-brand__tag">MES · 生产管理</span>
        </div>
      </router-link>

      <nav class="official-nav-desktop" aria-label="主导航">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="official-nav-desktop__link"
          :class="{ 'is-active': isActive(item.path) }"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="official-header__actions">
        <router-link class="official-header__login" :to="loginPath">登录系统</router-link>
      </div>
    </header>

    <main class="official-main">
      <router-view />
    </main>

    <nav class="official-tabbar" aria-label="移动端导航">
      <router-link
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="official-tab"
        :class="{ 'is-active': isActive(tab.path) }"
      >
        <svg v-if="tab.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="m3 10.5 9-7 9 7" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
        </svg>
        <svg v-else-if="tab.icon === 'grid'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <svg v-else-if="tab.icon === 'flow'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M4 6h16M4 12h10M4 18h14" /><circle cx="18" cy="12" r="2" /><circle cx="20" cy="18" r="2" />
        </svg>
        <svg v-else-if="tab.icon === 'book'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" />
        </svg>
        <span>{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>
</template>
