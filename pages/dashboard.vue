<script lang="ts" setup>
import { Database } from "~/utils/database.types";
const supabase = useSupabaseClient<Database>();
const loading = ref(true);
const username = ref("");
const avatar_path = ref("");
const hasEnteredText = ref(false);
const email = ref("");

definePageMeta({
  name: "dashboard",
  middleware: ["auth"],
});

loading.value = true;
const user = useSupabaseUser();
if (user.value?.email) {
  email.value = user.value.email;
}

async function getUserData() {
  let { data } = await supabase
    .from("profiles")
    .select(`username, website, avatar_url`)
    .eq("id", user.value?.id)
    .single();

  if (data) {
    if (data.username && data.avatar_url) {
      username.value = data.username;
      avatar_path.value = data.avatar_url;
    }
  }

  loading.value = false;
}

async function updateProfile() {
  loading.value = true;
  if (!user.value) return;
  const updates = {
    id: user.value.id,
    username: username.value,
    avatar_url: avatar_path.value,
    updated_at: new Date().toDateString(),
  };

  await supabase
    .from("profiles")
    .upsert(updates)
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log("Profile updated");
        alert("Profile updated!");
      }
    });

  loading.value = false;
}

async function signOut() {
  loading.value = true;
  await supabase.auth
    .signOut()
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log("Signed out");
        alert("Signed out!");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("There was an issue logging out. Try again.");
    });
}

function userEnteredText() {
  if (hasEnteredText.value) {
    return;
  } else {
    hasEnteredText.value = true;
  }
}

onBeforeMount(async () => {
  await getUserData();
});
</script>

<template>
  <form @submit.prevent="updateProfile">
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
    <FormButton
      type="submit"
      :text="loading ? 'loading...' : 'update'"
      :extraClassStyle="hasEnteredText ? 'btn-primary' : 'btn-disabled'"
    />
    <FormButton type="button" text="sign out" @click="signOut" />
  </form>
</template>
