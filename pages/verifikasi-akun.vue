<script setup lang="ts">
import { getUserData, getSetting } from "@/composables/utils";
import { ref, onMounted, computed } from "vue";

const { t } = useI18n();
const titleMenu = computed(() => `${t("verification-account.title-menu")}`);
const user = ref(null);
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const updateSuccess = ref<boolean>(false);

// Form data peribadi
const formInformation = ref({
  front_ktp: null as File | null,
  back_ktp: null as File | null,
  image: null as File | null,
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

const preview = ref({
  front_ktp: null as string | null,
  back_ktp: null as string | null,
  image: null as string | null,
});

// Form data bank
const formBank = ref({
  bank_name: "",
  account_number: "",
  account_name: "",
});

const handleFileChange = (event: Event, field: 'front_ktp' | 'back_ktp' | 'image') => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    formInformation.value[field] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.value[field] = e.target?.result as string | null;
    };
    reader.readAsDataURL(file);
  }
};

const formatICNumber = () => {
  let value = formInformation.value.ktp_number.replace(/\D/g, "");
  let formattedValue = "";
  if (value.length > 0) {
    formattedValue += value.slice(0, 6);
    if (value.length > 6) formattedValue += "-" + value.slice(6, 8);
    if (value.length > 8) formattedValue += "-" + value.slice(8, 12);
  }
  formInformation.value.ktp_number = formattedValue.slice(0, 14);
};

const submitPersonalInformation = async () => {
  const formData = new FormData();
  Object.keys(formInformation.value).forEach((key) => {
    const value = formInformation.value[key as keyof typeof formInformation.value];
    if (value !== null) formData.append(key, value);
  });

  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/profile/anggota-details", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    return response.ok ? { success: true, data: result } : { success: false, error: result.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const submitBankInformation = async () => {
  const formData = new FormData();
  Object.keys(formBank.value).forEach((key) => {
    formData.append(key, formBank.value[key as keyof typeof formBank.value]);
  });

  const token = getCookie("token");
  try {
    const response = await fetch("https://cms.mysolutionlending.com/api/v1/profile/anggota-bank", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      body: formData,
    });
    const result = await response.json();
    return response.ok ? { success: true, data: result } : { success: false, error: result.message };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = null;

  try {
    const [personalRes, bankRes] = await Promise.all([
      submitPersonalInformation(),
      submitBankInformation(),
    ]);

    if (personalRes.success && bankRes.success) {
      updateSuccess.value = true;
      setTimeout(() => { window.location.href = "/my-account"; }, 1500);
    } else {
      submitError.value = personalRes.error || bankRes.error || "Gagal menyimpan data.";
    }
  } catch (error: any) {
    submitError.value = error.message;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const settings = await getSetting();
    if (settings?.maintenance == 1) window.location.href = "/maintenance";
    user.value = await getUserData();
    if (!user.value.email_verified_at) window.location.href = "/kode-otp";
  } catch (error) {
    window.location.href = "/sign-in";
  }
});

useHead({
  title: t("verification-account.pageTitle"),
  link: [{ rel: "icon", type: "image/png", href: "/logo-flexyduit.png" }],
});
</script>

<template>
  <div class="min-h-screen relative bg-[#0A052E] text-white selection:bg-blue-500/30">
    <div class="fixed inset-0 z-0">
      <img src="/background.webp" class="w-full h-full object-cover opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0A052E]/60 via-[#0A052E] to-[#0A052E] backdrop-blur-[2px]"></div>
    </div>

    <section class="relative z-10 pb-32">
      <CardsNavigasiHeader :title="titleMenu" type="menu" class="sticky top-0 z-50 bg-[#0A052E]/80 backdrop-blur-xl border-b border-white/5" />

      <div class="max-w-md mx-auto px-5 pt-8">
        <div class="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-6 mb-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <i class="fa-solid fa-camera-retro text-blue-400 text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Dokumen Identitas</h3>
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Verifikasi Foto</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <div v-for="field in ['front_ktp', 'back_ktp', 'image']" :key="field" class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t(`verification-account.${field}`) }}</label>
              <div 
                @click="($refs[`${field}Input`] as any)[0].click()"
                class="relative h-44 border-2 border-dashed border-white/10 rounded-3xl overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group flex flex-col items-center justify-center"
              >
                <img v-if="preview[field as keyof typeof preview.value]" :src="preview[field as keyof typeof preview.value]!" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition duration-500">
                    <i class="fa-solid fa-plus text-slate-500"></i>
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Klik untuk Ambil Foto</span>
                </div>
                <input :ref="`${field}Input`" type="file" accept="image/*" capture="environment" class="hidden" @change="e => handleFileChange(e, field as any)" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-8">
          <h3 class="text-white font-bold mb-6 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            Maklumat Peribadi
          </h3>

          <div class="space-y-5">
            <div v-for="item in ['full_name', 'ktp_number', 'work', 'monthly_income', 'loan_purpose']" :key="item" class="space-y-1.5">
              <label class="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest ml-1">{{ t(`verification-account.${item}`) }}</label>
              <input 
                v-model="formInformation[item as keyof typeof formInformation.value]" 
                :type="item === 'monthly_income' ? 'number' : 'text'"
                class="modern-input"
                @input="item === 'ktp_number' ? formatICNumber() : null"
              />
            </div>

            <div class="space-y-1.5">
              <label class="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest ml-1">Alamat Tetap</label>
              <textarea v-model="formInformation.address" rows="3" class="modern-input resize-none"></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-12">
          <div class="flex items-center gap-4 mb-8">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <i class="fa-solid fa-building-columns text-blue-400 text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold">Maklumat Bank</h3>
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Pengeluaran Dana</p>
            </div>
          </div>

          <div class="space-y-5">
            <div v-for="field in ['bank_name', 'account_number', 'account_name']" :key="field" class="space-y-1.5">
              <label class="text-[10px] font-bold text-blue-400/80 uppercase tracking-widest ml-1">{{ t(`verification-account.${field}`) }}</label>
              <input v-model="formBank[field as keyof typeof formBank.value]" type="text" class="modern-input" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="fixed bottom-0 left-0 right-0 p-6 bg-[#0A052E]/90 backdrop-blur-2xl border-t border-white/10 z-50">
      <div class="max-w-md mx-auto">
        <button
          @click="handleSubmit"
          :disabled="isSubmitting"
          class="group relative w-full h-15 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-white rounded-[1.25rem] font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-[0.97] overflow-hidden py-4 px-6 flex items-center justify-center"
        >
          <div class="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
          
          <div v-if="isSubmitting" class="flex items-center gap-3">
             <i class="fa-solid fa-circle-notch animate-spin"></i>
             <span class="uppercase tracking-widest text-xs">Memproses...</span>
          </div>
          <span v-else class="uppercase tracking-widest text-xs">Hantar Maklumat Pengesahan</span>
        </button>
        
        <transition name="fade">
          <p v-if="submitError" class="text-red-400 text-[10px] text-center mt-3 font-bold uppercase">{{ submitError }}</p>
          <p v-else-if="updateSuccess" class="text-green-400 text-[10px] text-center mt-3 font-bold uppercase">Berhasil! Mengalihkan...</p>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modern-input {
  @apply w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none transition-all
         focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-600;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>