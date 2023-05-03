<script lang="ts" setup>
import { Database } from "~/utils/database.types";
import { AuthError } from "@supabase/supabase-js";
const supabase = useSupabaseClient<Database>();
const loading = ref(false);
const email = ref("");
definePageMeta({
  name: "auth",
});

async function handleLogin() {
  loading.value = true;
  await supabase.auth
    .signInWithOtp({
      email: email.value,
      options: {
        emailRedirectTo: "http://localhost:3001/",
      },
    })
    .then(({ error }) => {
      if (error) {
        throw error;
      } else {
        console.log("OTP sent");
        alert("Check your email for the login link!");
      }
    })
    .catch((error: AuthError) => {
      console.error(error);
      alert(
        "Oops, one of us f***ed up!\nDouble check your email and try again."
      );
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <form
    @submit.prevent="handleLogin"
    class="form-control gap-10 place-content-center h-screen max-w-sm"
  >
    <div class="prose">
      <h3>Welcome to:</h3>
      <h1 class="text-center">tools.vic3.dev</h1>
      <p>Enter your email and we'll send you a magic link!</p>
    </div>
    <InputGroup
      label="Email"
      placeholder="info@site.com"
      type="email"
      v-model:data="email"
    />
    <FormButton type="submit" text="submit 🚀" extraClassStyle="btn-primary" />
  </form>
</template>
