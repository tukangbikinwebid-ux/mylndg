<script setup lang="ts">
import { getUserData, getSetting, getCookie } from "@/composables/utils";
import { ref, onMounted, computed, nextTick, watch } from "vue";

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

// Helper: cek value kosong (handle null, undefined, string kosong, number 0 valid)
const isEmpty = (val: unknown, isNumber = false): boolean => {
  if (val === null || val === undefined) return true;
  if (val instanceof File) return false;
  if (typeof val === "number") return false;
  const str = String(val ?? "").trim();
  return str === "";
};

// Konfigurasi field untuk validasi konsisten (key, label, getter)
const FIELD_CONFIG = [
  { key: "front_ktp", label: "Foto KTP Depan", getVal: () => formInformation.value.front_ktp },
  { key: "back_ktp", label: "Foto KTP Belakang", getVal: () => formInformation.value.back_ktp },
  { key: "image", label: "Foto Selfie", getVal: () => formInformation.value.image },
  { key: "full_name", label: "Nama Lengkap", getVal: () => formInformation.value.full_name },
  { key: "ktp_number", label: "Nombor IC", getVal: () => formInformation.value.ktp_number },
  { key: "gender", label: "Jantina", getVal: () => formInformation.value.gender },
  { key: "birth_place", label: "Tempat Lahir", getVal: () => formInformation.value.birth_place },
  { key: "birth_date", label: "Tarikh Lahir", getVal: () => formInformation.value.birth_date },
  { key: "work", label: "Pekerjaan", getVal: () => formInformation.value.work },
  { key: "monthly_income", label: "Pendapatan Bulanan", getVal: () => formInformation.value.monthly_income, isNumber: true },
  { key: "loan_purpose", label: "Tujuan Pinjaman", getVal: () => formInformation.value.loan_purpose },
  { key: "address", label: "Alamat", getVal: () => formInformation.value.address },
  { key: "contact_1", label: "Nama Kontak Darurat", getVal: () => formInformation.value.contact_1 },
  { key: "contact_1_name", label: "Nombor Kontak Darurat", getVal: () => formInformation.value.contact_1_name },
  { key: "bank_name", label: "Nama Bank", getVal: () => formBank.value.bank_name },
  { key: "account_number", label: "Nombor Akaun", getVal: () => formBank.value.account_number },
  { key: "account_name", label: "Nama Pemilik Akaun", getVal: () => formBank.value.account_name },
];

// Daftar field yang kosong beserta label
const emptyFieldsList = computed(() =>
  FIELD_CONFIG.filter((f) => isEmpty(f.getVal(), f.isNumber)).map((f) => ({ key: f.key, label: f.label }))
);

// Computed property untuk cek apakah semua field sudah terisi
const isFormValid = computed(() => emptyFieldsList.value.length === 0);

// Fungsi validasi untuk mendapatkan field yang kosong (untuk pesan error)
const getEmptyFields = (): string[] => emptyFieldsList.value.map((f) => f.label);

// Cek field tertentu kosong (untuk highlight input)
const isFieldEmpty = (key: string): boolean =>
  FIELD_CONFIG.some((f) => f.key === key && isEmpty(f.getVal(), f.isNumber));

const showValidationErrors = ref(false);
watch(isFormValid, (valid) => {
  if (valid) showValidationErrors.value = false;
});
const scrollToFirstError = () => {
  showValidationErrors.value = true;
  nextTick(() => {
    const firstInvalid = document.querySelector("[data-invalid-field]");
    firstInvalid?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
};

const compressImage = (file: File, maxSizeMB = 10): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Jika sudah dibawah limit, return langsung
    if (file.size <= maxSizeMB * 1024 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // Resize jika dimensi terlalu besar (max 2048px)
      const MAX_DIM = 2048;
      if (width > MAX_DIM || height > MAX_DIM) {
        const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // Compress iteratif: mulai dari quality 0.8, turun sampai dibawah limit
      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Compression failed"));
              return;
            }
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.1) {
              const compressed = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressed);
            } else {
              quality -= 0.1;
              tryCompress();
            }
          },
          "image/jpeg",
          quality
        );
      };
      tryCompress();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

