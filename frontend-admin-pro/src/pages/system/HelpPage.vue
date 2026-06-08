<template>
  <div class="guide-page h-full flex gap-0">
    <div
      class="guide-sidebar shrink-0 border-r border-gray-200 bg-white flex flex-col transition-all duration-300"
      :class="sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'"
    >
      <div class="shrink-0 px-4 pt-4 pb-2" v-if="sidebarOpen">
        <el-input
          v-model="searchQuery"
          :placeholder="t('system.help.searchPlaceholder') || '搜索章节...'"
          size="small"
          clearable
          :prefix-icon="Search"
          class="guide-search"
        />
      </div>
      <div class="flex-1 overflow-y-auto px-2 pb-4" v-if="sidebarOpen">
        <div
          v-for="part in filteredData"
          :key="part.id"
          class="mb-1"
        >
          <div
            class="guide-part-title flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-semibold cursor-pointer select-none hover:bg-gray-50 transition-colors"
            :class="{ 'text-blue-600 bg-blue-50': activePart === part.id }"
            @click="togglePart(part.id)"
          >
            <component :is="getIcon(part.icon)" class="w-4 h-4 shrink-0" v-if="part.icon" />
            <span class="truncate">{{ part.title }}</span>
            <el-icon class="ml-auto text-gray-400 transition-transform duration-200" :class="{ 'rotate-90': expandedParts.has(part.id) }">
              <CaretRight />
            </el-icon>
          </div>
          <div v-show="expandedParts.has(part.id)" class="ml-1">
            <template v-for="ch in part.children" :key="ch.id">
              <div
                class="guide-chapter-title flex items-center gap-1.5 px-3 py-1.5 mt-0.5 rounded-lg text-xs font-medium cursor-pointer select-none hover:bg-gray-50 transition-colors"
                :class="{
                  'text-blue-600 bg-blue-50': activeChapter === ch.id,
                  'text-gray-700': activeChapter !== ch.id
                }"
                @click="toggleChapter(part.id, ch.id)"
              >
                <component :is="getIcon(ch.icon)" class="w-3.5 h-3.5 shrink-0 text-gray-400" v-if="ch.icon" />
                <span class="truncate">{{ ch.title }}</span>
                <el-icon class="ml-auto text-gray-300 transition-transform duration-200" :class="{ 'rotate-90': expandedChapters.has(ch.id) }" v-if="ch.children?.length">
                  <CaretRight />
                </el-icon>
              </div>
              <div v-show="expandedChapters.has(ch.id)">
                <div
                  v-for="sec in ch.children"
                  :key="sec.id"
                  class="guide-section-item flex items-center gap-2 pl-7 pr-3 py-1.5 my-0.5 rounded-lg text-xs cursor-pointer select-none transition-colors"
                  :class="{
                    'text-blue-600 bg-blue-50 font-medium': activeSection === sec.id,
                    'text-gray-500 hover:text-gray-700 hover:bg-gray-50': activeSection !== sec.id
                  }"
                  @click="navigateTo(sec.id)"
                >
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="activeSection === sec.id ? 'bg-blue-500' : 'bg-gray-300'" />
                  <span class="truncate">{{ sec.title }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div v-if="filteredData.length === 0" class="text-center text-gray-400 text-xs py-8">
          未找到匹配的章节
        </div>
      </div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col bg-gray-50">
      <div class="guide-toolbar shrink-0 flex items-center gap-2 px-4 py-2 bg-white border-b border-gray-200">
        <el-button text size="small" @click="sidebarOpen = !sidebarOpen" class="!px-1">
          <el-icon :size="18"><Menu /></el-icon>
        </el-button>
        <el-breadcrumb separator="/" class="text-xs">
          <el-breadcrumb-item v-for="(crumb, idx) in breadcrumbs" :key="crumb.id">
            <span v-if="idx < breadcrumbs.length - 1" class="text-gray-400">{{ crumb.title }}</span>
            <span v-else class="text-gray-700 font-medium">{{ crumb.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="ml-auto flex items-center gap-2">
          <el-button text size="small" @click="navigatePrev" :disabled="!prevId">
            <el-icon><ArrowLeft /></el-icon>
            <span class="hidden sm:inline">上一节</span>
          </el-button>
          <el-button text size="small" @click="navigateNext" :disabled="!nextId">
            <span class="hidden sm:inline">下一节</span>
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div v-if="currentSection" class="max-w-4xl mx-auto">
          <div class="guide-content bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-8">
            <div class="prose prose-sm sm:prose-base max-w-none" v-html="currentSection.content"></div>
            <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
              <el-button text size="small" @click="navigatePrev" :disabled="!prevId">
                <el-icon><ArrowLeft /></el-icon>
                {{ prevTitle || '上一节' }}
              </el-button>
              <el-button text size="small" @click="navigateNext" :disabled="!nextId">
                {{ nextTitle || '下一节' }}
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="max-w-4xl mx-auto">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div class="text-gray-300 mb-4">
              <el-icon :size="64"><Reading /></el-icon>
            </div>
            <h2 class="text-xl font-semibold text-gray-700 mb-2">LightMes 系统使用指南</h2>
            <p class="text-gray-400 text-sm mb-8">请从左侧目录选择一个章节开始阅读</p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div
                v-for="part in guideData"
                :key="part.id"
                class="border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
                @click="expandPartAndNavigate(part)"
              >
                <component :is="getIcon(part.icon)" class="w-8 h-8 mx-auto mb-2 text-blue-500" v-if="part.icon" />
                <div class="text-sm font-medium text-gray-700">{{ part.title }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ countSections(part) }} 个章节</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  Search, Menu, ArrowLeft, ArrowRight, CaretRight, Reading,
  Setting, Tools, Box, Money, List, User, Edit, Monitor,
  Coin, DataBoard, QuestionFilled, Key, ShoppingCart, Document
} from '@element-plus/icons-vue'
import guideData, { findSectionById, getBreadcrumb, flattenSections, type GuideSection } from '@/data/guide-data'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const searchQuery = ref('')
const activeSection = ref('')
const expandedParts = ref(new Set<string>())
const expandedChapters = ref(new Set<string>())

const currentSection = computed(() => {
  if (!activeSection.value) return undefined
  return findSectionById(activeSection.value)
})

const allSections = computed(() => flattenSections(guideData))

const currentIndex = computed(() => {
  const idx = allSections.value.findIndex(s => s.id === activeSection.value)
  return idx
})

const prevId = computed(() => {
  if (currentIndex.value > 0) return allSections.value[currentIndex.value - 1].id
  return null
})

const nextId = computed(() => {
  if (currentIndex.value >= 0 && currentIndex.value < allSections.value.length - 1)
    return allSections.value[currentIndex.value + 1].id
  return null
})

const prevTitle = computed(() => {
  if (prevId.value) {
    const s = findSectionById(prevId.value)
    return s ? s.title : ''
  }
  return ''
})

const nextTitle = computed(() => {
  if (nextId.value) {
    const s = findSectionById(nextId.value)
    return s ? s.title : ''
  }
  return ''
})

const breadcrumbs = computed(() => {
  if (!activeSection.value) return []
  return getBreadcrumb(activeSection.value)
})

const filteredData = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return guideData

  const result: GuideSection[] = []
  for (const part of guideData) {
    const matchedChildren: GuideSection[] = []
    for (const ch of part.children || []) {
      const matchedSections = (ch.children || []).filter(s =>
        s.title.toLowerCase().includes(q)
      )
      if (matchedSections.length > 0) {
        matchedChildren.push({ ...ch, children: matchedSections })
      } else if (ch.title.toLowerCase().includes(q)) {
        matchedChildren.push(ch)
      }
    }
    if (matchedChildren.length > 0) {
      result.push({ ...part, children: matchedChildren })
    } else if (part.title.toLowerCase().includes(q)) {
      result.push(part)
    }
  }
  return result
})

