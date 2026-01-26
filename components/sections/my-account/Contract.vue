<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from "vue";
import { getUserData, getCookie, getSetting } from "@/composables/utils";

const { t } = useI18n();

const isLoading = ref(false);
const loans = ref({ status: -1 });
const dataSettings = ref(null);
const users = ref(null);
const balance = ref(0);
const withdraw = ref(0);

onMounted(async () => {
  isLoading.value = true;
  try {
    const token = getCookie("token");
    users.value = await getUserData();
    balance.value = users?.value.anggota?.balance ?? 0;
    withdraw.value = users?.value.anggota?.can_withdraw ?? 0;

    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/loans?orderBy=updated_at&order=desc&paginate=1&page=1",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const loanList = data?.data?.data;
    loans.value = Array.isArray(loanList) && loanList.length > 0 ? loanList[0] : null;

    dataSettings.value = await getSetting();
  } catch (error) {
    console.error("Failed to fetch loans:", error);
  } finally {
    isLoading.value = false;
  }
});

function formatDate(dateString: any): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dateOptions: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" };
  const timeOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

  try {
    const formattedDate = date.toLocaleDateString("en-MY", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);
    return `${formattedDate} ${formattedTime}`;
  } catch (error) {
    try {
      return date.toLocaleString();
    } catch (fallbackError) {
      return dateString;
    }
  }
}

watchEffect(() => {
  if (dataSettings.value && dataSettings.value.loan_agreement) {
    let agreementText = dataSettings.value.loan_agreement;

    if (users.value && users.value.name) {
      agreementText = agreementText.replace(/\{name\}/g, users.value.name);
    }
    if (loans.value && loans.value.reference) {
      agreementText = agreementText.replace(/\{reference\}/g, loans.value.reference);
    }
    if (users.value?.anggota?.anggota_detail?.ktp_number) {
      agreementText = agreementText.replace(/\{ktp_number\}/g, users.value.anggota.anggota_detail.ktp_number);
    }
    if (loans.value && loans.value.created_at) {
      agreementText = agreementText.replace(/\{created_at\}/g, formatDate(loans.value.created_at));
    }
    if (loans.value && loans.value.nominal !== undefined) {
      agreementText = agreementText.replace(/\{nominal\}/g, "RM " + loans.value.nominal.toLocaleString("en-MY"));
    }
    if (loans.value && loans.value.tenor !== undefined) {
      agreementText = agreementText.replace(/\{tenor\}/g, loans.value.tenor.toString());
    }
    if (loans.value && loans.value.interest_rate !== undefined) {
      agreementText = agreementText.replace(/\{interest_rate\}/g, loans.value.interest_rate.toString() + "%");
    }
    if (loans.value && loans.value.monthly_payment !== undefined) {
      agreementText = agreementText.replace(/\{monthly_payment\}/g, "RM " + loans.value.monthly_payment.toLocaleString("en-MY"));
    }

    // Signatures & Stamps Styling
    let signatureHtml = "";
    if (loans.value && loans.value.signature) {
      const imageUrl = "https://cms.mysolutionlending.com" + loans.value.signature;
      signatureHtml = `<img src="${imageUrl}" alt="Signature" style="max-width: 100px; height: auto; filter: brightness(1.1); margin: 10px 0;" />`;
    }
    agreementText = agreementText.replace(/\{signature\}/g, signatureHtml);

    let stampHtml = "";
    if (dataSettings.value && dataSettings.value.stamp) {
      const imageUrl = "https://cms.mysolutionlending.com" + dataSettings.value.stamp;
      stampHtml = `<img src="${imageUrl}" alt="Stamp" style="max-width: 100px; height: auto; margin: 10px 0;" />`;
    }
    agreementText = agreementText.replace(/\{stamp\}/g, stampHtml);

    if (dataSettings.value.loan_agreement !== agreementText) {
      dataSettings.value.loan_agreement = agreementText;
    }
  }
});

const titleMenu = computed(() => `${t("my-account.title-menu")} - ${t("my-account.menu-contract")}`);

const myAccountBackgroundStyle = computed(() => ({
  backgroundColor: "#0A052E",
  backgroundImage: `radial-gradient(circle at 50% -20%, rgba(37, 99, 235, 0.15) 0%, transparent 50%)`,
}));
</script>

<template>
  <section
    class="relative flex justify-center items-start min-h-screen bg-[#0A052E] py-24 overflow-hidden"
    id="contract-page"
    :style="myAccountBackgroundStyle"
  >
    <div class="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full"></div>

    <div class="w-full relative z-10 px-5">
      <CardsNavigasiHeader :title="titleMenu" type="menu" />
      
      <AtomsContainer class-name="relative pt-6">
        
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p class="text-slate-400 animate-pulse text-sm">Menyediakan dokumen...</p>
        </div>

        <div v-else class="animate-enter bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] p-8 md:p-10">
          
          <div class="flex items-center justify-between mb-10">
            <div class="space-y-1">
              <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
                E-Kontrak Pinjaman
              </h1>
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em]">Dokumen Rasmi & Sah</p>
            </div>
            <div class="w-12 h-12 bg-blue-600/10 rounded-2xl border border-blue-500/20 flex items-center justify-center">
              <i class="fa-solid fa-file-contract text-blue-400 text-xl"></i>
            </div>
          </div>

          <div class="mb-8">
            <div
              class="contract-viewer text-slate-300 leading-relaxed text-sm md:text-base overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar"
              v-html="dataSettings?.loan_agreement"
            ></div>
          </div>

          <div class="mt-8 p-6 bg-blue-600/10 border border-blue-500/20 rounded-[2rem]">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 flex-shrink-0">
                <i class="fa-solid fa-shield-check text-blue-400"></i>
              </div>
              <div>
                <h3 class="text-xs font-bold text-blue-400 mb-2 uppercase tracking-[0.2em]">Nota Penting</h3>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  Dokumen ini dijana secara digital dan sah di bawah akta transaksi elektronik. Simpan dokumen ini dengan selamat untuk rujukan masa hadapan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AtomsContainer>
    </div>
  </section>
</template>

<style scoped>
/* Animasi Entrance */
.animate-enter {
  animation: slideUpFade 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom Styling for dynamic HTML content (v-html) */
.contract-viewer :deep(h1), 
.contract-viewer :deep(h2), 
.contract-viewer :deep(h3) {
  color: #ffffff;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.contract-viewer :deep(p) {
  margin-bottom: 1rem;
  text-align: justify;
}

.contract-viewer :deep(strong) {
  color: #60a5fa; /* blue-400 */
}

.contract-viewer :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  overflow: hidden;
}

.contract-viewer :deep(td), 
.contract-viewer :deep(th) {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Custom Scrollbar for Glassmorphism */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.5);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.7);
}

/* Deep Selector for Signature Images */
.contract-viewer :deep(img) {
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9); /* Sedikit putih agar signature hitam terlihat jelas */
  padding: 5px;
  box-shadow: 0 0 15px rgba(37, 99, 235, 0.2);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  display: none;
}
</style>