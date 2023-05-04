<script lang="ts" setup>
const { avatar } = useAvatar();
</script>

<template>
  <button
    type="button"
    class="avatar online w-12 h-12"
    @click="$router.push('/')"
  >
    <div
      class="transition w-12 rounded-full duration-150 ease-in-out hover:ring ring-primary ring-offset-base-100"
    >
      <img :src="avatar" alt="Avatar" />
    </div>
  </button>
</template>
