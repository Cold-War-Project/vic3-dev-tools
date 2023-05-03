<script lang="ts" setup>
definePageMeta({
  name: "index",
  middleware: ["auth"],
});

const { activeButton } = useButtons();
</script>

<template>
  <div class="w-4/5">
    <Picker />
    <Editor v-if="activeButton" />
  </div>
</template>