const activePart = computed(() => {
  const bc = breadcrumbs.value
  return bc.length > 0 ? bc[0].id : ''
})

const activeChapter = computed(() => {
  const bc = breadcrumbs.value
  return bc.length > 1 ? bc[1].id : ''
})

function getIcon(name?: string) {
  const map: Record<string, any> = {
    Setting, Tools, Box, Money, List, User, Edit, Monitor,
    Coin, DataBoard, QuestionFilled, Key, ShoppingCart, Document
  }
  return name && map[name] ? map[name] : null
}

function togglePart(id: string) {
  const set = expandedParts.value
  if (set.has(id)) set.delete(id)
  else set.add(id)
}

function toggleChapter(partId: string, chId: string) {
  const set = expandedChapters.value
  if (set.has(chId)) {
    set.delete(chId)
  } else {
    expandedParts.value.add(partId)
    set.add(chId)
  }
}

function expandPartAndNavigate(part: GuideSection) {
  expandedParts.value.add(part.id)
  if (part.children && part.children.length > 0) {
    const firstCh = part.children[0]
    expandedChapters.value.add(firstCh.id)
    if (firstCh.children && firstCh.children.length > 0) {
      navigateTo(firstCh.children[0].id)
    } else if (firstCh.content) {
      navigateTo(firstCh.id)
    }
  }
}

