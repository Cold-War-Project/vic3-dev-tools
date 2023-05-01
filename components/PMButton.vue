<script lang="ts" setup>
const props = defineProps<{
  buttonName: string;
}>();

const buttons = useButtons();
const activeButton = buttons.activeButton;
const toggleButton = buttons.toggleButton;

const mode = useMode();
const currentMode = mode.currentMode;

const isActiveButton = ref(false);

const handlePMSelect = () => {
  toggleButton(props.buttonName);
};

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
      @click="handlePMSelect"
      :disabled="currentMode == 'Save' || isActiveButton ? false : true"
      class="btn btn-xs"
      :class="isActiveButton ? 'btn-primary' : ''"
    >
      {{ buttonName }}
    </button>
  </div>
</template>
