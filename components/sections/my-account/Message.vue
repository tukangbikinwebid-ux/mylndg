<template>
  <section 
    class="relative min-h-screen bg-[#0A052E] pb-32 overflow-hidden" 
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-5%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />

      <AtomsContainer class="mt-24 px-5">
        <div class="relative">
          <div class="flex items-center gap-3 mb-8">
            <div class="h-1 bg-blue-500 w-8 rounded-full"></div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Mesej & Notifikasi</h2>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-slate-400 animate-pulse text-sm">Menyemak peti masuk...</p>
          </div>

          <div v-else-if="errorMessage" class="bg-red-500/10 border border-red-500/20 p-5 rounded-3xl text-red-400 text-center animate-enter">
            <i class="fa-solid fa-circle-exclamation mb-2 block text-2xl"></i>
            <p class="text-sm">{{ errorMessage }}</p>
          </div>

          <div v-else class="space-y-5">
            <div
              v-for="(item, index) in notifications"
              :key="index"
              class="animate-enter group relative overflow-hidden bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
              :style="{ 'animation-delay': (index * 0.1) + 's' }"
            >
              <div class="flex items-start justify-between w-full mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.1)]">
                    <i class="fa-solid fa-bell"></i>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {{ item.data.title }}
                    </h3>
                    <span class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-0.5">Official Update</span>
                  </div>
                </div>
                <div class="text-right">
                  <h4 class="text-[11px] text-slate-500 font-bold uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {{ formatDate(item.created_at) }}
                  </h4>
                </div>
              </div>

              <div 
                class="message-body text-slate-300 text-sm leading-relaxed pl-2 border-l-2 border-blue-500/30" 
                v-html="item.data.message"
              ></div>
            </div>

            <div v-if="notifications.length === 0" class="flex flex-col items-center justify-center py-24 opacity-30">
              <div class="w-20 h-20 mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <i class="fa-solid fa-envelope-open text-4xl text-slate-500"></i>
              </div>
              <p class="text-slate-400 font-medium tracking-wide">Tiada mesej baru untuk anda.</p>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>

    <CardsNavigasiFooter title="my-account" type="menu" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-message")}`
);

const notifications = ref([]);
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

const fetchNotification = async () => {
  isLoading.value = true;
  errorMessage.value = "";
  const token = getCookie("token");

  if (!token) {
    errorMessage.value = "Sesi tamat. Sila log masuk semula.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await fetch("https://cms.flexyduit.com/api/v1/notification", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`Ralat sistem (${response.status})`);

    const data = await response.json();
    // Path data disesuaikan dengan struktur API Laravel Notification
    notifications.value = data?.data.data.data ?? [];
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal mengambil data mesej.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    settings.value = await getSetting();
    fetchNotification();
  } catch (error) {
    console.error(error);
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

/* Styling content v-html */
.message-body :deep(strong) {
  color: #fff;
  font-weight: 700;
}

.message-body :deep(a) {
  color: #60a5fa;
  text-decoration: underline;
  text-underline-offset: 4px;
}

/* Hide Scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>