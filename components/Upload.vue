<script lang="ts" setup>
import { Database } from "~/utils/database.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { avatar, updateUserData } = useUserData();
const { avatarPath, uploadAvatar } = useAvatar();

const { loading, setLoading } = useLoading();
const files = ref();

const generateRandomString = (length = 18) =>
  Math.random().toString(20).substring(2, length);

async function handleUpload(event: { target: { files: any } }) {
  files.value = event.target.files;
  setLoading(true);
  if (!files.value || files.value.length === 0) {
    return;
  }
  await uploadAvatar(supabase, files.value, generateRandomString())
    .then(() => {
      if (!user.value) return;
      updateUserData(
        {
          id: user.value?.id,
          avatar_url: avatarPath.value,
          updated_at: new Date().toDateString(),
        },
        supabase
      );
    })
    .catch((error) => {
      console.error("Error uploading avatar:", error.message);
    })
    .finally(() => {
      setLoading(false);
    });
}
</script>

<template>
  <div class="flex flex-row gap-5">
    <form class="form-control w-full">
      <label class="label">
        <span class="label-text">Upload a new profile pic!</span>
      </label>
      <div class="flex flex-row gap-5 items-center">
        <Avatar disabled class="" />
        <input
          type="file"
          accept="image/*"
          :disabled="uploading"
          @change="handleUpload"
          class="file-input file-input-bordered file-input-primary w-full max-w-xs"
        />
        <Spinner v-if="loading" />
      </div>
    </form>
  </div>
</template>