function navigateTo(id: string) {
  activeSection.value = id
  const bc = getBreadcrumb(id)
  if (bc.length >= 2) {
    expandedParts.value.add(bc[0].id)
    expandedChapters.value.add(bc[1].id)
  }
  const el = document.querySelector('.guide-content')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function navigatePrev() {
  if (prevId.value) navigateTo(prevId.value)
}

function navigateNext() {
  if (nextId.value) navigateTo(nextId.value)
}

function countSections(part: GuideSection): number {
  let count = 0
  for (const ch of part.children || []) {
    count += ch.children?.length || (ch.content ? 1 : 0)
  }
  return count
}
</script>

<style scoped>
.guide-page {
  height: calc(100vh - 52px);
}

.guide-sidebar {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

.guide-sidebar::-webkit-scrollbar {
  width: 4px;
}

.guide-sidebar::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 4px;
}

.guide-content :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.guide-content :deep(h4) {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.guide-content :deep(p) {
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 0.75rem;
}

.guide-content :deep(ol),
.guide-content :deep(ul) {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.guide-content :deep(li) {
  color: #4b5563;
  line-height: 1.75;
  margin-bottom: 0.25rem;
}

.guide-content :deep(li > ul),
.guide-content :deep(li > ol) {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

.guide-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0.75rem 0 1rem;
  font-size: 0.875rem;
}

.guide-content :deep(th) {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  text-align: left;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
}

.guide-content :deep(td) {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  color: #4b5563;
}

.guide-content :deep(tr:nth-child(even) td) {
  background-color: #f9fafb;
}

.guide-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: #d63384;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.guide-content :deep(strong) {
  color: #1f2937;
  font-weight: 600;
}

.guide-content :deep(blockquote) {
  border-left: 3px solid #3b82f6;
  background-color: #f0f7ff;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0;
  border-radius: 0 0.5rem 0.5rem 0;
  color: #4b5563;
  font-size: 0.875rem;
}

.guide-search :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

.guide-search :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #3b82f6 inset;
}

.guide-section-item {
  position: relative;
}

.guide-toolbar :deep(.el-breadcrumb__inner) {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .guide-sidebar {
    position: fixed;
    top: 52px;
    left: 0;
    bottom: 0;
    z-index: 50;
    box-shadow: 4px 0 12px rgba(0,0,0,0.1);
  }
}
</style>
