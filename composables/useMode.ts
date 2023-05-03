export enum modes {
  edit = "Edit",
  save = "Save",
}
const currentMode = ref<modes>(modes.save);
const setMode = () => {
  if (currentMode.value == modes.edit) {
    currentMode.value = modes.save;
  } else {
    currentMode.value = modes.edit;
  }
};

export default function useMode() {
  return { setMode, currentMode };
}
