<script lang="ts" setup></script>

<template>
  <div class="container mx-auto max-w-3xl">
    <div class="flex flex-col gap-10 items-center">
      <Navbar class="sticky top-0 bg-base-100">
        <SpeedBar />
      </Navbar>
      <NuxtPage />
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
