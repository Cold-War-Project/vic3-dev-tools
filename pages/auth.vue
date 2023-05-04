<script lang="ts" setup>
import { Database } from "~/utils/database.types";
import { AuthError } from "@supabase/supabase-js";
const client = useSupabaseAuthClient<Database>();
const loading = ref(false);
const router = useRouter();
definePageMeta({
  name: "auth",
  middleware: [
    function (to, from) {
      const user = useSupabaseUser();
      if (user.value) {
        return navigateTo("/");
      }
    },
  ],
});

async function handleLogin(provider: "github" | "gitlab" | "bitbucket") {
  loading.value = true;
  await client.auth
    .signInWithOAuth({ provider })
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        router.push("/");
      }
    })
    .catch((error: AuthError) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="gap-10 place-content-center h-screen max-w-sm">
    <div class="prose">
      <h3>Welcome to:</h3>
      <h1 class="text-center">tools.vic3.dev</h1>
    </div>
    <FormButton
      text="Login with GitHub"
      extraClassStyle="btn-primary"
      @click="handleLogin('github')"
    >
      <font-awesome-icon icon="fa-brands fa-github" />
    </FormButton>
    <FormButton
      text="Login with Bitbucket"
      extraClassStyle="btn-primary"
      @click="handleLogin('bitbucket')"
    >
      <font-awesome-icon icon="fa-brands fa-bitbucket" />
    </FormButton>
    <FormButton
      text="Login with GitLab"
      extraClassStyle="btn-primary"
      @click="handleLogin('gitlab')"
    >
      <font-awesome-icon icon="fa-brands fa-gitlab" />
    </FormButton>
  </div>
</template>
