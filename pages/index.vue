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
  <div class="min-h-screen text-slate-200 pb-24 relative overflow-hidden">
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
    
    <!-- Glossy Light Effects -->
    <div class="absolute top-[-10%] right-[-10%] w-[70%] h-[40%] bg-blue-500/15 blur-[150px] rounded-full z-[1]"></div>
    <div class="absolute top-[20%] left-[-10%] w-[50%] h-[30%] bg-indigo-500/15 blur-[120px] rounded-full z-[1]"></div>
    <div class="absolute bottom-[10%] right-[5%] w-[40%] h-[25%] bg-purple-500/10 blur-[100px] rounded-full z-[1]"></div>

    <header class="sticky top-0 z-40 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
        <div class="flex flex-col">
          <h1 class="text-lg sm:text-xl font-bold bg-gradient-to-r from-white via-white to-blue-400 bg-clip-text text-transparent leading-tight">
            {{ (settings as any)?.tagline || 'Selamat Datang' }}
          </h1>
          <p class="text-[9px] sm:text-[10px] text-blue-400 font-semibold uppercase tracking-[0.2em] mt-0.5">Premium Membership</p>
        </div>
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xl shadow-lg shadow-blue-500/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-5 pt-6 sm:pt-8 space-y-8 sm:space-y-10 rounded-lg no-scrollbar overflow-y-auto" style="max-height: calc(100vh - 96px);">
      
      <section v-if="user" class="animate-enter">
        <div class="flex items-center gap-2 sm:gap-3">
            <div class="h-0.5 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 w-5 sm:w-6 rounded-full flex-shrink-0"></div>
            <h2 class="text-sm sm:text-base font-light text-slate-300 flex items-center gap-1.5">
                Hai, <span class="font-semibold text-white capitalize">{{ displayUsername }}</span> 
                <span class="text-sm sm:text-base">👋</span>
            </h2>
        </div>
      </section>

      <div class="transform transition-all duration-500 hover:scale-[1.01] animate-enter" style="animation-delay: 0.1s">
        <div class="rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/[0.08] border border-white/15 backdrop-blur-2xl p-1 shadow-2xl shadow-black/20">
            <SectionsHomeCard />
        </div>
      </div>

      <div class="space-y-4 animate-enter" style="animation-delay: 0.2s">
        <div class="flex justify-between items-center px-1 sm:px-2">
            <h3 class="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-widest">Promosi Terkini</h3>
            <span class="text-xs text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">Lihat Semua</span>
        </div>
        <div class="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/30 border border-white/10 backdrop-blur-xl">
          <SectionsHomeSlide />
        </div>
      </div>

    </main>

    <div class="fixed bottom-0 left-0 w-full z-50">
        <div class="absolute inset-0 bg-white/5 backdrop-blur-2xl border-t border-white/15 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)]"></div>
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
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* Glass card effect */
.glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>