<template>
  <div class="admin-filter-bar flex items-center justify-between gap-3 flex-wrap">
    <div v-if="$slots.leading" class="flex items-center gap-2 flex-wrap min-w-0">
      <slot name="leading" />
    </div>
    <div class="flex items-center gap-2 flex-wrap ml-auto">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
