p
<script lang="ts" setup>
const mode = useMode();
const currentMode = mode.currentMode;
const setMode = mode.setMode;

const buttons = useButtons();
const activeButton = buttons.activeButton;
</script>

<template>
  <div class="flex flex-row justify-between align-middle my-5">
    <div class="prose">
      <h1 v-if="currentMode == 'Save'" class="p-2">PM Alligator 🐊</h1>
      <h1 v-else class="bg-error text-error-content p-2">
        PM Alligator 😠🐊⚠️
      </h1>
    </div>
    <div class="flex flex-col">
      <button
        @click="setMode"
        :disabled="activeButton == '' || activeButton == null ? true : false"
        :class="currentMode == 'Edit' ? 'btn btn-success' : 'btn btn-error'"
      >
        {{ currentMode == "Edit" ? "Return to Safety" : "Enter Edit Mode" }}
      </button>
    </div>
  </div>
</template>
