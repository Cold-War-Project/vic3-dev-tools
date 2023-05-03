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
    class="btn"
    :class="extraClassStyle ? extraClassStyle : ''"
  >
    {{ text }}
  </button>
</template>
