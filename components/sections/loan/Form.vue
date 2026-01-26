<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { getCookie, getSetting, getUserData } from "@/composables/utils";
import MarkdownIt from "markdown-it";

// I18n Integration
const { t } = useI18n();
const titleMenu = computed(() => `${t("loan.title-menu")}`);

const user = ref(null);
const setting = ref(null);
const currentStep = ref(0);
const nowDate = new Date();
const loans = ref([]);
const isLoading = ref(false);

const fetchLoan = async () => {
  isLoading.value = true;
  const token = getCookie("token");
  if (!token) {
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
    loans.value = data?.data.data ?? [];
    
    if (user.value?.anggota?.second_loan == 0 && loans.value.length > 0) {
      if (loans.value[0].status == 1 || loans.value[0].status == 0) {
        alert(t("loan.notification.active_loan_alert") || "Anda mempunyai permohonan aktif.");
        window.location.href = "/";
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  user.value = await getUserData();
  setting.value = await getSetting();
  fetchLoan();
});

const md = new MarkdownIt();
const markdownToHtml = computed(() => setting.value?.term_of_service ? md.render(setting.value.term_of_service) : "");

const showContractModal = ref(false);
const formattedDate = computed(() => {
  const day = nowDate.getDate().toString().padStart(2, "0");
  const month = (nowDate.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}/${year}`;
});
const year = nowDate.getFullYear();

const steps = ["Loan", "Signature", "Finish"];
const signaturePad = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref(false);

const form = ref({
  nominal: 5000,
  tenor: 6,
  contract_checklist: 0,
  signature: null as any,
  monthly_principal: 0,
  monthly_interest: 0.5,
  monthly_amortization: 0,
  monthly_payment: 0,
  interest_rate: 0.5,
});

const agreedTerms = ref(false);
const showModal = ref(false);
const showLoanRules = ref(false);

// Loan Rules Data
const loanRules = ref({
  interestRates: {
    6: 0.80,
    12: 0.80,
    24: 0.70,
    36: 0.60,
    48: 0.50,
    60: 0.40,
    72: 0.30,
  },
  loanAmounts: [5000, 6000, 8000, 10000, 15000, 20000, 25000, 30000, 35000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 90000, 95000, 100000, 125000, 150000, 200000],
  tenors: [6, 12, 24, 36, 48, 60, 72],
  monthlyPayments: {
    5000: { 6: 873.33, 12: 456.67, 24: 243.33, 36: 168.89, 48: 144.17, 60: 103.33, 72: 84.44 },
    6000: { 6: 1048, 12: 548, 24: 292, 36: 202.67, 48: 173, 60: 124, 72: 101.33 },
    8000: { 6: 1397.33, 12: 730.67, 24: 389.33, 36: 270.22, 48: 230.67, 60: 165.33, 72: 135.11 },
    10000: { 6: 1746.67, 12: 913.33, 24: 486.67, 36: 337.78, 48: 288.33, 60: 206.67, 72: 168.89 },
    15000: { 6: 2620, 12: 1370, 24: 730, 36: 506.67, 48: 432.50, 60: 310, 72: 253.33 },
    20000: { 6: 3493.33, 12: 1826.67, 24: 973.33, 36: 675.56, 48: 576.67, 60: 413.33, 72: 337.78 },
    25000: { 6: 4366.67, 12: 2283.33, 24: 1216.67, 36: 844.44, 48: 720.83, 60: 516.67, 72: 422.22 },
    30000: { 6: 5240, 12: 2740, 24: 1460, 36: 1013.33, 48: 865, 60: 620, 72: 506.67 },
    35000: { 6: 6113.33, 12: 3196.67, 24: 1703.33, 36: 1182.22, 48: 1009.17, 60: 723.33, 72: 591.11 },
    45000: { 6: 7860, 12: 4110, 24: 2190, 36: 1520, 48: 1297.50, 60: 930, 72: 760 },
    50000: { 6: 8733.33, 12: 4566.67, 24: 2433.33, 36: 1688.89, 48: 1441.67, 60: 1033.33, 72: 844.44 },
    55000: { 6: 9606.67, 12: 5023.33, 24: 2676.67, 36: 1857.78, 48: 1585.83, 60: 1136.67, 72: 928.89 },
    60000: { 6: 10480, 12: 5480, 24: 2920, 36: 2026.67, 48: 1730, 60: 1240, 72: 1013.33 },
    65000: { 6: 11353.33, 12: 5936.67, 24: 3163.33, 36: 2195.56, 48: 1874.17, 60: 1343.33, 72: 1097.78 },
    70000: { 6: 12226.67, 12: 6393.33, 24: 3406.67, 36: 2364.44, 48: 2018.33, 60: 1446.67, 72: 1182.22 },
    75000: { 6: 13100, 12: 6850, 24: 3650, 36: 2533.33, 48: 2162.50, 60: 1550, 72: 1266.67 },
    80000: { 6: 13973.33, 12: 7306.67, 24: 3893.33, 36: 2702.22, 48: 2306.67, 60: 1653.33, 72: 1351.11 },
    90000: { 6: 15720, 12: 8220, 24: 4380, 36: 3040, 48: 2595, 60: 1860, 72: 1520 },
    95000: { 6: 16593.33, 12: 8676.67, 24: 4623.33, 36: 3208.89, 48: 2739.17, 60: 1963.33, 72: 1604.44 },
    100000: { 6: 17466.67, 12: 9133.33, 24: 4866.67, 36: 3377.78, 48: 2883.33, 60: 2066.67, 72: 1688.89 },
    125000: { 6: 21833.33, 12: 11416.67, 24: 6083.33, 36: 4222.22, 48: 3604.17, 60: 2583.33, 72: 2111.11 },
    150000: { 6: 26200, 12: 13700, 24: 7300, 36: 5066.67, 48: 4325, 60: 3100, 72: 2533.33 },
    200000: { 6: 34933.33, 12: 18266.67, 24: 9733.33, 36: 6755.56, 48: 4766.67, 60: 4133.33, 72: 3377.78 },
  }
});

// Background Style
const loginBackgroundStyle = computed(() => ({
  // backgroundColor: "#0A052E",
  // backgroundImage: `radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.1) 0%, transparent 40%)`,
}));

// Logic Signature (Tetap sama)
const startDrawing = (e: any) => {
  if (!signaturePad.value) return;
  const ctx = signaturePad.value.getContext("2d");
  if (!ctx) return;
  ctx.beginPath();
  const pos = getPosition(e);
  ctx.moveTo(pos.x, pos.y);
  isDrawing.value = true;
};
const draw = (e: any) => {
  if (!isDrawing.value || !signaturePad.value) return;
  const ctx = signaturePad.value.getContext("2d");
  if (!ctx) return;
  const pos = getPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.stroke();
};
const stopDrawing = () => { isDrawing.value = false; if(signaturePad.value) form.value.signature = signaturePad.value.toDataURL(); };
const clearSignature = () => {
  const ctx = signaturePad.value?.getContext("2d");
  ctx?.clearRect(0, 0, signaturePad.value!.width, signaturePad.value!.height);
  form.value.signature = null;
};
const getPosition = (e: any) => {
  const rect = signaturePad.value!.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return { x: clientX - rect.left, y: clientY - rect.top };
};

const submitForm = async (e: Event) => {
  e.preventDefault();
  if (!form.value.signature) return alert(t("loan.signature.note"));
  
  isLoading.value = true;
  const token = getCookie("token");

  try {
    const loanData = new FormData();
    
    // Data Utama
    loanData.append("nominal", form.value.nominal.toString());
    loanData.append("tenor", form.value.tenor.toString());
    loanData.append("interest_rate", form.value.interest_rate.toString());
    
    // Tambahkan field kalkulasi yang diminta backend (PENTING)
    loanData.append("monthly_principal", form.value.monthly_principal.toString());
    loanData.append("monthly_interest", form.value.monthly_interest.toString());
    loanData.append("monthly_amortization", form.value.monthly_amortization.toString());
    loanData.append("monthly_payment", form.value.monthly_payment.toString());

    // Signature
    if (form.value.signature) {
      const res = await fetch(form.value.signature);
      const blob = await res.blob();
      loanData.append("signature", blob, "signature.png");
    }
    
    loanData.append("contract_checklist", agreedTerms.value ? "1" : "0");

    const response = await fetch("https://cms.mysolutionlending.com/api/v1/loans", {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        Accept: "application/json" // Rekomendasi: tambahkan ini agar response selalu JSON
      },
      body: loanData,
    });

    const result = await response.json();

    if (!response.ok) {
      // Jika ada error validasi dari Laravel, tampilkan pesannya
      const errorMsg = result.message || "Gagal hantar permohonan.";
      throw new Error(errorMsg);
    }

    currentStep.value = 2;
    setTimeout(() => { window.location.href = "/wallet"; }, 5000);
  } catch (error: any) {
    alert(error.message || "Ralat penghantaran.");
    console.error("Submit Error:", error);
  } finally {
    isLoading.value = false;
  }
};

const setMonth = (val: number) => {
  form.value.tenor = val;
  // Get interest rate from loan rules
  form.value.interest_rate = loanRules.value.interestRates[val as keyof typeof loanRules.value.interestRates] || 0.8;
  calculateLoan();
};

const calculateLoan = () => {
  const nominal = form.value.nominal;
  const tenor = form.value.tenor;
  
  // Get monthly payment from loan rules if available
  const monthlyPaymentData = loanRules.value.monthlyPayments[nominal as keyof typeof loanRules.value.monthlyPayments];
  let monthlyPayment = 0;
  
  if (monthlyPaymentData && monthlyPaymentData[tenor as keyof typeof monthlyPaymentData]) {
    monthlyPayment = monthlyPaymentData[tenor as keyof typeof monthlyPaymentData] as number;
  } else {
    // Calculate if not in rules (fallback calculation)
    // Bunga flat: Total Interest = Principal * Interest Rate * Tenor
    // Monthly Payment = (Principal + Total Interest) / Tenor
    const totalInterest = (nominal * form.value.interest_rate * tenor) / 100;
    monthlyPayment = (nominal + totalInterest) / tenor;
  }
  
  // Calculate breakdown
  const monthlyPrincipal = nominal / tenor;
  const totalInterest = (monthlyPayment * tenor) - nominal;
  const monthlyInterest = totalInterest / tenor;
  
  form.value.monthly_principal = monthlyPrincipal;
  form.value.monthly_interest = monthlyInterest;
  form.value.monthly_amortization = monthlyPayment;
  form.value.monthly_payment = monthlyPayment;
};

// Computed for display
const totalInterest = computed(() => {
  return (form.value.monthly_payment * form.value.tenor) - form.value.nominal;
});

const totalPayment = computed(() => {
  return form.value.monthly_payment * form.value.tenor;
});

const handleNominalInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let rawValue = target.value.replace(/\D/g, "");
  const numericValue = parseInt(rawValue) || 0;
  form.value.nominal = numericValue;
  target.value = numericValue > 0 ? `RM${numericValue.toLocaleString("en-MY")}` : "RM";
  // Don't calculate here, wait for blur to validate first
};

const validateNominal = () => {
  // Find closest valid loan amount
  const validAmounts = loanRules.value.loanAmounts;
  const minAmount = validAmounts[0];
  const maxAmount = validAmounts[validAmounts.length - 1];
  
  if (form.value.nominal < minAmount) {
    alert(`Minimum RM ${minAmount.toLocaleString("en-MY")}`);
    form.value.nominal = minAmount;
  } else if (form.value.nominal > maxAmount) {
    alert(`Maximum RM ${maxAmount.toLocaleString("en-MY")}`);
    form.value.nominal = maxAmount;
  } else {
    // Find closest valid amount
    const closest = validAmounts.reduce((prev, curr) => {
      return Math.abs(curr - form.value.nominal) < Math.abs(prev - form.value.nominal) ? curr : prev;
    });
    form.value.nominal = closest;
  }
  calculateLoan();
};

// Initial calculation - wait for component to be fully mounted
onMounted(() => {
  setTimeout(() => {
    setMonth(6);
  }, 100);
});
</script>

<template>
  
  <section
    class="relative flex justify-center items-start min-h-screen py-20 overflow-hidden"
    :style="loginBackgroundStyle"
  >
    <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>

    <div class="w-full relative z-10 px-4">
      <CardsNavigasiHeader :title="titleMenu" type="menu" />
      
      <AtomsContainer class-name="relative">
        <div class="flex justify-between gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar" v-if="currentStep < 2">
          <button
            v-for="(step, index) in steps.slice(0, 2)"
            :key="index"
            @click="currentStep = index"
            class="flex-1 min-w-[120px] py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border"
            :class="currentStep === index 
              ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
              : 'bg-white/5 border-white/10 text-slate-400 backdrop-blur-md'"
          >
            Step {{ index + 1 }}: {{ step }}
          </button>
        </div>

        <div class="w-full">
          <form @submit="submitForm" class="space-y-6">
            
            <div v-if="currentStep === 0" class="animate-enter">
              <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                <h2 class="text-2xl font-bold text-white mb-8 tracking-tight">{{ t("loan.form.title") }}</h2>
                
                <div class="space-y-4 mb-8">
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1">{{ t("loan.form.amount") }}</label>
                    <div class="relative group">
                        <input
                            :value="`RM${form.nominal.toLocaleString('en-MY')}`"
                            @input="handleNominalInput"
                            @blur="validateNominal"
                            type="text"
                            inputmode="numeric"
                            class="w-full px-6 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 outline-none transition-all text-white text-2xl font-black tracking-tighter"
                        />
                    </div>
                    <div class="flex gap-3">
                        <button 
                            type="button" 
                            @click="form.nominal > loanRules.loanAmounts[0] ? (form.nominal = Math.max(loanRules.loanAmounts[0], form.nominal - 1000), validateNominal()) : null" 
                            :disabled="form.nominal <= loanRules.loanAmounts[0]"
                            class="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            - 1K
                        </button>
                        <button 
                            type="button" 
                            @click="form.nominal < loanRules.loanAmounts[loanRules.loanAmounts.length - 1] ? (form.nominal = Math.min(loanRules.loanAmounts[loanRules.loanAmounts.length - 1], form.nominal + 1000), validateNominal()) : null"
                            :disabled="form.nominal >= loanRules.loanAmounts[loanRules.loanAmounts.length - 1]"
                            class="flex-1 py-3 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400 font-bold hover:bg-blue-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                            + 1K
                        </button>
                    </div>
                </div>

                <div class="mb-6">
                    <div class="flex items-center justify-between mb-3">
                        <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1">Rekomendasi Jumlah Pinjaman</label>
                        <button type="button" @click="showLoanRules = true" class="text-xs text-blue-400 hover:text-blue-300 font-medium underline">
                            Lihat Aturan Pinjaman
                        </button>
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                        <button 
                            v-for="val in [10000, 20000, 50000, 100000]" 
                            :key="val" 
                            type="button" 
                            @click="form.nominal = val, calculateLoan()" 
                            class="py-2.5 px-3 bg-white/5 border rounded-xl text-[11px] text-slate-300 font-bold hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                            :class="form.nominal === val ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/5'">
                            {{ val/1000 }}K
                        </button>
                    </div>
                </div>

                <div class="space-y-4 mb-10">
                    <label class="block text-xs font-semibold text-slate-300 uppercase tracking-widest ml-1">{{ t("loan.form.loan-term") }} ({{ t("loan.card.month") }})</label>
                    <div class="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        <button 
                            v-for="m in loanRules.tenors" 
                            :key="m" 
                            type="button" 
                            @click="setMonth(m)"
                            class="py-4 rounded-xl font-bold transition-all border text-sm"
                            :class="form.tenor === m ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/30'">
                            {{ m }}
                        </button>
                    </div>
                </div>

                <div class="relative overflow-hidden bg-gradient-to-br from-blue-600/20 to-indigo-900/40 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                    <div class="space-y-4">
                        <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                            <span class="text-slate-300">Pokok Pinjaman</span>
                            <span class="text-white font-bold">RM {{ form.nominal.toLocaleString("en-MY") }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                            <span class="text-slate-300">Kadar Faedah</span>
                            <span class="text-white font-bold">{{ form.interest_rate }}% / bulan</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                            <span class="text-slate-300">Tempoh Pinjaman</span>
                            <span class="text-white font-bold">{{ form.tenor }} bulan</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                            <span class="text-slate-300">Pokok Bulanan</span>
                            <span class="text-white font-bold">RM {{ form.monthly_principal.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                            <span class="text-slate-300">Bunga Bulanan</span>
                            <span class="text-white font-bold">RM {{ form.monthly_interest.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                        </div>
                        <div class="bg-white/5 rounded-2xl p-4 border border-white/10">
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-[11px] text-blue-400 font-bold uppercase tracking-widest">Cicilan Bulanan</span>
                                <span class="text-2xl font-black text-white tracking-tighter">RM {{ form.monthly_amortization.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                                <span class="text-slate-400">Total Bunga</span>
                                <span class="text-slate-200 font-semibold">RM {{ totalInterest.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </div>
                            <div class="flex justify-between items-center text-xs pt-2">
                                <span class="text-slate-400">Total Bayar</span>
                                <span class="text-green-400 font-bold">RM {{ totalPayment.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-8 flex items-start gap-3 px-2">
                    <input id="terms" type="checkbox" v-model="agreedTerms" class="mt-1 h-5 w-5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500" />
                    <label for="terms" class="text-xs text-slate-400 leading-relaxed">
                        {{ t("loan.form.term-start") }} 
                        <span @click="showModal = true" class="text-blue-400 font-bold underline cursor-pointer">{{ t("loan.form.term-condition") }}</span>
                    </label>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 1" class="animate-enter">
              <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-2xl">
                <h2 class="text-2xl font-bold text-white mb-2 tracking-tight">{{ t("loan.signature.title") }}</h2>
                <p class="text-slate-400 text-sm mb-8 italic">{{ t("loan.signature.note") }}</p>

                <div class="space-y-4 mb-8">
                   <div @click="showContractModal = true" class="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                      <div class="flex items-center gap-3">
                         <i class="fa-solid fa-file-signature text-blue-400 text-xl"></i>
                         <span class="text-white font-medium text-sm">{{ t("loan.signature.description") }}</span>
                      </div>
                      <i class="fa-solid fa-chevron-right text-slate-500"></i>
                   </div>
                </div>

                <div class="space-y-2">
                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Sila Tanda Tangan Di Sini</label>
                    <div class="bg-white rounded-3xl overflow-hidden shadow-inner p-1">
                        <canvas
                            ref="signaturePad"
                            class="w-full h-56 bg-white cursor-crosshair touch-none"
                            @mousedown="startDrawing"
                            @mousemove="draw"
                            @mouseup="stopDrawing"
                            @touchstart.prevent="startDrawing"
                            @touchmove.prevent="draw"
                            @touchend.prevent="stopDrawing"
                        ></canvas>
                    </div>
                    <button type="button" @click="clearSignature" class="text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mt-2 ml-2">
                        <i class="fa-solid fa-eraser"></i> Padam Tanda Tangan
                    </button>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 2" class="animate-enter flex flex-col items-center py-10">
                <div class="relative mb-8">
                    <div class="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
                    <img src="/images/checklist.png" class="relative w-32 h-32 object-contain brightness-110" />
                </div>
                <h3 class="text-3xl font-black text-white mb-2">{{ user?.name }}</h3>
                <p class="text-slate-400 text-center text-lg max-w-xs leading-relaxed mb-10">
                    {{ t("loan.notification.title") }} <br/>
                    <span class="text-sm opacity-60">{{ t("loan.notification.sub-title") }}</span>
                </p>
                <div class="w-full bg-blue-600/20 border border-blue-500/30 rounded-3xl p-6 backdrop-blur-md">
                   <p class="text-blue-200 text-center text-sm font-medium">
                      {{ t("loan.notification.description") }}
                   </p>
                </div>
            </div>

            <div class="pt-6" v-if="currentStep < 2">
              <button
                v-if="currentStep === 0"
                type="button"
                @click="currentStep = 1"
                :disabled="!agreedTerms"
                class="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale text-white rounded-[1.5rem] font-bold text-lg shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {{ t("loan.button-next") }} <i class="fa-solid fa-arrow-right"></i>
              </button>

              <button
                v-if="currentStep === 1"
                type="submit"
                :disabled="isLoading"
                class="w-full py-5 bg-green-600 hover:bg-green-500 text-white rounded-[1.5rem] font-bold text-lg shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <span v-if="isLoading" class="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                {{ isLoading ? 'Processing...' : t("loan.button-submit") }}
              </button>
            </div>
          </form>
        </div>
      </AtomsContainer>
    </div>

    <transition name="fade-slide">
      <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-[#0A052E]/90 backdrop-blur-md" @click="showModal = false"></div>
        <div class="relative bg-white w-full max-w-lg h-[80vh] p-8 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden text-gray-800">
           <h2 class="text-xl font-bold mb-6 border-b pb-4">Terma & Syarat</h2>
           <div class="flex-grow overflow-y-auto pr-2 mb-6 custom-md-viewer" v-html="markdownToHtml"></div>
           <button @click="showModal = false" class="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl">Faham & Tutup</button>
        </div>
      </div>
    </transition>

    <transition name="fade-slide">
      <div v-if="showContractModal" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-[#0A052E]/90 backdrop-blur-md" @click="showContractModal = false"></div>
        <div class="relative bg-[#1a154d] border border-white/10 w-full max-w-lg p-8 rounded-[2.5rem] shadow-2xl text-white">
           <button @click="showContractModal = false" class="absolute top-6 right-6 text-slate-400 text-2xl">&times;</button>
           <h2 class="text-2xl font-bold mb-6">Maklumat Pinjaman</h2>
           <div class="space-y-4 text-slate-300">
              <div class="flex justify-between border-b border-white/5 pb-2"><span>Nama</span><span class="text-white font-medium">{{ user?.name }}</span></div>
              <div class="flex justify-between border-b border-white/5 pb-2"><span>No. IC</span><span class="text-white font-medium">{{ user?.anggota?.anggota_detail?.ktp_number }}</span></div>
              <div class="flex justify-between border-b border-white/5 pb-2"><span>Jumlah</span><span class="text-white font-bold">RM {{ form.nominal.toLocaleString("en-MY") }}</span></div>
              <div class="flex justify-between border-b border-white/5 pb-2"><span>Tempoh</span><span class="text-white font-medium">{{ form.tenor }} {{ t("loan.card.month") }}</span></div>
              <div class="flex justify-between border-b border-white/5 pb-2"><span>Kadar Faedah</span><span class="text-white font-medium">{{ form.interest_rate }}% / bulan</span></div>
              <div class="flex justify-between pt-2"><span>Bayaran Bulanan</span><span class="text-blue-400 font-black text-xl">RM {{ form.monthly_payment.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span></div>
           </div>
           <button @click="showContractModal = false" class="w-full mt-10 py-4 bg-blue-600 text-white font-bold rounded-2xl">Sahkan Maklumat</button>
        </div>
      </div>
    </transition>

    <transition name="fade-slide">
      <div v-if="showLoanRules" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
        <div class="absolute inset-0 bg-[#0A052E]/95 backdrop-blur-md" @click="showLoanRules = false"></div>
        <div class="relative bg-[#1a154d] border border-white/10 w-full max-w-7xl max-h-[90vh] p-6 md:p-8 rounded-[2.5rem] shadow-2xl text-white overflow-hidden flex flex-col">
           <div class="flex items-center justify-between mb-6">
             <div>
               <h2 class="text-2xl md:text-3xl font-bold mb-2">Aturan Pinjaman</h2>
               <p class="text-sm text-slate-400">Kadar faedah dan bayaran bulanan berdasarkan jumlah dan tempoh pinjaman</p>
             </div>
             <button @click="showLoanRules = false" class="text-slate-400 hover:text-white text-3xl transition-all">&times;</button>
           </div>
           
           <div class="flex-1 overflow-auto pr-2 custom-scrollbar">
             <div class="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
               <h3 class="text-lg font-bold mb-3 text-blue-400">Kadar Faedah Bulanan</h3>
               <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                 <div v-for="(rate, tenor) in loanRules.interestRates" :key="tenor" class="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                   <div class="text-xs text-slate-400 mb-1">{{ tenor }} Bulan</div>
                   <div class="text-lg font-bold text-white">{{ rate }}%</div>
                 </div>
               </div>
             </div>

             <div class="overflow-x-auto">
               <table class="w-full text-sm">
                 <thead>
                   <tr class="bg-blue-600/20 border-b border-blue-500/30">
                     <th class="px-4 py-3 text-left font-bold text-blue-400 sticky left-0 bg-[#1a154d] z-10">Jumlah Pinjaman</th>
                     <th v-for="tenor in loanRules.tenors" :key="tenor" class="px-3 py-3 text-center font-bold text-blue-400 min-w-[100px]">
                       {{ tenor }} Bln
                     </th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr v-for="amount in loanRules.loanAmounts" :key="amount" class="border-b border-white/5 hover:bg-white/5 transition-colors">
                     <td class="px-4 py-3 font-bold text-white sticky left-0 bg-[#1a154d] z-10">
                       RM {{ amount.toLocaleString("en-MY") }}
                     </td>
                     <td v-for="tenor in loanRules.tenors" :key="tenor" class="px-3 py-3 text-center text-slate-300">
                       <div v-if="loanRules.monthlyPayments[amount as keyof typeof loanRules.monthlyPayments]?.[tenor as keyof typeof loanRules.monthlyPayments[5000]]">
                         RM {{ (loanRules.monthlyPayments[amount as keyof typeof loanRules.monthlyPayments][tenor as keyof typeof loanRules.monthlyPayments[5000]] as number).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                       </div>
                       <div v-else class="text-slate-500">-</div>
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
           
           <div class="mt-6 pt-6 border-t border-white/10">
             <button @click="showLoanRules = false" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all">
               Tutup
             </button>
           </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.animate-enter {
  animation: slideUpFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.4s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(40px) scale(0.95); }

/* Custom MD Style */
.custom-md-viewer :deep(h1), .custom-md-viewer :deep(h2) { font-weight: 800; margin-bottom: 1rem; color: #111; }
.custom-md-viewer :deep(p) { margin-bottom: 0.8rem; line-height: 1.6; font-size: 0.9rem; }

/* Custom Scrollbar */
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
</style>