<script setup lang="ts">
const { t } = useI18n();
useHead({
  title: "Flexyduit",
  meta: [
    {
      name: "description",
      content: t("welcome"),
    },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/logo-flexyduit.png" }],
});
</script>
<template>
  <div>
    <SectionsFormOtp />
  </div>
</template>
