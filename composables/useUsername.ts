const username = ref("");
function setUsername(name: string) {
  username.value = name;
}

export default function useUsername() {
  return { username, setUsername };
}
