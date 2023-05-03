<script lang="ts" setup></script>

<template>
  <div class="container mx-auto flex flex-col max-w-10/12 items-center">
    <Navbar>
      <SpeedBar />
    </Navbar>

    <NuxtPage />
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
