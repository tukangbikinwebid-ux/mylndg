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
  <div>
    <SectionsSignIn />
  </div>
</template>
