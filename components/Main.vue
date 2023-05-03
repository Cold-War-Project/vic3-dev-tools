<script lang="ts" setup></script>

<template>
  <div class="w-4/5">
    <Navbar>
      <SpeedBar />
    </Navbar>
    <Picker />
    <Editor v-if="activeButton" />
  </div>
</template>
