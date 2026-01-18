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
    if (user.value.email_verified_at == null) {
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
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background Image -->
    <div class="fixed inset-0 z-0">
      <img 
        src="/background.webp" 
        alt="Background" 
        class="w-full h-full object-cover object-center"
      />
      <!-- Glassmorphism Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#0A052E]/85 via-[#0A052E]/75 to-[#1a1050]/80 backdrop-blur-[2px]"></div>
    </div>
    <SectionsMyAccountList />
    <CardsNavigasiFooter title="my-account" type="menu" />
  </div>
</template>
