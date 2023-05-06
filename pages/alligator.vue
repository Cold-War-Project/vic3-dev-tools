<script lang="ts" setup>
import { FileObject } from "@supabase/storage-js";
definePageMeta({
  name: "index",
  middleware: ["auth"],
});

const { activeButton } = useButtons();
const { loadedFile, setLoadedFile } = useFile();
const { fileList, setFileList } = useFileList();
const { username, fetchUserData } = useUserData();
const { loading, setLoading } = useLoading();
const user = useSupabaseUser();
const supabase = useSupabaseClient();
const loadMenuOpen = ref(false);

async function uploadFile(file: File) {
  setLoading(true);
  if (file.type !== "text/plain") {
    console.error("File must be a text file. Got:", file.type);
    return;
  }
  if (!user.value) throw new Error("User not logged in, cannot upload file");
  await supabase.storage
    .from("files")
    .upload(`${user.value.id}/${file.name}`, file, {
      upsert: true,
      cacheControl: "0",
    })
    .then(async ({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log(`Uploaded file: ${file.name}`);
        setFileList(await getFileList());
        loadMenuOpen.value = true;
        setLoading(false);
      }
    });
}

async function loadFile(filename: string) {
  setLoading(true);
  if (!user.value) throw new Error("User not logged in, cannot download file");
  await supabase.storage
    .from("files")
    .download(`${user.value.id}/${filename}`)
    .then(({ data, error }) => {
      if (error) {
        throw error;
      } else {
        console.log(`Downloaded file: ${filename}`);
        setLoadedFile(URL.createObjectURL(data), filename);
        loadMenuOpen.value = false;
        setLoading(false);
      }
    });
}

const getFileList = async (): Promise<FileObject[]> => {
  setLoading(true);
  let outputData: FileObject[] = [];
  if (!user.value) throw new Error("User not logged in, cannot get file list");
  await supabase.storage
    .from("files")
    .list(`${user.value.id}`)
    .then(({ data, error }) => {
      if (error) {
        throw error;
      } else {
        console.log(`Got file list`);
        outputData = data;
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setLoading(false);
    });

  return outputData;
};

const formatUsernamePossessive = () => {
  if (username.value.endsWith("s")) {
    return `${username.value}'`;
  } else {
    return `${username.value}'s`;
  }
};

setFileList(await getFileList());
onBeforeMount(async () => {
  await fetchUserData(supabase, user.value);
});
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-row gap-5 items-end justify-self-end">
      <FormButton
        type="button"
        text="Load"
        @click="
          async () => {
            setFileList(await getFileList());
            loadMenuOpen = !loadMenuOpen;
          }
        "
      >
        <font-awesome-icon icon="fa-solid fa-download" />
      </FormButton>
      <div class="form-control w-full max-w-xs">
        <div class="label">
          <label class="label-text"> Upload a file. </label>
        </div>
        <input
          type="file"
          @change="uploadFile($event.target.files[0])"
          class="file-input file-input-bordered w-full max-w-xs"
        />
      </div>
    </div>
    <details style="cursor: pointer" :open="loadMenuOpen">
      <summary>{{ formatUsernamePossessive() }} Files</summary>
      <ul>
        <div v-for="file in fileList" :key="file.name">
          <button class="btn btn-xs" @click.prevent="loadFile(file.name)">
            {{ file.name }}
          </button>
        </div>
      </ul>
    </details>
    <Picker />
    <Editor
      v-if="activeButton"
      @gatherData="
        async (data: File) => {
          await uploadFile(data)
            .then(async () => {
              await loadFile(data.name);
            })
            .catch((error) => console.error(error));
        }
      "
    />
  </div>
</template>
