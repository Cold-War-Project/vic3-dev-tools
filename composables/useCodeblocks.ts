const codeblocks = ref<{ [key: string]: string[] }>({
  // "buttonName": ["popType = numWorkers", ...]
});

export default function useCodeblocks() {
  return { codeblocks };
}
