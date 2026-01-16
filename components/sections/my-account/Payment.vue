<template>
  <section 
    class="relative min-h-screen pb-32 overflow-hidden font-sans" 
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-5%] left-[-10%] w-72 h-72 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] right-[-5%] w-80 h-80 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="relative z-10">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="bg-[#0A052E]/60 backdrop-blur-xl border-b border-white/5" />

      <AtomsContainer class="mt-24 px-5">
        
        <div 
          v-if="loanDetail"
          class="animate-enter relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 mb-12"
        >
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <div class="relative z-10 space-y-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 flex items-center justify-center bg-blue-600/20 border border-blue-500/20 rounded-xl text-blue-400">
                <i class="fa-solid fa-file-invoice-dollar"></i>
              </div>
              <h1 class="text-2xl font-bold text-white tracking-tight">
                {{ t("my-account.payment.title") }}
              </h1>
            </div>

            <div class="space-y-4 pt-2">
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.payment.nominal") }}</span>
                <span class="text-xl font-black text-white tracking-tight">RM {{ loanDetail?.amount?.toLocaleString("en-MY") }}</span>
              </div>
              
              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.payment.ke") }}</span>
                <span class="text-slate-200 font-semibold">{{ loanDetail?.month }}</span>
              </div>

              <div class="flex items-center justify-between border-b border-white/5 pb-3">
                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ t("my-account.payment.date") }}</span>
                <span class="text-blue-400 font-bold font-mono">{{ formatDate(loanDetail?.due_date) }}</span>
              </div>
            </div>

            <button
              @click="showModal = true"
              class="group relative w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden mt-4"
            >
              <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
              <i class="fa-solid fa-money-bill-transfer"></i>
              <span>{{ t("my-account.payment.button") }}</span>
            </button>
          </div>
        </div>

        <div class="relative space-y-6">
          <div class="flex items-center gap-3 px-2 mb-6">
            <div class="h-1 bg-blue-500 w-8 rounded-full"></div>
            <h2 class="text-xl font-bold text-white tracking-tight">
              {{ t("my-account.payment.loan-title") }}
            </h2>
          </div>

          <div v-if="isLoading" class="flex flex-col items-center justify-center py-10">
            <div class="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-slate-400 animate-pulse text-xs">Memuat data...</p>
          </div>
          
          <div v-else-if="errorMessage" class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center">
            {{ errorMessage }}
          </div>
          
          <div v-else-if="loans.length === 0" class="text-center py-10 opacity-30">
            <i class="fa-solid fa-folder-open text-4xl mb-3"></i>
            <p class="text-slate-400 text-sm">{{ t("my-account.payment.loan-empty") || "Tiada data pinjaman." }}</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="(item, index) in loans"
              :key="index"
              class="animate-enter bg-white/[0.02] backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] shadow-xl hover:bg-white/[0.05] transition-all duration-300"
              :style="{ 'animation-delay': (index * 0.1) + 's' }"
            >
              <div class="flex justify-between items-start mb-6">
                <div>
                   <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{{ t("my-account.payment.loan-nomor") }}</p>
                   <p class="text-white font-mono font-bold">{{ item?.reference }}</p>
                </div>
                <div class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  :class="item?.status == 1 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-500/10 text-slate-400 border border-white/10'"
                >
                  {{ item?.status == 1 ? "Aktif" : "Belum aktif" }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{{ t("my-account.payment.loan-tenor") }}</span>
                  <span class="text-slate-200">{{ item?.tenor }} {{ t("my-account.payment.loan-month") }}</span>
                </div>
                <div class="flex flex-col gap-1 text-right">
                  <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{{ t("my-account.payment.loan-amount") }}</span>
                  <span class="text-white font-bold">RM{{ Number(item?.nominal).toLocaleString("en-MY") }}</span>
                </div>
                <div class="flex flex-col gap-1">
                  <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{{ t("my-account.payment.loan-date-payment") }}</span>
                  <span class="text-slate-200 text-xs">{{ getStartDate(item?.updated_at) }}</span>
                </div>
                <div class="flex flex-col gap-1 text-right">
                  <span class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{{ t("my-account.payment.loan-monthly-payment") }}</span>
                  <span class="text-blue-400 font-black">RM{{ Number(item?.monthly_amortization).toLocaleString("en-MY") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>

    <transition name="fade-slide">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-[#0A052E]/90 backdrop-blur-md" @click="showModal = false"></div>
        <div class="relative w-full max-w-sm bg-[#0F0A3D] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-center">
          <div class="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-6 text-blue-400 text-2xl">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">{{ t("my-account.payment.upload-title") }}</h2>
          <p class="text-slate-400 text-sm mb-8">Sila muat naik resit atau bukti pemindahan bank anda.</p>

          <div class="space-y-4">
            <div class="relative">
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="hidden"
                id="payment-file"
              />
              <label for="payment-file" class="flex items-center justify-center w-full p-4 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                 <span class="text-slate-300 text-sm group-hover:text-white transition-colors">
                  {{ paymentImage ? paymentImage.name : 'Pilih Fail Resit...' }}
                 </span>
              </label>
            </div>

            <div class="flex gap-3 pt-4">
              <button @click="showModal = false" class="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                Batal
              </button>
              <button @click="handlePayment" :disabled="isLoading" class="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50">
                {{ isLoading ? "Proses..." : "Hantar" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <CardsNavigasiFooter title="my-account" type="menu" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();
const titleMenu = computed(
  () => `${t("my-account.title-menu")} - ${t("my-account.menu-pembayaran")}`
);

const loans = ref([]);
const loanDetail = ref();
const isLoading = ref(false);
const errorMessage = ref("");
const showModal = ref(false);
const paymentImage = ref<File | null>(null);
const settings = ref(null);

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStartDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + 1);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEndDate = (dateStr: string, tenor: number): string => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  date.setMonth(date.getMonth() + 1 + tenor);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const fetchDetail = async (id: any) => {
  isLoading.value = true;
  errorMessage.value = "";
  const token = getCookie("token");

  try {
    const response = await fetch(`https://cms.mysolutionlending.com/api/v1/loans/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    const allDetails = data?.data?.loan_details ?? [];
    loanDetail.value = allDetails[0];
  } catch (error: any) {
    errorMessage.value = error.message || "Gagal mengambil data.";
  } finally {
    isLoading.value = false;
  }
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
      "https://cms.mysolutionlending.com/api/v1/loans?orderBy=updated_at&order=desc&paginate=10&page=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    loans.value = data?.data?.data ?? [];
    const loanWithStatusOne = loans.value.find((loan: any) => loan.status === 1);
    if (loanWithStatusOne && loanWithStatusOne.id) {
      fetchDetail(loanWithStatusOne.id);
    }
  } catch (error: any) {
    errorMessage.value = error?.message || "Ralat sistem.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    settings.value = await getSetting();
    fetchTransactionHistory();
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

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target?.files?.length) {
    paymentImage.value = target.files[0];
  }
};

const handlePayment = async () => {
  const token = getCookie("token");
  if (!paymentImage.value) {
    alert("Mohon unggah bukti pembayaran.");
    return;
  }

  try {
    isLoading.value = true;
    const formData = new FormData();
    formData.append("loan_detail_id", String(loanDetail.value.id));
    formData.append("image", paymentImage.value);

    const response = await fetch("https://cms.mysolutionlending.com/api/v1/loans/pay", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Pembayaran gagal.");

    alert("Pembayaran berjaya dihantar untuk semakan!");
    showModal.value = false;
    paymentImage.value = null;
  } catch (error) {
    alert("Terjadi kesalahan semasa proses pembayaran.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }

.animate-enter {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(40px) scale(0.95); }
</style>