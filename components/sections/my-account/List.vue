<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { getUserData, getSetting } from "@/composables/utils";
import { ref, onMounted, computed } from "vue";

const { t } = useI18n();
const titleMenu = computed(() => `${t("my-account.title-menu")}`);
const router = useRouter();

const user = ref(null);
const settings = ref(null);
const credit = ref(0);
const status = ref(false);
const previewPhoto = ref<string | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await getUserData();
    settings.value = await getSetting();
    status.value =
      user.value.anggota?.anggota_detail &&
      user.value.anggota?.status == 1 &&
      user.value.anggota.anggota_detail.ktp_number
      ? true
      : false;
    credit.value = user.value.anggota?.credit_score || 0;
    previewPhoto.value = "https://cms.flexyduit.com/" + user.value.image;
  } catch (error) {
    console.error(error);
    window.location.href = "/sign-in";
  } finally {
    isLoading.value = false;
  }
});

const myAccountBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)`,
  };
});

const blogPosts = [
  { id: 5, icon: "fa-solid fa-circle-info", title: t("my-account.menu-information"), link: "/my-account/information" },
  { id: 2, icon: "fa-solid fa-lock", title: t("my-account.menu-password"), link: "/my-account/change-password" },
  { id: 3, icon: "fa-solid fa-credit-card", title: t("my-account.menu-bank"), link: "/my-account/bank-account" },
  { id: 8, icon: "fa-solid fa-file-contract", title: t("my-account.menu-contract"), link: "/my-account/contract" },
  { id: 6, icon: "fa-solid fa-money-bill-transfer", title: t("my-account.menu-pembayaran"), link: "/my-account/payment" },
  { id: 4, icon: "fa-solid fa-clock-rotate-left", title: t("my-account.menu-history"), link: "/my-account/history-transaction" },
  { id: 7, icon: "fa-solid fa-comment-dots", title: t("my-account.menu-message"), link: "/my-account/message" },
];

const handleLogout = () => {
  document.cookie = "token=; path=/; max-age=0";
  router.push("/sign-in");
};
</script>

<template>
  <section
    class="relative min-h-screen bg-[#0A052E] pb-32 overflow-hidden"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />

      <AtomsContainer class="mt-24 px-5">
        
        <div
          v-if="status"
          class="animate-enter relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-10"
        >
          <div class="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>

          <div class="relative z-10 flex justify-between items-center">
            <div class="space-y-2">
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Credit Score</p>
              <h2 class="text-5xl font-black text-white tracking-tighter">{{ credit }}</h2>
              <div class="flex items-center gap-2 pt-2">
                <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                  {{ credit >= 500 ? "Excellent" : "Standard" }}
                </span>
              </div>
            </div>
            <div class="p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <img src="/images/speedometer.avif" class="w-14 h-14 object-contain brightness-110" />
            </div>
          </div>
          <p class="mt-6 text-slate-500 text-[10px] italic">Terakhir dikemaskini hari ini</p>
        </div>

        <div
          v-else
          class="animate-enter bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-10"
        >
          <div class="flex items-center gap-5 mb-6">
            <div class="w-14 h-14 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <i class="fa-solid fa-user-shield text-blue-400 text-2xl"></i>
            </div>
            <div>
                <h3 class="text-lg font-bold text-white">Pengesahan Diperlukan</h3>
                <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Account Security</p>
            </div>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed mb-8 font-light italic">
            Akaun anda belum disahkan. Sila lengkapkan maklumat peribadi anda untuk menikmati had pinjaman yang lebih tinggi.
          </p>
          <NuxtLink
            to="/verifikasi-akun"
            class="group relative block text-center py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_10_20px_rgba(37,99,235,0.2)] active:scale-[0.98] overflow-hidden"
          >
            <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
            Sahkan Akaun Sekarang
          </NuxtLink>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] px-2 mb-4">Pengurusan Akaun</p>
          
          <div
            v-for="(blog, index) in blogPosts"
            :key="index"
            class="animate-enter bg-white/[0.02] border border-white/5 backdrop-blur-md rounded-2xl transition-all duration-300 hover:bg-white/5 hover:border-white/10 group"
            :style="{ 'animation-delay': (index * 0.05) + 's' }"
          >
            <NuxtLink
              :to="blog.link"
              class="flex items-center justify-between p-5"
            >
              <div class="flex items-center gap-5">
                <div class="w-11 h-11 flex items-center justify-center rounded-xl bg-blue-500/5 border border-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                  <i :class="blog.icon" class="text-lg"></i>
                </div>
                <span class="text-slate-200 font-bold text-sm tracking-wide">{{ blog.title }}</span>
              </div>
              <div class="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors">
                <i class="fa-solid fa-chevron-right text-slate-600 text-[10px] group-hover:text-blue-400"></i>
              </div>
            </NuxtLink>
          </div>

          <button
            @click="handleLogout"
            class="animate-enter w-full mt-10 flex items-center justify-center gap-3 py-5 bg-red-500/5 border border-red-500/10 text-red-400 rounded-2xl font-bold transition-all hover:bg-red-500/10 active:scale-[0.98]"
            style="animation-delay: 0.5s"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
            <span class="uppercase tracking-widest text-xs">Log Keluar Akaun</span>
          </button>
        </div>
      </AtomsContainer>
    </div>

    <CardsNavigasiFooter title="my-account" type="menu" />
  </section>
</template>

<style scoped>
/* Animasi Entrance Premium */
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

/* Glass Enhancement */
::-webkit-scrollbar {
  display: none;
}
</style>