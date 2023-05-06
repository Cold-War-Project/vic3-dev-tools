<script lang="ts" setup>
const { currentMode, setMode } = useMode();
const { activeButton } = useButtons();
const { avatar } = useUserData();
const router = useRouter();
</script>

<template>
  <div class="container mx-auto">
    <div
      class="flex flex-row items-center justify-between my-10 w-full"
      v-if="router.currentRoute.value.path !== '/auth'"
    >
      <button
        class="transition duration-150 ease-in-out prose hover:bg-primary-focus rounded-md text-primary-content"
        @click="$router.push('/')"
      >
        <h3 v-if="currentMode == 'Save'" class="p-2">tools.vic3.dev</h3>
        <h3 v-else class="bg-error text-error-content p-2">
          tools.vic3.dev 😠
        </h3>
      </button>
      <div class="flex flex-row items-center gap-5">
        <slot />
        <button
          @click="setMode"
          :disabled="activeButton == '' || activeButton == null ? true : false"
          class="btn"
          :class="currentMode == 'Edit' ? 'btn-success' : 'btn-error '"
        >
          {{ currentMode == "Edit" ? "Return to Safety" : "Enter Edit Mode" }}
        </button>
        <Avatar />
      </div>
    </div>
  </div>
</template>
