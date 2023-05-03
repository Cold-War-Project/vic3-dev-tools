const activeButton = ref<string>("");
const toggleButton = (button: string) => {
  activeButton.value = button;
};

export default function useButtons() {
  return { toggleButton, activeButton };
}
