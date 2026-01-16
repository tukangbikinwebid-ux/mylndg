<template>
  <section 
    class="relative min-h-screen pb-28 overflow-hidden" 
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] left-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />

      <AtomsContainer class="mt-24 px-5">
        <div class="relative">
          <div class="flex items-center gap-3 mb-8">
            <div class="h-1 bg-blue-500 w-8 rounded-full"></div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Riwayat Transaksi</h2>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-slate-400 animate-pulse text-sm">Menyemak transaksi...</p>
          </div>

          <div v-else-if="errorMessage" class="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-center">
            <i class="fa-solid fa-circle-exclamation mb-2 block text-xl"></i>
            {{ errorMessage }}
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in transactionHistory"
              :key="index"
              class="animate-enter group relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20"
              :style="{ 'animation-delay': (index * 0.1) + 's' }"
            >
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <i class="fa-solid" :class="item.balance < 0 ? 'fa-arrow-up-right-from-square' : 'fa-wallet'"></i>
                  </div>
                  
                  <div class="flex flex-col">
                    <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {{ item.description }}
                    </h3>
                    <h4 class="text-[11px] text-slate-500 uppercase tracking-widest font-semibold mt-1">
                      {{ formatDate(item.created_at) }}
                    </h4>
                  </div>
                </div>

                <div class="text-right">
                  <div 
                    class="text-lg font-black tracking-tight"
                    :class="item.balance < 0 ? 'text-red-400' : 'text-green-400'"
                  >
                    {{ item.balance < 0 ? '-' : '+' }} RM {{ Math.abs(item.balance).toLocaleString("en-MY") }}
                  </div>
                  <p v-if="item.model?.description" class="text-[10px] text-slate-500 italic opacity-80 mt-1">
                    {{ item.model.description }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="transactionHistory.length === 0" class="text-center py-20 opacity-40">
              <i class="fa-solid fa-receipt text-6xl text-slate-600 mb-4"></i>
              <p class="text-slate-400">Tiada riwayat transaksi ditemui.</p>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-history")}`
);

const transactionHistory = ref([]);
const isLoading = ref(false);
const errorMessage = ref("");
const settings = ref(null);

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fetchTransactionHistory = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  const token = getCookie("token");

  if (!token) {
    errorMessage.value = "Sesi tamat. Sila log masuk semula.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/wallet/transactions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error(`Ralat sistem (${response.status})`);

    const data = await response.json();
    transactionHistory.value = data?.data.data ?? [];
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal mengambil data transaksi.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    fetchTransactionHistory();
    settings.value = await getSetting();
  } catch (error) {
    console.log(error);
  }
});

const myAccountBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)`,
  };
});
</script>

<style scoped>
/* Animasi Entrance Premium */
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

/* Glass Enhancement */
::-webkit-scrollbar {
  display: none;
}
</style>