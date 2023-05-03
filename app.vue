<script lang="ts" setup>
const user = useSupabaseUser();
</script>

<template>
  <div class="container mx-auto flex flex-col max-w-8/12 items-center">
    <Main v-if="user" />
    <Auth v-else />
  </div>
</template>

<style>
input::--webkit-outer-spin-button,
input::--webkit-inner-spin-button {
  appearance: none;
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: none;
  -moz-appearance: textfield;
}
</style>
