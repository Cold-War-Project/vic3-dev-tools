<script lang="ts" setup>
const props = defineProps<{
  buttonName: string;
}>();

const { activeButton, setActiveButton } = useButtons();
const { currentMode } = useMode();
const isActiveButton = ref(false);

watch(
  () => activeButton.value,
  () => {
    isActiveButton.value = activeButton.value == props.buttonName;
  }
);
</script>

<template>
  <div>
    <button
      @click="setActiveButton(buttonName)"
      :disabled="currentMode == 'Save' || isActiveButton ? false : true"
      class="btn btn-xs"
      :class="isActiveButton ? 'btn-primary' : ''"
    >
      {{ buttonName }}
    </button>
  </div>
</template>
