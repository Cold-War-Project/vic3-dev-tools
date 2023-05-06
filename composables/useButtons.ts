const activeButton = ref<string>("");
const setActiveButton = (button: string) => {
  activeButton.value = button;
};

export default function useButtons() {
  return { setActiveButton, activeButton };
}
