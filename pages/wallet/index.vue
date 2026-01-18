<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getUserData, getSetting } from "@/composables/utils";

const { t } = useI18n();
const user = ref(null);
const settings = ref(null);
const isLoading = ref(true);

// Cek token saat komponen dimuat
onMounted(() => {
  const init = async () => {
    try {
      settings.value = await getSetting();
      
      // Maintenance Check
      if (settings.value?.maintenance == 1) {
        window.location.href = "/maintenance";
        return;
      }

      user.value = await getUserData();
      
      // Verification Check
      if (user.value && user.value.email_verified_at == null) {
        window.location.href = "/kode-otp";
        return;
      }
    } catch (error) {
      console.error(error);
      window.location.href = "/sign-in";
    } finally {
      isLoading.value = false;
    }
  };

  init();
});

useHead({
  title: "Dompet - My Solution Lending",
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
  <div class="min-h-screen text-slate-200 relative overflow-hidden pb-24">
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

    <div class="absolute top-[-5%] left-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-10%] w-[50%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <header class="sticky top-0 z-40 bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5">
      <div class="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <div class="flex flex-col">
          <h1 class="text-xl font-bold text-white tracking-tight">
            Dompet Saya
          </h1>
          <p class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em]">Financial Overview</p>
        </div>
        
        <div class="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-[10px] text-green-500 font-bold uppercase">Terverifikasi</span>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-5 pt-8">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p class="text-sm text-slate-500 animate-pulse">Memuat data dompet...</p>
      </div>

      <div v-else class="animate-enter">
        <div class="rounded-[2.5rem] overflow-hidden">
            <SectionsWalletList />
        </div>

        <div class="mt-8 p-6 bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-3xl">
            <div class="flex items-start gap-4 text-slate-400 text-sm italic">
                <i class="fa-solid fa-circle-info mt-1 text-blue-500"></i>
                <p>Pastikan semua data transaksi anda selaras dengan profil yang didaftarkan untuk proses pengeluaran yang lebih lancar.</p>
            </div>
        </div>
      </div>
    </main>

    <CardsNavigasiFooter title="wallet" type="menu" />
  </div>
</template>

<style scoped>
/* Animasi Masuk */
.animate-enter {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom styling agar SectionsWalletList menyatu */
:deep(.wallet-list-container) {
    background: transparent !important;
}
</style>