<script lang="ts" setup>
const props = defineProps<{
  popType: string;
}>();
</script>

<template>
  <div>
    <label class="label cursor-pointer">
      <span class="label-text px-2">{{ popType }}</span>
      <input
        type="checkbox"
        checked="checked"
        class="checkbox checkbox-primary"
      />
    </label>
  </div>
</template>
