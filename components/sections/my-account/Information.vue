<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getUserData, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-information")}`
);

// --- State Management ---
const user = ref(null);
const settings = ref(null);
const isLoading = ref(false);
const showKtp = ref(false);
const isDetailMode = ref(false);

const form = ref({
  full_name: "",
  ktp_number: "",
  gender: "",
  birth_place: "",
  birth_date: "",
  work: "",
  monthly_income: "",
  loan_purpose: "",
  address: "",
  contact_1: "",
  contact_1_name: "",
});

const previewKtpDepan = ref<string | null>(null);
const previewKtpBelakang = ref<string | null>(null);
const previewSelfie = ref<string | null>(null);

const baseURL = "https://cms.mysolutionlending.com/";

onMounted(async () => {
  try {
    isLoading.value = true;
    user.value = await getUserData();
    settings.value = await getSetting();
    const detail = user.value?.anggota?.anggota_detail;

    if (detail) {      
      form.value = {
        full_name: detail.full_name || "-",
        ktp_number: detail.ktp_number || "-",
        gender: detail.gender || "-",
        birth_place: detail.birth_place || "-",
        birth_date: detail.birth_date || "-",
        work: detail.work || "-",
        monthly_income: detail.monthly_income || "0",
        loan_purpose: detail.loan_purpose || "-",
        address: detail.address || "-",
        contact_1: detail.contact_1 || "-",
        contact_1_name: detail.contact_1_name || "-",
      };

      previewKtpDepan.value = detail.front_ktp;
      previewKtpBelakang.value = detail.back_ktp;
      previewSelfie.value = detail.image;
    }
  } catch (error) {
    console.error("Error loading profile:", error);
  } finally {
    isLoading.value = false;
  }
});

const myAccountBackgroundStyle = computed(() => {
  return {
    backgroundColor: "#0A052E",
    backgroundImage: `radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)`,
  };
});
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen bg-[#0A052E] py-24 overflow-hidden"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10 px-5">
      <CardsNavigasiHeader :title="titleMenu" type="menu" />
      
      <AtomsContainer class-name="relative pt-6">
        
        <div
          v-if="!isDetailMode"
          class="animate-enter bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10"
        >
          <div class="flex items-center justify-between mb-10">
            <div class="space-y-1">
                <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {{ t("my-account.information-data.title") }}
                </h1>
                <p class="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Verified Profile</p>
            </div>
            <button
              @click="isDetailMode = true"
              class="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-400 hover:bg-white/10 transition-all active:scale-95"
            >
              <i class="fa-solid fa-file-lines"></i>
            </button>
          </div>

          <div class="text-left space-y-6">
            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.information-data.name") }}</span>
              <span class="text-white font-medium text-lg">{{ form.full_name }}</span>
            </div>
            
            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.information-data.no_ic") }}</span>
              <div class="flex items-center justify-between">
                <span class="text-white font-mono text-lg tracking-widest">{{ showKtp ? form.ktp_number : "•••• •••• ••••" }}</span>
                <button @click="showKtp = !showKtp" class="text-slate-500 hover:text-white transition-colors">
                    <i class="fa-solid" :class="showKtp ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
                <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Work</span>
                    <span class="text-white font-medium">{{ form.work }}</span>
                </div>
                <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
                    <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Income</span>
                    <span class="text-blue-400 font-bold">RM {{ form.monthly_income }}</span>
                </div>
            </div>

            <div class="flex flex-col space-y-1 border-b border-white/5 pb-3">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Address</span>
              <span class="text-white font-medium text-sm leading-relaxed">{{ form.address }}</span>
            </div>
          </div>

          <button
            @click="isDetailMode = true"
            class="w-full mt-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
          >
            Lihat Butiran Lengkap
          </button>
        </div>

        <div
          v-else
          class="animate-enter bg-[#0F0A3D]/80 backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 md:p-10 w-full"
        >
          <div class="flex items-center justify-between mb-10">
            <div>
              <h1 class="text-2xl font-bold text-white tracking-tight">Butiran Profil</h1>
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                Dokumen Rasmi & Maklumat Peribadi
              </p>
            </div>
            <button
              @click="isDetailMode = false"
              class="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <div class="space-y-10">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                v-for="type in (['Selfie', 'KTP Depan', 'KTP Belakang'] as const)"
                :key="type"
                class="space-y-3"
              >
                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{{ type }}</label>
                <div class="relative h-44 w-full bg-white/5 rounded-2xl overflow-hidden border border-white/10 group shadow-lg">
                  <img
                    v-if="type === 'Selfie' ? previewSelfie : (type === 'KTP Depan' ? previewKtpDepan : previewKtpBelakang)"
                    :src="type === 'Selfie' ? previewSelfie! : (type === 'KTP Depan' ? previewKtpDepan! : previewKtpBelakang!)"
                    class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div v-else class="flex items-center justify-center h-full text-slate-700">
                    <i class="fa-solid fa-image text-3xl"></i>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 pt-8 border-t border-white/5">
              <div class="detail-item">
                <label>Full Name</label>
                <p>{{ form.full_name }}</p>
              </div>
              <div class="detail-item">
                <label>IC Number</label>
                <p>{{ form.ktp_number }}</p>
              </div>
              <div class="detail-item">
                <label>Gender</label>
                <p class="capitalize text-blue-300 font-semibold">{{ form.gender }}</p>
              </div>
              <div class="detail-item">
                <label>Monthly Income</label>
                <p class="text-green-400 font-bold">RM {{ form.monthly_income }}</p>
              </div>
              <div class="detail-item">
                <label>Occupation</label>
                <p>{{ form.work }}</p>
              </div>
              <div class="detail-item">
                <label>Birth Info</label>
                <p>{{ form.birth_place }}, {{ form.birth_date }}</p>
              </div>
              <div class="detail-item md:col-span-2">
                <label>Loan Purpose</label>
                <p class="italic text-slate-400">{{ form.loan_purpose }}</p>
              </div>
              <div class="detail-item md:col-span-2">
                <label>Full Address</label>
                <p class="text-sm leading-relaxed">{{ form.address }}</p>
              </div>
            </div>

            <div class="bg-blue-600/10 border border-blue-500/20 p-6 rounded-[2rem] mt-6">
              <h3 class="text-xs font-bold text-blue-400 mb-6 flex items-center uppercase tracking-[0.2em]">
                <i class="fa-solid fa-phone-volume mr-3 text-lg"></i> Emergency Contact
              </h3>
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <label class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Name</label>
                  <p class="text-white font-bold tracking-wide">{{ form.contact_1_name }}</p>
                </div>
                <div>
                  <label class="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1 block">Phone</label>
                  <p class="text-white font-bold tracking-wide font-mono">{{ form.contact_1 }}</p>
                </div>
              </div>
            </div>

            <button
              @click="isDetailMode = false"
              class="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
            >
              Kembali ke Ringkasan
            </button>
          </div>
        </div>
      </AtomsContainer>
    </div>
  </section>
</template>

<style scoped>
/* Detail Item Premium Styling */
.detail-item {
  @apply space-y-1.5 py-2 border-b border-white/5;
}

.detail-item label {
  @apply text-[10px] font-bold text-slate-500 uppercase tracking-widest block;
}

.detail-item p {
  @apply text-slate-200 font-medium;
}

/* Animasi Entrance */
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

/* Custom Scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>