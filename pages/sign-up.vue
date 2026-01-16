<script setup lang="ts">
import { ref, onMounted } from "vue";

import { getSetting } from "@/composables/utils";

const settings = ref(null);
// Cek token saat komponen dimuat
onMounted(async () => {
  settings.value = await getSetting();
  if(settings.value.maintenance == 1) {
    window.location.href = "/maintenance"; 
  }
  const token = getCookie("token");
  if (token) {
    window.location.href = "/"; // Redirect ke halaman sign-in jika token tidak ada
  }
});

// Fungsi untuk ambil token dari cookie
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}
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
    <SectionsSignUp />
  </div>
</template>