const handleFileChange = async (
  event: Event,
  field: keyof typeof formInformation.value
) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    try {
      const compressed = await compressImage(file);
      formInformation.value[field] = compressed;
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
      reader.readAsDataURL(compressed);
    } catch {
      // Fallback: gunakan file asli jika compress gagal
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
  
// Helper function untuk cek error authentication
const isAuthenticationError = (status: number, message: string): boolean => {
  const authKeywords = ['unauthenticated', 'unauthorized', 'token', 'expired', 'invalid token', 'not authenticated'];
  const lowerMessage = message.toLowerCase();
  return status === 401 || status === 403 || authKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Helper function untuk redirect ke login dengan pesan
const handleAuthError = () => {
  // Hapus token yang sudah expired
  document.cookie = "token=; path=/; max-age=0";
  // Redirect ke halaman login
  setTimeout(() => {
    window.location.href = "/sign-in";
  }, 3000);
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
  
  // Cek token sebelum request
  if (!token) {
    return {
      success: false,
      error: "Sesi anda telah tamat tempoh. Sila log masuk semula.",
      isAuthError: true,
    };
  }

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/profile/anggota-details",
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
      // Cek jika error authentication
      if (isAuthenticationError(response.status, result.message || "")) {
        return {
          success: false,
          error: "Sesi anda telah tamat tempoh. Sila log masuk semula untuk meneruskan.",
          isAuthError: true,
        };
      }
      return {
        success: false,
        error: result.message || "Gagal menyimpan maklumat peribadi. Sila cuba lagi.",
        isAuthError: false,
      };
    }
    return { success: true, data: result, isAuthError: false };
  } catch (error: any) {
    return { 
      success: false, 
      error: "Ralat sambungan rangkaian. Sila periksa internet anda dan cuba lagi.",
      isAuthError: false,
    };
  }
};

const submitBankInformation = async () => {
  const formData = new FormData();
  Object.keys(formBank.value).forEach((key) => {
    formData.append(key, formBank.value[key as keyof typeof formBank.value]);
  });

  const token = getCookie("token");
  
  // Cek token sebelum request
  if (!token) {
    return {
      success: false,
      error: "Sesi anda telah tamat tempoh. Sila log masuk semula.",
      isAuthError: true,
    };
  }

  try {
    const response = await fetch(
      "https://cms.mysolutionlending.com/api/v1/profile/anggota-bank",
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
      // Cek jika error authentication
      if (isAuthenticationError(response.status, result.message || "")) {
        return {
          success: false,
          error: "Sesi anda telah tamat tempoh. Sila log masuk semula untuk meneruskan.",
          isAuthError: true,
        };
      }
      return {
        success: false,
        error: result.message || "Gagal menyimpan maklumat bank. Sila cuba lagi.",
        isAuthError: false,
      };
    }
    return { success: true, data: result, isAuthError: false };
  } catch (error: any) {
    return { 
      success: false, 
      error: "Ralat sambungan rangkaian. Sila periksa internet anda dan cuba lagi.",
      isAuthError: false,
    };
  }
};

const notification = ref<{ type: 'success' | 'error'; message: string; visible: boolean }>({ type: 'success', message: '', visible: false });
function showNotification(type: 'success' | 'error', message: string) {
  notification.value = { type, message, visible: true };
  setTimeout(() => {
    notification.value.visible = false;
  }, 3500);
}

