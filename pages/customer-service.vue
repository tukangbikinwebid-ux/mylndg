<script setup lang="ts">
const { t } = useI18n();

useHead({
  title: "My Solution Lending - Customer Service",
  meta: [
    {
      name: "description",
      content: t("chat.title"),
    },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/logo-flexyduit.png" }],
});
</script>
<template>
  <div>
    <SectionsCustomerServiceChat />
  </div>
</template>
