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
  try {
    const response = await fetch(
      "https://cms.flexyduit.com/api/v1/profile/anggota-details", // HAPUS ?_method=PUT
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
      "https://cms.flexyduit.com/api/v1/profile/anggota-bank", // HAPUS ?_method=PUT
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
  <section class="min-h-screen bg-slate-50 pb-24" id="bank-account">
    <CardsNavigasiHeader
      :title="titleMenu"
      type="menu"
      class="sticky top-0 z-50 shadow-sm"
    />

    <div class="max-w-md mx-auto px-4 pt-6">
      <div class="flex justify-between items-center mb-6 px-2">
        <h2 class="text-xl font-extrabold text-slate-800 tracking-tight">
          {{ t("verification-account.formDataInformation") }}
        </h2>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6"
      >
        <div class="space-y-5">
          <div class="grid grid-cols-1 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 block">{{
                t("verification-account.frontIdCard")
              }}</label>
              <div
                @click="$refs.frontKtpInput.click()"
                class="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100 transition cursor-pointer group h-40 flex flex-col items-center justify-center text-center p-4"
              >
                <img
                  v-if="previewKtpDepan"
                  :src="previewKtpDepan"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center">
                  <div
                    class="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span class="text-xs text-slate-500 font-medium"
                    >Klik untuk Ambil Foto</span
                  >
                </div>
                <input
                  ref="frontKtpInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  @change="(e) => handleFileChange(e, 'front_ktp')"
                  class="hidden"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 block">{{
                t("verification-account.backIdCard")
              }}</label>
              <div
                @click="$refs.backKtpInput.click()"
                class="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100 transition cursor-pointer group h-40 flex flex-col items-center justify-center text-center p-4"
              >
                <img
                  v-if="previewKtpBelakang"
                  :src="previewKtpBelakang"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center">
                  <div
                    class="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span class="text-xs text-slate-500 font-medium"
                    >Klik untuk Ambil Foto</span
                  >
                </div>
                <input
                  ref="backKtpInput"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  @change="(e) => handleFileChange(e, 'back_ktp')"
                  class="hidden"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-bold text-slate-700 block">{{
                t("verification-account.selfieWithPhoto")
              }}</label>
              <div
                @click="$refs.imageInput.click()"
                class="relative border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 hover:bg-slate-100 transition cursor-pointer group h-40 flex flex-col items-center justify-center text-center p-4"
              >
                <img
                  v-if="previewSelfie"
                  :src="previewSelfie"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div v-else class="flex flex-col items-center">
                  <div
                    class="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span class="text-xs text-slate-500 font-medium"
                    >Klik untuk Ambil Selfie</span
                  >
                </div>
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  capture="user"
                  @change="(e) => handleFileChange(e, 'image')"
                  class="hidden"
                />
              </div>
            </div>
          </div>

          <hr class="border-slate-100" />

          <div class="space-y-4">
            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                >{{ t("verification-account.fullName") }}</label
              >
              <input
                v-model="formInformation.full_name"
                type="text"
                :placeholder="t('verification-account.enterFullName')"
                class="modern-input"
              />
            </div>

            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                >{{ t("verification-account.icNumberFormat") }}</label
              >
              <input
                v-model="formInformation.ktp_number"
                type="text"
                :placeholder="t('verification-account.enterIcNumber')"
                class="modern-input font-mono"
                @input="formatICNumber"
              />
            </div>

            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block"
                >{{ t("verification-account.gender") }}</label
              >
              <div class="grid grid-cols-2 gap-3">
                <label
                  class="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition"
                  :class="
                    formInformation.gender === 'male'
                      ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  "
                >
                  <input
                    type="radio"
                    value="male"
                    v-model="formInformation.gender"
                    class="hidden"
                  />
                  <span>{{ t("verification-account.male") }}</span>
                </label>
                <label
                  class="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition"
                  :class="
                    formInformation.gender === 'female'
                      ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold'
                      : 'bg-white border-slate-200 text-slate-500'
                  "
                >
                  <input
                    type="radio"
                    value="female"
                    v-model="formInformation.gender"
                    class="hidden"
                  />
                  <span>{{ t("verification-account.female") }}</span>
                </label>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="form-group">
                <label
                  class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                  >{{ t("verification-account.birthPlace") }}</label
                >
                <input
                  v-model="formInformation.birth_place"
                  type="text"
                  class="modern-input"
                />
              </div>
              <div class="form-group">
                <label
                  class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                  >{{ t("verification-account.birthDate") }}</label
                >
                <input
                  v-model="formInformation.birth_date"
                  type="date"
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                >{{ t("verification-account.work") }}</label
              >
              <input
                v-model="formInformation.work"
                type="text"
                class="modern-input"
              />
            </div>

            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                >{{ t("verification-account.monthlyIncome") }} (RM)</label
              >
              <div class="relative">
                <input
                  v-model="formInformation.monthly_income"
                  type="number"
                  class="modern-input pl-10"
                />
              </div>
            </div>

            <div class="form-group">
              <label
                class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
                >{{ t("verification-account.address") }}</label
              >
              <textarea
                v-model="formInformation.address"
                rows="3"
                class="modern-input resize-none"
              ></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-400 uppercase">{{
                t("verification-account.loanPurpose")
              }}</label>
              <input
                v-model="formInformation.loan_purpose"
                type="text"
                class="modern-input mt-1"
              />
            </div>

            <div class="pt-2">
              <p
                class="text-left text-black font-semibold uppercase text-xs tracking-wider"
              >
                {{ t("verification-account.emergencyContactName") }}
              </p>
              <input
                v-model="formInformation.contact_1"
                type="text"
                class="modern-input mt-1"
              />
            </div>

            <div class="pt-2">
              <p
                class="text-left text-black font-semibold uppercase text-xs tracking-wider"
              >
                {{ t("verification-account.emergencyContactNumber") }}
              </p>
              <input
                v-model="formInformation.contact_1_name"
                type="tel"
                class="modern-input mt-1 font-mono"
                maxlength="13"
                @input="
                  formInformation.contact_1_name =
                    formInformation.contact_1_name.replace(/\D/g, '')
                "
              />
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-8"
      >
        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
          <div class="w-1 h-6 bg-blue-600 rounded-full mr-3"></div>
          {{ t("verification-account.bankAccountInformation") }}
        </h3>

        <div class="space-y-4">
          <div class="form-group">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
              >{{ t("verification-account.branchBank") }}</label
            >
            <input
              v-model="formBank.bank_name"
              type="text"
              class="modern-input"
              required
            />
          </div>
          <div class="form-group">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
              >{{ t("verification-account.accountNumberBank") }}</label
            >
            <input
              v-model="formBank.account_number"
              type="text"
              class="modern-input"
              required
            />
          </div>
          <div class="form-group">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block"
              >{{ t("verification-account.accountName") }}</label
            >
            <input
              v-model="formBank.account_name"
              type="text"
              class="modern-input"
              required
            />
          </div>
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col items-center"
      >
        <div class="max-w-md w-full">
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="w-full h-14 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all flex items-center justify-center disabled:bg-slate-300 disabled:shadow-none"
          >
            <svg
              v-if="isSubmitting"
              class="animate-spin h-5 w-5 mr-3 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>{{
              isSubmitting
                ? t("verification-account.submitting")
                : t("verification-account.submitAllInformation")
            }}</span>
          </button>

          <p
            v-if="submitError"
            class="text-red-500 text-xs text-center mt-2 font-medium"
          >
            ⚠️ {{ submitError }}
          </p>
          <p
            v-if="updateSuccess"
            class="text-green-600 text-xs text-center mt-2 font-medium"
          >
            ✅ {{ t("verification-account.allInfoSubmitSuccessRedirect") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.modern-input {
  @apply w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm 
         focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none 
         placeholder:text-slate-400;
}

.color-primary {
  background: linear-gradient(90deg, #2563eb, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