const handleSubmit = async () => {
  const emptyFields = getEmptyFields();
  if (emptyFields.length > 0) {
    const errorMsg =
      emptyFields.length === 1
        ? `Sila lengkapkan: ${emptyFields[0]}`
        : `Sila lengkapkan ${emptyFields.length} medan: ${emptyFields.join(", ")}`;
    showNotification("error", errorMsg);
    submitError.value = errorMsg;
    scrollToFirstError();
    return;
  }
  showValidationErrors.value = false;

  // Cek token sebelum submit
  const token = getCookie("token");
  if (!token) {
    const authErrorMsg = "Sesi anda telah tamat tempoh. Anda akan dialihkan ke halaman log masuk...";
    showNotification('error', authErrorMsg);
    submitError.value = authErrorMsg;
    handleAuthError();
    return;
  }

  isSubmitting.value = true;
  submitError.value = null;
  updateSuccess.value = false;

  try {
    const [personalInfoResult, bankInfoResult] = await Promise.all([
      submitPersonalInformation(),
      submitBankInformation(),
    ]);

    // Cek jika ada error authentication
    if (personalInfoResult.isAuthError || bankInfoResult.isAuthError) {
      const authErrorMsg = "Sesi anda telah tamat tempoh atau tidak sah. Anda akan dialihkan ke halaman log masuk...";
      showNotification('error', authErrorMsg);
      submitError.value = authErrorMsg;
      handleAuthError();
      return;
    }

    if (personalInfoResult.success && bankInfoResult.success) {
      showNotification('success', "Pengesahan maklumat berjaya disimpan!");
      updateSuccess.value = true;
      setTimeout(() => {
        window.location.href = "/my-account";
      }, 1200);
    } else {
      // Kumpulkan semua error messages
      const errors: string[] = [];
      
      if (personalInfoResult.error) {
        errors.push(personalInfoResult.error);
      }
      if (bankInfoResult.error && bankInfoResult.error !== personalInfoResult.error) {
        errors.push(bankInfoResult.error);
      }
      
      const errorMessage = errors.length > 0 
        ? errors.join(" | ") 
        : "Gagal menyimpan maklumat. Sila cuba lagi.";
      
      showNotification('error', errorMessage);
      submitError.value = errorMessage;
    }
  } catch (error: any) {
    const networkErrorMsg = "Ralat tidak dijangka berlaku. Sila cuba lagi atau hubungi sokongan pelanggan.";
    showNotification('error', networkErrorMsg);
    submitError.value = networkErrorMsg;
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
            <div class="space-y-2" :data-invalid-field="showValidationErrors && isFieldEmpty('front_ktp') ? 'front_ktp' : undefined">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.frontIdCard") }}</label>
              <div @click="$refs.frontKtpInput.click()" class="upload-box-glossy group" :class="{ 'ring-2 ring-red-500/60 border-red-500/40': showValidationErrors && isFieldEmpty('front_ktp') }">
                <img v-if="previewKtpDepan" :src="previewKtpDepan" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="icon-circle-glossy"><i class="fa-solid fa-id-card text-blue-400 text-lg"></i></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ambil Foto Depan</span>
                </div>
                <input ref="frontKtpInput" type="file" accept="image/*" capture="environment" @change="(e) => handleFileChange(e, 'front_ktp')" class="hidden" />
              </div>
            </div>

            <div class="space-y-2" :data-invalid-field="showValidationErrors && isFieldEmpty('back_ktp') ? 'back_ktp' : undefined">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.backIdCard") }}</label>
              <div @click="$refs.backKtpInput.click()" class="upload-box-glossy group" :class="{ 'ring-2 ring-red-500/60 border-red-500/40': showValidationErrors && isFieldEmpty('back_ktp') }">
                <img v-if="previewKtpBelakang" :src="previewKtpBelakang" class="absolute inset-0 w-full h-full object-cover" />
                <div v-else class="text-center">
                  <div class="icon-circle-glossy"><i class="fa-solid fa-address-card text-blue-400 text-lg"></i></div>
                  <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Ambil Foto Belakang</span>
                </div>
                <input ref="backKtpInput" type="file" accept="image/*" capture="environment" @change="(e) => handleFileChange(e, 'back_ktp')" class="hidden" />
              </div>
            </div>

            <div class="space-y-2" :data-invalid-field="showValidationErrors && isFieldEmpty('image') ? 'image' : undefined">
              <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ t("verification-account.selfieWithPhoto") }}</label>
              <div @click="$refs.imageInput.click()" class="upload-box-glossy group" :class="{ 'ring-2 ring-red-500/60 border-red-500/40': showValidationErrors && isFieldEmpty('image') }">
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
            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('full_name') ? 'full_name' : undefined">
              <label class="label-dark">{{ t("verification-account.fullName") }}</label>
              <input v-model="formInformation.full_name" type="text" :placeholder="t('verification-account.enterFullName')" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('full_name') }" />
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('ktp_number') ? 'ktp_number' : undefined">
              <label class="label-dark">{{ t("verification-account.icNumberFormat") }}</label>
              <input v-model="formInformation.ktp_number" type="text" class="modern-input-dark font-mono" @input="formatICNumber" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('ktp_number') }" />
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('gender') ? 'gender' : undefined">
              <label class="label-dark">{{ t("verification-account.gender") }}</label>
              <div class="grid grid-cols-2 gap-3 mt-2" :class="{ 'ring-2 ring-red-500/40 rounded-xl p-0.5 -m-0.5': showValidationErrors && isFieldEmpty('gender') }">
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
              <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('birth_place') ? 'birth_place' : undefined">
                <label class="label-dark">{{ t("verification-account.birthPlace") }}</label>
                <input v-model="formInformation.birth_place" type="text" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('birth_place') }" />
              </div>
              <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('birth_date') ? 'birth_date' : undefined">
                <label class="label-dark">{{ t("verification-account.birthDate") }}</label>
                <input v-model="formInformation.birth_date" type="date" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('birth_date') }" />
              </div>
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('work') ? 'work' : undefined">
              <label class="label-dark">{{ t("verification-account.work") }}</label>
              <input v-model="formInformation.work" type="text" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('work') }" />
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('monthly_income') ? 'monthly_income' : undefined">
              <label class="label-dark">{{ t("verification-account.monthlyIncome") }} (RM)</label>
              <input v-model="formInformation.monthly_income" type="number" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('monthly_income') }" />
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('address') ? 'address' : undefined">
              <label class="label-dark">{{ t("verification-account.address") }}</label>
              <textarea v-model="formInformation.address" rows="3" class="modern-input-dark resize-none" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('address') }"></textarea>
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('loan_purpose') ? 'loan_purpose' : undefined">
              <label class="label-dark">{{ t("verification-account.loanPurpose") }}</label>
              <input v-model="formInformation.loan_purpose" type="text" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('loan_purpose') }" />
            </div>

            <div class="border-t border-white/5 pt-4" :data-invalid-field="showValidationErrors && isFieldEmpty('contact_1') ? 'contact_1' : undefined">
               <label class="label-dark">Nama Kontak Darurat</label>
               <input v-model="formInformation.contact_1" type="text" class="modern-input-dark" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('contact_1') }" />
            </div>

            <div class="form-group-dark" :data-invalid-field="showValidationErrors && isFieldEmpty('contact_1_name') ? 'contact_1_name' : undefined">
               <label class="label-dark">Nombor Kontak Darurat</label>
               <input v-model="formInformation.contact_1_name" type="tel" class="modern-input-dark font-mono" maxlength="13" @input="formInformation.contact_1_name = formInformation.contact_1_name.replace(/\D/g, '')" :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty('contact_1_name') }" />
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
            <div class="form-group-dark" v-for="field in (['bank_name', 'account_number', 'account_name'] as const)" :key="field" :data-invalid-field="showValidationErrors && isFieldEmpty(field) ? field : undefined">
              <label class="label-dark">{{ t(`verification-account.${field === 'bank_name' ? 'branchBank' : field === 'account_number' ? 'accountNumberBank' : 'accountName'}`) }}</label>
              <input
                :value="formBank[field]"
                type="text"
                class="modern-input-dark"
                :class="{ 'border-red-500/60 ring-2 ring-red-500/30': showValidationErrors && isFieldEmpty(field) }"
                :inputmode="field === 'account_number' ? 'numeric' : undefined"
                @input="(e) => formBank[field] = field === 'account_number' ? (e.target as HTMLInputElement).value.replace(/\s/g, '') : (e.target as HTMLInputElement).value"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="fixed bottom-0 left-0 right-0 p-6 bg-[#0A052E]/90 backdrop-blur-2xl border-t border-white/10 z-50">
      <div class="max-w-md mx-auto">
        <button
          @click="handleSubmit"
          :disabled="isSubmitting || !isFormValid"
          :class="[
            'group relative w-full h-15 text-white rounded-[1.25rem] font-bold transition-all active:scale-[0.97] overflow-hidden py-4 flex items-center justify-center',
            isFormValid && !isSubmitting 
              ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_10px_30px_rgba(37,99,235,0.3)]' 
              : 'bg-white/10 cursor-not-allowed shadow-none'
          ]"
        >
          <div v-if="isFormValid && !isSubmitting" class="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
          
          <div v-if="isSubmitting" class="flex items-center gap-3">
             <i class="fa-solid fa-circle-notch animate-spin"></i>
             <span class="uppercase tracking-widest text-xs">Memproses...</span>
          </div>
          <div v-else-if="!isFormValid" class="flex items-center gap-2">
             <i class="fa-solid fa-lock text-slate-500"></i>
             <span class="uppercase tracking-widest text-xs text-slate-400">Lengkapkan Semua Data</span>
          </div>
          <span v-else class="uppercase tracking-widest text-xs">{{ t("verification-account.submitAllInformation") }}</span>
        </button>
        
        <!-- Progress indicator - tunjukkan field yang belum lengkap -->
        <div v-if="!isFormValid" class="mt-3 px-1">
          <p class="text-slate-400 text-[10px] font-bold uppercase tracking-tight mb-1.5">
            <i class="fa-solid fa-info-circle mr-1"></i>
            {{ emptyFieldsList.length }} medan belum dilengkapkan:
          </p>
          <p class="text-slate-500 text-[11px] leading-relaxed">
            {{ emptyFieldsList.map(f => f.label).join(" • ") }}
          </p>
        </div>
        
        <p v-if="submitError" class="text-red-400 text-[10px] text-center mt-3 font-bold uppercase tracking-tight">{{ submitError }}</p>
        <p v-if="updateSuccess" class="text-green-400 text-[10px] text-center mt-3 font-bold uppercase tracking-tight">Pengesahan Berjaya!</p>
      </div>
    </div>

    <!-- Notifikasi Custom -->
    <transition name="notify-center">
      <div v-if="notification.visible">
        <div class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"></div>
        <div :class="[ 'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 px-8 py-8 rounded-3xl shadow-2xl border flex flex-col items-center', notification.type === 'success' ? 'bg-blue-500/40 border-blue-500/30' : 'bg-red-500/40 border-red-500/30' ]" style="backdrop-filter: blur(24px); min-width: 320px; max-width: 95vw;">
          <span v-if="notification.type === 'success'" class="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-blue-500/60 text-white text-5xl shadow-lg">✔️</span>
          <span v-else class="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-red-500/60 text-white text-5xl shadow-lg">❌</span>
          <span class="text-white font-bold text-lg text-center leading-snug">{{ notification.message }}</span>
        </div>
      </div>
    </transition>
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

/* Animasi Transisi */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Notifikasi Pusat */
.notify-center-enter-active,
.notify-center-leave-active {
  transition: opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}
.notify-center-enter-from,
.notify-center-leave-to {
  opacity: 0;
  transform: scale(0.85) translate(-50%, -50%);
}
</style>