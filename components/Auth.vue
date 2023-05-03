<script lang="ts" setup>
import { Database } from "~/utils/database.types";
import { AuthError } from "@supabase/supabase-js";
const supabase = useSupabaseClient<Database>();
const loading = ref(false);
const email = ref("");

async function handleLogin() {
  loading.value = true;
  await supabase.auth
    .signInWithOtp({ email: email.value })
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
    <label class="text-2xl bg-accent text-accent-content rounded"
      >Welcome to tools.vic3.dev <br />
      Enter your email and we'll send you a magic link!
    </label>
    <InputGroup
      label="Email"
      placeholder="info@site.com"
      type="email"
      v-model:data="email"
    />
    <FormButton type="submit" text="submit" extraClassStyle="btn-primary" />
  </form>
</template>
