const email = ref("");
function setEmail(input: string) {
  email.value = input;
}

export default function useEmail() {
  return { email, setEmail };
}
