<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { getUserData, getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const user = ref(null);
const name = ref("");
const informations = ref<any[]>([]);
const partners = ref<any[]>([]);
const status = ref(false);
const settings = ref(null);

// --- State untuk Slider Banner ---
const sliderRef = ref<HTMLElement | null>(null);
const nextIsVisible = ref(false);
const prevIsVisible = ref(false);
const banners = ref<any[]>([]);

// --- Fungsi Fetching ---
const fetchInformation = async () => {
  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/information", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    informations.value = data?.data ?? [];
  } catch (error: any) {
    console.error("Gagal mengambil data info:", error);
  }
};

const fetchPartner = async () => {
  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/partner", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    partners.value = data?.data ?? [];
  } catch (error: any) {
    console.error("Gagal mengambil data partner:", error);
  }
};

const fetchBanner = async () => {
  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/banner", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    const data = await response.json();
    banners.value = data?.data ?? [];
    setTimeout(initScroll, 500);
  } catch (error) {
    console.error("Gagal mengambil banner:", error);
  }
};

// --- Logika Kontrol Slider ---
const initScroll = (): void => {
  const el = sliderRef.value;
  if (!el) return;
  prevIsVisible.value = el.scrollLeft > 10;
  nextIsVisible.value = el.scrollLeft < el.scrollWidth - el.offsetWidth - 10;
};

const scrollToLeft = (): void => {
  sliderRef.value?.scrollBy({ left: -300, behavior: 'smooth' });
};

const scrollToRight = (): void => {
  sliderRef.value?.scrollBy({ left: 300, behavior: 'smooth' });
};

// --- Helpers ---
function maskNumber(number: string): string {
  number = number.toString();
  if (number.length < 8) return number;
  return number.slice(0, 2) + "****" + number.slice(-4);
}

onMounted(async () => {
  user.value = await getUserData();
  settings.value = await getSetting();
  if (user.value) {
    name.value = user.value.name;
    status.value = user.value.anggota?.anggota_detail && user.value.anggota?.status == 1;
  }
  await Promise.all([fetchPartner(), fetchInformation(), fetchBanner()]);
  initScroll();
});
</script>

