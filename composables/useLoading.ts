const loading = ref(false);

function setLoading(value: boolean) {
  loading.value = value;
}

export default function useLoading() {
  return { loading, setLoading };
}
