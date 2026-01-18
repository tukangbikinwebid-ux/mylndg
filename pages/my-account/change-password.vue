<script setup lang="ts">
const { t } = useI18n();

import { getUserData, getSetting } from "@/composables/utils";
const user = ref(null);
const settings = ref(null);
// Cek token saat komponen dimuat
onMounted(async () => {
  try {
    settings.value = await getSetting();
    if(settings.value.maintenance == 1) {
      window.location.href = "/maintenance"; 
    }
    
    user.value = await getUserData();
    if(user.value.email_verified_at == null){
      window.location.href = "/kode-otp"; // Redirect jika gagal ambil data
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/sign-in"; // Redirect jika gagal ambil data
  }
});

useHead({
  title: "My Solution Lending",
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
    <SectionsMyAccountChangePassword />
    <CardsNavigasiFooter title="my-account" type="menu" />
  </div>
</template>
