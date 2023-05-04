<script lang="ts" setup></script>

<template>
  <div class="prose flex flex-col gap-4 items-start">
    <h3>What are we workin' on today?</h3>
    <NuxtLink to="/alligator">
      <FormButton
        type="button"
        :text="'Allocate PMs'"
        :extraClassStyle="'btn-primary'"
      />
    </NuxtLink>
  </div>
</template>
