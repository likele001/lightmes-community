<template>
  <div class="admin-empty flex flex-col items-center justify-center py-10 px-4 text-center">
    <el-icon :size="48" class="admin-empty__icon mb-3 opacity-60">
      <Box />
    </el-icon>
    <p class="text-[14px] text-[var(--admin-brand-subtitle)]">{{ resolvedDescription }}</p>
    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Box } from '@element-plus/icons-vue'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    description?: string
  }>(),
  {
    description: '',
  }
)

const resolvedDescription = computed(() => props.description || t('common.noDataText'))
</script>

<style scoped>
.admin-empty__icon {
  color: var(--el-color-primary);
}
</style>
