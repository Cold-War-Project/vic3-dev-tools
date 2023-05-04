<script lang="ts" setup>
import { Database } from "~/utils/database.types";
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { email, username, fetchUserData, updateUserData } = useUserData();
const { avatarPath } = useAvatar();
const loading = ref(true);
const hasEnteredText = ref(false);

definePageMeta({
  name: "dashboard",
});

loading.value = true;

await fetchUserData(supabase, user.value)
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    loading.value = false;
  });

// async function updateProfile() {
//   loading.value = true;
//   if (!user.value) return;
//   await updateUserData(
//     {
//       id: user.value.id,
//       username: username.value,
//       avatar: avatar.value,
//       updated_at: new Date().toDateString(),
//     },
//     supabase
//   )
//     .catch((error) => {
//       console.error(error);
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// }

//

async function signOut() {
  loading.value = true;
  await supabase.auth
    .signOut()
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log("Signed out");
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
}

function userEnteredText() {
  if (hasEnteredText.value) {
    return;
  } else {
    hasEnteredText.value = true;
  }
}

fetchUserData(supabase, user.value);
</script>

<template>
  <div class="container mx-auto w-full">
    <div class="grid grid-flow-col grid-cols-12 gap-10">
      <DashboardNavigation class="col-span-3" />
      <form
        @submit.prevent="
          if (user)
            updateUserData(
              {
                id: user.id,
                username: username,
                avatar_url: avatarPath,
                updated_at: new Date().toDateString(),
              },
              supabase
            );
        "
        class="col-span-9 flex flex-col gap-10 items-end"
      >
        <Upload />
        <div class="flex flex-col gap-3 items-end">
          <InputGroup
            v-model:data="email"
            label="email"
            placeholder="info@email.com"
            type="email"
            :disabled="true"
          />
          <InputGroup
            v-model:data="username"
            label="username"
            placeholder="username"
            type="text"
            @change="userEnteredText"
          />
        </div>
        <div class="flex flex-row items-end gap-3">
          <FormButton
            type="submit"
            :text="loading ? 'loading...' : 'update'"
            :extraClassStyle="hasEnteredText ? 'btn-primary' : 'btn-disabled'"
          />
          <FormButton type="button" text="sign out" @click="signOut" />
        </div>
      </form>
    </div>
  </div>
</template>
