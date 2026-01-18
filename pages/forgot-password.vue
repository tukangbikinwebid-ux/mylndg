<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUserData, getSetting } from "@/composables/utils";

const settings = ref(null);
const isLoading = ref(true);

// SEO & Meta
useHead({
  title: "Lupa Kata Laluan - My Solution Lending",
  meta: [
    { name: "description", content: "Pulihkan akses akaun anda dengan selamat." }
  ]
});

onMounted(async () => {
  try {
    settings.value = await getSetting();
    
    // Check Maintenance
    if (settings.value?.maintenance == 1) {
      window.location.href = "/maintenance";
      return;
    }
    
    // Redirect jika sudah log masuk
    const token = getCookie("token");
    if (token) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    isLoading.value = false;
  }
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}
</script>

<template>
  <section 
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent px-4"
  >
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
    
    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[130px] rounded-full"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
    
    <div class="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl animate-pulse"></div>

    <div class="relative w-full max-w-md z-10">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      </div>

      <transition name="fade-up" appear>
        <div v-if="!isLoading">
          <div class="flex justify-center mb-8">
            <div class="p-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
              <img 
                src="/logo-flexyduit.png" 
                alt="My Solution Lending" 
                class="h-12 w-auto brightness-110"
              />
            </div>
          </div>

          <div 
            class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10"
          >
            <div class="text-center mb-8">
              <h1 class="text-3xl font-bold text-white tracking-tight">Pulihkan Akaun</h1>
              <p class="text-slate-400 mt-2 text-sm font-light">
                Masukkan butiran anda untuk menetapkan semula kata laluan
              </p>
            </div>

            <SectionsForgotPassword />

            <div class="mt-8 pt-6 border-t border-white/5 text-center">
              <NuxtLink 
                to="/sign-in" 
                class="group text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2"
              >
                <i class="fa-solid fa-arrow-left text-xs transition-transform group-hover:-translate-x-1"></i>
                Kembali ke Log Masuk
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
/* Animasi Entrance */
.fade-up-enter-active {
  transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

/* Penyelarasan untuk input di dalam komponen SectionsForgotPassword */
:deep(input) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
  border-radius: 1rem !important;
}

:deep(input:focus) {
  border-color: rgba(59, 130, 246, 0.5) !important;
  background-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
}

:deep(label) {
  color: #cbd5e1 !important; /* slate-300 */
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  margin-left: 0.25rem !important;
}

:deep(button[type="submit"]) {
  background: #2563eb !important;
  border-radius: 1rem !important;
  font-weight: 700 !important;
  transition: all 0.3s ease !important;
}

:deep(button[type="submit"]:hover) {
  background: #3b82f6 !important;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4) !important;
}
</style>