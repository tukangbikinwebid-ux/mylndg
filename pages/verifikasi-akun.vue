<script setup lang="ts">
import { getUserData, getSetting } from "@/composables/utils";
import { ref, onMounted } from "vue";

const { t } = useI18n();
const titleMenu = computed(() => `${t("verification-account.title-menu")}`);
const user = ref(null);
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const updateSuccess = ref<boolean>(false);

// Form data for personal information
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
const previewKtpDepan = ref<string | null>(null);
const previewKtpBelakang = ref<string | null>(null);
const previewSelfie = ref<string | null>(null);

// Form data for bank account information
const formBank = ref({
  bank_name: "",
  account_number: "",
  account_name: "",
});

const handleFileChange = (
  event: Event,
  field: keyof typeof formInformation.value
) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    formInformation.value[field] = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (field === "front_ktp") {
        previewKtpDepan.value = e.target?.result as string | null;
      } else if (field === "back_ktp") {
        previewKtpBelakang.value = e.target?.result as string | null;
      } else if (field === "image") {
        previewSelfie.value = e.target?.result as string | null;
      }
    };
    reader.readAsDataURL(file);
  }
};

const formatICNumber = () => {
  let value = formInformation.value.ktp_number.replace(/\D/g, "");
  let formattedValue = "";

  if (value.length > 0) {
    formattedValue += value.slice(0, 6);
    if (value.length > 6) {
      formattedValue += "-" + value.slice(6, 8);
      if (value.length > 8) {
        formattedValue += "-" + value.slice(8, 12);
      }
    }
  }

  formInformation.value.ktp_number = formattedValue;

  if (formInformation.value.ktp_number.length > 14) {
    formInformation.value.ktp_number = formInformation.value.ktp_number.slice(
      0,
      14
    );
  }
};
  
const submitPersonalInformation = async () => {
  const formData = new FormData();

  // Append data ke FormData
  Object.keys(formInformation.value).forEach((key) => {
    const value =
      formInformation.value[key as keyof typeof formInformation.value];
    if (value !== null) {
      formData.append(key, value);
    }
  });

  const token = getCookie("token");
  alert(token);
  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/profile/anggota-details", // HAPUS ?_method=PUT
      {
        method: "POST", // Tetap POST
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json", // Tambahkan ini agar Laravel mengembalikan JSON jika error
        },
        body: formData,
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Gagal simpan data peribadi",
      };
    }
    return { success: true, data: result };
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
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/profile/anggota-bank", // HAPUS ?_method=PUT
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      }
    );

    const result = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Gagal simpan data bank",
      };
    }
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = null;
  updateSuccess.value = false;

  try {
    const [personalInfoResult, bankInfoResult] = await Promise.all([
      submitPersonalInformation(),
      submitBankInformation(),
    ]);

    if (personalInfoResult.success && bankInfoResult.success) {
      console.log(t("verification-account.allInfoSubmitSuccess"));
      updateSuccess.value = true;
      window.location.href = "/my-account"; // Redirect after successful submission of both forms
    } else {
      let errorMessage = "";
      if (personalInfoResult.error) {
        errorMessage += personalInfoResult.error + " ";
      }
      if (bankInfoResult.error) {
        errorMessage += bankInfoResult.error;
      }
      submitError.value =
        errorMessage.trim() || t("verification-account.allInfoSubmitFailed");
      console.error(t("verification-account.someOrAllInfoSubmitFailed"), {
        personalInfoResult,
        bankInfoResult,
      });
    }
  } catch (error: any) {
    submitError.value =
      error.message || t("verification-account.unexpectedSubmissionError");
    console.error(t("verification-account.submissionError"), error);
  } finally {
    isSubmitting.value = false;
  }
};

const settings = ref(null);
// Cek token saat komponen dimuat
onMounted(async () => {
  try {
    settings.value = await getSetting();
    if (settings.value.maintenance == 1) {
      window.location.href = "/maintenance";
    }
    user.value = await getUserData();
    if (user.value.email_verified_at == null) {
      window.location.href = "/kode-otp"; // Redirect jika email belum diverifikasi
      return;
    }
  } catch (error) {
    console.error(error);
    window.location.href = "/sign-in"; // Redirect jika gagal ambil data user
  }
});

