
<template>
    <h2 class="text-2xl md:text-3xl text-dark-800 dark:text-dark font-bold">
        {{ texte }}
    </h2>
</template>
<script lang="ts" setup>
const { texte } = defineProps<{texte:string}>()
</script>