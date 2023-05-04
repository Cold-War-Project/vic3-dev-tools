<script setup lang="ts">
const { scrollSpeed } = useScrollSpeed();
const { codeblocks } = useCodeblocks();

const codeblockRegex =
  /(^.*?)(?=\s*=\s*\{)\s*=\s*\{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)\}/gm;

async function getData(): Promise<Record<string, string[]>> {
  const { data } = await useFetch<Record<string, string[]>>(
    "/data/in/01_industry.txt",
    {
      method: "GET",
      mode: "cors",
      credentials: "same-origin",
      retry: 3,
      headers: {
        "Content-Type": "text/plain",
      },
      baseURL: "http://localhost:3000",
      parseResponse: async (
        response
      ): Promise<Record<string, string[]> | null> => {
        return await parseData(response);
      },
      onRequestError: (error) => {
        console.error(error);
      },
    }
  );

  return data.value ?? {};
}

async function parseData(data: string) {
  let match;
  let output: Record<string, string[]> = {};
  while ((match = codeblockRegex.exec(data)) !== null) {
    const buttonName = match[1].trim();
    const codeblock = match[2].split("\n").map((line) => line.trim());
    output[buttonName] = codeblock;
  }
  return output;
}

function ScrollHorizontal(event: WheelEvent) {
  if (!event.currentTarget) return;
  const currentTarget = event.currentTarget as HTMLDivElement;
  currentTarget.scrollLeft += event.deltaY * scrollSpeed.value;
}

const data = await getData();

onBeforeMount(() => {
  codeblocks.value = data;
});
</script>

<template>
  <div class="flex flex-row">
    <div
      @wheel.prevent="ScrollHorizontal($event)"
      class="my-5 flex flex-col flex-wrap gap-2 max-h-72 overflow-x-scroll scroll-smooth will-change-scroll w-full"
    >
      <div v-for="(codeblock, buttonName) in codeblocks" :key="buttonName">
        <PMButton :buttonName="buttonName" />
      </div>
    </div>
  </div>
</template>
