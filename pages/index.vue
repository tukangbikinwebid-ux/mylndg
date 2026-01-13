<script setup lang="ts">
import { ref, computed, onMounted } from "vue"; // Menambahkan computed ke import
import { getUserData, getSetting } from "@/composables/utils";

// Mengambil fungsi i18n
const { t } = useI18n();

const user = ref(null);
const displayUsername = computed(() => {
  if (!user.value?.email) return "";
  // Mengambil teks sebelum karakter '@'
  return user.value.email.split('@')[0];
});

const settings = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    settings.value = await getSetting();
    
    // Maintenance Check
    if (settings.value?.maintenance == 1) {
      window.location.href = "/maintenance";
      return;
    }
    
    user.value = await getUserData();
  } catch (error) {
    console.error("Error fetching home data:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-[#0A052E] text-slate-200 pb-24 relative overflow-hidden">
    <div class="absolute top-[-10%] right-[-10%] w-[70%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute top-[20%] left-[-10%] w-[50%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <header class="sticky top-0 z-40 bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div class="flex flex-col">
          <h1 class="text-xl font-bold bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent leading-tight">
            {{ settings?.tagline || 'Selamat Datang' }}
          </h1>
          <p class="text-[10px] text-blue-400 font-semibold uppercase tracking-[0.2em] mt-0.5">Premium Membership</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-5 pt-8 space-y-10">
      
      <section v-if="user" class="animate-enter">
        <div class="flex items-center gap-3">
            <div class="h-1 bg-blue-500 w-8 rounded-full"></div>
            <h2 class="text-2xl font-light text-slate-300">
                Hai, <span class="font-bold text-white capitalize">{{ displayUsername }}</span> 👋
            </h2>
        </div>
      </section>

      <div class="transform transition-all duration-500 hover:scale-[1.01] animate-enter" style="animation-delay: 0.1s">
        <div class="rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-2xl p-1 shadow-2xl">
            <SectionsHomeCard />
        </div>
      </div>

      <div class="space-y-4 animate-enter" style="animation-delay: 0.2s">
        <div class="flex justify-between items-center px-2">
            <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Promosi Terkini</h3>
            <span class="text-xs text-blue-400">Lihat Semua</span>
        </div>
        <div class="rounded-[2rem] overflow-hidden shadow-2xl border border-white/5">
          <SectionsHomeSlide />
        </div>
      </div>

    </main>

    <div class="fixed bottom-0 left-0 w-full z-50">
        <div class="absolute inset-0 bg-[#0A052E]/80 backdrop-blur-2xl border-t border-white/5"></div>
        <CardsNavigasiFooter title="home" type="menu" class="relative z-10" />
    </div>
  </div>
</template>

<style scoped>
/* Menghilangkan scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animasi Premium Entrance */
.animate-enter {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom shadow untuk elemen floating */
.glass-shadow {
    shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>