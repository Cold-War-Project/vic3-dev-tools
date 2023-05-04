// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "nuxt-vitest", "@nuxtjs/supabase"],
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  css: ["@fortawesome/fontawesome-svg-core/styles.css"],
});
