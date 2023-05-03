<script lang="ts" setup>
defineProps<{
  data: string;
  label: string;
  placeholder: string;
  type: string;
}>();
defineEmits<{
  "update:data": (value: string) => void;
}>();
</script>

<template>
  <label class="input-group">
    <span>{{ label }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :key="label"
      class="input input-bordered focus:input-primary transform duration-150 ease-in-out"
      :value="data"
      @input="$emit('update:data', $event.target.value)"
    />
  </label>
</template>
