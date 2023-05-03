// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-vitest", "@nuxtjs/supabase"],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    cookies: {
      domain: process.env.ENDPOINT,
      lifetime: 365,
      sameSite: "lax",
    },
  },
});
