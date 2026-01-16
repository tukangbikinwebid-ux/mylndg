<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import { getUserData, getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();

const isLoading = ref(false);
const loans = ref({ status: -1 });
const wallets = ref({ status: -1 });

const dataSettings = ref(null);
const users = ref(null);
const balance = ref(0);
const withdraw = ref(0);

// Logic Computed (Tetap dipertahankan)
const loanTitle = computed(() => {
  if (!loans.value) return "Unknown status";
  switch (loans.value.status) {
    case 0: return "Loan progress";
    case 1: return "Loan approved";
    case -1: case 2: return "Loan rejected";
    default: return "Unknown status";
  }
});

const loanStatusText = computed(() => {
  if (!loans.value) return t("loan.status.unknown");
  switch (loans.value.status) {
    case 0: return t("loan.status.under-review");
    case 1: return t("loan.status.approved");
    case -1: case 2: return t("loan.status.rejected");
    default: return t("loan.status.unknown");
  }
});

const showNominal = ref(true);

const formattedNominal = computed(() => {
  if (balance.value == null) return "RM0";
  return "RM " + Number(balance.value).toLocaleString("en-MY", { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 2 
  });
});

const custom_status = ref("");
const custom_description = ref("");
const custom_color = ref("");

onMounted(async () => {
  isLoading.value = true;
  try {
    const token = getCookie("token");
    users.value = await getUserData();
    balance.value = users?.value.anggota?.balance ?? 0;
    withdraw.value = users?.value.anggota?.can_withdraw ?? 0;

    const response = await fetch("https://cms.mysolutionlending.com/api/v1/loans?orderBy=updated_at&order=desc&paginate=1&page=1", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    const data = await response.json();
    const loanList = data?.data?.data;
    loans.value = Array.isArray(loanList) && loanList.length > 0 ? loanList[0] : null;

    const responseWallet = await fetch("https://cms.mysolutionlending.com/api/v1/wallet/withdraw?orderBy=updated_at&order=desc&paginate=1&page=1", {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    });
    const dataWallet = await responseWallet.json();
    const walletList = dataWallet?.data?.data;

    custom_status.value = walletList?.[0]?.custom_status || null;
    custom_description.value = walletList?.[0]?.description || null;
    custom_color.value = walletList?.[0]?.custom_status_color || null;
    wallets.value = Array.isArray(walletList) && walletList.length > 0 ? walletList[0] : null;

    dataSettings.value = await getSetting();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

// Helper Functions (formatDate, etc) tetap sama...
function formatDate(dateString: any): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
  return `${date.toLocaleDateString("en-MY", dateOptions)} ${date.toLocaleTimeString("en-GB", timeOptions)}`;
}

watchEffect(() => {
  if (dataSettings.value?.loan_agreement) {
    let agreementText = dataSettings.value.loan_agreement;
    // ... Logic replacement tetap sama ...
    if (users.value?.name) agreementText = agreementText.replace(/\{name\}/g, users.value.name);
    if (loans.value?.reference) agreementText = agreementText.replace(/\{reference\}/g, loans.value.reference);
    if (loans.value?.nominal !== undefined) agreementText = agreementText.replace(/\{nominal\}/g, "RM " + loans.value.nominal.toLocaleString("en-MY"));
    // (Lanjutkan replacement lainnya sesuai kebutuhan)
    
    dataSettings.value.loan_agreement = agreementText;
  }
});

const submitOtp = async () => {
  const code = otp.value.join("");
  if (code.length < 6) return alert("OTP belum lengkap.");
  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/wallet/withdraw/validate-otp", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ otp: code }),
    });
    const result = await response.json();
    if (!response.ok) alert(result.message || "Validasi OTP gagal.");
    else {
      showOtpModal.value = false;
      showFlashNotif.value = true;
      setTimeout(() => { showFlashNotif.value = false; window.location.href = "/wallet"; }, 5000);
    }
  } catch (error) { alert("Gagal memvalidasi OTP"); }
};

const showOtpModal = ref(false);
const otp = ref(Array(6).fill(""));
const showFlashNotif = ref(false);
const showContractModal = ref(false);

const handleOtpInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement;
  otp.value[index] = input.value.slice(0, 1);
  if (input.value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
};

const activeActivity = computed(() => {
  const loanItem = loans.value;
  const walletItem = wallets.value;
  if (walletItem?.created_at && (!loanItem?.created_at || new Date(walletItem.created_at) > new Date(loanItem.created_at))) {
    return { type: "wallet", data: walletItem };
  }
  return loanItem?.created_at ? { type: "loan", data: loanItem } : null;
});

const displayDescriptionText = computed(() => {
  if (!activeActivity.value || !dataSettings.value?.status) return { title: "-", description: "-", color: "#fff" };
  const statusArray = dataSettings.value.status;
  if (activeActivity.value.type === "wallet") {
    const w = wallets.value;
    if (w.status_otp == 1 && w.status == 7) return statusArray[7];
    if (w.status_otp == -1) return statusArray[6];
    return statusArray[4] || statusArray[3];
  }
  return statusArray[loans.value?.status] || { title: "-", description: "-", color: "#fff" };
});
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen bg-[#0A052E] py-20 overflow-hidden"
    id="bank-account"
  >
    <div class="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[40%] bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10">
      <CardsNavigasiHeader title="Wallet" type="menu" />
      
      <AtomsContainer class-name="relative px-5">
        
        <div class="relative overflow-hidden bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-8">
          <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-6">
              <div class="flex flex-col">
                <span class="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-1">Akaun Saya</span>
                <span class="text-white font-medium">{{ users?.anggota?.phone || "-" }}</span>
              </div>
              <div class="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                 <i class="fa-solid fa-wallet text-blue-400"></i>
              </div>
            </div>

            <div class="flex items-end justify-between">
              <div>
                <p class="text-slate-400 text-sm mb-1">{{ t("wallet.card-title") }}</p>
                <h2 v-if="showNominal" class="text-3xl md:text-4xl font-black text-white tracking-tight">
                  {{ formattedNominal }}
                </h2>
                <h2 v-else class="text-3xl md:text-4xl font-black text-white tracking-widest pt-2">
                  ••••••••
                </h2>
              </div>
              
              <button 
                @click="showNominal = !showNominal"
                class="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
              >
                <svg v-if="showNominal" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.07 10.07 0 0012 19c-4.418 0-8.418-2.626-10.25-6.5a10.051 10.051 0 0118.5 0A10.069 10.069 0 0012 19c-.676 0-1.338-.062-1.975-.175M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="px-2 mb-10">
          <button
            v-if="balance > 0"
            @click="showOtpModal = true"
            class="group relative w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
          >
            <div class="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700"></div>
            <i class="fa-solid fa-shield-halved"></i> 
            <span>Keluarkan sekarang</span>
          </button>
        </div>

        <div class="space-y-4">
          <h3 class="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] px-2 mb-4">Aktiviti Terkini</h3>
          
          <div v-if="activeActivity" class="bg-white/[0.03] backdrop-blur-2xl border border-white/5 p-6 rounded-[2rem] shadow-xl">
            <div class="flex items-center justify-between mb-6">
              <h4 class="text-lg font-bold text-white">{{ t("wallet.content-title") }}</h4>
              <span class="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                {{ activeActivity.type }}
              </span>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400">{{ t("wallet.content-document") }}</span>
                <span class="text-white font-mono">{{ loans?.reference }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-400">{{ t("wallet.content-status") }}</span>
                <span class="text-white font-bold">{{ custom_status || displayDescriptionText.title }}</span>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-white/5">
                <p class="text-sm font-medium mb-4" :style="{ color: custom_color || displayDescriptionText.color }">
                  {{ custom_description || displayDescriptionText.description }}
                </p>
                
                <button 
                  v-if="dataSettings?.loan_agreement_status === 1"
                  @click="showContractModal = true"
                  class="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest"
                >
                  {{ t("loan.signature.description") }}
                </button>
            </div>
          </div>
        </div>

        <div v-if="dataSettings?.wallet" class="mt-12">
           <img
            :src="`https://cms.flexyduit.com${dataSettings.wallet}`"
            class="w-full rounded-[2.5rem] border border-white/5 shadow-2xl"
          />
        </div>

      </AtomsContainer>

      <transition name="fade-slide">
        <div v-if="showOtpModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div class="absolute inset-0 bg-[#0A052E]/90 backdrop-blur-md" @click="showOtpModal = false"></div>
          <div class="relative w-full max-w-sm bg-[#0F0A3D] border border-white/10 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
            <div class="w-16 h-16 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                <i class="fa-solid fa-lock text-blue-400 text-2xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Masukkan Kode OTP</h2>
            <p class="text-slate-400 text-sm mb-8">Sila periksa mesej anda untuk kod pengesahan</p>
            
            <div class="flex justify-center gap-2 mb-8">
              <input
                v-for="(digit, index) in otp" :key="index" :id="`otp-${index}`"
                v-model="otp[index]" @input="handleOtpInput(index, $event)"
                maxlength="1" type="number"
                class="w-11 h-14 text-center bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            
            <button @click="submitOtp" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-600/20">
              Sahkan Sekarang
            </button>
          </div>
        </div>
      </transition>

      <transition name="fade-slide">
        <div v-if="showContractModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-[#0A052E]/90 backdrop-blur-md" @click="showContractModal = false"></div>
          <div class="relative bg-white w-full max-w-2xl h-[85vh] p-8 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden">
            <button @click="showContractModal = false" class="absolute top-6 right-6 text-slate-400 hover:text-black text-3xl">&times;</button>
            <h2 class="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Surat Perjanjian</h2>
            <div class="flex-grow overflow-y-auto mb-6 pr-2 text-gray-700 leading-relaxed agreement-content" v-html="dataSettings?.loan_agreement"></div>
            <button @click="showContractModal = false" class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl transition-all active:scale-95">Tutup Dokumen</button>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="showFlashNotif" class="fixed inset-0 bg-[#0A052E]/90 backdrop-blur-xl flex items-center justify-center z-[110] px-6">
          <div class="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 max-w-sm w-full shadow-2xl text-center">
            <div class="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-500/20 border border-green-500/30 mb-8">
              <svg class="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-3xl font-bold text-white mb-4">Berjaya!</h3>
            <p class="text-slate-400 leading-relaxed mb-8">Permintaan pengeluaran berjaya dihantar. Sila tunggu proses pengesahan.</p>
            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div class="bg-green-500 h-full animate-progress"></div>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </section>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(30px) scale(0.95); }

@keyframes progress { 0% { width: 100%; } 100% { width: 0%; } }
.animate-progress { animation: progress 5s linear forwards; }

.agreement-content :deep(p) { margin-bottom: 1rem; }
.agreement-content :deep(img) { display: inline-block; margin: 10px 0; border-radius: 8px; }

/* Hide scrollbar */
::-webkit-scrollbar { display: none; }
</style>