useHead({
  title: t("verification-account.pageTitle"),
  meta: [
    {
      name: "description",
      content: t("verification-account.welcome"),
    },
  ],
  link: [{ rel: "icon", type: "image/png", href: "/logo-flexyduit.png" }],
});
</script>

<template>
  <div class="min-h-screen relative bg-[#0A052E] text-white selection:bg-blue-500/30 overflow-x-hidden">
    <div class="fixed inset-0 z-0">
      <img src="/background.webp" class="w-full h-full object-cover opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-b from-[#0A052E]/60 via-[#0A052E] to-[#0A052E] backdrop-blur-[2px]"></div>
    </div>

    <section class="relative z-10 pb-32">
      <CardsNavigasiHeader 
        :title="titleMenu" 
        type="menu" 
        class="sticky top-0 z-50 bg-[#0A052E]/80 backdrop-blur-xl border-b border-white/5" 
      />

      <div class="max-w-md mx-auto px-5 pt-8">
        <div class="mb-6 px-2">
          <h2 class="text-xl font-extrabold text-white tracking-tight">
            {{ t("verification-account.formDataInformation") }}
          </h2>
        </div>

        <div class="animate-enter bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-6 mb-8">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-12 h-12 flex items-center justify-center bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <i class="fa-solid fa-user-shield text-blue-400 text-xl"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white">Pengesahan Identitas</h3>
              <p class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Dokumen Wajib</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-5">
            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.frontIdCard") }}</label>
              <div @click="$refs.frontKtpInput.click()" class="upload-box-glossy group">
                <img v-if="previewKtpDepan" :src="previewKtpDepan" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="icon-circle-glossy"><i class="fa-solid fa-id-card text-blue-400 text-lg"></i></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ambil Foto Depan</span>
                </div>
                <input ref="frontKtpInput" type="file" accept="image/*" capture="environment" @change="(e) => handleFileChange(e, 'front_ktp')" class="hidden" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.backIdCard") }}</label>
              <div @click="$refs.backKtpInput.click()" class="upload-box-glossy group">
                <img v-if="previewKtpBelakang" :src="previewKtpBelakang" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="icon-circle-glossy"><i class="fa-solid fa-address-card text-blue-400 text-lg"></i></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ambil Foto Belakang</span>
                </div>
                <input ref="backKtpInput" type="file" accept="image/*" capture="environment" @change="(e) => handleFileChange(e, 'back_ktp')" class="hidden" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.selfieWithPhoto") }}</label>
              <div @click="$refs.imageInput.click()" class="upload-box-glossy group">
                <img v-if="previewSelfie" :src="previewSelfie" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="icon-circle-glossy"><i class="fa-solid fa-camera-retro text-blue-400 text-lg"></i></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ambil Selfie</span>
                </div>
                <input ref="imageInput" type="file" accept="image/*" capture="user" @change="(e) => handleFileChange(e, 'image')" class="hidden" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[2.5rem] p-8 mb-8">
          <h3 class="text-white font-bold mb-8 flex items-center gap-3">
            <span class="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"></span>
            Maklumat Peribadi
          </h3>

          <div class="space-y-6">
            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.fullName") }}</label>
              <input v-model="formInformation.full_name" type="text" :placeholder="t('verification-account.enterFullName')" class="modern-input-dark" />
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.icNumberFormat") }}</label>
              <input v-model="formInformation.ktp_number" type="text" class="modern-input-dark font-mono" @input="formatICNumber" />
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.gender") }}</label>
              <div class="grid grid-cols-2 gap-3 mt-2">
                <button 
                  v-for="g in ['male', 'female']" :key="g"
                  @click="formInformation.gender = g"
                  :class="formInformation.gender === g ? 'gender-btn-active' : 'gender-btn-inactive'"
                >
                  {{ t(`verification-account.${g}`) }}
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="form-group-dark">
                <label class="label-dark">{{ t("verification-account.birthPlace") }}</label>
                <input v-model="formInformation.birth_place" type="text" class="modern-input-dark" />
              </div>
              <div class="form-group-dark">
                <label class="label-dark">{{ t("verification-account.birthDate") }}</label>
                <input v-model="formInformation.birth_date" type="date" class="modern-input-dark" />
              </div>
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.work") }}</label>
              <input v-model="formInformation.work" type="text" class="modern-input-dark" />
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.monthlyIncome") }} (RM)</label>
              <input v-model="formInformation.monthly_income" type="number" class="modern-input-dark" />
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.address") }}</label>
              <textarea v-model="formInformation.address" rows="3" class="modern-input-dark resize-none"></textarea>
            </div>

            <div class="form-group-dark">
              <label class="label-dark">{{ t("verification-account.loanPurpose") }}</label>
              <input v-model="formInformation.loan_purpose" type="text" class="modern-input-dark" />
            </div>

            <div class="border-t border-white/5 pt-4">
               <label class="label-dark">Nama Kontak Darurat</label>
               <input v-model="formInformation.contact_1" type="text" class="modern-input-dark" />
            </div>

            <div class="form-group-dark">
               <label class="label-dark">Nombor Kontak Darurat</label>
               <input v-model="formInformation.contact_1_name" type="tel" class="modern-input-dark font-mono" maxlength="13" @input="formInformation.contact_1_name = formInformation.contact_1_name.replace(/\D/g, '')" />
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

          <div class="space-y-6">
            <div class="form-group-dark" v-for="field in ['bank_name', 'account_number', 'account_name']" :key="field">
              <label class="label-dark">{{ t(`verification-account.${field === 'bank_name' ? 'branchBank' : field === 'account_number' ? 'accountNumberBank' : 'accountName'}`) }}</label>
              <input v-model="formBank[field]" type="text" class="modern-input-dark" required />
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
          class="group relative w-full h-15 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-white rounded-[1.25rem] font-bold transition-all shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-[0.97] overflow-hidden py-4 flex items-center justify-center"
        >
          <div class="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
          
          <div v-if="isSubmitting" class="flex items-center gap-3">
             <i class="fa-solid fa-circle-notch animate-spin"></i>
             <span class="uppercase tracking-widest text-xs">Memproses...</span>
          </div>
          <span v-else class="uppercase tracking-widest text-xs">{{ t("verification-account.submitAllInformation") }}</span>
        </button>
        
        <p v-if="submitError" class="text-red-400 text-[10px] text-center mt-3 font-bold uppercase tracking-tight">⚠️ {{ submitError }}</p>
        <p v-if="updateSuccess" class="text-green-400 text-[10px] text-center mt-3 font-bold uppercase tracking-tight">✅ Pengesahan Berjaya!</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-enter {
  animation: slideUp 0.6s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom Component Styles */
.upload-box-glossy {
  @apply relative h-44 border-2 border-dashed border-white/10 rounded-[2rem] overflow-hidden bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer flex flex-col items-center justify-center;
}

.icon-circle-glossy {
  @apply w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition duration-500;
}

.label-dark {
  @apply text-[10px] font-bold text-blue-400/80 uppercase tracking-widest ml-1 mb-1.5 block;
}

.modern-input-dark {
  @apply w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white text-sm outline-none transition-all
         focus:bg-white/[0.07] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-600;
}

.gender-btn-active {
  @apply p-3.5 bg-blue-600 border border-blue-400 text-white text-xs font-bold rounded-xl shadow-[0_5px_15px_rgba(37,99,235,0.3)];
}

.gender-btn-inactive {
  @apply p-3.5 bg-white/[0.03] border border-white/10 text-slate-400 text-xs font-bold rounded-xl hover:bg-white/5 transition-all;
}

/* Hilangkan Arrows di Input Number */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>