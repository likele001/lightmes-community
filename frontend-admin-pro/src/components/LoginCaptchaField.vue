<template>
  <el-form-item v-if="enabled" :label="t('common.captcha')">
    <div class="flex gap-2 items-center w-full min-h-10">
      <el-input
        v-model="state.captcha_code"
        maxlength="6"
        autocomplete="off"
        :placeholder="t('common.pleaseEnterCaptcha')"
        class="flex-1"
      />
      <div
        class="shrink-0 h-10 w-[128px] border border-[#dcdfe6] rounded flex items-center justify-center cursor-pointer bg-[#f5f7fa] overflow-hidden"
        :title="loadError ? t('common.loadFailedRetry') : t('common.clickRefreshCaptcha')"
        @click="refresh"
      >
        <img
          v-if="state.image_base64 && !loading"
          :src="`data:image/png;base64,${state.image_base64}`"
          class="h-full w-full object-contain"
          :alt="t('common.captcha')"
        />
        <span v-else-if="loading" class="text-xs text-[#909399]">{{ t('common.loading') }}</span>
        <span v-else class="text-xs text-[#409eff] px-1 text-center">{{ t('common.clickRefresh') }}</span>
      </div>
    </div>
    <p v-if="loadError" class="text-xs text-[#f56c6c] mt-1">{{ loadError }}</p>
  </el-form-item>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLoginCaptcha } from '@/composables/useLoginCaptcha'

const { t } = useI18n()
const { enabled, loading, loadError, state, refresh, payloadFields } = useLoginCaptcha()

function validate(): boolean {
  if (!enabled.value) return true
  return Boolean(state.captcha_code.trim())
}

defineExpose({ payloadFields, refresh, validate, enabled, state })
</script>
