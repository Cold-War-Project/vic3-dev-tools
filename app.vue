<script lang="ts" setup>
const { activeButton } = useButtons();
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col items-center">
      <Navbar>
        <SpeedBar />
      </Navbar>
      <Picker />
      <Editor v-if="activeButton" />
    </div>
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
