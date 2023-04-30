export const activeButton = ref<string>("");
export const toggleButton = (button: string) => {
  activeButton.value = button;
};
export enum modes {
  edit = "Edit",
  save = "Save",
}
export const currentMode = ref<modes>(modes.save);
export const setMode = () => {
  if (currentMode.value == modes.edit) {
    currentMode.value = modes.save;
  } else {
    currentMode.value = modes.edit;
  }
};
