<script lang="ts" setup>
const { scrollSpeed } = useScrollSpeed();

const minValue = 0;
const maxValue = 10;
const totalInputWidth = 194;
const thumbHalfWidth = 12;

const sliderLeft = computed(() => {
  return (
    ((scrollSpeed.value - minValue) / (maxValue - minValue)) *
      (totalInputWidth - thumbHalfWidth - thumbHalfWidth) +
    thumbHalfWidth / 2
  );
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col">
      <div
        class="tooltip tooltip-top"
        data-tip="🏃‍♂️ Sets horizontal scroll speed of box below"
      >
        <input
          type="range"
          min="0"
          max="10"
          v-model="scrollSpeed"
          class="range range-secondary w-42"
          step="1"
        />
      </div>
      <label
        class="label relative w-1"
        :style="`left: ${sliderLeft}px; padding: 0px`"
        >{{ scrollSpeed }}</label
      >
    </div>
  </div>
</template>