<template>
  <section class="min-h-screen bg-[#0A052E] pb-24 relative overflow-hidden rounded-[2rem]" id="home">
    <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <AtomsContainer class="pt-6 px-4 md:px-6 relative z-10">
      
      <div class="w-full mx-auto mb-10">
        <div class="relative h-12 overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center">
          <div class="absolute left-0 z-20 bg-[#0A052E] h-full flex items-center px-5 rounded-l-full border-r border-white/10">
             <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>
          <div class="marquee-container flex items-center whitespace-nowrap">
            <div class="marquee-content flex items-center gap-12 pl-16">
              <div v-for="(info, idx) in informations" :key="idx" class="flex items-center gap-3">
                <p class="text-sm md:text-base text-slate-300 font-medium">
                  <span class="text-blue-400 font-bold mr-1">{{ maskNumber(String(info.number)) }}</span>
                  <span class="opacity-80">Berjaya Mengeluarkan</span>
                  <span class="ml-2 font-black text-white bg-blue-500/20 px-2 py-0.5 rounded text-sm">
                    RM{{ Number(info.nominal).toLocaleString("en-MY") }}
                  </span>
                </p>
                <span class="text-white/20">•</span>
              </div>
              <div v-for="(info, idx) in informations" :key="'dup-'+idx" class="flex items-center gap-3">
                <p class="text-sm md:text-base text-slate-300 font-medium">
                  <span class="text-blue-400 font-bold mr-1">{{ maskNumber(String(info.number)) }}</span>
                  <span class="opacity-80">Berjaya Mengeluarkan</span>
                  <span class="ml-2 font-black text-white bg-blue-500/20 px-2 py-0.5 rounded text-sm">
                    RM{{ Number(info.nominal).toLocaleString("en-MY") }}
                  </span>
                </p>
                <span class="text-white/20">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-14 mb-16 shadow-2xl">
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span class="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Limit Tersedia</span>
            </div>
            <h1 class="text-xl md:text-3xl font-bold text-white tracking-tight">
              {{ $t("home.card.title") }}, <span class="text-blue-400">{{ name }}</span> 👋
            </h1>
            <p class="text-slate-400 text-lg font-light max-w-md">{{ $t("home.card.description") }}</p>
            <div class="flex items-baseline gap-3">
              <span class="text-xl font-medium text-slate-500">RM</span>
              <span class="text-3xl font-black text-white tracking-tighter">5,000 - 200,000</span>
            </div>
          </div>
          <NuxtLink :to="status ? '/loan' : '#'" class="group relative inline-flex items-center px-10 py-5 font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-500 transition-all" :class="!status ? 'opacity-40 cursor-not-allowed' : ''">
            <span>{{ t("home.card.button") }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </NuxtLink>
        </div>
      </div>

      <div class="mb-16">
        <div class="relative group">
          <div class="flex absolute top-1/2 -left-4 -translate-y-1/2 z-20 transition-all" :class="prevIsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <button @click="scrollToLeft" class="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-blue-600/40 transition-all">
              <IconsPrevIco class="w-6 h-6" />
            </button>
          </div>
          <div class="flex absolute top-1/2 -right-4 -translate-y-1/2 z-20 transition-all" :class="nextIsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'">
            <button @click="scrollToRight" class="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-blue-600/40 transition-all">
              <IconsNextIco class="w-6 h-6" />
            </button>
          </div>

          <div ref="sliderRef" @scroll="initScroll" class="flex gap-6 overflow-x-auto invisible-scroll snap-x snap-mandatory py-4">
            <div v-for="(banner, index) in banners" :key="index" class="min-w-[85%] md:min-w-[33%] lg:min-w-[25%] snap-center">
              <div class="relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm hover:border-blue-500/50 transition-all">
                <CardsRecentPod :title="banner.title" duration="" href="#" :cover-image="`${banner.image}`" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0A052E] via-transparent opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full mx-auto">
        <div class="text-center mb-14">
            <p class="text-blue-400 text-xs font-bold uppercase tracking-[0.3em] mb-3">Informasi Perkhidmatan</p>
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">{{ t("home.information.title") }}</h2>
            <div class="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full"></div>
        </div>

        <div class="space-y-8 text-slate-300 leading-relaxed text-lg italic opacity-90">
          <p class="border-l-2 border-blue-500/30 pl-6">{{ t("home.information.p-1") }}</p>
          <p class="border-l-2 border-blue-500/30 pl-6">{{ t("home.information.p-2") }}</p>
        </div>

        <div class="grid grid-cols-1 gap-4 pt-12">
          <div v-for="i in [1, 2, 3]" :key="i" class="group bg-white/[0.03] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all flex items-center gap-6">
            <div class="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-2xl group-hover:scale-110 transition-transform">
              <span v-if="i === 1">⚡️</span>
              <span v-else-if="i === 2">🔒</span>
              <span v-else>🤝</span>
            </div>
            <p class="text-slate-200 font-medium text-base md:text-lg">{{ t(`home.information.content-${i}`) }}</p>
          </div>
        </div>
      </div>

      <div class="mt-24 pb-12">
        <div class="flex items-center gap-4 mb-10">
            <div class="h-[1px] flex-grow bg-white/10"></div>
            <p class="text-slate-500 text-[10px] font-bold tracking-[0.4em] uppercase">Rakan Niaga Rasmi</p>
            <div class="h-[1px] flex-grow bg-white/10"></div>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div v-for="(partner, index) in partners" :key="index" class="flex justify-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group">
            <img :src="`${partner.image}`" class="w-full h-full w-auto object-contain filter transition-all duration-500" alt="Partner Logo" />
          </div>
        </div>
      </div>

    </AtomsContainer>
  </section>
</template>

<style scoped>
/* Marquee Styles */
.marquee-container {
  overflow: hidden;
  width: 100%;
}
.marquee-content {
  display: flex;
  animation: marquee 40s linear infinite;
}
.marquee-container:hover .marquee-content {
  animation-play-state: paused;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Slider Styles */
.invisible-scroll::-webkit-scrollbar {
  display: none;
}
.invisible-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

#home {
  background-attachment: fixed;
}
</style>