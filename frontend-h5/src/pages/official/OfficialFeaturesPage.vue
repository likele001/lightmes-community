<script setup lang="ts">
import { onMounted } from 'vue'
import { featureModules } from '@/data/official-content'

onMounted(() => {
  document.title = '功能模块 · LightMes'
})
</script>

<template>
  <div class="official-container">
    <header class="official-page-head">
      <p class="official-section__eyebrow">功能模块</p>
      <h1 class="official-page-head__title">覆盖加工厂全流程</h1>
      <p class="official-page-head__desc">从客户下单到工资结算，模块可按需启用、快速交付。PC 与移动端能力一体规划。</p>
    </header>

    <section
      v-for="mod in featureModules"
      :key="mod.group"
      class="official-module"
      :style="{ '--module-accent': mod.accent }"
      :aria-labelledby="`mod-${mod.group}`"
    >
      <h2 :id="`mod-${mod.group}`" class="official-module__label">{{ mod.group }}</h2>
      <div class="official-chip-grid official-chip-grid--dense">
        <article v-for="item in mod.items" :key="item.title" class="official-chip">
          <h3 class="official-chip__title">{{ item.title }}</h3>
          <p class="official-chip__desc">{{ item.desc }}</p>
        </article>
      </div>
    </section>

    <footer class="official-footer-bar">
      <p>详细操作请参阅系统内智能帮助与操作手册</p>
    </footer>
  </div>
</template>
