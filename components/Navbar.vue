p
<script lang="ts" setup>
const mode = useMode();
const currentMode = mode.currentMode;
const setMode = mode.setMode;

const buttons = useButtons();
const activeButton = buttons.activeButton;
</script>

<template>
  <div class="flex flex-row items-center justify-between my-10">
    <div class="prose">
      <h3 v-if="currentMode == 'Save'" class="p-2">PM Alligator 🐊</h3>
      <h3 v-else class="bg-error text-error-content p-2">
        PM Alligator 😠🐊⚠️
      </h3>
    </div>
    <div class="flex flex-row items-center gap-5">
      <slot />
      <button
        @click="setMode"
        :disabled="activeButton == '' || activeButton == null ? true : false"
        class="btn"
        :class="currentMode == 'Edit' ? 'btn-success' : 'btn-error '"
      >
        {{ currentMode == "Edit" ? "Return to Safety" : "Enter Edit Mode" }}
      </button>
      <div class="avatar online">
        <div class="w-12 rounded-full">
          <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
    </div>
  </div>
</template>
