<script setup lang="ts">
import { Database } from "~/utils/database.types";
const { scrollSpeed } = useScrollSpeed();
const { codeblocks } = useCodeblocks();
const { loadedFile } = useFile(); //reference to local file object as a URL
const { loading, setLoading } = useLoading();

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

const codeblockRegex =
  /(^.*?)(?=\s*=\s*\{)\s*=\s*\{((?:[^{}]*|{(?:[^{}]*|{[^{}]*})*})*)\}/gm;

const deleteFile = async (filename: string) => {
  setLoading(true);
  if (!user.value) throw new Error("User not logged in, cannot delete file");
  await supabase.storage
    .from("files")
    .remove([`/${user.value.id}/${filename}`])
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log(`Deleted file: ${filename}`);
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setLoading(false);
    });
};

async function getData(): Promise<Record<string, string[]>> {
  const { data } = await useFetch<Record<string, string[]>>(
    loadedFile.value.url,
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

watch(
  () => loadedFile.value,
  async () => {
    codeblocks.value = await getData();
  },
  { deep: true }
);
</script>

<template>
  <div class="flex flex-row">
    <Spinner v-if="loading" />
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
