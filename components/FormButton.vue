<script lang="ts" setup>
defineProps<{
  extraClassStyle?: string;
  type?: "button" | "submit";
  text: string;
}>();
</script>

<template>
  <button
    :type="type ? type : 'button'"
    class="btn gap-2"
    :class="extraClassStyle ? extraClassStyle : ''"
  >
    {{ text }}
    <slot />
  </button>
</template>
